import React, { Component } from 'react'
import { PieChart } from 'react-native-chart-kit'
import { Dimensions, View } from 'react-native'
import { BottomShadowView } from './BottomShadowView'
const screenWidth = Dimensions.get('window').width

export default class AmPmPieChart extends Component {
  render() {
    const chartConfig = {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientTo: '#08130D',
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2 // optional, default 3
    }
    const data = [
      {
        name: 'AM',
        count: 21500000,
        color: 'rgba(131, 167, 234, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15
      },
      {
        name: 'PM',
        count: 2800000,
        color: '#F00',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15
      }
    ]
    return (
      <BottomShadowView>
        <PieChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="count"
          backgroundColor="transparent"
          //   paddingLeft="15"
          style={{}}
        />
      </BottomShadowView>
    )
  }
}
