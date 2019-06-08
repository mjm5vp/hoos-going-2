import React, { Component } from 'react'
import { LineChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'
import { BottomShadowView } from './BottomShadowView'
const screenWidth = Dimensions.get('window').width

export default class DayOfWeekLineChart extends Component {
  render() {
    const chartConfig = {
      backgroundGradientFrom: 'white',
      backgroundGradientTo: 'white',
      color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
      strokeWidth: 2 // optional, default 3
    }

    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43, 32],
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
          strokeWidth: 2 // optional
        }
      ]
    }
    return (
      <BottomShadowView>
        <LineChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          decimalPlaces={0}
          bezier
          backgroundColor="transparent"
          style={{}}
        />
      </BottomShadowView>
    )
  }
}
