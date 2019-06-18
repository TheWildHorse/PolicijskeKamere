/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import InitialContainer from './app/container/InitialContainer';

const RootStack = createStackNavigator(
    {
      Initial: {
        screen: InitialContainer
      },
    },
    {
      initialRouteName: 'Initial',
      headerMode: "none"
    }
);

const App = createAppContainer(RootStack);

export default App;