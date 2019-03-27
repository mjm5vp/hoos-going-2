import React from 'react';
import { Text, View, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { CardSection } from './CardSection';

const Confirm = ({ children, visible, onAccept, onDecline }) => {
  const { containerStyle, textStyle, cardSectionStyle, buttonStyle } = styles;

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={containerStyle}>
        <CardSection style={cardSectionStyle}>
          <Text style={textStyle}>
            {children}
          </Text>
        </CardSection>

        <CardSection style={cardSectionStyle}>
          <Button buttonStyle={buttonStyle} title='Yes' onPress={onAccept} />
          <Button buttonStyle={buttonStyle} title='No' onPress={onDecline} />
        </CardSection>
      </View>
    </Modal>
  );
};

const styles = {
  cardSectionStyle: {
    justifyContent: 'center'
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  },
  buttonStyle: {
    height: 50,
    width: 100,
    borderRadius: 5,
    backgroundColor: 'rgba(0,150,136,0.5)',
  }
};

export default Confirm;
