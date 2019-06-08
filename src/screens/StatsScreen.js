import React, { Component } from 'react'
import { ScrollView, View, Image, Text } from 'react-native'
import _ from 'lodash'
import { Card } from 'react-native-elements'
import { connect } from 'react-redux'

import allNamedPoos from '../../assets/namedPooExport'
import TimeChart from '../components/TimeChart'
import ContributionChart from '../components/ContributionChart'
import AmPmPieChart from '../components/AmPmPieChart'
import DayOfWeekLineChart from '../components/DayOfWeekLineChart'
import MostUsed from '../components/MostUsed'

export default class StatsScreen extends Component {
  render() {
    return (
      <ScrollView>
        <MostUsed />
        <TimeChart />
        <ContributionChart />
        <DayOfWeekLineChart />
        <AmPmPieChart />
      </ScrollView>
    )
  }
}
