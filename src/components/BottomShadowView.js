import React from 'react'
import { View } from 'react-native'

const BottomShadowView = props => {
  return (
    <View
      elevation={5}
      style={{
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowOpacity: 0.5,
        marginBottom: 3
      }}
    >
      {props.children}
    </View>
  )
}

export { BottomShadowView }
