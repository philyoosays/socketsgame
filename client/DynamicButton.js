import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

export default function DynamicButton(props) {
  return(
    <TouchableHighlight
      style={styles.buttonStyle}
      onPress={() => props.buttonPress(props.dataToSend)}>
      <Text style={styles.buttonText}>{props.button}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontWeight: '900',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#841584',
    padding: 10
  }
})
