import React, { Component } from 'react'
import { View, Text, ActivityIndicator, Keyboard } from 'react-native'
import { Input, Button } from 'react-native-elements'
import axios from 'axios'
import firebase from 'firebase'
import { connect } from 'react-redux'

import { authLogin, editMyInfo, setNotificationToken } from '../actions'
import {
  registerForPushNotificationsAsync,
  registerForRemoteNotifications
} from '../services/push_notifications'

const ROOT_URL =
  'https://us-central1-one-time-password-698fc.cloudfunctions.net'

class AuthScreen extends Component {
  state = {
    name: '',
    phone: '',
    code: '',
    message: '',
    codeMessage: '',
    showSpinner: false,
    phoneEntered: false,
    showName: false,
    fail: false
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps')
    if (nextProps.token) {
      this.setState({ showSpinner: false })
      this.props.navigation.goBack()
    }
  }

  componentWillMount() {
    this.setState({ fail: false })
  }

  handleSubmit = async () => {
    const { phone } = this.state

    const number = this.formatPhone(phone)

    if (number.length === 10) {
      this.checkIfUserIdExists(number)
      // this.setState({ phoneEntered: true, phone: number });
    } else {
      this.setState({
        message: 'Phone number not valid.  Please try again.'
      })
    }
  }

  formatPhone = phone => {
    const number = String(phone).replace(/[^\d]/g, '')
    return number.charAt(0) === '1' ? number.substring(1) : number
  }

  checkIfUserIdExists = async phone => {
    await firebase
      .database()
      .ref(`/users/${phone}`)
      .once('value', snapshot => {
        if (snapshot.val()) {
          // console.log('user exists');
          const myInfo = snapshot.val().myInfo
          this.props.editMyInfo(myInfo)
          this.setState({
            showName: false,
            phoneEntered: true,
            name: myInfo.name,
            message: `Welcome back ${myInfo.name}`,
            codeMessage:
              'You will recieve a text message shortly with a 4-digit code.'
          })
          // this.userExists(phone);
          this.requestPassword(phone)
        } else {
          console.log('user does not exist')
          Keyboard.dismiss()
          this.setState({
            showName: true,
            message: 'Welcome to Hoos Going 2!'
          })
          // this.newUser(phone);
        }
      })
  }

  newUser = async phone => {
    try {
      this.setState({
        showName: false,
        phoneEntered: true,
        codeMessage:
          'You will recieve a text message shortly with a 4-digit code.'
      })
      await axios.post(`${ROOT_URL}/createUser`, { phone })
      console.log('user created')
      this.requestPassword(phone)
    } catch (err) {
      console.log(err)
      this.setState({ message: 'An error occurred. Please try again later.' })
    }
  }

  requestPassword = async phone => {
    try {
      await axios.post(`${ROOT_URL}/requestOneTimePassword`, { phone })
    } catch (err) {
      console.log('request password', err)
      this.setState({
        message: 'Phone number not valid.  Please try again.',
        phoneEntered: false
      })
    }
  }

  // userExists = async (phone) => {
  //   await axios.post(`${ROOT_URL}/requestOneTimePassword`, { phone });
  // }

  signIn = async () => {
    const { phone, code } = this.state
    const { myPoos, myFriends, notificationToken } = this.props
    this.setState({ showSpinner: true })

    try {
      const {
        data: { token }
      } = await axios.post(`${ROOT_URL}/verifyOneTimePassword`, { phone, code })
      await this.props.authLogin({ token, myPoos, phone, myFriends })
      const pushToken = await registerForRemoteNotifications(notificationToken)
      await this.props.setNotificationToken({ pushToken })
    } catch (err) {
      this.setState({
        message: 'Code not valid. Please try again',
        showSpinner: false,
        code: ''
      })
    }
  }

  handleNameSubmit = () => {
    const { name, phone } = this.state

    if (name.length > 0) {
      this.props.editMyInfo({ name, number: phone })
      this.setState({ showName: false, phoneEntered: true })
      this.newUser(phone)
      Keyboard.dismiss()
    } else {
      this.setState({ message: 'Please enter you Name' })
    }
  }

  renderPhoneNameOrCode = () => {
    if (this.state.showName) {
      return (
        <View>
          <View style={{ marginBottom: 10 }}>
            <Input
              placeholder="Enter your name:"
              value={this.state.name}
              keyboardType="default"
              onChangeText={name => this.setState({ name })}
            />
            {/* <FormLabel>Enter your name:</FormLabel>
            <FormInput
              value={this.state.name}
              onChangeText={name => this.setState({ name })}
              keyboardType="default"
            /> */}
          </View>
          <Button title="Submit" onPress={this.handleNameSubmit} />
        </View>
      )
    }

    if (!this.state.phoneEntered) {
      return (
        <View>
          <View style={{ marginBottom: 10 }}>
            <Input
              placeholder="Enter your phone number"
              value={this.state.phone}
              onChangeText={phone => this.setState({ phone })}
              keyboardType="number-pad"
            />
            {/* <FormLabel>Enter your phone number:</FormLabel>
            <FormInput
              value={this.state.phone}
              onChangeText={phone => this.setState({ phone })}
              keyboardType="number-pad"
            /> */}
          </View>
          <Button title="Submit" onPress={this.handleSubmit} />
        </View>
      )
    }

    return (
      <View>
        <View style={{ marginBottom: 10 }}>
          <Input
            placeholder="Enter code"
            value={this.state.code}
            onChangeText={code => this.setState({ code })}
            keyboardType="number-pad"
          />
          {/* <FormLabel>Enter code:</FormLabel>
        <FormInput
            value={this.state.code}
            onChangeText={code => this.setState({ code })}
            keyboardType="number-pad"
          /> */}
        </View>

        <Button title="Submit" onPress={this.signIn} />
      </View>
    )
  }

  renderSpinner = () => {
    if (this.state.showSpinner) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      )
    }
    return <View />
  }

  renderSpinnerOrButton = () => {
    if (this.state.showButtonSpinner) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      )
    }
    return <View />
  }

  render() {
    // console.log('this.props.fail');
    // console.log(this.props.fail);

    return (
      <View style={styles.viewContainer}>
        {this.renderSpinner()}
        <Text>{this.state.message}</Text>
        {this.renderPhoneNameOrCode()}
        <Text>{this.state.codeMessage}</Text>
      </View>
    )
  }
}

const styles = {
  viewContainer: {
    flex: 1,
    marginTop: 100
  }
}

const mapStateToProps = state => {
  const { myPoos } = state.pooReducer
  const { token, fail, notificationToken } = state.auth
  const { myFriends } = state.friends

  return { myPoos, token, fail, myFriends, notificationToken }
}

export default connect(
  mapStateToProps,
  {
    authLogin,
    editMyInfo,
    setNotificationToken
  }
)(AuthScreen)
