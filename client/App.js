import React from 'react';
import { StyleSheet, View } from 'react-native';
import GameScreen from './GameScreen';
import Intro from './Intro';
import WaitingRoom from './WaitingRoom';
import EndScreen from './EndScreen';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gamestate: 'intro',
      gameid: 0,
      gameactive: false,
      winlose: ''
    }
    this.introChangeGameState = this.introChangeGameState.bind(this);
    this.changeGameState = this.changeGameState.bind(this);
    this.endingChangeGameState = this.endingChangeGameState.bind(this);
    this.updatePlayerCount = this.updatePlayerCount.bind(this);
    this.signalStart = this.signalStart.bind(this);
  }

  componentWillMount() {
    // wst = new WebSocket('ws://173.2.3.175:8097');
    // wst.addEventListener('open', function (event) {
    //   wst.send(JSON.stringify(
    //     'Worker bees can leave. Even drones can fly away. The queen is their slave'
    //   ));
    // });
    // wst = new WebSocket('ws://173.2.0.31:8097');
    // wst = new WebSocket('ws://173.2.6.52:8097');
    // wst.addEventListener('open', function (event) {
    //   wst.send(JSON.stringify(
    //     'Worker bees can leave. Even drones can fly away. The queen is their slave'
    //   ));
    // });

    ws = new WebSocket('ws://192.168.1.5:8097');
    // ws = new WebSocket('ws://173.2.6.52:8097');
    // ws = new WebSocket('ws://192.168.1.107:8097');
    ws.addEventListener('open', function (event) {
      ws.send(JSON.stringify(
        'Worker bees can leave. Even drones can fly away. The queen is their slave.'
      ));
    });
  }

  loadRender() {
    switch(this.state.gamestate) {
      case 'intro':
        return <Intro
                      next={this.introChangeGameState}
                      playercount={this.updatePlayerCount}
                    />
        break;
      case 'waiting':
        return <WaitingRoom
                      next={this.changeGameState}
                      gameid={this.state.gameid}
                      playercount={this.updatePlayerCount}
                      players={this.state.players}
                    />
        break;
      case 'gamescreen':
        return <GameScreen
                      next={this.endingChangeGameState}
                      gameid={this.state.gameid}
                      gameactive={this.state.gameactive}
                      signalstart={this.signalStart}
                    />
        break;
      case 'endscreen':
        return <EndScreen
                      next={this.changeGameState}
                      winlose={this.state.winlose}
                    />
        break;
    }
  }

  updatePlayerCount(players) {
    let array = []
    for(let i = 0; i < players; i++) {
      array.push(i)
    }
    this.setState({
      players: array
    })
  }

  introChangeGameState(newState, gameid) {
    this.setState({
      gamestate: newState,
      gameid: gameid
    })
  }

  changeGameState(newState) {
    this.setState({
      gamestate: newState
    })
  }

  endingChangeGameState(winLoseStatus) {
    console.log('win lose is ', winLoseStatus)
    this.setState({
      gamestate: 'endscreen',
      winlose: winLoseStatus,
      gameactive: false,
      gameid: 0
    })
  }

  signalStart() {
    this.setState({
      gameactive: true,
    })
  }

  render() {
    const view = this.loadRender();
    return (
      <View style={styles.container}>
        {view}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  }
})
