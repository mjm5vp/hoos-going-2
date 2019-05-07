import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  Linking,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { Card, Icon, Button } from 'react-native-elements'
import _ from 'lodash'

import addStyles from '../styles/addStyles'
import { acceptFriend } from '../actions'
import EditFriendModal from '../modals/AddFriendModal'

class ContactsUsingApp extends Component {
  state = {
    loading: true,
    usingAppNamesAndNumbers: [],
    addName: '',
    addNumber: '',
    addFriendModalVisible: false,
    editFriendModalVisible: false
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

  onAccept = async () => {
    const { name, number } = this.props.myInfo
    const { notificationToken } = this.props

    this.setState({ addFriendModalVisible: false })

    await this.props.acceptFriend({
      name: this.state.addName,
      number: this.state.addNumber,
      myName: name,
      myNumber: number,
      notificationToken
    })
    this.props.refresh()
  }

  onDecline = () => {
    this.setState({
      addFriendModalVisible: false
    })
  }

  changeName = addName => {
    this.setState({
      addName
    })
  }

  changeNumber = addNumber => {
    this.setState({
      addNumber
    })
  }

  getLoadingSpinner = () => {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  render() {
    const { contactPermissionGranted, usingAppNamesAndNumbers } = this.props

    if (contactPermissionGranted === null) {
      return this.getLoadingSpinner()
    }

    if (!contactPermissionGranted) {
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
    if (usingAppNamesAndNumbers === null) {
      return this.getLoadingSpinner()
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
        <EditFriendModal
          name={this.state.addName}
          number={this.state.addNumber}
          visible={this.state.addFriendModalVisible}
          onAccept={this.onAccept}
          onDecline={this.onDecline}
          changeName={name => this.changeName(name)}
          changeNumber={number => this.changeNumber(number)}
          onDelete={number => this.onDelete(number)}
          editMode={false}
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
  { acceptFriend }
)(ContactsUsingApp)
