import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Card, Icon } from 'react-native-elements'
import _ from 'lodash'
import Expo from 'expo'

import addStyles from '../styles/addStyles'
import { getContactsAsync, getUsersNumbers } from '../services/contacts'
import { setAllContacts, setUsersNumbers } from '../actions'

class ContactsUsingApp extends Component {
  state = {
    allContacts: [],
    usersNumbers: [],
    usingAppNamesAndNumbers: []
  }

  componentWillMount() {
    this.askContactsPermission()
  }

  askContactsPermission = async () => {
    // Ask for permission to query contacts.
    const permission = await Expo.Permissions.askAsync(
      Expo.Permissions.CONTACTS
    )
    if (permission.status !== 'granted') {
      // Permission was denied...
      // this.setState({ loading: false, contactPermissionDenied: true })
      return
    }

    this.refreshContactAndUserData()
  }

  refreshContactAndUserData = async () => {
    const allContacts = await getContactsAsync()
    const usersNumbers = await getUsersNumbers()
    this.setUsingAppList(allContacts, usersNumbers)
    this.props.setAllContacts(allContacts)
    this.props.setUsersNumbers(usersNumbers)
  }

  setUsingAppList = (allContacts, usersNumbers) => {
    const contactsNumbers = allContacts.map(contact => contact.number)

    const usingApp = _.intersectionWith(
      contactsNumbers,
      usersNumbers,
      _.isEqual
    )
    const usingAppNamesAndNumbers = []

    usingApp.forEach(usingContact => {
      usingAppNamesAndNumbers.push(
        _.find(allContacts, contact => {
          return usingContact === contact.number
        })
      )
    })

    this.setState({ usingAppNamesAndNumbers })
  }

  render() {
    const { usingAppNamesAndNumbers } = this.state
    if (usingAppNamesAndNumbers.length === 0) {
      return null
    }
    const finalList = usingAppNamesAndNumbers.map((contact, i) => {
      const { name, number } = contact
      return (
        <Card key={i}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text>{name}</Text>
              <Text>{number}</Text>
            </View>
            <TouchableOpacity onPress={() => this.onPressUser(name, number)}>
              <View style={addStyles.addButtonView}>
                <Text>Add</Text>
                <Icon
                  name="ios-add-circle-outline"
                  type="ionicon"
                  color="#517fa4"
                  size={20}
                  style={{ margin: 5 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Card>
      )
    })

    return <Card title="Contacts using Hoos Going 2">{finalList}</Card>
  }
}

const styles = {}

export default connect(
  null,
  { setAllContacts, setUsersNumbers }
)(ContactsUsingApp)
