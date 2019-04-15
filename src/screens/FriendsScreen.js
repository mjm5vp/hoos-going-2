import {
  Button,
  Card,
  Divider,
  FormInput,
  FormLabel,
  Icon
} from 'react-native-elements'
import React, { Component } from 'react'
import { Permissions } from 'expo'
import {
  getContactsAsync,
  getUsersNumbers,
  removeFriendsFromContacts
} from '../services/contacts'
import { ScrollView, RefreshControl } from 'react-native'
import {
  acceptFriend,
  checkAddedMe,
  setFriends,
  setFriendsFromDb,
  setAllContacts,
  setUsersNumbers
} from '../actions'

import ContactsUsingApp from '../components/ContactsUsingApp'
import FriendsList from '../components/FriendsList'
import Modal from 'react-native-modal'
import _ from 'lodash'
import { connect } from 'react-redux'
import firebase from 'firebase'
import modalStyles from '../styles/modalStyles'
import { registerForPushNotificationsAsync } from '../services/push_notifications'

class FriendsScreen extends Component {
  static navigationOptions = () => {
    return {
      title: 'Friends'
    }
  }

  state = {
    contactsMinusFriends: [],
    usersNumbers: [],
    usingAppNamesAndNumbers: null,
    contactPermissionGranted: null,
    refreshing: false,
    myFriends: [],
    currentUser: null,
    showModal: false,
    editName: '',
    editNumber: '',
    id: ''
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    const { myFriends } = this.props
    // registerForPushNotificationsAsync();

    const sortedFriends = _.orderBy(myFriends, [
      friend => friend.name.toLowerCase()
    ])

    this.setState({ currentUser, myFriends: sortedFriends })
    this.refreshContactAndUserData()
  }

  askContactsPermission = async () => {
    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS)
    return permission.status === 'granted'
  }

  refreshContactAndUserData = async () => {
    console.log('refresh')
    const contactPermissionGranted = await this.askContactsPermission()

    this.setState({ contactPermissionGranted })

    if (contactPermissionGranted) {
      const allContacts = await getContactsAsync()
      const contactsMinusFriends = removeFriendsFromContacts(
        allContacts,
        this.props.myFriends
      )
      const usersNumbers = await getUsersNumbers()
      const usingAppNamesAndNumbers = this.getUsingAppList(
        contactsMinusFriends,
        usersNumbers
      )
      this.setState({ contactsMinusFriends, usingAppNamesAndNumbers })
      this.props.setAllContacts(contactsMinusFriends)
      this.props.setUsersNumbers(usersNumbers)
    }
  }

  getUsingAppList = (allContacts, usersNumbers) => {
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

    return usingAppNamesAndNumbers
  }

  editContactInfo = (name, number, i) => {
    this.setState({
      showModal: true,
      editName: name,
      editNumber: number,
      id: i
    })
  }

  onEditAccept = () => {
    const { editName, editNumber, id, myFriends } = this.state

    const newMyFriends = myFriends
    newMyFriends[id] = { name: editName, number: editNumber }

    this.props.setFriends(newMyFriends)
    this.setState({ showModal: false, myFriends: newMyFriends })
  }

  onDelete = () => {
    const { id, myFriends } = this.state
    const newMyFriends = myFriends
    newMyFriends.splice(id, 1)

    this.props.setFriends(newMyFriends)
    this.setState({ showModal: false, myFriends: newMyFriends })
  }

  onCancel = () => {
    this.setState({ showModal: false })
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.refreshContactAndUserData()
    this.setState({ refreshing: false })
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <Button
          title="Contacts"
          onPress={() => this.props.navigation.navigate('add_contacts')}
          raised
        />
        <ContactsUsingApp
          contactPermissionGranted={this.state.contactPermissionGranted}
          usingAppNamesAndNumbers={this.state.usingAppNamesAndNumbers}
          refresh={() => this.refreshContactAndUserData()}
        />
        <FriendsList refresh={() => this.refreshContactAndUserData()} />
      </ScrollView>
    )
  }
}

const styles = {
  menuView: {
    flexDirection: 'row'
  },
  addView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconView: {
    flexDirection: 'row'
  },
  friendView: {
    marginTop: 10,
    marginBottom: 10
  }
}

const mapStateToProps = state => {
  const { myFriends, addedMe } = state.friends
  const { myInfo, notificationToken } = state.auth

  return { myFriends, addedMe, myInfo, notificationToken }
}

export default connect(
  mapStateToProps,
  {
    checkAddedMe,
    acceptFriend,
    setFriendsFromDb,
    setFriends,
    setAllContacts,
    setUsersNumbers
  }
)(FriendsScreen)
