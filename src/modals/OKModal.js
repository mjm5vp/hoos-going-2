import React from 'react';
import Modal from 'react-native-modal';
import { Text, View, TouchableOpacity } from 'react-native';

import modalStyles from '../styles/modalStyles';

const OKModal = ({ infoText, buttonText, visible, onAccept }) => {
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
            <View style={modalStyles.buttonView}>
              <TouchableOpacity onPress={() => onAccept()}>
                <View style={modalStyles.button}>
                  <Text>{buttonText}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

        </Modal>

    );
};

export default OKModal;
