import React, { Component } from 'react'
import { View } from 'react-native'
import { Input, Text } from 'react-native-elements'

export default class EnterCode extends Component {
  state = {
    code: '',
    formattedCode: []
  }

  componentDidMount() {
    const formattedCode = [...Array(this.props.codeLength)].map((_, i) => '-')
    this.setState({ formattedCode })
  }

  updateCode = code => {
    const formattedCode = this.formatCode(code)
    this.setState({ code, formattedCode }, () => {
      this.checkIfCodeComplete(code)
    })
  }

  formatCode = text => {
    const arr = text.split('')

    return this.state.formattedCode.map((c, i) => {
      return arr[i] ? arr[i] : '-'
    })
  }

  renderFormattedCode = () => {
    return this.state.formattedCode.map((num, i) => {
      return (
        <View style={styles.codeBoxView}>
          <Text style={styles.codeNumberText}>{num}</Text>
        </View>
      )
    })
  }

  checkIfCodeComplete = code => {
    console.log(code)
    if (code.length === this.props.codeLength) {
      this.props.codeComplete(code)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.codeContainer}>{this.renderFormattedCode()}</View>
        <Input
          value={this.state.code}
          ref={this.inputRef}
          onChangeText={code => this.updateCode(code)}
          //   onKeyPress={this._keyPress}
          //   onFocus={() => this._onFocused(true)}
          //   onBlur={() => this._onFocused(false)}
          spellCheck={false}
          autoFocus
          keyboardType="number-pad"
          numberOfLines={1}
          maxLength={4}
          //   selection={{
          //     start: value.length,
          //     end: value.length
          //   }}
          containerStyle={{
            flex: 1,
            opacity: 0,
            width: 20
          }}
        />
      </View>
    )
  }
}

const styles = {
  container: {
    alignItems: 'center'
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%'
  },
  codeBoxView: {
    flex: 1
  },
  codeNumberText: {
    fontSize: 50
  }
}
