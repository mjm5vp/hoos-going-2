import React, { Component } from 'react'
import { ContributionGraph } from 'react-native-chart-kit'

export default class ContributionChart extends Component {
  render() {
    const chartConfig = {
      backgroundColor: '#e26a00',
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      }
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
      <ContributionGraph
        values={commitsData}
        endDate={new Date()}
        numDays={500}
        // width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        overflow="Scroll"
      />
    )
  }
}
