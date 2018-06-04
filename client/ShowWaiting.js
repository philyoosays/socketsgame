import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

import DynamicButton from './DynamicButton';

export default function ShowWaiting(props) {
  players = props.numplayers.map((player, i) => {
      return (<View style={styles.playerbox} key={i}>
        <Text>Player {i + 1}</Text>
      </View>)
    })
  return(
    <View>
      <View style={{flex:1}} />
      <Text>
        Room: {props.gameid}
      </Text>
        {players}
      <View style={{flex:1}} />
      <View style={{alignItems: 'center'}}>
        <TouchableHighlight
          style={styles.buttonStyle}
          onPress={props.iAmReady}>
          <Text style={styles.buttonText}>{props.buttontext}</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  playerbox: {
    width: 75,
    height: 75,
    backgroundColor: 'orange',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
  },
  countdown: {
    textAlign: 'center',
    fontSize: 80
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#841584',
    padding: 10
  }
})
