import { Card, Divider } from 'react-native-elements'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, TouchableOpacity, View } from 'react-native'
import {
  setAllContacts,
  setFriends,
  setFriendsFromDb,
  setUsersNumbers
} from '../actions'
import EditFriendModal from '../modals/EditFriendModal'

class FriendsList extends Component {
  state = {
    myFriends: [],
    addFriendModalVisible: false,
    editName: '',
    editNumber: '',
    oldNumber: ''
  }
  componentWillMount() {
    this.props.setFriendsFromDb()
  }

  onEdit = async () => {
    const newMyFriends = this.props.myFriends.map(friend => {
      if (friend.number === this.state.oldNumber) {
        return {
          ...friend,
          name: this.state.editName,
          number: this.state.editNumber
        }
      } else {
        return friend
      }
    })

    this.setState({ editFriendModalVisible: false })
    await this.props.setFriends(newMyFriends)
    this.props.refresh()
  }

  onDecline = () => {
    this.setState({
      editFriendModalVisible: false
    })
  }

  onDelete = async number => {
    const newMyFriends = this.props.myFriends.filter(friend => {
      return friend.number !== number
    })
    this.setState({ editFriendModalVisible: false })
    await this.props.setFriends(newMyFriends)
    this.props.refresh()
  }

  onPressFriend = (name, number) => {
    this.setState({
      editName: name,
      editNumber: number,
      editFriendModalVisible: true,
      oldNumber: number
    })
  }

  changeName = editName => {
    this.setState({ editName })
  }

  changeNumber = editNumber => {
    this.setState({ editNumber })
  }

  render() {
    const { myFriends } = this.props

    const myFriendsList = myFriends.map((friend, i) => {
      const { name, number } = friend
      return (
        <View key={i}>
          <TouchableOpacity onPress={() => this.onPressFriend(name, number)}>
            <View style={styles.friendView}>
              <Text>{name}</Text>
              <Text>{number}</Text>
            </View>
            <Divider />
          </TouchableOpacity>
        </View>
      )
    })

    return (
      <Card title="My Friends">
        <EditFriendModal
          name={this.state.editName}
          number={this.state.editNumber}
          changeName={name => this.changeName(name)}
          changeNumber={number => this.changeNumber(number)}
          visible={this.state.editFriendModalVisible}
          onAccept={this.onEdit}
          onDecline={this.onDecline}
          onDelete={this.onDelete}
          editMode={true}
        />
        {myFriendsList}
      </Card>
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
  const { myFriends } = state.friends
  const { myInfo, notificationToken } = state.auth

  return { myFriends, myInfo, notificationToken }
}

export default connect(
  mapStateToProps,
  {
    setFriendsFromDb,
    setFriends,
    showContactsAsync: setAllContacts,
    getUsersNumbers: setUsersNumbers
  }
)(FriendsList)
