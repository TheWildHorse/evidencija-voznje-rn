import React, {Component} from 'react';
import {Dimensions, BackHandler, ToastAndroid, Linking} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import HomeComponent from '../component/HomeComponent';
import DatabaseService from '../service/DatabaseService';
import StorageService from '../service/StorageService';
import ServerService from '../service/ServerService';
import {
  createCompanyApi,
  acceptInvitationApi,
  sendInvitationApi,
  createVehicleApi,
  saveDataApi,
  serverUrl,
  recordForm,
} from '../config/Params';

const window = Dimensions.get('window');
const {width, height} = window;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922; //0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let tabIndex = {
  0: 'Tvrtke',
  1: 'Pozivnice',
  2: 'Vozila',
  3: 'Praćenje',
  4: 'Evidencija',
};
let _databaseService = null;
let _storageService = null;
let _serverService = null;
let _geolocationWatchId = null;

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: props.navigation.getParam('companies', []),
      vehicles: props.navigation.getParam('vehicles', []),
      invitations: props.navigation.getParam('invitations', []),
      records: props.navigation.getParam('records', []),
      fabActive: false,
      coordinates: [],
      initialKilometers: null,
    };
  }

  getCurrentPosition = async () => {
    let lat = 0,
      long = 0;
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        position => {
          long = position.coords.longitude;
          lat = position.coords.latitude;
          let initialRegion = {
            latitude: lat,
            longitude: long,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          resolve(initialRegion);
        },
        error => console.log(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    });
  };

  handleFab = () => {
    this.setState({
      fabActive: !this.state.fabActive,
    });
  };

  handleTabChange = _ref => {
    this.setState({
      activeTab: tabIndex[_ref.i],
    });
  };

  handleModal = which => {
    this.setState({
      modal: which,
    });
  };

  handleLogout = async () => {
    await _databaseService.deleteFromTable('user');
    await _storageService.removeValue('token');
    await _storageService.removeValue('username');
    this.props.navigation.navigate('Initial', {
      refresh: true,
    });
  };

  handleCompanyInput = name => {
    this.setState({
      company: name,
    });
  };

  handleInvitationInput = email => {
    this.setState({
      invitationEmail: email,
    });
  };

  handleUserType = type => {
    this.setState({
      selectedUserType: type,
    });
  };

  handleNewCompany = async () => {
    let company = this.state.company;

    if (!(company !== '')) {
      alert('Unesite naziv nove tvrtke!');
      return;
    }
    let token = await _storageService.getData('token');
    let username = await _storageService.getData('username');

    let body = JSON.stringify({
      companyName: company,
      token: token,
    });
    let response = await _serverService.sendRequest(createCompanyApi, body);
    if (response.code === 200) {
      let newCompany = {
        company: company,
        users: [username],
      };
      let allCompanies = this.state.companies;
      allCompanies.push(newCompany);
      this.setState({
        companies: allCompanies,
      });
      this.handleModal('');
    }
  };

  handleSelectCompany = company => {
    this.setState({
      companyName: company,
    });
  };

  handleSendInvitation = async () => {
    let invitationEmail = this.state.invitationEmail;
    let type = this.state.selectedUserType;
    let companyName = this.state.companyName;

    if (
      typeof invitationEmail === 'undefined' ||
      invitationEmail.length === 0
    ) {
      alert('Unesite email!');
      return;
    }
    let token = await _storageService.getData('token');

    let body = JSON.stringify({
      invitationType: type,
      invitationEmail: invitationEmail,
      token: token,
      companyName: companyName,
    });
    let response = await _serverService.sendRequest(sendInvitationApi, body);
    if (response.code === 200) {
      this.handleModal('');
    }
  };

  acceptInvitations = async code => {
    let token = await _storageService.getData('token');
    let body = JSON.stringify({
      token: token,
      invitationCode: code,
    });
    await _serverService.sendRequest(acceptInvitationApi, body);
    this.props.navigation.navigate('Initial', {
      refresh: true,
    });
  };

  handleVehicleInput = vehicle => {
    this.setState({
      vehicle: vehicle,
    });
  };

  handleCreateVehicle = async () => {
    let vehicle = this.state.vehicle;
    let companyName = this.state.companyName;
    let vehicleName = this.state.vehicleName;

    if (typeof vehicle === 'undefined' || vehicle.length === 0) {
      alert('Unesite vozilo!');
      return;
    }

    if (this.state.companies.length === 0) {
      alert('Potrebno je prvo kreirati tvrtku!');
      return;
    }

    if (typeof companyName === 'undefined' || companyName.length === 0) {
      companyName =
        this.state.companies.length > 0 ? this.state.companies[0].company : '';
    }

    if (typeof vehicleName === 'undefined' || vehicleName.length === 0) {
      alert('Unesite ime vozila!');
      return;
    }
    let token = await _storageService.getData('token');

    let body = JSON.stringify({
      vehicleRegistration: vehicle,
      token: token,
      companyName: companyName,
      vehicleName: vehicleName,
    });
    let response = await _serverService.sendRequest(createVehicleApi, body);
    if (response.code === 200) {
      let vehicles = this.state.vehicles;

      for (var i = 0; i < vehicles.length; i++) {
        if (vehicles[i].company === companyName) {
          vehicles[i].vehicles.push(vehicle);
        }
      }
      this.setState({
        vehicles: vehicles,
      });
      this.handleModal('');
    }
  };

  handleVehicleNameInput = mileage => {
    this.setState({
      vehicleName: mileage,
    });
  };

  updateMap = (lat, long) => {
    let data = {latitude: lat, longitude: long};
    this.setState({
      coordinates: this.state.coordinates.concat(data),
    });
  };

  startTracking = async () => {
    if (this.state.initialKilometers === null) {
      alert('Unesite početno stanje brojila');
      return;
    }
    this.setState({
      startTrackingButton: true,
      stopTrackingButton: false,
    });
    let selectedVehicle = this.state.trackingVehicle;
    if (typeof selectedVehicle === 'undefined') {
      this.setState({
        trackingVehicle: this.state.vehicles[0].vehicles[0],
      });
    }

    let lat = 0,
      long = 0;
    let options = {
      timeout: 1000,
      maximumAge: 0,
      enableHighAccuracy: true,
      distanceFilter: 10,
    };
    _geolocationWatchId = Geolocation.watchPosition(
      position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        this.setState({
          latitude: lat,
          longitude: long,
        });
        var date = new Date();
        var strDate =
          date.getDate() +
          '.' +
          date.getMonth() +
          '.' +
          date.getFullYear() +
          ' ' +
          date.getHours() +
          ':' +
          date.getMinutes() +
          ':' +
          date.getSeconds();
        _databaseService.insertIntoDataTable(
          lat,
          long,
          this.state.trackingVehicle,
          strDate,
        );
        this.updateMap(lat, long);
      },
      error => console.log(error.message),
      options,
    );
  };

  stopTracking = async () => {
    this.setState({
      startTrackingButton: false,
      stopTrackingButton: true,
    });
    Geolocation.clearWatch(_geolocationWatchId);
    Geolocation.stopObserving();
    let gpsData = await _databaseService.readFromTable('gps_data');
    let token = await _storageService.getData('token');
    let body = JSON.stringify({
      token: token,
      data: gpsData,
      initial_kilometers: this.state.initialKilometers,
    });
    let response = await _serverService.sendRequest(saveDataApi, body);
    if (response.code === 200) {
      await _databaseService.deleteFromTable('gps_data');
      this.setState({
        coordinates: [],
        initialKilometers: null,
      });
    }
  };

  handleSelectTrackingVehicle = vehicle => {
    this.setState({
      trackingVehicle: vehicle,
    });
  };

  handleBackPress = () => {
    if (this.state.exit === 1) {
      BackHandler.exitApp();
    } else {
      ToastAndroid.show('Pritisnite ponovo za izlaz', ToastAndroid.SHORT);
      this.setState({
        exit: 1,
      });
      setTimeout(() => {
        this.setState({
          t: 0,
        });
      }, 3 * 1000); // wait for 3 seconds
    }
    return true;
  };

  handleRecordButton = async record_id => {
    let link = serverUrl + recordForm + '?record_id=' + record_id;
    Linking.openURL(link);
  };

  handleInitialKilometers = txt => {
    this.setState({
      initialKilometers: txt,
    });
  };

  componentDidMount = async () => {
    _databaseService = new DatabaseService();
    _storageService = new StorageService();
    _serverService = new ServerService();

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );

    let initialRegion = await this.getCurrentPosition();
    let preselectedCompany =
      typeof this.state.companies !== 'undefined' &&
      this.state.companies.length > 0
        ? this.state.companies[0].company
        : '';
    this.setState({
      fabActive: false,
      activeTab: 'Tvrtke',
      company: '',
      modal: false,
      selectedUserType: 'employee',
      companyName: preselectedCompany,
      initialRegion: initialRegion,
      latitude: initialRegion.latitude,
      longitude: initialRegion.longitude,
      startTrackingButton: false,
      stopTrackingButton: true,
    });
    setTimeout(
      () =>
        this.setState({
          menuTop: 100,
        }),
      1500,
    );
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <HomeComponent
        fabActive={this.state.fabActive}
        handleFab={this.handleFab}
        handleTabChange={this.handleTabChange.bind(this)}
        activeTab={this.state.activeTab}
        handleLogout={this.handleLogout}
        companies={this.state.companies}
        handleModal={this.handleModal.bind(this)}
        modal={this.state.modal}
        handleCompanyInput={this.handleCompanyInput.bind(this)}
        handleNewCompany={this.handleNewCompany}
        invitations={this.state.invitations}
        acceptInvitation={this.acceptInvitations.bind(this)}
        handleInvitationInput={this.handleInvitationInput.bind(this)}
        handleSendInvitation={this.handleSendInvitation}
        selectedUserType={this.state.selectedUserType}
        handleUserType={this.handleUserType.bind(this)}
        handleSelectCompany={this.handleSelectCompany.bind(this)}
        selectedCompany={this.state.companyName}
        vehicles={this.state.vehicles}
        handleVehicleInput={this.handleVehicleInput.bind(this)}
        handleCreateVehicle={this.handleCreateVehicle}
        handleVehicleNameInput={this.handleVehicleNameInput.bind(this)}
        handleSelectTrackingVehicle={this.handleSelectTrackingVehicle.bind(
          this,
        )}
        selectedTrackingVehicle={this.state.trackingVehicle}
        menuTop={this.state.menuTop}
        region={this.state.initialRegion}
        coordinates={this.state.coordinates}
        startTrackingButton={this.state.startTrackingButton}
        stopTrackingButton={this.state.stopTrackingButton}
        startTrackingFn={this.startTracking}
        stopTrackingFn={this.stopTracking}
        records={this.state.records}
        handleRecordButton={this.handleRecordButton.bind(this)}
        handleInitialKilometers={this.handleInitialKilometers.bind(this)}
      />
    );
  }
}

export default HomeContainer;
