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
      buttons: [{id:0, button:'fuck'},{id:0, button:'fuck'},{id:0, button:'fuck'},{id:0, button:'fuck'},{id:0, button:'fuck'}],
    }
    this.buttonPress = this.buttonPress.bind(this)
  }

  resetPackage() {
    // let tempArray = []
    // this.state.buttons.forEach(d => {
    //   tempArray = d.id
    // })
    thePackage = {
      gameid: this.props.gameid,
      // buttons: tempArray
    }
  }

  componentWillMount() {
    if(this.props.gameactive === false && this.state.buttons[0].button === 'fuck') {
      thePackage = {
        gameid: this.props.gameid,
        dealbuttons: true
      }
      ws.send(JSON.stringify(thePackage))
      console.log('GameScreen sending:', thePackage)
      this.props.signalstart();
    }
    console.log('!!!!!!!!IAM RUNNING!!!!!!')
    ws.onmessage = (message) => {
      let thePackage = message.data.charAt(0) === '{' ? JSON.parse(message.data) : message.data;
      console.log('GameScreen receiving: ', thePackage)

      // BUTTONS
      if(thePackage.hasOwnProperty('buttons')) {
        this.setState({
          buttons: thePackage.buttons
        })
        this.getInstructions()
      }
      if(thePackage.hasOwnProperty('instruction')) {
        this.processInstruction(thePackage)
        this.instructionTimer()
      }
      if(thePackage.hasOwnProperty('stoptimer')) {
        this.stopTimer()
      }
      if(thePackage.hasOwnProperty('winlose')) {
        this.stopTimerEndGame();
        this.props.next(thePackage.winlose)
      }
      console.log('GS package', thePackage)
      /////////////////
      // CATCH ALL ////
      /////////////////
      // if(typeof thePackage === 'string') {
      //   this.setState({
      //     message: thePackage
      //   })
      // } else if(typeof thePackage === 'object') {
      //   console.log('Have Payload', thePackage)
      // }
    }
  }

  makePackageAndSend(buttons) {
    thePackage.sendinstruction = true;
    thePackage.gameid = this.props.gameid;
    thePackage.buttons = []
    this.state.buttons.forEach(d => {
      thePackage.buttons.push(d.id)
    })
    ws.send(JSON.stringify(thePackage))
    console.log('GameScreen sending: ', thePackage)
  }

  getInstructions() {
    this.resetPackage();
    this.makePackageAndSend()
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
      thePackage.score = -1;
      thePackage.sendinstruction = true;
      this.makePackageAndSend()
    }, 10000)
  }

  stopTimer() {
    clearTimeout(timer)
    this.resetPackage();
    thePackage.score = 1;
    thePackage.sendinstruction = true;
    this.makePackageAndSend()
  }

  stopTimerEndGame() {
    clearTimeout(timer)
  }

  render() {
    // 556830 let excrement = this.state.text === '💩💩💩' ? this.state.text : '';
    // let serverMessage = this.state.message.charAt(0) === '[' ? '' : this.state.message;
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
