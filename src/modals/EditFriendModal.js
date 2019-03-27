import { FormInput, FormLabel } from 'react-native-elements'
import { Text, TouchableOpacity, View } from 'react-native'

import Modal from 'react-native-modal'
import React from 'react'
import styles from '../styles/modalStyles'

const EditFriendModal = ({
  name,
  number,
  visible,
  onDecline,
  changeName,
  changeNumber,
  deleteButton
}) => {
  renderDeleteButton = () => {
    return deleteButton ? (
      <View style={styles.buttonView}>
        <TouchableOpacity onPress={this.onDelete}>
          <View style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : null
  }

  onAccept = (name, number) => {
    console.log(name)
  }

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

          <FormLabel>Name</FormLabel>
          <FormInput value={name} onChangeText={changeName} />

          <FormLabel>Number</FormLabel>
          <FormInput
            keyboardType="number-pad"
            value={number}
            onChangeText={changeNumber}
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => this.onAccept(this.state.name, this.state.number)}
          >
            <View style={styles.button}>
              <Text>Add Friend</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDecline}>
            <View style={styles.cancelButton}>
              <Text>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.renderDeleteButton()}
      </View>
    </Modal>
  )
}

export default EditFriendModal
