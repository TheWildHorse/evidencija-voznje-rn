import React, {Component} from 'react';
import {registerApi} from '../config/Params';
import RegisterComponent from '../component/RegisterComponent';
import ServerService from '../service/ServerService';
import DatabaseService from '../service/DatabaseService';
import StorageService from '../service/StorageService';

let _serverService = null;
let _databaseService = null;
let _storageService = null;

class RegisterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      loading: false,
    };
  }

  navigate = screen => {
    this.props.navigation.navigate(screen);
  };

  handleUsername = txt => {
    this.setState({
      username: txt,
    });
  };

  handleEmail = txt => {
    this.setState({
      email: txt,
    });
  };

  handlePassword = txt => {
    this.setState({
      password: txt,
    });
  };

  register = async () => {
    this.setState({
      loading: true,
    });
    let username = this.state.username;
    let email = this.state.email;
    let password = this.state.password;

    if (!(username !== '' && email !== '' && password !== '')) {
      alert('Popunite sva polja!');
      return;
    }

    let body = JSON.stringify({
      email: email,
      password: password,
      username: username,
    });

    let response = await _serverService.sendRequest(registerApi, body);
    if (response.code === 200 && response.token) {
      await _databaseService.deleteFromTable('user'); // delete previous users if any
      _databaseService.insertIntoUserTable(response.token, response.username); // insert token
      await _storageService.storeData('token', response.token); // store token to use it later
      await _storageService.storeData('username', username);

      let companies = await _serverService.getCompanies(response.token);
      let vehicles = await _serverService.getVehicles(response.token);
      let invitations = await _serverService.getInvitations(response.token);
      this.props.navigation.navigate('Home', {
        companies: companies,
        vehicles: vehicles,
        invitations: invitations,
      });
    }
  };

  componentDidMount = () => {
    _databaseService = new DatabaseService();
    _storageService = new StorageService();
    _serverService = new ServerService();
    this.setState({
      username: '',
      email: '',
      password: '',
      loading: false,
    });
  };

  render() {
    return (
      <RegisterComponent
        navigate={this.navigate}
        handleUsername={this.handleUsername.bind(this)}
        handleEmail={this.handleEmail.bind(this)}
        handlePassword={this.handlePassword.bind(this)}
        register={this.register}
        loading={this.state.loading}
      />
    );
  }
}

export default RegisterContainer;
