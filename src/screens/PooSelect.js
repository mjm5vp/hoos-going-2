import React, { Component } from 'react'
import { ScrollView, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { selectPoo } from '../actions'
import allPoos from '../../assets/namedPooExport'

class PooSelect extends Component {
  static navigationOptions = {
    mode: 'modal'
  }

  onPressButton = pooName => {
    // console.log(name);
    this.props.selectPoo(pooName)
    this.props.navigation.goBack()
  }

  renderPooSelects() {
    return _.map(allPoos, (poo, i) => {
      // return _.allPoos.map((poo, i) => {
      const { image, name } = poo
      return (
        <TouchableOpacity
          style={styles.buttonStyle}
          key={i}
          onPress={() => this.onPressButton(name)}
        >
          <Image source={image} />
        </TouchableOpacity>
      )
    })
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.viewStyle}>{this.renderPooSelects()}</View>
      </ScrollView>
    )
  }
}

const styles = {
  buttonStyle: {},
  viewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
}

export default connect(
  null,
  { selectPoo }
)(PooSelect)
