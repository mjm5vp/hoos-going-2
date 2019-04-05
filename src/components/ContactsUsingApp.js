import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Linking } from 'react-native'
import { connect } from 'react-redux'
import { Card, Icon, Button } from 'react-native-elements'
import _ from 'lodash'
import { Permissions } from 'expo'

import addStyles from '../styles/addStyles'
import { getContactsAsync, getUsersNumbers } from '../services/contacts'
import { setAllContacts, setUsersNumbers } from '../actions'

class ContactsUsingApp extends Component {
  state = {
    loading: true,
    contactPermissionDenied: true,
    allContacts: [],
    usersNumbers: [],
    usingAppNamesAndNumbers: []
  }

  componentDidMount() {
    this.refreshContactAndUserData()
  }

  askContactsPermission = async () => {
    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS)
    return permission.status === 'granted'
  }

  refreshContactAndUserData = async () => {
    const contactPermissionGranted = await this.askContactsPermission()

    if (contactPermissionGranted) {
      this.setState({ contactPermissionDenied: false })
      const allContacts = await getContactsAsync()
      const usersNumbers = await getUsersNumbers()
      this.setUsingAppList(allContacts, usersNumbers)
      this.props.setAllContacts(allContacts)
      this.props.setUsersNumbers(usersNumbers)
    } else {
      this.setState({ contactPermissionDenied: true })
    }
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
    const { contactPermissionDenied, usingAppNamesAndNumbers } = this.state
    if (contactPermissionDenied) {
      return (
        <Card>
          <View>
            <Text>
              Enable CONTACTS in SETTINGS to see which of your contacts are
              already using Hoos Going 2.
            </Text>
            <Button
              title="Go to Settings"
              onPress={() => Linking.openURL('app-settings:')}
              style={{ marginTop: 10 }}
            />
          </View>
        </Card>
      )
    }
    if (usingAppNamesAndNumbers.length === 0) {
      return null
    }
    const finalList = usingAppNamesAndNumbers.map((contact, i) => {
      const { name, number } = contact
      return (
        <Card key={i}>
          <View style={styles.containerView}>
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

const styles = {
  containerView: { flexDirection: 'row', justifyContent: 'space-between' }
}

export default connect(
  null,
  { setAllContacts, setUsersNumbers }
)(ContactsUsingApp)
