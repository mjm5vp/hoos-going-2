import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { Card, Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import firebase from 'firebase'
// import { LoginButton } from 'react-native-fbsdk';

import { checkIfNotificationsOn } from '../services/push_notifications'
import styles from '../styles/modalStyles'
import { editPoos, deleteFriends, deleteUser } from '../actions'

class SettingsScreen extends Component {
  state = {
    showModal: false,
    modalText: '',
    modalConfirmMethod: ''
  }

  componentDidMount() {
    this.checkNotificationsAsync()
  }

  checkNotificationsAsync = async () => {
    const notificationsOn = await checkIfNotificationsOn()

    this.setState({ notificationsOn })
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  modalConfirm = confirmMethod => {
    switch (confirmMethod) {
      case 'delete_all_poos':
        this.deleteAllPoos()
        this.setState({ showModal: false })
        break
      case 'delete_all_friends':
        this.deleteAllFriends()
        this.setState({ showModal: false })
        break
      case 'delete_account':
        this.deleteAccount()
        this.setState({ showModal: false })
        break
      default:
        console.log('default')
    }
  }

  deleteAllPoos = () => {
    this.setState({ showModal: true })
    const noPoos = []

    this.props.editPoos(noPoos)
  }

  deleteAllFriends = () => {
    this.props.deleteFriends()
  }

  deleteAccount = () => {
    this.props.deleteUser()
  }

  renderDeleteAccount = () => {
    const { currentUser } = firebase.auth()

    if (!currentUser) {
      return <View />
    }

    return (
      <Card>
        <Button
          title="Delete Account"
          onPress={() => {
            this.setState({
              showModal: true,
              modalText: 'Are you sure you want to delete your Account?',
              modalConfirmMethod: 'delete_account'
            })
          }}
        />
      </Card>
    )
  }

  renderNotificationsSettings = () => {
    if (this.state.notificationsOn) {
      return
    }

    return (
      <Card>
        <Button
          title="Turn Notifications On"
          onPress={() => Linking.openURL('app-settings:')}
        />
      </Card>
    )
  }

  render() {
    return (
      <View>
        <Modal
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
          <View style={styles.modalContent}>
            <Text>{this.state.modalText}</Text>
            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => this.setState({ showModal: false })}
              >
                <View style={styles.cancelButton}>
                  <Text>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.modalConfirm(this.state.modalConfirmMethod)}
              >
                <View style={styles.dangerButton}>
                  <Text style={styles.dangerButtonText}>Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {this.renderNotificationsSettings()}

        <Card>
          <Button
            title="Delete All Poos"
            onPress={() => {
              this.setState({
                showModal: true,
                modalText: 'Are you sure you want to delete ALL Poos?',
                modalConfirmMethod: 'delete_all_poos'
              })
            }}
          />
        </Card>

        <Card>
          <Button
            title="Delete All Friends"
            onPress={() => {
              this.setState({
                showModal: true,
                modalText: 'Are you sure you want to delete ALL Friends?',
                modalConfirmMethod: 'delete_all_friends'
              })
            }}
          />
        </Card>

        {this.renderDeleteAccount()}
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { token } = state.auth

  return { token }
}

export default connect(
  mapStateToProps,
  { editPoos, deleteFriends, deleteUser }
)(SettingsScreen)
