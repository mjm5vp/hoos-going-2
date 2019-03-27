import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Linking,
  ListView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import {
  Button,
  Card,
  FormInput,
  FormLabel,
  Icon,
  ListItem
} from 'react-native-elements'
import React, { Component } from 'react'
import { acceptFriend, addFriend } from '../actions'

import AlphaScrollFlatList from 'alpha-scroll-flat-list'
// import AddFriendModal from '../modals/AddFriendModal';
import ConfirmCancelModal from '../modals/ConfirmCancelModal'
import Expo from 'expo'
import Modal from 'react-native-modal'
import _ from 'lodash'
import addStyles from '../styles/addStyles'
import { connect } from 'react-redux'
import firebase from 'firebase'
import people from './people'
// import styles from '../styles/modalStyles'
import { text } from 'react-native-communications'

const WIDTH = Dimensions.get('window').width
const ITEM_HEIGHT = 50

class AddFriends extends Component {
  constructor() {
    super()
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      usersNumbers: [],
      contactsNumbers: [],
      contactsNamesAndNumbers: [],
      loading: true,
      showModal: false,
      confirmCancelModalVisible: false,
      sendNumber: null,
      newContactName: '',
      newContactNumber: '',
      contactPermissionDenied: null,
      dummyData: people
    }
  }

  componentDidMount() {
    this.showFirstContactAsync()
  }

  addByNumber = () => {
    this.setState({
      showModal: true
    })
  }

  renderItem({ item }) {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.company}</Text>
      </View>
    )
  }

  renderAddFriendModal = () => {
    return (
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
        avoidKeyboard
      >
        <View style={styles.modalContent}>
          <View style={styles.inputView}>
            <Text>Confirm contact info</Text>

            <FormLabel>Name</FormLabel>
            <FormInput
              value={this.state.newContactName}
              onChangeText={newContactName => this.setState({ newContactName })}
            />

            <FormLabel>Number</FormLabel>
            <FormInput
              keyboardType="number-pad"
              value={this.state.newContactNumber}
              onChangeText={newContactNumber =>
                this.setState({ newContactNumber })
              }
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() =>
                this.onAccept(
                  this.state.newContactName,
                  this.state.newContactNumber
                )
              }
            >
              <View style={styles.button}>
                <Text>Add Friend</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ showModal: false })}
            >
              <View style={styles.cancelButton}>
                <Text>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  createDataSource(contactsNamesAndNumbers) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.dataSource = ds.cloneWithRows(contactsNamesAndNumbers)
    this.setState({ loading: false })
  }

  showFirstContactAsync = async () => {
    // Ask for permission to query contacts.
    const permission = await Expo.Permissions.askAsync(
      Expo.Permissions.CONTACTS
    )
    if (permission.status !== 'granted') {
      // Permission was denied...
      this.setState({ loading: false, contactPermissionDenied: true })
      return
    }
    const contacts = await Expo.Contacts.getContactsAsync({
      fields: [Expo.Contacts.PHONE_NUMBERS],
      pageSize: 0,
      pageOffset: 0
    })
    this.formatContacts(contacts)
    this.setState({ contacts: contacts.data })
    let usersNumbers = null
    await firebase
      .database()
      .ref('/users')
      .once('value', snapshot => {
        usersNumbers = Object.keys(snapshot.val())
      })
    this.setState({ usersNumbers })
  }

  formatContacts = contacts => {
    const contactsNumbers = []
    let contactsNamesAndNumbers = []

    contacts.data.filter(contact => contact.phoneNumbers[0]).forEach(contact =>
      contact.phoneNumbers.forEach(phoneNumber => {
        const number = this.formatPhone(phoneNumber.number)
        if (
          number.length === 10 &&
          !_.some(this.props.myFriends, ['number', number])
        ) {
          contactsNumbers.push(number)
          contactsNamesAndNumbers.push({ name: contact.name, number })
        }
      })
    )

    contactsNamesAndNumbers = _.uniqWith(contactsNamesAndNumbers, _.isEqual)
    contactsNamesAndNumbers = _.sortBy(
      contactsNamesAndNumbers,
      contact => contact.name
    )
    this.createDataSource(contactsNamesAndNumbers)
    this.setState({ contactsNumbers, contactsNamesAndNumbers })
  }

  formatPhone = phone => {
    const number = String(phone).replace(/[^\d]/g, '')
    return number.charAt(0) === '1' ? number.substring(1) : number
  }

  onPressNonUser = number => {
    this.setState({ confirmCancelModalVisible: true, sendNumber: number })
  }

  sendText = () => {
    text(
      this.state.sendNumber,
      'Download Hoos going 2 so we can track each others poos!'
    )
  }

  onPressUser = (newContactName, newContactNumber) => {
    this.setState({ newContactName, newContactNumber, showModal: true })
  }

  renderRow = contact => {
    const { name, number } = contact
    return (
      <ListItem
        title={name}
        subtitle={number}
        onPress={() => this.onPressUser(name, number)}
      />
    )
  }

  changeName = name => {
    this.setState({ name })
  }

  changeNumber = number => {
    this.setState({ number })
  }

  renderAddFriendByNumber = () => {
    return (
      <View>
        <Card>
          <TouchableOpacity onPress={() => this.addByNumber()}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Text>Add Friend by Number</Text>
              <Icon
                name="ios-add-circle-outline"
                type="ionicon"
                color="#517fa4"
                size={20}
                style={{ margin: 5 }}
              />
            </View>
          </TouchableOpacity>
        </Card>

        {this.renderAddFriendModal()}
      </View>
    )
  }

  renderUsingAppList = () => {
    const {
      contactsNumbers,
      usersNumbers,
      contactsNamesAndNumbers
    } = this.state

    const usingApp = _.intersectionWith(
      contactsNumbers,
      usersNumbers,
      _.isEqual
    )
    const usingAppNamesAndNumbers = []

    usingApp.forEach(usingContact => {
      usingAppNamesAndNumbers.push(
        _.find(contactsNamesAndNumbers, contact => {
          return usingContact === contact.number
        })
      )
    })

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

    return finalList.length > 0 ? (
      <Card title="Contacts using Hoos Going 2">{finalList}</Card>
    ) : null
  }

  onAccept = () => {
    const { name, number } = this.props.myInfo
    const { notificationToken } = this.props

    // this.props.addFriend(friend, myInfo);
    this.props.acceptFriend({
      name: this.state.newContactName,
      number: this.state.newContactNumber,
      myName: name,
      myNumber: number,
      notificationToken
    })
    this.setState({ showModal: false })
  }

  keyExtractor(item) {
    return item.id
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: '50%', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    if (this.state.contactPermissionDenied) {
      return (
        <View>
          {this.renderAddFriendByNumber()}
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
        </View>
      )
    }

    // const input = (
    //   <View>
    //     <TextInput
    //       label='Name'
    //       value={this.state.newContactName}
    //       onTextChange={newContactName => this.setState({ newContactName })}
    //     />
    //     <TextInput
    //       label='Number'
    //       value={this.state.newContactNumber}
    //       onTextChange={newContactNumber => this.setState({ newContactNumber })}
    //     />
    //   </View>
    // );

    return (
      // <ScrollView>
      // <View>

      <View style={styles.container}>
        {this.renderAddFriendByNumber()}

        {/* {this.renderUsingAppList()} */}
        {/* <Card title="Invite Friends"> */}
        <View>
          {/* <ListView dataSource={this.dataSource} renderRow={this.renderRow} /> */}
          <AlphaScrollFlatList
            keyExtractor={this.keyExtractor.bind(this)}
            data={people.sort((prev, next) =>
              prev.name.localeCompare(next.name)
            )}
            renderItem={this.renderItem.bind(this)}
            scrollKey={'name'}
            reverse={false}
            itemHeight={ITEM_HEIGHT}
          />
        </View>
        {/* </Card> */}
        {this.renderAddFriendModal()}

        <ConfirmCancelModal
          infoText="Text contact with invite link?"
          visible={this.state.confirmCancelModalVisible}
          onAccept={this.sendText}
          onDecline={() => this.setState({ confirmCancelModalVisible: false })}
        />
      </View>
      // </View>

      // </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  const { myInfo, notificationToken } = state.auth
  const { myFriends } = state.friends

  return { myFriends, myInfo, notificationToken }
}

export default connect(
  mapStateToProps,
  { addFriend, acceptFriend }
)(AddFriends)

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
    // paddingVertical: 50
  },
  itemContainer: {
    width: WIDTH,
    flex: 1,
    flexDirection: 'column',
    height: ITEM_HEIGHT
  },
  itemTitle: {
    fontWeight: 'bold',
    color: '#888',
    padding: 5
  },
  itemSubtitle: {
    color: '#ddd',
    padding: 5,
    paddingTop: 0
  }
}
