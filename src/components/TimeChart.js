import React from 'react'
import { Card } from 'react-native-elements'
import { BarChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'
const screenWidth = Dimensions.get('window').width

export default class TimeChart extends React.PureComponent {
  render() {
    const data = {
      labels: ['1', '2', '3', '4', '5', '6'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43]
        }
      ]
    }

    return (
      <BarChart
        style={{
          borderRadius: 16
        }}
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
        }}
      />
    )
  }
}
