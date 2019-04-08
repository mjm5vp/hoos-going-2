import { Input } from 'react-native-elements'
import { Text, TouchableOpacity, View } from 'react-native'

import Modal from 'react-native-modal'
import React from 'react'
import styles from '../styles/modalStyles'

const EditFriendModal = ({
  name,
  number,
  visible,
  onAccept,
  onDecline,
  onDelete,
  changeName,
  changeNumber,
  editMode
}) => {
  renderDeleteButton = () => {
    return editMode ? (
      <View style={styles.buttonView}>
        <TouchableOpacity onPress={() => onDelete(number)}>
          <View style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : null
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

          <Input placeholder="Name" value={name} onChangeText={changeName} />

          <Input
            placeholder="Number"
            keyboardType="number-pad"
            value={number}
            onChangeText={changeNumber}
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={() => onAccept(name, number)}>
            <View style={styles.button}>
              <Text>{editMode ? 'Edit' : 'Add'} Friend</Text>
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
