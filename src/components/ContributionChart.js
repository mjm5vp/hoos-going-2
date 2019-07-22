import React, { Component } from 'react'
import { ContributionGraph } from 'react-native-chart-kit'
import { BottomShadowView } from './BottomShadowView'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

class ContributionChart extends Component {
  state = {
    data: []
  }

  componentDidMount() {
    const commitsData = this.props.myPoos.map(poo => {
      return moment(poo.datetime).format('YYYY-MM-DD')
    })

    const data = _.values(_.groupBy(commitsData)).map(d => ({
      date: d[0],
      count: d.length
    }))

    this.setState({ data })
  }

  render() {
    const chartConfig = {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientTo: '#08130D',
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2 // optional, default 3
    }

    const commitsData = [
      { date: '2019-07-02', count: 1 },
      { date: '2019-07-03', count: 2 },
      { date: '2019-07-04', count: 3 },
      { date: '2019-07-05', count: 4 },
      { date: '2019-07-06', count: 5 },
      { date: '2019-06-30', count: 2 },
      { date: '2019-06-21', count: 3 },
      { date: '2019-07-01', count: 2 },
      { date: '2019-07-02', count: 4 },
      { date: '2019-07-05', count: 2 },
      { date: '2019-07-30', count: 4 }
    ]

    return (
      <BottomShadowView>
        <ContributionGraph
          values={this.state.data}
          endDate={moment().format('YYYY-MM-DD')}
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

const mapStateToProps = state => {
  const { myPoos } = state.pooReducer

  return { myPoos }
}

export default connect(
  mapStateToProps,
  {}
)(ContributionChart)
