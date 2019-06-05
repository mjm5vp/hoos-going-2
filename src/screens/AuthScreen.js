import React, { Component } from 'react'
import { View, Text, ActivityIndicator, Keyboard } from 'react-native'
import { Input, Button } from 'react-native-elements'
import axios from 'axios'
import firebase from 'firebase'
import { connect } from 'react-redux'
import PhoneInput from 'react-native-phone-input'

import {
  authLogin,
  editMyInfo,
  setNotificationToken,
  setMyInfoLocal
} from '../actions'
import { registerForPushNotificationsAsync } from '../services/push_notifications'
import { phoneUtil } from '../services/phone_validation'
import CountryPicker from 'react-native-country-picker-modal'
import EnterCode from '../components/EnterCode'
import EnterPhone from '../components/EnterPhone'

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
    userExists: false,
    fail: false,
    cca2: 'US'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token) {
      this.setState({ showSpinner: false })
      this.props.navigation.goBack()
    }
  }

  componentWillMount() {
    this.setState({ fail: false })
  }

  handleSubmit = async input => {
    const phone = this.formatPhone(input)
    console.log(phone)
    this.setState({ phone })
    this.checkIfUserIdExists(this.formatPhone(phone))
  }

  formatPhone = phone => {
    return String(phone).replace(/[^\d]/g, '')
  }

  checkIfUserIdExists = async phone => {
    await firebase
      .database()
      .ref(`/users/${phone}`)
      .once('value', snapshot => {
        if (snapshot.val()) {
          const { myInfo } = snapshot.val()
          if (myInfo && myInfo.name) {
            this.requestPassword(phone)
            this.props.setMyInfoLocal(myInfo)
            this.setState({
              userExists: true,
              showName: false,
              phoneEntered: true,
              name: myInfo.name,
              message: `Welcome back ${myInfo.name}`,
              codeMessage:
                'You will recieve a text message shortly with a 4-digit code.'
            })
          } else {
            this.userExistsWithMissingInfo()
          }
        } else {
          Keyboard.dismiss()
          this.setState({
            showName: true,
            message: 'Welcome to Hoos Going 2!'
          })
        }
      })
  }

  userExistsWithMissingInfo = () => {
    Keyboard.dismiss()
    this.setState({
      userExists: true,
      showName: true,
      phoneEntered: true,
      message: 'Welcome to Hoos Going 2!'
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
      if (!this.state.userExists) {
        await axios.post(`${ROOT_URL}/createUser`, { phone })
      }
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

  signIn = async code => {
    const { phone } = this.state
    const { myPoos, myFriends, notificationToken } = this.props
    this.setState({ showSpinner: true })

    try {
      const {
        data: { token }
      } = await axios.post(`${ROOT_URL}/verifyOneTimePassword`, { phone, code })
      await this.props.authLogin({ token, myPoos, phone, myFriends })
      const pushToken = await registerForPushNotificationsAsync()
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
    const { name, phone, userExists } = this.state

    if (name.length > 0) {
      this.props.editMyInfo({ name, number: phone })
      this.setState({ showName: false, phoneEntered: true })
      this.newUser(phone)
      Keyboard.dismiss()
    } else {
      this.setState({ message: 'Please enter you Name' })
    }
  }

  onPressFlag = () => {
    this.countryPicker.openModal()
  }

  selectCountry = country => {
    this.phone.selectCountry(country.cca2.toLowerCase())
    this.setState({ cca2: country.cca2 })
  }

  onChangePhoneNumber = () => {
    this.setState({ phone: this.formatPhone(this.phone.getValue()) })
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
          </View>
          <Button title="Submit" onPress={this.handleNameSubmit} />
        </View>
      )
    }

    if (!this.state.phoneEntered) {
      return (
        <View>
          <View style={{ marginBottom: 10 }}>
            <EnterPhone handleSubmit={phone => this.handleSubmit(phone)} />
          </View>
        </View>
      )
    }

    return <EnterCode codeLength={4} codeComplete={code => this.signIn(code)} />
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
    setMyInfoLocal,
    authLogin,
    editMyInfo,
    setNotificationToken
  }
)(AuthScreen)
