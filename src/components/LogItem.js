import React, { Component } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import moment from 'moment';

import allNamedPoos from '../../assets/namedPooExport';

class LogItem extends Component {
  render() {
    const { poo, onLogItemPress } = this.props;
    const datetime = moment(poo.datetime).format('MMMM Do YYYY, h:mm a');
    const pooImage = allNamedPoos[poo.currentPooName].image;
    const description = poo.description === '' ? 'No description' : poo.description;

    return (
      <Card>
        <TouchableOpacity onPress={() => onLogItemPress(poo)}>
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
        </TouchableOpacity>
      </Card>
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

export default LogItem;
