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
import { View, ScrollView, RefreshControl, Linking } from 'react-native'
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
import EditFriendModal from '../modals/EditFriendModal'
import Modal from 'react-native-modal'
import _ from 'lodash'
import { connect } from 'react-redux'
import firebase from 'firebase'
import modalStyles from '../styles/modalStyles'
import { registerForPushNotificationsAsync } from '../services/push_notifications'
import ConfirmCancelModal from '../modals/ConfirmCancelModal'
import { parseNumber, phoneUtil } from '../services/phone_validation'

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
    addFriendByNumberModalVisible: false,
    conactPermissionModalVisible: false,
    myFriends: [],
    currentUser: null,
    showModal: false,
    editName: '',
    editNumber: '',
    addNameNew: '',
    addNumberNew: '',
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
    this.setState({
      addFriendByNumberModalVisible: false,
      conactPermissionModalVisible: false
    })
  }

  onAcceptNew = () => {
    const { name, number } = this.props.myInfo
    const { notificationToken } = this.props

    // console.log(phoneUtil.isValidNumber(parseNumber(this.state.addNumberNew)))

    this.setState({ addFriendByNumberModalVisible: false })

    this.props.acceptFriend({
      name: this.state.addNameNew,
      number: this.state.addNumberNew,
      myName: name,
      myNumber: number,
      notificationToken
    })
  }

  changeName = addNameNew => {
    this.setState({ addNameNew })
  }

  changeNumber = addNumberNew => {
    this.setState({ addNumberNew })
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.refreshContactAndUserData()
    this.setState({ refreshing: false })
  }

  onPressContacts = () => {
    if (this.state.contactPermissionGranted) {
      this.props.navigation.navigate('add_contacts')
    } else {
      this.setState({ conactPermissionModalVisible: true })
    }
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
        <EditFriendModal
          name={this.state.addNameNew}
          number={this.state.addNumberNew}
          visible={this.state.addFriendByNumberModalVisible}
          changeName={name => this.changeName(name)}
          changeNumber={number => this.changeNumber(number)}
          onAccept={this.onAcceptNew}
          onDecline={this.onCancel}
          editMode={false}
        />
        <ConfirmCancelModal
          visible={this.state.conactPermissionModalVisible}
          infoText="Enable CONTACTS Permissions in Settings?"
          onAccept={() => Linking.openURL('app-settings:')}
          onDecline={this.onCancel}
        />
        <View style={styles.iconContainer}>
          <Icon
            name="address-book"
            type="font-awesome"
            onPress={this.onPressContacts}
            reverse
          />
          <Icon
            name="hashtag"
            type="font-awesome"
            onPress={() =>
              this.setState({ addFriendByNumberModalVisible: true })
            }
            reverse
          />
        </View>

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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
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
