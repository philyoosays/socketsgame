import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

import ShowCountDown from './ShowCountDown'
import ShowWaiting from './ShowWaiting'

export default class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttontext: 'Set Status to Ready!',
      numplayers: [],
      show: 'waiting'
    }
    this.iAmReady = this.iAmReady.bind(this)
    this.startGame = this.startGame.bind(this)
  }

  componentWillMount() {
    this.setState({
      numplayers: this.props.players
    })
    ws.onmessage = (message) => {
      let thePackage = message.data.charAt(0) === '{' ? JSON.parse(message.data) : message.data;
      console.log('WaitingRoom received: ', thePackage)
      if(thePackage.gamestatus === 'joined') {
        console.log('currentplayers', this.state.numplayers)
        console.log('incomingplayers', thePackage.players)
        if(parseInt(thePackage.players) > this.state.numplayers.length) {
          let array = this.state.numplayers.slice()
          for(let i = array.length; i < thePackage.players; i++) {
            array.push(i)
          }
          this.setState({
            numplayers: array
          })
        }
      } else if(thePackage.startgame === true) {
        this.startGame()
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

  startGame() {
    this.setState({
      show: 'startgame'
    })
  }

  resetPackage() {
    thePackage = {
      readystate: 'not ready',
      gameid: ''
    }
  }

  iAmReady() {
    this.resetPackage();
    thePackage.gameid = this.props.gameid;
    if(this.state.buttontext !== 'Waiting for other players...') {
      this.makeAndSendPackage('readystate', true)
      this.setState({
        buttontext: 'Waiting for other players...'
      })
    } else {
      this.makeAndSendPackage('readystate', false)
      this.setState({
        buttontext: 'Set Status to Ready!'
      })
    }
  }

  makeAndSendPackage(key, value) {
    thePackage[key] = value;
    ws.send(JSON.stringify(thePackage))
    console.log('WaitingRoom sending: ', thePackage)
  }

  loadRender(props) {
    switch(this.state.show) {
      case 'waiting':
        renderView = <ShowWaiting
                        gameid={this.props.gameid}
                        iAmReady={this.iAmReady}
                        buttontext={this.state.buttontext}
                        numplayers={this.state.numplayers}
                      />
        break;
      case 'startgame':
        renderView = <ShowCountDown
                      next={this.props.next}
                      />
        break;

    }
  }

  render() {
    this.loadRender();
    return(
      <View style={{flex:1, justifyContent:'center'}}>
        {renderView}
      </View>
    );
  }
}

let thePackage = {
  readystate: 'not ready',
  gameid: ''
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
  }
})
