import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from 'react-native'
import { Button, Card, Badge, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import firebase from 'firebase'

import { checkAndSetPushToken } from '../services/push_notifications'
import feetBackground from '../../assets/backgrounds/feet_background.jpg'
import allNamedPoos from '../../assets/namedPooExport'
import OKModal from '../modals/OKModal'
import styles from '../styles/homeStyles'
import {
  setInputType,
  setLogType,
  resetInput,
  authLogout,
  authLogin,
  syncPropsWithDb,
  fetchSentToMe,
  setNotificationToken
} from '../actions'

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    currentUser: null,
    addedMe: [],
    okModalVisible: false,
    okModalText: ''
  }

  componentWillReceiveProps() {
    // console.log('componentWillReceiveProps');
    // console.log(nextProps.token);
    // if (nextProps.token) {
    //   this.setState({ currentUser: true, addedMe: nextProps.addedMe });
    // } else {
    //   this.setState({ currentUser: false });
    // }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user here', user)
      if (user) {
        const phone = user.uid
        const { myPoos, myFriends, myInfo } = this.props
        this.props.syncPropsWithDb({ phone, myPoos, myFriends, myInfo })
        this.setState({ currentUser: true })
        // if (!this.props.notificationToken) {
        // this.checkForPushToken()
        // }
      } else {
        this.setState({ currentUser: false })
      }
    })
  }

  checkForPushToken = async () => {
    try {
      const pushToken = await checkAndSetPushToken()

      if (pushToken) {
        this.props.setNotificationToken({ pushToken })
      }
    } catch (error) {
      console.log('could not check for push token')
    }
  }

  authLoginWithToken = async token => {
    try {
      // await firebase.auth().signOut();
      await firebase.auth().signInWithCustomToken(token)
      this.setState({ currentUser: true })
      // console.log('authLoginWithToken success');
    } catch (err) {
      console.log('authLoginWithToken failed')
      console.log(err)
    }
  }

  navToAdd() {
    this.props.resetInput()
    this.props.setInputType('new')
    this.props.navigation.navigate('input')
  }

  navToMap() {
    this.props.navigation.navigate('map')
  }

  navToLog() {
    this.props.setLogType('normal')
    this.props.navigation.navigate('log')
  }

  navToFriends = () => {
    if (this.state.currentUser) {
      this.props.navigation.navigate('friends')
    } else {
      this.setState({
        okModalVisible: true,
        okModalText: 'You must create an acount or sign in to use this feature.'
      })
    }
  }

  navToSentToMe = () => {
    if (this.state.currentUser) {
      this.props.navigation.navigate('sent_to_me')
    } else {
      this.setState({
        okModalVisible: true,
        okModalText: 'You must create an acount or sign in to use this feature.'
      })
    }
  }

  authLogout = async () => {
    await this.props.authLogout()
    this.setState({ currentUser: false })
  }

  renderAuthButton = () => {
    const { currentUser } = firebase.auth()
    // console.log('renderAuthButton currentUser');
    // console.log(currentUser);
    if (this.state.currentUser || currentUser) {
      return (
        <Card>
          <Text>You're signed In</Text>
          <Button title="Sign Out" onPress={() => this.authLogout()} />
        </Card>
      )
    }
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('auth')}>
        <View style={styles.iconView}>
          <Text style={styles.addText}>Log In</Text>
          <Icon name="arrow-circle-right" type="font-awesome" />
        </View>
      </TouchableOpacity>
    )
  }

  okModalAccept = () => {
    this.setState({ okModalVisible: false, okModalText: '' })
  }

  render() {
    return (
      // <ImageBackground
      //   source={feetBackground}
      //   style={styles.backgroundContainer}
      // >
      <View style={{ flex: 1 }}>
        <Text style={styles.headerStyle}>Hoos Going 2</Text>

        <ScrollView
          style={styles.scrollViewContainer}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <TouchableOpacity onPress={() => this.navToAdd()}>
            <View style={styles.addView}>
              <Image
                source={allNamedPoos.sunglasses.image}
                style={styles.addImage}
              />
              <Text style={styles.addText}>Take a Poo</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.iconRowView}>
            <TouchableOpacity onPress={() => this.navToMap()}>
              <View style={styles.iconView}>
                <Icon name="map" type="font-awesome" />
                <Text style={styles.addText}>Map</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.navToLog()}>
              <View style={styles.iconView}>
                <Icon name="list" type="font-awesome" />
                <Text style={styles.addText}>Log</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.iconRowView}>
            <TouchableOpacity onPress={() => this.navToFriends()}>
              <View style={styles.iconView}>
                <Icon name="users" type="font-awesome" />
                <Text style={styles.addText}>Friends</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('settings')}
            >
              <View style={styles.iconView}>
                <Icon name="cogs" type="font-awesome" />
                <Text style={styles.addText}>Settings</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.iconRowView}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('stats')}
            >
              <View style={styles.iconView}>
                <Icon name="area-chart" type="font-awesome" />
                <Text style={styles.addText}>Stats</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.navToSentToMe()}>
              <View style={styles.iconView}>
                <Icon name="envelope" type="font-awesome" />
                <Text style={styles.addText}>Inbox</Text>
              </View>
            </TouchableOpacity>
          </View>

          {this.renderAuthButton()}
        </ScrollView>

        <OKModal
          infoText={this.state.okModalText}
          buttonText="OK"
          onAccept={this.okModalAccept}
          visible={this.state.okModalVisible}
        />
      </View>
      // </ImageBackground>
    )
  }
}

const mapStateToProps = state => {
  const { token, notificationToken } = state.auth
  const { myFriends, myInfo, addedMe } = state.friends
  const { myPoos } = state.pooReducer

  return { token, myFriends, myInfo, myPoos, addedMe, notificationToken }
}

export default connect(
  mapStateToProps,
  {
    setInputType,
    setLogType,
    resetInput,
    authLogout,
    authLogin,
    syncPropsWithDb,
    fetchSentToMe,
    setNotificationToken
  }
)(HomeScreen)
