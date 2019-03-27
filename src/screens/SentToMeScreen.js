import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { fetchSentToMe } from '../actions';
import allNamedPoos from '../../assets/namedPooExport';

class SentToMeScreen extends Component {
  static navigationOptions = {
    title: 'Sent to me'
  }

  state = {
    sentToMe: []
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.props.fetchSentToMe();
  }

  componentWillReceiveProps(nextProps) {
    const { sentToMe } = nextProps;

    console.log('sentToMe.length');
    console.log(sentToMe.length);

    this.setState({ sentToMe });
  }

  renderList = () => {
    const sortedSentToMe = _.sortBy(this.state.sentToMe, (o) => {
      return new moment(o.datetime);
    }).reverse();

    return sortedSentToMe.map((item, i) => {
      // console.log(this.props.myFriends);
      // console.log(item.from.number);
      const matchedFriend = _.find(this.props.myFriends, ['number', item.from.number]);
      const friendName = matchedFriend
        ? matchedFriend.name
        : `${item.from.name} (${item.from.number})`;

      const datetime = moment(item.poo.datetime).format('MMMM Do YYYY, h:mm a');
      const pooImage = allNamedPoos[item.poo.currentPooName].image;
      const description = item.poo.description === '' ? 'No description' : item.poo.description;

      return (
        <Card key={i}>
          <Text>From: {friendName}</Text>
          <View style={styles.containerView}>
            <Image
              source={pooImage}
              style={styles.imageStyle}
            />
            <View style={styles.rightView}>
              <Text>{datetime}</Text>
              <Divider />
              <Text>{description}</Text>
            </View>
          </View>
        </Card>
      );
    });
  }

  render() {
    return (
      <ScrollView>
        {this.renderList()}
      </ScrollView>
    );
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
};

const mapStateToProps = state => {
  const { sentToMe, myFriends } = state.friends;

  return { sentToMe, myFriends };
};

export default connect(mapStateToProps, { fetchSentToMe })(SentToMeScreen);
