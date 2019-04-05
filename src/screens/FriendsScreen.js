import {
  Button,
  Card,
  Divider,
  FormInput,
  FormLabel,
  Icon
} from 'react-native-elements'
import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import {
  acceptFriend,
  checkAddedMe,
  setFriends,
  setFriendsFromDb
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
    addedMe: [],
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

    // this.askContactsPermission()
    this.setState({ currentUser, myFriends: sortedFriends })
  }

  // askContactsPermission = async () => {
  //   // Ask for permission to query contacts.
  //   const permission = await Expo.Permissions.askAsync(
  //     Expo.Permissions.CONTACTS
  //   )
  //   if (permission.status !== 'granted') {
  //     // Permission was denied...
  //     this.setState({ loading: false, contactPermissionDenied: true })
  //     return
  //   }
  // }

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

  render() {
    return (
      <ScrollView>
        {/* <Modal
          isVisible={this.state.showModal}
          backdropColor={'black'}
          backdropOpacity={0.5}
          animationIn={'slideInLeft'}
          animationOut={'slideOutRight'}
          animationInTiming={250}
          animationOutTiming={250}
          backdropTransitionInTiming={250}
          backdropTransitionOutTiming={250}
        >
          <View style={modalStyles.modalContent}>
            <View style={modalStyles.inputView}>
              <Text>Edit contact info</Text>

              <FormLabel>Name</FormLabel>
              <FormInput
                value={this.state.editName}
                onChangeText={editName => this.setState({ editName })}
              />

              <FormLabel>Number</FormLabel>
              <FormInput
                value={this.state.editNumber}
                onChangeText={editNumber => this.setState({ editNumber })}
              />
            </View>
            <View style={modalStyles.buttonView}>
              <TouchableOpacity onPress={this.onEditAccept}>
                <View style={modalStyles.button}>
                  <Text>Edit</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onCancel}>
                <View style={modalStyles.cancelButton}>
                  <Text>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={modalStyles.buttonView}>
              <TouchableOpacity onPress={this.onDelete}>
                <View style={modalStyles.dangerButton}>
                  <Text style={modalStyles.dangerButtonText}>Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}

        {/* {this.renderAddedMe()} */}
        {/* <View style={styles.menuView}> */}

        {/* <Button
            title='Add Friends'
            onPress={() => this.props.navigation.navigate('add_friends')}
          /> */}
        {/* </View> */}
        <ContactsUsingApp />
        <FriendsList />
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
    setFriends
  }
)(FriendsScreen)
