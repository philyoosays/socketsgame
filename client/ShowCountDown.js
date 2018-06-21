import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

export default class ShowCountDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: 5
    }
  }

  componentDidMount() {
    let theCountdown = setInterval(() => {
      this.setState(prevState => {
        return{countdown: prevState.countdown - 1}
      })
    }, 1000)
    setTimeout(() => {
      clearInterval(theCountdown)
      this.props.next('endscreen')
    }, 6010)
  }

  render() {
    return (
      <View>
        <View style={{flex:1}} />
          <Text style={styles.countdown}>{this.state.countdown}</Text>
        <View style={{flex:1}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  countdown: {
    textAlign: 'center',
    fontSize: 80
  }
})
