import React from 'react';
import { StyleSheet, View, TextInput, TouchableHighlight, Text } from 'react-native';

import DynamicButton from './DynamicButton';

export default class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameidfield: '',
      screenmessage: ''
    }
    this.makeGame = this.makeGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  componentWillMount() {
    ws.onmessage = (message) => {
      let thePackage = message.data.charAt(0) === '{' ? JSON.parse(message.data) : message.data;
      // console.log('this ismessage', thePackage)
      if(thePackage.hasOwnProperty('noroom')) {
        this.setState({
          screenmessage: `Room ${thePackage.gameroom} is full`
        })
      }
      if(thePackage.hasOwnProperty('newgameid')) {
        this.updateInput(thePackage.newgameid.toString())
      } else if(thePackage.hasOwnProperty('gamestatus')) {
        if(thePackage.gamestatus === 'does not exist') {
          this.setState({
            screenmessage: `${thePackage.gameroom} does not exist`
          })
        } else if(thePackage.gamestatus === 'joined' && thePackage.newgameid !== 0) {
          this.props.playercount(thePackage.players)
          this.nextScreen(thePackage)
        }
      }
      /////////////////
      // CATCH ALL ////
      /////////////////
      // if(typeof thePackage === 'string') {
      //   this.setState({
      //     message: thePackage
      //   })
      //   console.log('Have message: ',this.state.message)
      // } else if(typeof thePackage === 'object') {
      //   console.log('Have Payload: ', thePackage)
      // }
    }
  }

  resetPackage() {
    thePackage = {
      makegameid: false,
      joingameid: 0
    }
  }

  makeAndSendPackage(key, value) {
    thePackage[key] = value;
    ws.send(JSON.stringify(thePackage))
    console.log('Intro sending: ', thePackage)
  }

  makeGame() {
    this.resetPackage();
    thePackage.makegameid = true;
    this.makeAndSendPackage('makegameid', true)
  }

  joinGame() {
    this.resetPackage();
    this.makeAndSendPackage('joingameid', this.state.gameidfield)
  }

  updateInput(gameid) {
    this._textInput.setNativeProps({text: gameid});
    this.setState({
      gameidfield: gameid
    })
  }

  nextScreen(thePackage) {
    if(thePackage.gamestatus === 'joined') {
      this.props.next('waiting', parseInt(thePackage.gameroom));
    }
  }

  render() {
    return(
      <View style={styles.container, styles.inputBox}>
        <Text>{this.state.screenmessage}</Text>
        <DynamicButton
          buttonPress={this.makeGame}
          dataToSend={''}
          button="Create Game"
        />
        <View style={styles.alternativeLayoutButtonContainer}>
          <TextInput
            style={styles.inputField}
            onChangeText={gameidfield => {this.setState({gameidfield})}}
            ref={component => this._textInput = component}
          />
          <DynamicButton
            buttonPress={this.joinGame}
            dataToSend={''}
            button="Join"
          />
          <Text></Text>
        </View>
      </View>
    );
  }
}

let thePackage = {
  makegameid: false,
  joingameid: 0
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   flexDirection: 'row',
  },
  buttonContainer: {
    margin: 20
  },
  center: {
    textAlign: 'center'
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
  },
  inputBox: {
    width: '90%',
    alignItems: 'center'
  },
  inputField: {
    height:40,
    width:70
  }
})
