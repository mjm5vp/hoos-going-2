import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { selectPoo } from '../actions';
import allPoos from '../../assets/pooExport';

class PooSelect extends Component {
  static navigationOptions = {
    mode: 'modal'
  }

  onPressButton = (pooName) => {
    // console.log(name);
    this.props.selectPoo(pooName);
    this.props.navigation.goBack();
  }

  renderPooSelects() {
    return allPoos.map((poo, i) => {
      const { image, name } = poo;
      return (
        <TouchableOpacity
          style={styles.buttonStyle}
          key={i}
          onPress={() => this.onPressButton(name)}
        >
          <Image
            source={image}
          />
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        {this.renderPooSelects()}
      </View>
    );
  }
}

const styles = {
  buttonStyle: {
  },
  viewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
};

export default connect(null, { selectPoo })(PooSelect);
