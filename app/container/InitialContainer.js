import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Spinner} from 'native-base';
import {Text} from 'react-native-elements';
import DatabaseService from '../service/DatabaseService';
import StorageService from '../service/StorageService';
import ServerService from '../service/ServerService';
import NetInfo from '@react-native-community/netinfo';
import {saveDataApi, getDataApi} from '../config/Params';

let _databaseService = null;
let _storageService = null;
let _serverService = null;

class InitialContainer extends Component {
  constructor(props) {
    super(props);
  }

  checkConnection = async () => {
    let netInfo = NetInfo.fetch().then(state => {
      return state.isConnected;
    });
    return netInfo;
  };

  userLoggedIn = async () => {
    _databaseService.createTables(); // create tables if they don't exists
    let storageToken = await _storageService.getData('token'); // check if we have token already save in storage
    if (typeof storageToken === 'undefined') {
      return false;
    }
    // if not, check if user is logged in
    if (storageToken.length === 0) {
      data = await _databaseService.readFromTable('user');

      // user is logged in
      if (data.length === 0) {
        _storageService.storeData('token', data[0].token);
        _storageService.storeData('username', data[0].username);
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  logout = async () => {
    await _databaseService.deleteFromTable('user');
    await _storageService.removeValue('token');
    await _storageService.removeValue('username');
    this.props.navigation.navigate('Initial', {
      refresh: true,
    });
  };

  sendDataToServer = async token => {
    let gpsData = await _databaseService.readFromTable('gps_data');
    if (gpsData.length === 0) {
      return;
    }
    let body = JSON.stringify({
      token: token,
      data: gpsData,
    });
    let response = await _serverService.sendRequest(saveDataApi, body);
    if (response.code === 200) {
      await _databaseService.deleteFromTable('gps_data');
    }
  };

  getGpsDataFromServer = async token => {
    let body = JSON.stringify({
      token: token,
    });
    let response = await _serverService.sendRequest(getDataApi, body);
    return response.data;
  };

  initialize = async () => {
    let connection = await this.checkConnection();
    if (!connection) {
      alert('Potrebna je internet veza!');
      return;
    }
    _databaseService = new DatabaseService();
    _storageService = new StorageService();
    _serverService = new ServerService();

    await _databaseService.createTables();

    let loggedIn = await this.userLoggedIn();
    let token = await _storageService.getData('token');

    let records = [];

    if (loggedIn) {
      await this.sendDataToServer(token);
      records = await this.getGpsDataFromServer(token);
      let companies = await _serverService.getCompanies(token);
      if (companies === 50) {
        this.logout();
      }
      let vehicles = await _serverService.getVehicles(token);
      let invitations = await _serverService.getInvitations(token);
      this.props.navigation.navigate('Home', {
        companies: companies,
        vehicles: vehicles,
        invitations: invitations,
        records: records,
      });
    } else {
      this.props.navigation.navigate('Register');
    }
  };

  componentDidMount = async () => {
    await this.initialize();
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.navigation.getParam('refresh')) {
      this.initialize();
    }
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: '#2E3246',
          ...StyleSheet.absoluteFillObject,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text h4 style={{color: '#707AA8'}}>
          Učitavanje
        </Text>
        <Spinner color="#707AA8" />
      </View>
    );
  }
}

export default InitialContainer;
