let wsLogic = require('./wsLogic')

const buttons = [
  {id: 1, button: 'Flush The Vents', instruction: 'Flush The Vents'},
  {id: 2, button: 'Engage Thrusters', instruction: 'Engage Thrusters'},
  {id: 3, button: 'Cool Drive Modules', instruction: 'Cool Drive Modules'},
  {id: 4, button: 'Engage Inertial Dampers', instruction: 'Engage Inertial Dampers'},
  {id: 5, button: 'Jettison Waste', instruction: 'Jettison Waste'},
  {id: 6, button: 'Turn On Search Lights', instruction: 'Turn On Search Lights'},
  {id: 7, button: 'Prime a Fuel Rod', instruction: 'Prime a Fuel Rod'},
  {id: 8, button: 'Inject Anti-matter', instruction: 'Inject Anti-matter'},
  {id: 9, button: 'Flood the Reactor', instruction: 'Flood the Reactor'},
  {id: 10, button: 'Rotate the Dish', instruction: 'Rotate the Dish'},
  {id: 11, button: 'Engage Forward Shields', instruction: 'Engage Forward Shields'},
  {id: 12, button: 'Engage Rear Shields', instruction: 'Engage Rear Shields'},
  {id: 13, button: 'Take Evasive Maneuvers', instruction: 'Take Evasive Maneuvers'},
  {id: 14, button: 'De-ice Fins', instruction: 'De-ice Fins'},
  {id: 15, button: 'Re-align Sensors', instruction: 'Re-align Sensors'},
  {id: 16, button: 'Adjust Course', instruction: 'Adjust Course'},
  {id: 17, button: 'Reset Inertial Dampers', instruction: 'Reset Inertial Dampers'},
  {id: 18, button: 'Stabilize Course', instruction: 'Stabilize Course'},
  {id: 19, button: 'Become a Wizard', instruction: 'Become a Wizard'},
  {id: 20, button: 'Take a Nap', instruction: 'Take a Nap'},
]

const buttonselse = [
  {id: 1, button: 'Make a Martini', instruction: 'Table 5 needs a martini'},
  {id: 2, button: 'Put Fries in The Fryer', instruction: 'We got an order of fries!'},
  {id: 3, button: 'Boil Noodles', instruction: 'Table 2 ordered spaghetti'},
  {id: 4, button: 'Prepare Salad', instruction: 'Table 7 ordered a salad'},
  {id: 5, button: 'Steam Broccoli', instruction: 'We need a side of steamed veggies'},
  {id: 6, button: 'Kick Customers Out', instruction: 'Table 10 is being unruly'},
  {id: 7, button: 'Take the Table\'s Order', instruction: 'Table 3 was just seated'},
  {id: 8, button: 'Seat The Customers', instruction: 'We have customers waiting for a seat'},
  {id: 9, button: 'Fry A Chicken Order', instruction: 'A bucket of chicken was just ordered'},
  {id: 10, button: 'Plate The Risotto', instruction: 'That risotto is done cooking'},
  {id: 11, button: 'Serve The Dish', instruction: 'That plate is ready and just sitting there'},
  {id: 12, button: 'De-vein Shrimp', instruction: 'Someone ordered a shrimp cocktail'},
  {id: 13, button: 'Serve the Margaritas', instruction: 'Bartender has 5 margaritas are ready'},
  {id: 14, button: 'Bake a Potato', instruction: 'Do you have baked potatoes?'},
  {id: 15, button: 'Reseat The Table', instruction: 'Table 1 hates their seat!'},
  {id: 16, button: 'Take The Drink Order', instruction: 'People came in for happy hour'},
  {id: 17, button: 'Bring Out Appetizers', instruction: 'Chips and Salsa ready'},
  {id: 18, button: 'Clean Table 6', instruction: 'Table 6 just left'},
  {id: 19, button: 'Grill a Burger', instruction: 'I want a burger cooked medium'},
  {id: 20, button: 'Serve Ice-Cream', instruction: 'We want dessert!'},
]

let doWhileLoopAgain

module.exports = {

  flatten(array) {
    if(Array.isArray(array[0])) {
      return this.flatten(array[0])
    } else {
      return array;
    }
  },

  killArray(thing) {
    if(Array.isArray(thing)) {
      return this.killArray(thing[0])
    } else {
      return thing;
    }
  },

  squashObj(instruction) {
    if(typeof instruction === 'object') {
      if(Object.keys(instruction).length === 1) {
        return this.squashObj(instruction[0][Object.keys(instruction)[0]])
      } else if(Object.keys(instruction).length > 1) {
        return instruction;
      }
    }
  },

  shuffleArray(arr) {
    let array = arr.slice();
    for(let i = 0; i < array.length; i++) {
      let random = i;
      while(i === random) {
        random = Math.floor(Math.random() * array.length);
      }
      let temp = array[i];
      array[i] = array[random];
      array[random] = temp;
    }
    return array;
  },

  dealTheButtons(package, activeGames) {
    let theGame = wsLogic.findGame(package.gameid, activeGames);
    if(!theGame[0].hasOwnProperty('mixedarray')){
      theGame[0].mixedArray = this.shuffleArray(buttons)
    }
    theGame[0].buttons = [];
    let theButtons = []
    for(let i = 0; i < 5; i++) {
      let oneButton = theGame[0].mixedArray.shift()
      theGame[0].buttons.push(oneButton);
      theButtons.push(oneButton)
    }
    return theGame[0].buttons.slice();
  },

  initializeScore(package, activeGames) {
    let theGame = wsLogic.findGame(package.gameid, activeGames);
    theGame[0].score = 0
  },

  sendInstructions(package, activeGames, webSock) {
    let theGame = wsLogic.findGame(package.gameid, activeGames);

    theGame[0].players.forEach(client => {
      if(this.areYouTheClient(webSock, client)) {
        if(client.hasOwnProperty('instruction')){
          // console.log('thisisclient instruct', client.instruction)
          // console.log('thisisclone of client', Object.assign({}, this.killArray(client.instruction)))
          theGame[0].buttons.push(Object.assign({}, this.killArray(client.instruction)))
        } else {
          console.log('client has no instruction')
        }
      }
    })

    let copyArray = []
    theGame[0].buttons.forEach(button => {
      if(package.buttons.indexOf(button.id) === -1) {
        copyArray.push(button)
      }
    })
    // console.log('allbuttons', theGame[0].buttons)
    // console.log('copyaray', copyArray)

    doWhileLoopAgain = true;
    let safetyCounter = 0;
    let beLessRandom = true


    while(doWhileLoopAgain === true) {
      let rand = Math.floor(Math.random() * theGame[0].buttons.length)
      let instruction = this.flatten(theGame[0].buttons.splice(rand,1))

      console.log('I AM INSTRUCTION', instruction)
      console.log('I AM PACKAGE', package)

      theGame[0].players.forEach(client => {
        if(this.areYouTheClient(webSock, client)) {
          if(this.instructionIsNotSameAsPrevious(client, instruction)) {
            if(beLessRandom) {
              if(this.instructionIsNotOneOfMine(package, instruction)) {
                // this.makeAndSendInstructionPackage(client, instruction, beLessRandom)
                console.log('thisisinstruction', instruction)
                client.instruction = instruction;
                let sendPackage = {
                  'buttonid': instruction[0].id,
                  'instruction': instruction[0].instruction
                }
                console.log('instructions sent this: ', sendPackage)
                client.client.send(JSON.stringify(sendPackage))
                doWhileLoopAgain = false;
                client.beLessRandom = !beLessRandom;
              } else {
                // the instruction IS one of MINE and NOT THE SAME as the previous
                this.returnTheInstructionToArray(theGame, instruction)
              }
            } else {
              // Just use whatever the random gives me
              // this.makeAndSendInstructionPackage(client, instruction, beLessRandom)
              console.log('thisisinstruction', instruction)
              client.instruction = instruction;
              let sendPackage = {
                'buttonid': instruction[0].id,
                'instruction': instruction[0].instruction
              }
              console.log('instructions sent this: ', sendPackage)
              client.client.send(JSON.stringify(sendPackage))
              doWhileLoopAgain = false;
              client.beLessRandom = !beLessRandom;
            }
          } else {
            // the instruction IS the SAME as the previous
            this.returnTheInstructionToArray(theGame, instruction)
          }
          console.log('I\'m not finding the client')
        }

        // SEE IF THERE IS A BETTER WAY!!!!
        // if(webSock.ws === client.client) {
          // if(client.instruction !== instruction) {
            // if(fuckRandom) {
              // if(package.buttons.indexOf(instruction[0].id) === -1) {
                // doWhileLoopAgain = false;
                // client.instruction = instruction
                // let sendPackage = {
                //   'buttonid': instruction[0].id,
                //   'instruction': instruction[0].instruction
                // }
                // webSock.ws.send(JSON.stringify(sendPackage))
                // console.log('Sent from sendInstruction1: ', sendPackage)
              // } else {
              //   theGame[0].buttons.push(Object.assign({}, instruction))
              // }
            // } else {
            //   doWhileLoopAgain = false;
            //   client.instruction = instruction
            //   let sendPackage = {
            //     'buttonid': instruction[0].id,
            //     'instruction': instruction[0].instruction
            //   }
            //   webSock.ws.send(JSON.stringify(sendPackage))
            //   console.log('Sent from sendInstruction2: ', sendPackage)
            // }
          // } else {
          //   theGame[0].buttons.push(Object.assign({}, instruction))
          // }
        // }
      })

      if(safetyCounter >= (buttons.length * 2)) {
        doWhileLoopAgain = false;
        console.log('!!!!! WHILE LOOP SAFETY TRIGGERED !!!!!')
      } else if(safetyCounter > 150) {
        console.log('!!!!! WHILE LOOP SAFETY TRIGGERED !!!!!')
        console.log('!!!!! Somethings wrong with your buttons length !!!!!')
        doWhileLoopAgain = false;
      }
      safetyCounter++;
    }
  },

  buttonPress(package, activeGames, webSock) {
    let theGame = wsLogic.findGame(package.gameid, activeGames);

    theGame[0].players.forEach(client => {
      console.log('thisis client', client)
      if(client.instruction.id === package.buttonid) {
        client.client.send(JSON.stringify({stoptimer: true}))
        console.log('Sent from buttonPress: ', {stoptimer: true})
      }
    })
  },

  updateScore(package, activeGames, webSock) {
    let theGame = wsLogic.findGame(package.gameid, activeGames);
    theGame[0].score += package.score
    this.checkWinCondition(package, activeGames, webSock)
  },

  checkWinCondition(package, activeGames, webSock) {
    let theGame = wsLogic.findGame(package.gameid, activeGames);
    let sendPackage = {winlose: 'win'}
    if(theGame[0].score >= 20) {
      console.log('Win condition')
      webSock.broadcastRoom(sendPackage, theGame[0].players, webSock)
    } else if(theGame[0].score <= -5) {
      console.log('Losing Condition')
      sendPackage.winlose = 'lose'
      webSock.broadcastRoom(sendPackage, theGame[0].players, webSock)
    } else {
      console.log('No win/lose detected')
    }
  },


  /////////////////////

  areYouTheClient(webSock, client) {
    if(webSock.ws === client.client) {
      return true;
    } else {
      return false;
    }
  },

  instructionIsNotSameAsPrevious(client, instruction) {
    if(client.instruction !== instruction) {
      console.log('iamclientinstruct', client.instruction)
      console.log('iamreginstruction', instruction)
      return true;
    } else {
      return false;
    }
  },

  returnTheInstructionToArray(theGame, instruction) {
    theGame[0].buttons.push(this.squashObj(instruction));
  },

  instructionIsNotOneOfMine(package, instruction) {
    if(package.buttons.indexOf(this.killArray(instruction).id) === -1) {
      return true;
    } else {
      return false;
    }
  },

// I think the problem is here because I'm giving it the client but it's not affecting the real client
  makeAndSendInstructionPackage(client, instruction, beLessRandom, webSock) {
    console.log('thisisinstruction', instruction)
    client.instruction = instruction;
    let sendPackage = {
      'buttonid': instruction[0].id,
      'instruction': instruction[0].instruction
    }
    console.log('instructions sent this: ', sendPackage)
    client.client.send(JSON.stringify(sendPackage))
    doWhileLoopAgain = false;
    client.beLessRandom = !beLessRandom;
  },

}










