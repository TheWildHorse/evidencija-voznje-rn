import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import InitialContainer from './app/container/InitialContainer';
import RegisterContainer from './app/container/RegisterContainer';
import LoginContainer from './app/container/LoginContainer';
import HomeContainer from './app/container/HomeContainer';

const RootStack = createStackNavigator(
  {
    Initial: {
      screen: InitialContainer,
    },
    Register: {
      screen: RegisterContainer,
    },
    Login: {
      screen: LoginContainer,
    },
    Home: {
      screen: HomeContainer,
    },
  },
  {
    initialRouteName: 'Initial',
    headerMode: 'none',
  },
);

const App = createAppContainer(RootStack);

export default App;
