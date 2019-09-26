import React, {Component} from 'react';
import LoginComponent from '../component/LoginComponent';
import ServerService from '../service/ServerService';
import DatabaseService from '../service/DatabaseService';
import StorageService from '../service/StorageService';
import {loginApi} from '../config/Params';

let _serverService = null;
let _databaseService = null;
let _storageService = null;

class LoginContainer extends Component {
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

  login = async () => {
    this.setState({
      loading: true,
    });
    let email = this.state.email;
    let password = this.state.password;

    if (
      typeof this.state !== 'undefined' &&
      !(email !== '' && password !== '')
    ) {
      alert('Popunite sva polja!');
      return;
    }

    let body = JSON.stringify({
      email: email,
      password: password,
    });

    let response = await _serverService.sendRequest(loginApi, body);
    this.setState({
      loading: false,
    });
    if (response.code === 200 && response.token) {
      await _databaseService.deleteFromTable('user'); // delete previous users if any
      _databaseService.insertIntoUserTable(response.token, response.username); // insert token
      await _storageService.storeData('token', response.token); // store token to use it later
      await _storageService.storeData('username', response.username);

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
    _serverService = new ServerService();
    _databaseService = new DatabaseService();
    _storageService = new StorageService();

    this.setState({
      email: '',
      password: '',
      loading: false,
    });
  };

  render() {
    return (
      <LoginComponent
        navigate={this.navigate}
        handleEmail={this.handleEmail.bind(this)}
        handlePassword={this.handlePassword.bind(this)}
        login={this.login}
        loading={this.state.loading}
      />
    );
  }
}

export default LoginContainer;
