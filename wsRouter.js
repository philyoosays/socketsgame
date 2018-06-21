const wsLogic = require('./wsLogic')
const game = require('./gameLogic')

module.exports = {
  activeGames: [],
  activePlayers: [],

  makeAndSendPackage(package, activeKeyAsStr, webSock) {
    if(activeKeyAsStr !== 'skip') {
      if(typeof JSON.parse(package[activeKeyAsStr]) === 'number') {
        package[activeKeyAsStr] = 0;
      } else {
        package[activeKeyAsStr] = false;
      }
    }
    webSock.ws.send(JSON.stringify(package));
    console.log('Sentfrom Router: ', package)
  },

  parser(webSock, package) {
    switch(true) {

      //////////////////////////
      // MAKEGAMEID          ///
      // Creating a new game ///
      //////////////////////////
      case package.makegameid === true:
        package.newgameid = wsLogic.makeTheId(this.activeGames);
        this.makeAndSendPackage(package, 'makegameid', webSock)
        this.parser(webSock, package);
        break;

      //////////////////////////
      // JOINGAMEID          ///
      // Need to join a game ///
      //////////////////////////
      case package.hasOwnProperty('joingameid') && package.joingameid !== 0:
        package = wsLogic.enterGame(package, this.activeGames, webSock);
        package.gameroom = package.joingameid;
        this.makeAndSendPackage(package, 'joingameid', webSock)
        this.parser(webSock, package);
        break;

      //////////////////////////
      // READYSTATE          ///
      // State changed       ///
      //////////////////////////
      case package.readystate === true:
        wsLogic.updatePlayerReadyState(package, this.activeGames, webSock);
        wsLogic.gameStartCondition(package, this.activeGames, webSock);
        this.makeAndSendPackage(package, 'readystate', webSock)
        this.parser(webSock, package)
        break;

      //////////////////////////
      // GAMESTART          ////
      // Deal the buttons   ////
      // and begin the game ////
      //////////////////////////
      case package.gamestart === true:
        wsLogic.signalStart(package, this.activeGames, webSock)
        // package.buttons = game.dealTheButtons(package, this.activeGames);
        game.initializeScore(package, this.activeGames);

        this.makeAndSendPackage(package, 'gamestart', webSock)
        // this.parser(webSock, package);
        break;

      //////////////////////////
      // SCORE.             ////
      // Change score.      ////
      //////////////////////////
      case package.hasOwnProperty('score') && package.score !== 0:
        game.updateScore(package, this.activeGames, webSock)
        package.score = 0;
        this.parser(webSock, package)
        break;

      //////////////////////////
      // SENDINSTRUCTION    ////
      // Begin the          ////
      // instruction stream ////
      //////////////////////////
      case package.sendinstruction === true:
        console.log('SendInstruction disabled')
        // game.sendInstructions(package, this.activeGames, webSock)
        // package.sendinstruction = false
        // this.parser(webSock, package)
        break;

      /////////////////////
      // BUTTON PRESS /////
      /////////////////////
      case package.buttonpress === true:
        game.buttonPress(package, this.activeGames, webSock)
        package.buttonpress = false;
        this.parser(webSock, package)
        break;

      //////////////////////////////
      // INITIAL SERVER MESSAGE ////
      //////////////////////////////
      case package === 'Worker bees can leave. Even drones can fly away. The queen is their slave.':
        webSock.ws.send('I am Jack\'s complete lack of surprise.');
        break;

      default:
        console.log('No Data in Parser')
        break;
    }
  },

}
