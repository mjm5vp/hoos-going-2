import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView
} from 'react-native'
import { Button, Card } from 'react-native-elements'
import { connect } from 'react-redux'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import firebase from 'firebase'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Modal from 'react-native-modal'

import allNamedPoos from '../../assets/namedPooExport'
import toiletImage from '../../assets/otherImages/toilet.jpg'
import styles from '../styles/inputStyles'
import modalStyles from '../styles/modalStyles'
import {
  increaseUID,
  selectPoo,
  updateDescription,
  updateDateTime,
  addPoo,
  editPoos,
  resetInput,
  sendToFriendsAction
} from '../actions'

class InputScreen extends Component {
  static navigationOptions = {
    title: 'Send to Friends',
    headerBackTitle: 'Cancel'
  }

  state = {
    date: moment(),
    time: moment(),
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    description: '',
    showModal: false,
    showInfoModal: false,
    currentUser: null
  }

  componentWillMount() {
    this.setAuthSubscription()
    const date = moment().format('YYYY-MM-DD')
    const time = moment().format('HH:mm')
    const datetime = `${date}T${time}`

    this.props.updateDateTime(datetime)

    this.setState({ date: moment(), time: moment() })
  }

  setAuthSubscription = () => {
    firebase.auth().onAuthStateChanged(currentUser => {
      this.setState({ currentUser })
    })
  }

  showDatePicker = () => this.setState({ isDatePickerVisible: true })

  hideDatePicker = () => this.setState({ isDatePickerVisible: false })

  handleDatePicked = date => {
    const time = this.state.time.format('HH:mm')
    const newDate = moment(date).format('YYYY-MM-DD')
    const datetime = `${newDate}T${time}`

    this.props.updateDateTime(datetime)
    this.setState({ date: moment(date) })
    this.hideDatePicker()
  }

  showTimePicker = () => this.setState({ isTimePickerVisible: true })

  hideTimePicker = () => this.setState({ isTimePickerVisible: false })

  handleTimePicked = time => {
    const date = this.state.date.format('YYYY-MM-DD')
    const newTime = moment(time).format('HH:mm')
    const datetime = `${date}T${newTime}`

    this.props.updateDateTime(datetime)
    this.setState({ time: moment(time) })
    this.hideTimePicker()
  }

  renderMapPreview = () => {
    if (this.props.location.latitude) {
      const { latitude, longitude } = this.props.location
      const pooImage = allNamedPoos[this.props.currentPooName].image

      const region = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      }
      console.log(region)

      return (
        <Card>
          <View style={{ height: 200, marginBottom: 10 }}>
            <MapView
              mapType={this.props.mapType}
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              cacheEnabled={Platform.OS === 'android'}
              scrollEnabled={false}
              region={region}
            >
              <MapView.Marker
                coordinate={this.props.location}
                image={pooImage}
                anchor={{ x: 0.5, y: 0.5 }}
              />
            </MapView>
          </View>

          <Button
            title="Change Location"
            style={{ marginTop: 10 }}
            onPress={() => this.props.navigation.navigate('map_select')}
            buttonStyle={styles.selectButton}
            // iconRight={{ name: 'google-maps', type: 'material-community' }}
            raised
          />
        </Card>
      )
    }

    return (
      <Card>
        <View style={styles.emptyMapView}>
          <Text style={{}}>Location Not Set</Text>
        </View>

        <Button
          title="Add to Map"
          style={{ marginTop: 10 }}
          onPress={() => this.props.navigation.navigate('map_select')}
          buttonStyle={styles.selectButton}
          raised
          // iconRight={{ name: 'google-maps', type: 'material-community' }}
        />
      </Card>
    )
  }

  renderSendingToList = () => {
    const { sendToFriends } = this.props
    let sendToFriendsList = null

    if (sendToFriends.length === 0) {
      sendToFriendsList = <Text>No friends selected</Text>
    } else {
      sendToFriendsList = sendToFriends.map((friend, i) => {
        if (i === 0) {
          return <Text key={i}>{friend.name}</Text>
        }
        return <Text key={i}>, {friend.name}</Text>
      })
    }

    return (
      <View style={styles.sendToFriendsContainer}>
        <ScrollView
          horizontal
          style={{ flexDirection: 'row', height: 40 }}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {sendToFriendsList}
        </ScrollView>
      </View>
    )
  }

  renderFlushButton = () => {
    if (this.props.inputType === 'new') {
      return (
        <View>
          <Card title="Flush" containerStyle={{ marginBottom: 20 }}>
            <TouchableOpacity onPress={() => this.handleFlush()}>
              <View style={styles.toiletImageView}>
                <Image source={toiletImage} style={styles.toiletImage} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>
      )
    }

    return (
      <View>
        <Card title="Update">
          <TouchableOpacity onPress={() => this.handleUpdate()}>
            <View style={styles.toiletImageView}>
              <Image source={toiletImage} style={styles.toiletImage} />
            </View>
          </TouchableOpacity>
        </Card>

        <Card containerStyle={{ marginBottom: 20 }}>
          <Button
            title="Delete"
            onPress={() => this.setState({ showModal: !this.state.showModal })}
            raised
            backgroundColor="red"
          />
        </Card>
      </View>
    )
  }

  updateByUID = () => {
    const {
      inputUID,
      currentPooName,
      datetime,
      description,
      location,
      myPoos
    } = this.props

    return myPoos.map(poo => {
      console.log(`poo.inputUID: ${poo.inputUID}`)
      console.log(`inputUID: ${inputUID}`)
      if (poo.inputUID === inputUID) {
        return { inputUID, currentPooName, datetime, description, location }
      }
      return poo
    })
  }

  handleUpdate = () => {
    const newPoos = this.updateByUID()

    this.props.editPoos(newPoos)
    this.props.resetInput()
    this.props.navigation.goBack()
  }

  deleteByUID = () => {
    const { inputUID, myPoos } = this.props

    return myPoos.filter(poo => {
      return poo.inputUID !== inputUID
    })
  }

  handleDelete = () => {
    const newPoos = this.deleteByUID()

    this.props.editPoos(newPoos)
    this.props.resetInput()
    this.props.navigation.goBack()
  }

  handleFlush = () => {
    const {
      uid,
      currentPooName,
      datetime,
      description,
      location,
      sendToFriends,
      myInfo
    } = this.props
    const poo = {
      inputUID: uid,
      currentPooName,
      datetime,
      description,
      location
    }

    this.props.addPoo(poo)
    this.props.increaseUID()

    if (sendToFriends.length > 0) {
      this.props.sendToFriendsAction({ sendToFriends, poo, myInfo })
    }
    this.props.resetInput()
    this.props.navigation.goBack()
  }

  onSendToFriendsPress = () => {
    if (this.state.currentUser) {
      this.props.navigation.navigate('send_to_friends')
    } else {
      this.setState({
        showInfoModal: true
      })
    }
  }

  onAccept = () => {
    this.handleDelete()
  }

  onDecline = () => {
    this.setState({ showModal: false, showInfoModal: false })
  }

  render() {
    const pooImage = allNamedPoos[this.props.currentPooName].image

    return (
      <ScrollView contentContainerStyle={styles.containerStyle}>
        <Card>
          <View style={styles.selectCard}>
            <Image source={pooImage} style={styles.pooSelectImage} />

            <View style={styles.selectButtonView}>
              <Button
                title="Select Poomoji"
                onPress={() => this.props.navigation.navigate('select')}
                buttonStyle={styles.selectButton}
                fontSize={20}
                raised
              />
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.datetimeCard}>
            <Text style={styles.datetimeText}>
              {moment(this.props.datetime).format('MMMM Do YYYY, h:mm a')}
            </Text>

            <View style={styles.changeButtonsView}>
              <Button
                title="Change Date"
                onPress={this.showDatePicker}
                fontSize={20}
                buttonStyle={styles.selectButton}
                raised
              />
              <Button
                title="Change Time"
                onPress={this.showTimePicker}
                fontSize={20}
                buttonStyle={styles.selectButton}
                raised
              />
            </View>

            <DateTimePicker
              mode="date"
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDatePicker}
            />

            <DateTimePicker
              mode="time"
              isVisible={this.state.isTimePickerVisible}
              onConfirm={this.handleTimePicked}
              onCancel={this.hideTimePicker}
            />
          </View>
        </Card>

        <Card title="Description">
          <TextInput
            multiline
            label="Description"
            placeholder="How did everything go?"
            value={this.props.description}
            onChangeText={text => this.props.updateDescription({ text })}
            style={{ height: 100 }}
          />
        </Card>

        {this.renderMapPreview()}

        <Card>
          <View>
            <Button
              title="Send to friends"
              buttonStyle={styles.selectButton}
              raised
              // iconRight={{ name: 'send', type: 'font-awesome' }}
              onPress={() => this.onSendToFriendsPress()}
            />
          </View>

          {this.renderSendingToList()}
        </Card>

        {this.renderFlushButton()}

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
          <View style={modalStyles.modalContent}>
            <Text>Are you sure you want to delete this?</Text>
            <View style={modalStyles.buttonView}>
              <TouchableOpacity onPress={() => this.onDecline()}>
                <View style={modalStyles.cancelButton}>
                  <Text>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onAccept()}>
                <View style={modalStyles.dangerButton}>
                  <Text style={modalStyles.dangerButtonText}>Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.showInfoModal}
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
            <Text>
              You must create an account or be signed in to use this feature.
            </Text>
            <View style={modalStyles.buttonView}>
              <TouchableOpacity onPress={() => this.onDecline()}>
                <View style={modalStyles.button}>
                  <Text>OK</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  const { uid, myPoos } = state.pooReducer
  const { myInfo } = state.auth
  const { mapType } = state.settings
  const {
    inputType,
    inputUID,
    currentPooName,
    description,
    datetime,
    location,
    sendToFriends
  } = state.input

  return {
    inputType,
    uid,
    inputUID,
    currentPooName,
    description,
    datetime,
    location,
    sendToFriends,
    myPoos,
    myInfo,
    mapType
  }
}

export default connect(
  mapStateToProps,
  {
    increaseUID,
    selectPoo,
    updateDescription,
    updateDateTime,
    addPoo,
    editPoos,
    resetInput,
    sendToFriendsAction
  }
)(InputScreen)
