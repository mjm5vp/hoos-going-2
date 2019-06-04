import React, { Component } from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements'

export default class EnterCode extends Component {
  state = {
    code: []
  }

  updateCode = (text, place) => {
    if (text) {
      const refName = `code${place + 1}`
      this[refName].focus()
    } else {
      const refName = `code${place - 1}`
      this[refName].focus()
    }
  }

  render() {
    return (
      <View>
        <Input
          onChangeText={text => this.updateCode(text, 0)}
          value={this.state.code[0]}
          keyboardType="number-pad"
          caretHidden={true}
          placeholder="-"
          maxLength={1}
          ref={ref => {
            this.code0 = ref
          }}
          autoFocus
        />

        <Input
          onChangeText={text => this.updateCode(text, 1)}
          value={this.state.code[1]}
          keyboardType="number-pad"
          caretHidden={true}
          placeholder="-"
          maxLength={1}
          ref={ref => {
            this.code1 = ref
          }}
        />

        <Input
          onChangeText={text => this.updateCode(text, 2)}
          value={this.state.code[2]}
          keyboardType="number-pad"
          caretHidden={true}
          placeholder="-"
          maxLength={1}
          ref={ref => {
            this.code2 = ref
          }}
        />

        <Input
          onChangeText={text => this.updateCode(text, 3)}
          value={this.state.code[3]}
          keyboardType="number-pad"
          caretHidden={true}
          placeholder="-"
          maxLength={1}
          ref={ref => {
            this.code3 = ref
          }}
        />
      </View>
    )
  }
}
