import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { connect } from 'react-redux';

import allNamedPoos from '../../assets/namedPooExport';
import { editMyInfo } from '../actions';

class ProfileScreen extends Component {
  state = {
    loading: true,
    name: '',
    number: '',
    avatar: ''
  }

  componentWillMount() {
    const { myInfo: { name, number, avatar } } = this.props;

    this.setState({ name, number, avatar, loading: false });
  }

  onSubmit = () => {
    const { name, number, avatar } = this.state;

    this.props.editMyInfo({ name, number, avatar });
  }


  render() {
    return (
      <View style={styles.containerView}>
        <Image
          source={allNamedPoos.money.image}
          style={styles.avatarImage}
        />
        <FormLabel>Name:</FormLabel>
        <FormInput
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        <Button
          title='Submit'
          onPress={() => this.onSubmit()}
        />
      </View>
    );
  }
}

const styles = {
  containerView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100
  }
};

const mapStateToProps = state => {
  const { myInfo } = state.friends;

  return { myInfo };
};

export default connect(mapStateToProps, { editMyInfo })(ProfileScreen);
