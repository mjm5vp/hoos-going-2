import React, { Component } from 'react'
import { ContributionGraph } from 'react-native-chart-kit'
import { BottomShadowView } from './BottomShadowView'

export default class ContributionChart extends Component {
  render() {
    const chartConfig = {
      backgroundColor: 'brown',
      backgroundGradientFrom: 'white',
      backgroundGradientTo: 'white',
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      style: {}
    }

    const commitsData = [
      { date: '2019-01-02', count: 1 },
      { date: '2019-01-03', count: 2 },
      { date: '2019-01-04', count: 3 },
      { date: '2019-01-05', count: 4 },
      { date: '2019-01-06', count: 5 },
      { date: '2019-01-30', count: 2 },
      { date: '2019-01-31', count: 3 },
      { date: '2019-03-01', count: 2 },
      { date: '2019-04-02', count: 4 },
      { date: '2019-03-05', count: 2 },
      { date: '2019-02-30', count: 4 }
    ]
    return (
      <BottomShadowView>
        <ContributionGraph
          values={commitsData}
          endDate={new Date()}
          numDays={100}
          // width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          backgroundColor="transparent"
          style={{}}
        />
      </BottomShadowView>
    )
  }
}
