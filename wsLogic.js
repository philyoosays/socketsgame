module.exports = {

  killArray(array) {
    if(Array.isArray(array)) {
      return array[0]
    } else {
      return array
    }
  },

  makeTheId(activeGames) {
    let newGameID = Math.floor(Math.random() * 10000) + 1;
    while(this.doesIDExist(newGameID, activeGames)) {
      newGameID = Math.floor(Math.random() * 10000) + 1;
    }
    let date = new Date();
    activeGames.push({gameid: newGameID, date, players: []});
    return newGameID;
  },

  doesIDExist(newGameID, activeGames) {
    activeGames.forEach(d => {
      if(newGameID === d.gameid) {
        return true;
      }
    })
    return false;
  },

  findGame(gameid, activeGames) {
    return activeGames.filter(element => {
      return element.gameid === parseInt(gameid)
    })
  },

  enterGame(package, activeGames, webSock) {
    let theGame = this.findGame(package.joingameid, activeGames)
    let alreadyExists = false;
    if(theGame.length > 0) {
      if(theGame[0].players.length >= 4) {
        webSock.ws.send(JSON.stringify({noroom: true}))
        return package;
      }
      if(theGame[0].players.length > 0) {
        theGame[0].players.forEach(user => {
          if(user === webSock.ws) {
            alreadyExists = true;
            package.gamestatus = 'joined';
          }
        })
      }
      if(alreadyExists === false && theGame[0].players.length < 4) {
        theGame[0].players.push({client: webSock.ws, ready: false})
        package.gamestatus = 'joined';
      }
      package.players = theGame[0].players.length
      webSock.broadcastAllElse(package, theGame[0].players, webSock)
    } else {
      package.gamestatus = 'does not exist';
    }
    return package;
  },

  updatePlayerReadyState(package, activeGames, webSock) {
    let theGame = this.findGame(package.gameid, activeGames)
    theGame[0].players.forEach(players => {
      if(webSock.ws === players.client) {
        players.ready = package.readystate
      }
    })
  },

  gameStartCondition(package, activeGames) {
    let theGame = this.findGame(package.gameid, activeGames)
    let gameStart = true;
    theGame[0].players.forEach(player => {
      if(player.ready === false) {
        gameStart = false;
      }
    })
    package.gamestart = gameStart;
    console.log('thisisgamestart', package.gamestart)
  },

  signalStart(package, activeGames, webSock) {
    let theGame = this.findGame(package.gameid, activeGames);
    let theTorch = {startgame: true}
    webSock.broadcastRoom(theTorch, theGame[0].players, webSock)
    console.log('wsLogic.signalStart broadcasting: ', theTorch)
  },

}
