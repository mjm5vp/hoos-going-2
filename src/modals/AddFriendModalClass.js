import React, { Component } from 'react'
import { Input } from 'react-native-elements'
import { Text, TouchableOpacity, View } from 'react-native'

import Modal from 'react-native-modal'
import styles from '../styles/modalStyles'

class AddFriendModalClass extends Component {
  state = {
    name: this.props.name,
    number: this.props.number,
    visible: false
  }

  changeField = (fieldName, value) => {
    this.setState({ [fieldName]: value })
  }

  onAccept = () => {
    this.props.onAccept(name, number)
  }

  render() {
    const { name, number, visible } = this.props

    return (
      <Modal
        isVisible={visible}
        backdropColor={'black'}
        backdropOpacity={0.5}
        animationIn={'slideInLeft'}
        animationOut={'slideOutRight'}
        animationInTiming={250}
        animationOutTiming={250}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={250}
      >
        <View style={styles.modalContent}>
          <View style={styles.inputView}>
            <Text>Confirm contact info</Text>

            <Input
              placeholder="Name"
              value={name}
              changeField={value => this.changeField('name', value)}
            />

            <Input
              placeholder="Number"
              keyboardType="number-pad"
              value={number}
              changeField={value => this.changeField('number', value)}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => this.props.onAccept(name, number)}>
              <View style={styles.button}>
                <Text>Add Friend</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onDecline}>
              <View style={styles.cancelButton}>
                <Text>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

export default AddFriendModalClass
