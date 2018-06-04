import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import DynamicButton from './DynamicButton';

export default function EndScreen(props) {
  winMessage = 'You\'ve successfully worked together as a Space Team. Congratulations!';
  loseMessage = 'You\'ve failed to work together. Try again... but as a Space Team.';
  toRender = props.winlose === 'win' ? winMessage : loseMessage;

  return(
    <View style={styles.container}>
      <View style={{flex:1}} />
      <View style={{flex:1}}>
        <Text style={styles.center}>
          {toRender}
        </Text>
      </View>
      <View style={{flex:1}}>
        <Text style={styles.center}>
          Do you want to play again?
        </Text>
        <DynamicButton
            buttonPress={props.next}
            dataToSend='intro'
            button="Back To Intro"
          />
        <View style={{flex:1}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   flexDirection: 'column',
  },
  buttonContainer: {
    margin: 20
  },
  progressBar: {
    backgroundColor: 'lime',
    width: 100
  },
  center: {
    textAlign: 'center',
    flex: 1
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
  }
})
