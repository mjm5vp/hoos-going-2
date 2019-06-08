import React, { Component } from 'react'
import { ScrollView, View, Image, Text } from 'react-native'
import _ from 'lodash'
import { Card } from 'react-native-elements'
import { connect } from 'react-redux'

import allNamedPoos from '../../assets/namedPooExport'
import { BottomShadowView } from './BottomShadowView'

class MostUsed extends Component {
  setMostUsed = () => {
    const { myPoos } = this.props

    return _.chain(myPoos)
      .countBy('currentPooName')
      .toPairs()
      .sortBy(1)
      .reverse()
      .value()
  }

  renderMostUsed = () => {
    const mostUsed = this.setMostUsed() || []

    if (mostUsed.length === 0) {
      return (
        <View>
          <Text>No Poomojis Yet</Text>
        </View>
      )
    }

    return mostUsed.slice(0, 3).map((poo, key) => {
      const name = poo[0]
      const number = poo[1]
      return (
        <View key={key} style={styles.iterateView}>
          <Image source={allNamedPoos[name].image} />
          <Text>{number}</Text>
        </View>
      )
    })
  }

  render() {
    return (
      <BottomShadowView>
        <View style={styles.mostUsedView}>{this.renderMostUsed()}</View>
      </BottomShadowView>
    )
  }
}

const styles = {
  mostUsedView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 220
  },
  iterateView: {
    alignItems: 'center'
  }
}

const mapStateToProps = state => {
  const { myPoos } = state.pooReducer

  return { myPoos }
}

export default connect(
  mapStateToProps,
  {}
)(MostUsed)
