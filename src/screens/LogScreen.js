import React, { Component } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import LogItem from '../components/LogItem';
import allNamedPoos from '../../assets/namedPooExport';
import { fillInput, setInputType, resetInput } from '../actions';

class LogScreen extends Component {

  static navigationOptions = () => {
    return {
      title: 'Log',
    };
  }

  onLogItemPress = (poo) => {
    this.props.resetInput();
    this.props.setInputType('edit');
    this.props.fillInput(poo);
    this.props.navigation.navigate('input');
  }

  filterPoos = () => {
    const { myPoos, selectedStackLocation } = this.props;

    return myPoos.filter(poo => {
      return poo.location.latitude === selectedStackLocation.latitude;
    });
  }

  sortPoos = () => {
    const filteredPoos = this.props.logType === 'stack'
      ? this.filterPoos()
      : this.props.myPoos;

    return _.sortBy(filteredPoos, (o) => {
      return new moment(o.datetime);
    }).reverse();
  }

  renderPooLog() {
    const sortedPoos = this.sortPoos();

    return sortedPoos.map((poo, key) => {
      return (
        <LogItem
          key={key}
          poo={poo}
          onLogItemPress={this.onLogItemPress}
        />
      );
    });
  }

  render() {
    if (this.props.myPoos.length === 0) {
      return (
        <Card title='No Poos Yet'>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={allNamedPoos.cry.image}
            />
          </View>
        </Card>
      );
    }

    return (
      <ScrollView>
        {this.renderPooLog()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { myPoos, logType, selectedStackLocation } = state.pooReducer;

  return { myPoos, logType, selectedStackLocation };
};

export default connect(mapStateToProps, { fillInput, setInputType, resetInput })(LogScreen);
