import React, { Component } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Card, Button, CheckBox } from 'react-native-elements'
import { connect } from 'react-redux'
import _ from 'lodash'

import { setSendToFriends } from '../actions'

class SendToFriends extends Component {
  static navigationOptions = {
    title: 'Send to Friends',
    headerBackTitle: 'Cancel'
  }

  state = {
    myFriendsList: [],
    checkedFriends: []
  }

  componentWillMount() {
    const { myFriends, sendToFriends } = this.props

    const newMyFriends = []
    myFriends.forEach(friend => {
      newMyFriends.push({
        name: friend.name,
        number: friend.number,
        checked: friend.checked,
        pushToken: friend.pushToken
      })
    })

    const sendToFriendsNumbers = sendToFriends.map(friend => {
      return friend.number
    })

    // const sortedFriends = _.orderBy(newMyFriends, [friend => friend.name.toLowerCase()]);
    const sortedCheckedFriends = newMyFriends.filter(friend => {
      const newFriend = friend
      if (sendToFriendsNumbers.includes(friend.number)) {
        newFriend.checked = true
      }
      return newFriend
    })

    // const checkedFriends = myFriends.filter(friend => friend.checked);
    // const sortedCheckedFriends = _.sortBy(checkedFriends, friend => friend.name);

    this.setState({
      myFriendsList: sortedCheckedFriends,
      checkedFriends: sendToFriends
    })
  }

  checkBox = i => {
    const newMyFriends = []
    this.state.myFriendsList.forEach(friend => {
      newMyFriends.push({
        name: friend.name,
        number: friend.number,
        checked: friend.checked,
        pushToken: friend.pushToken
      })
    })

    newMyFriends[i].checked = !newMyFriends[i].checked

    const checkedFriends = newMyFriends.filter(friend => friend.checked)

    this.setState({
      myFriendsList: newMyFriends,
      checkedFriends
    })
  }

  onSubmit = () => {
    this.props.setSendToFriends(this.state.checkedFriends)
    this.props.navigation.goBack()
  }

  renderFriendsList = () => {
    return this.state.myFriendsList.map((friend, i) => {
      const checked = friend.checked
      return (
        <Card key={i}>
          <View style={styles.cardView}>
            <View>
              <Text>{friend.name}</Text>
            </View>
            <CheckBox
              onPress={() => this.checkBox(i)}
              checked={checked}
              center
            />
          </View>
        </Card>
      )
    })
  }

  renderSubmitButton = () => {
    const { checkedFriends } = this.state
    let checkedFriendsList = null

    if (checkedFriends.length === 0) {
      checkedFriendsList = <Text>No friends selected</Text>
    } else {
      checkedFriendsList = checkedFriends.map((friend, i) => {
        if (i === 0) {
          return <Text key={i}>{friend.name}</Text>
        }
        return <Text key={i}>, {friend.name}</Text>
      })
    }

    return (
      <Card containerStyle={styles.checkedFriendsCard}>
        <View style={styles.submitButtonContainer}>
          <ScrollView
            horizontal
            style={styles.checkedFriendsStyle}
            contentContainerStyle={{ alignItems: 'center' }}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={() => {
              this.scrollView.scrollToEnd({ animated: true })
            }}
          >
            {checkedFriendsList}
          </ScrollView>
          <Button
            title="Confirm"
            onPress={() => this.onSubmit()}
            buttonStyle={styles.submitButton}
          />
        </View>
      </Card>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.friendsList}>
          {this.renderFriendsList()}
        </ScrollView>

        {this.renderSubmitButton()}
      </View>
    )
  }
}

const styles = {
  checkedFriendsCard: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0
    // flex: 1,
    // width: '100%'
  },
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  friendsList: {
    marginBottom: 100
  },
  submitButtonContainer: {
    flexDirection: 'row',
    // position: 'absolute',
    // left: 20,
    // right: 10,
    // flex: 1,
    alignItems: 'center'
    // width: '80%'
  },
  submitButton: {
    height: 40,
    borderRadius: 5,
    backgroundColor: 'rgba(0,150,136,0.5)'
  },
  checkedFriendsStyle: {
    flexDirection: 'row',
    height: 40
  }
}

const mapStateToProps = state => {
  const { myFriends } = state.friends
  const { sendToFriends } = state.input

  return { myFriends, sendToFriends }
}

export default connect(
  mapStateToProps,
  { setSendToFriends }
)(SendToFriends)
