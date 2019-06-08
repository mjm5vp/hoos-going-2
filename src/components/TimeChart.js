import React, { Component } from 'react'
import { BarChart } from 'react-native-chart-kit'
import { Dimensions, View } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import { BottomShadowView } from './BottomShadowView'

const screenWidth = Dimensions.get('window').width

class TimeChart extends Component {
  state = {
    data: {
      labels: [],
      datasets: [
        {
          data: []
        }
      ]
    }
  }
  componentDidMount() {
    const hours = this.props.myPoos.map(poo => {
      return moment(poo.datetime).format('h a')
    })

    const arrData = _.chain(hours)
      .countBy()
      .toPairs()
      .sortBy(1)
      .reverse()
      .value()
      .slice(0, 6)

    const labels = arrData.map(item => item[0])
    const data = arrData.map(item => item[1])

    this.setState({
      data: {
        labels,
        datasets: [
          {
            data
          }
        ]
      }
    })
  }

  render() {
    return (
      <BottomShadowView>
        <BarChart
          style={{}}
          data={this.state.data}
          width={screenWidth}
          height={220}
          fromZero
          backgroundColor="transparent"
          chartConfig={{
            backgroundColor: 'red',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`
          }}
        />
      </BottomShadowView>
    )
  }
}

const mapStateToProps = state => {
  const { myPoos } = state.pooReducer

  return { myPoos }
}

export default connect(
  mapStateToProps,
  {}
)(TimeChart)
