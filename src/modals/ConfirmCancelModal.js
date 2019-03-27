import React from 'react';
import Modal from 'react-native-modal';
import { Text, View, TouchableOpacity } from 'react-native';

import modalStyles from '../styles/modalStyles';

const ConfirmCancelModal = ({ infoText, visible, onAccept, onDecline }) => {
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
          <View style={modalStyles.modalContent}>
            <Text>{infoText}</Text>
            <View style={modalStyles.twoButtonView}>

              <TouchableOpacity onPress={() => onAccept()}>
                <View style={modalStyles.button}>
                  <Text>Confirm</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onDecline()}>
                <View>
                  <Text>Cancel</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </Modal>

    );
};

export default ConfirmCancelModal;
