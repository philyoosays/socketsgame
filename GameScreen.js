import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import DynamicButton from './DynamicButton'

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      // text: '',
      count: 0,
      buttons: [],
      test: false,
    }
    this.buttonPress = this.buttonPress.bind(this)
  }

  resetPackage() {
    thePackage = {
      gameid: this.props.gameid
    }
  }

  componentWillMount() {
    if(this.props.gameactive === false) {
      thePackage = {
        gamestart: true,
        gameid: this.props.gameid
      }
      ws.send(JSON.stringify(thePackage))
      this.props.signalstart();
    }
    ws.onmessage = (message) => {
      let thePackage = message.data.charAt(0) === '{' ? JSON.parse(message.data) : message.data;
      if(thePackage.hasOwnProperty('buttons')) {
        console.log('thepackage from line 36 in the Gamescreen.js', Array.isArray(thePackage.buttons))
        this.setState({
          test: true
        })
        console.log('thisis the state', this.state.test)
        // this.getInstructions(tempButtons)
      }
      // if(thePackage.hasOwnProperty('instruction')) {
      //   this.processInstruction(thePackage)
      //   this.instructionTimer()
      // }
      // if(thePackage.hasOwnProperty('stoptimer')) {
      //   this.stopTimer()
      // }
      // if(thePackage.hasOwnProperty('winlose')) {
      //   this.props.next(thePackage.winlose)
      // }
      /////////////////
      // CATCH ALL ////
      /////////////////
      if(typeof thePackage === 'string') {
        this.setState({
          message: thePackage
        })
      } else if(typeof thePackage === 'object') {
        console.log('Have Payload', thePackage)
      }
    }
  }

  setTrue() {
    this.state.test = true
  }

  makePackageAndSend(buttons) {
    thePackage.sendinstruction = true;
    thePackage.buttons = []
    buttons.forEach(d => {
      thePackage.buttons.push(d.id)
    })
    ws.send(JSON.stringify(thePackage))
  }

  getInstructions(buttons) {
    this.resetPackage();
    this.makePackageAndSend(buttons)
  }

  buttonPress(id) {
    this.resetPackage()
    thePackage.buttonid = id
    thePackage.buttonpress = true
    ws.send(JSON.stringify(thePackage))
  }

  processInstruction(thePackage) {
    this.setState({
      message: thePackage.instruction
    })
  }

  instructionTimer() {
    timer = setTimeout(() => {
      this.resetPackage()
      thePackage.score = -1
      this.makePackageAndSend()
    }, 10000)
  }

  stopTimer() {
    clearTimeout(timer)
    this.resetPackage();
    thePackage.score = 1
    this.makePackageAndSend()
  }

  render() {
    // let excrement = this.state.text === '💩💩💩' ? this.state.text : '';
    // let serverMessage = this.state.message.charAt(0) === '[' ? '' : this.state.message;
    console.log('thissssisssssstate', this.state.test)
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.center}>
            {this.state.message}
          </Text>
          <View style={styles.progressBar} />
        </View>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <DynamicButton
              buttonPress={this.buttonPress}
              dataToSend={this.state.buttons[0].id}
              button={this.state.buttons[0].button}
            />
          </View>
          <View style={styles.buttonContainer}>
            <DynamicButton
              buttonPress={this.buttonPress}
              dataToSend={this.state.buttons[1].id}
              button={this.state.buttons[1].button}
            />
          </View>
          <View style={styles.buttonContainer}>
            <DynamicButton
              buttonPress={this.buttonPress}
              dataToSend={this.state.buttons[2].id}
              button={this.state.buttons[2].button}
            />
          </View>
          <View style={styles.alternativeLayoutButtonContainer}>
            <DynamicButton
              buttonPress={this.buttonPress}
              dataToSend={this.state.buttons[3].id}
              button={this.state.buttons[3].button}
            />
            <DynamicButton
              buttonPress={this.buttonPress}
              dataToSend={this.state.buttons[4].id}
              button={this.state.buttons[4].button}
            />
          </View>
        </View>
      </View>
    );
  }
}

let thePackage = {
  buttonpress: true
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  },
  progressBar: {
    backgroundColor: 'lime',
    width: 100
  },
  center: {
    textAlign: 'center'
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})
