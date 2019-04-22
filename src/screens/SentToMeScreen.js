import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  Linking
} from 'react-native'
import { Card, Divider, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import { fetchSentToMe, setNotificationToken } from '../actions'
import allNamedPoos from '../../assets/namedPooExport'
import { registerForPushNotificationsAsync } from '../services/push_notifications'

class SentToMeScreen extends Component {
  static navigationOptions = {
    title: 'Sent to me'
  }

  state = {
    refreshing: false,
    sentToMe: []
  }

  componentDidMount() {
    this.refreshScreen()
  }

  componentWillReceiveProps(nextProps) {
    const { sentToMe } = nextProps

    this.setState({ sentToMe })
  }

  renderNotificationsButton = () => {
    if (!this.props.notificationToken) {
      return (
        <Card>
          <Button
            title="Turn on notifications in settings"
            onPress={() => Linking.openURL('app-settings:')}
          />
        </Card>
      )
    }
  }

  renderList = () => {
    const sortedSentToMe = _.sortBy(this.state.sentToMe, o => {
      return new moment(o.datetime)
    }).reverse()

    return sortedSentToMe.map((item, i) => {
      const matchedFriend = _.find(this.props.myFriends, [
        'number',
        item.from.number
      ])
      const friendName = matchedFriend
        ? matchedFriend.name
        : `${item.from.name} (${item.from.number})`

      const datetime = moment(item.poo.datetime).format('MMMM Do YYYY, h:mm a')
      const pooImage = allNamedPoos[item.poo.currentPooName].image
      const description =
        item.poo.description === '' ? 'No description' : item.poo.description

      return (
        <Card key={i}>
          <Text>From: {friendName}</Text>
          <View style={styles.containerView}>
            <Image source={pooImage} style={styles.imageStyle} />
            <View style={styles.rightView}>
              <Text>{datetime}</Text>
              <Divider />
              <Text>{description}</Text>
            </View>
          </View>
        </Card>
      )
    })
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.refreshScreen()
    this.setState({ refreshing: false })
  }

  refreshScreen = async () => {
    this.props.fetchSentToMe()
    const pushToken = await registerForPushNotificationsAsync()
    this.props.setNotificationToken({ pushToken })
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
        {this.renderNotificationsButton()}
        {this.renderList()}
      </ScrollView>
    )
  }
}

const styles = {
  containerView: {
    flexDirection: 'row',
    height: 100
  },
  imageStyle: {
    width: '30%'
  },
  rightView: {
    width: '70%'
  }
}

const mapStateToProps = state => {
  const { notificationToken } = state.auth
  const { sentToMe, myFriends } = state.friends

  return { sentToMe, myFriends, notificationToken }
}

export default connect(
  mapStateToProps,
  { fetchSentToMe, setNotificationToken }
)(SentToMeScreen)
