import React, { Component } from 'react'
import { View, Text } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import { Input, Button, Icon } from 'react-native-elements'
import {
  formatPartialByCountry,
  isValidNumber
} from '../services/phone_validation'

export default class EnterPhone extends Component {
  state = {
    cca2: 'US',
    callingCode: '1',
    phone: '',
    formattedPhone: '',
    errorMessage: ''
  }

  updatePhone = phone => {
    const { cca2 } = this.state
    const formattedPhone = formatPartialByCountry(phone.split(''), cca2)
    this.setState({ phone, formattedPhone })
  }

  renderFormattedPhone = () => {
    const input = this.state.phone
      ? this.state.formattedPhone
      : '(202) 555-7667'

    const style = this.state.phone
      ? styles.formatedPhoneText
      : styles.placeholderPhoneText

    return (
      <Text style={style} numberOfLines={1} adjustsFontSizeToFit>
        {input}
      </Text>
    )
  }

  submitPhone = () => {
    const { callingCode, phone, cca2 } = this.state
    const fullPhone = `${callingCode}${phone}`
    if (isValidNumber(fullPhone, cca2)) {
      this.props.handleSubmit(fullPhone)
    } else {
      this.setState({ errorMessage: 'Please enter a valid number.' })
    }
  }

  onChangeCountry = value => {
    const { cca2, callingCode } = value
    this.setState({
      cca2,
      callingCode,
      phone: '',
      formattedPhone: '',
      errorMessage: ''
    })
    this.inputRef.focus()
  }

  isTenDigitNumber = () => {
    return this.state.callingCode === '1'
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.enterText}>Enter your mobile number</Text>
        <View style={styles.countryPickerContainer}>
          <View style={styles.countryPickerView}>
            <CountryPicker
              onChange={value => this.onChangeCountry(value)}
              ref={ref => {
                this.countryPicker = ref
              }}
              translation="eng"
              cca2={this.state.cca2}
              closeable
              filterable
              showCallingCode
              filterPlaceholder="Search"
              animationType="slide"
              autoFocusFilter={false}
            />
          </View>

          <Text
            style={styles.formatedPhoneText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            +{this.state.callingCode}
          </Text>
          {this.renderFormattedPhone()}
        </View>

        <Text style={styles.errorMessageText}>{this.state.errorMessage}</Text>

        <View style={styles.continueContainer}>
          <Text style={styles.continueText}>
            By continuing you may receive an SMS for verification. Message and
            data rates may apply.
          </Text>
          <Icon
            raised
            name="arrow-right"
            type="font-awesome"
            color="#725632"
            onPress={() => this.submitPhone()}
            disabled={!this.state.phone}
          />
        </View>

        <Input
          value={this.state.phone}
          ref={ref => {
            this.inputRef = ref
          }}
          onChangeText={phone => this.updatePhone(phone)}
          spellCheck={false}
          autoFocus
          keyboardType="number-pad"
          numberOfLines={1}
          maxLength={
            this.isTenDigitNumber() ? 10 : 15 - this.state.callingCode.length
          }
          containerStyle={{
            flex: 1,
            opacity: 0,
            width: 20
          }}
        />
      </View>
    )
  }
}

const styles = {
  container: {
    margin: 20
  },
  enterText: {
    fontSize: 20
  },
  countryPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    backgroundColor: '#c4c0c0',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    height: 50,
    overflow: 'scroll'
  },
  countryPickerView: {
    marginLeft: 10,
    marginBottom: 5
  },
  formatedPhoneText: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 20
  },
  placeholderPhoneText: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 20,
    opacity: 0.5
  },
  errorMessageText: {
    color: 'red'
  },
  continueContainer: {
    marginTop: 50,
    flexDirection: 'row'
  },
  continueText: {
    flex: 1,
    paddingRight: 30
  }
}
