import React, { Component } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import AlphaScrollFlatList from 'alpha-scroll-flat-list'
import { connect } from 'react-redux'
import EditFriendModal from '../modals/EditFriendModal'
import { acceptFriend } from '../actions'

const WIDTH = Dimensions.get('window').width
const ITEM_HEIGHT = 50

class AddContactsScreen extends Component {
  state = {
    name: '',
    number: ''
  }

  onPressContact = (name, number) => {
    this.setState({ addContactModalVisible: true, name, number })
  }

  onCancel = () => {
    this.setState({ addContactModalVisible: false })
  }

  onAccept = () => {
    const { name, number } = this.props.myInfo
    const { notificationToken } = this.props

    this.setState({ addContactModalVisible: false })

    this.props.acceptFriend({
      name: this.state.name,
      number: this.state.number,
      myName: name,
      myNumber: number,
      notificationToken
    })

    this.props.navigation.goBack()
  }

  changeName = name => {
    this.setState({ name })
  }

  changeNumber = number => {
    this.setState({ number })
  }

  keyExtractor(item) {
    return item.id
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => this.onPressContact(item.name, item.number)}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>{item.number}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View>
        <EditFriendModal
          name={this.state.name}
          number={this.state.number}
          visible={this.state.addContactModalVisible}
          changeName={name => this.changeName(name)}
          changeNumber={number => this.changeNumber(number)}
          onAccept={this.onAccept}
          onDecline={this.onCancel}
          editMode={false}
        />
        <AlphaScrollFlatList
          keyExtractor={this.keyExtractor.bind(this)}
          data={this.props.allContacts.sort((prev, next) =>
            prev.name.localeCompare(next.name)
          )}
          renderItem={this.renderItem.bind(this)}
          scrollKey={'name'}
          reverse={false}
          itemHeight={ITEM_HEIGHT}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { myFriends, addedMe, allContacts } = state.friends
  const { myInfo, notificationToken } = state.auth

  return { myFriends, addedMe, myInfo, notificationToken, allContacts }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
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

export default connect(
  mapStateToProps,
  { acceptFriend }
)(AddContactsScreen)
