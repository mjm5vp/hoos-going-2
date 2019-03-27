import React, { Component } from 'react'
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Linking
} from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Icon, Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import { Location, Permissions } from 'expo'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'

import styles from '../styles/mapStyles'
import allNamedPoos from '../../assets/namedPooExport'
import MapSettingsModal from '../modals/MapSettingsModal'
import { identifyStackLocation, setLogType, setMapType } from '../actions'

class MapScreen extends Component {
  static navigationOptions = () => {
    return {
      title: 'Map'
    }
  }

  state = {
    mapLoaded: false,
    location: null,
    showLocationButton: false,
    showSettings: false,
    mapType: 'standard',
    errorMessage: null,
    region: {
      latitude: 30,
      longitude: -95,
      latitudeDelta: 50,
      longitudeDelta: 50
    }
  }

  componentDidMount() {
    this.setState({ mapLoaded: true, mapType: this.props.mapType })
    this.getLocationAsync()
  }

  componentWillReceiveProps(nextProps) {
    const { mapType } = nextProps

    console.log(mapType)
    console.log(this.props.mapType)

    if (mapType !== this.props.mapType) {
      this.setState({ mapType })
    }
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
        showLocationButton: false,
        region: {
          latitude: 30,
          longitude: -95,
          latitudeDelta: 50,
          longitudeDelta: 50
        }
      })
    } else {
      const location = await Location.getCurrentPositionAsync({})
      const {
        coords: { latitude, longitude }
      } = location
      this.setState({
        showLocationButton: true,
        location,
        region: {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }
      })
    }
  }

  renderAllMarkers = () => {
    const poosWithLocation = this.props.myPoos.filter(poo => {
      return poo.location.latitude
    })

    const sortedPoos = _.sortBy(poosWithLocation, o => {
      return new moment(o.datetime)
    }).reverse()

    const uniqPoos = _.uniqBy(sortedPoos, 'location.latitude')

    return uniqPoos.map((poo, key) => {
      const pooImage = allNamedPoos[poo.currentPooName].image
      return (
        <MapView.Marker
          key={key}
          coordinate={poo.location}
          image={pooImage}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <MapView.Callout onPress={() => this.onCalloutStack(poo)}>
            <View>
              <Text>View Stack</Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      )
    })
  }

  onCalloutStack = ({ location }) => {
    this.props.setLogType('stack')
    this.props.identifyStackLocation(location)
    this.props.navigation.navigate('log')
  }

  renderMyLocationButton = () => {
    return (
      // <Button
      //   buttonStyle={styles.myLocationButtonView}
      //   icon={{ name: 'gps-fixed', type: 'material-icons', color: 'black', justifyContent: 'center', alignItems: 'center' }}
      //   onPress={() => console.log('my location button press')}
      // />
      <Icon
        raised
        name="gps-fixed"
        type="material-icons"
        color="black"
        containerStyle={styles.myLocationButton}
        onPress={() => this.setState({ showSettings: false })}
      />
    )
  }

  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={this.state.region}
          mapType={this.state.mapType}
          showsUserLocation
          showsMyLocationButton={this.state.showLocationButton}
          showsPointsOfInterest
          showsBuildings
          showsIndoors
          showsIndoorLevelPicker
          showsCompass
          moveOnMarkerPress
          rotateEnabled={false}
          // onRegionChangeComplete={region => this.setState(region)}
        >
          {this.renderAllMarkers()}
        </MapView>
        <Icon
          raised
          name="settings"
          type="feather"
          containerStyle={styles.settingsButton}
          onPress={() => this.setState({ showSettings: true })}
        />

        <MapSettingsModal
          showSettings={this.state.showSettings}
          closeSettings={() => this.setState({ showSettings: false })}
          locationOn={this.state.showLocationButton}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { myPoos } = state.pooReducer
  const { mapType } = state.settings

  return { myPoos, mapType }
}

export default connect(
  mapStateToProps,
  { identifyStackLocation, setLogType, setMapType }
)(MapScreen)
