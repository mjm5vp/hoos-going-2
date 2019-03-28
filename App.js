import { AppLoading, Asset, Font, Notifications } from 'expo'
import React from 'react'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Image, View, Alert, Text } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'
import firebase from 'firebase'

// Map Images
import defaultMapImage from './assets/maps/default.png'
import satelliteMapImage from './assets/maps/satellite.png'
import terrainMapImage from './assets/maps/terrain.png'

// Poo Images
import allPoos from './assets/pooExport'

// Background Images
import feetBackground from './assets/backgrounds/feet_background.jpg'

import { registerForNotifications } from './src/services/push_notifications'
// import store from './src/store';
import configureStore from './src/store'
import HomeScreen from './src/screens/HomeScreen'
import MapScreen from './src/screens/MapScreen'
import PooSelect from './src/screens/PooSelect'
import InputScreen from './src/screens/InputScreen'
import LogScreen from './src/screens/LogScreen'
import MapSelectScreen from './src/screens/MapSelectScreen'
import StatsScreen from './src/screens/StatsScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import AuthScreen from './src/screens/AuthScreen'
import FriendsScreen from './src/screens/FriendsScreen'
import AddFriendsScreen from './src/screens/AddFriendsScreen'
import SendToFriendsScreen from './src/screens/SendToFriendsScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import SentToMeScreen from './src/screens/SentToMeScreen'

// console.ignoredYellowBox = [
//   'Warning: PropTypes',
//   'Warning: checkPropTypes',
//   'Warning: React.createClass'
// ];

let RootStack = createStackNavigator({
  home: HomeScreen,
  input: InputScreen,
  map_select: MapSelectScreen,
  log: LogScreen,
  map: MapScreen,
  select: PooSelect,
  stats: StatsScreen,
  settings: SettingsScreen,
  auth: AuthScreen,
  friends: FriendsScreen,
  add_friends: AddFriendsScreen,
  send_to_friends: SendToFriendsScreen,
  sent_to_me: SentToMeScreen,
  profile: ProfileScreen
})

let Navigation = createAppContainer(RootStack)

const cacheImages = images => {
  return images.map(image => {
    if (typeof image === 'string') {
      const pre = Image.prefetch(image)
      return pre
    }

    return Asset.fromModule(image).downloadAsync()
  })
}

const cacheFonts = fonts => {
  return fonts.map(font => Font.loadAsync(font))
}

export default class App extends React.Component {
  state = {
    isReady: false,
    notification: {}
  }

  async loadAssetsAsync() {
    const poos = allPoos.map(poo => poo.image)
    const imageAssets = cacheImages([
      feetBackground,
      defaultMapImage,
      satelliteMapImage,
      terrainMapImage,
      ...poos
    ])

    const fontAssets = cacheFonts([{}])

    await Promise.all([...imageAssets, ...fontAssets])
  }

  componentDidMount() {
    this.loadAssetsAsync()
    const config = {
      apiKey: 'AIzaSyAB6ioNX2EZn0Z8exCVMoLZeWpFswluVyM',
      authDomain: 'one-time-password-698fc.firebaseapp.com',
      databaseURL: 'https://one-time-password-698fc.firebaseio.com',
      projectId: 'one-time-password-698fc',
      storageBucket: 'one-time-password-698fc.appspot.com',
      messagingSenderId: '1035913942891'
    }
    firebase.initializeApp(config)
    // this.notificationSubscription = Notifications.addListener(this.handleNotification);
    // console.log('origin');
    // console.log(this.state.notification.origin);
    // console.log('data');
    // console.log(JSON.stringify(this.state.notification.data));
    // registerForNotifications();
    Notifications.addListener(notification => {
      const {
        data: { text },
        origin
      } = notification

      if (origin === 'received') {
        Alert.alert('New Push Notification', text, [{ text: 'ok' }])
      }
    })
  }

  _handleNotification = notification => {
    this.setState({ notification })
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }

    const { persistor, store } = configureStore()

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={styles.container}>
            <Navigation />
          </View>
        </PersistGate>
      </Provider>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
}
