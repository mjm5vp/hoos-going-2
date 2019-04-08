import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Linking } from 'react-native'
import { connect } from 'react-redux'
import { Card, Icon, Button } from 'react-native-elements'
import _ from 'lodash'
import { Permissions } from 'expo'

import addStyles from '../styles/addStyles'
import { getContactsAsync, getUsersNumbers } from '../services/contacts'
import { setAllContacts, setUsersNumbers, acceptFriend } from '../actions'
import AddFriendModal from '../modals/AddFriendModal'

class ContactsUsingApp extends Component {
  state = {
    loading: true,
    contactPermissionDenied: true,
    allContacts: [],
    usersNumbers: [],
    usingAppNamesAndNumbers: [],
    addName: '',
    addNumber: '',
    addFriendModalVisible: false
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
      const allContacts = (await getContactsAsync()).filter(contacts => {
        return !_.some(this.props.myFriends, ['number', number])
      })

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

  onPressUser = (name, number) => {
    this.setState({
      addName: name,
      addNumber: number,
      addFriendModalVisible: true
    })
  }

  changeName = addName => {
    this.setState({ addName })
  }

  changeNumber = addNumber => {
    this.setState({ addNumber })
  }

  onAccept = () => {
    const { name, number } = this.props.myInfo
    const { notificationToken } = this.props

    this.props.acceptFriend({
      name: this.state.addName,
      number: this.state.addNumber,
      myName: name,
      myNumber: number,
      notificationToken
    })
    this.setState({ addFriendModalVisible: false })
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

    return (
      <Card title="Contacts using Hoos Going 2">
        <AddFriendModal
          name={this.state.addName}
          number={this.state.addNumber}
          visible={this.state.addFriendModalVisible}
          onAccept={this.onAccept}
        />
        {finalList}
      </Card>
    )
  }
}

const styles = {
  containerView: { flexDirection: 'row', justifyContent: 'space-between' }
}

const mapStateToProps = state => {
  const { myInfo, notificationToken } = state.auth
  const { myFriends } = state.friends

  return { myInfo, notificationToken, myFriends }
}

export default connect(
  mapStateToProps,
  { setAllContacts, setUsersNumbers, acceptFriend }
)(ContactsUsingApp)
