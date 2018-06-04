const express = require('express');
const logger = require('morgan');

const wsRouter = require('./wsRouter')

const PORT = process.env.PORT || 3000;
const app = express();

const webSocket = require('ws')
wss = new webSocket.Server({port: 8097})

wss.on('connection', function (ws, req) {
  console.log('server-side wsocket established')
  console.log('ws', req.connection.remoteAddress)
  console.log('His name was Robert Paulsen.')
  // ws.send(JSON.stringify('Go Away Andrew'))
  ws.on('message', function (message) {
    console.log('received: ', message)
    // ws.send(JSON.stringify('Go Away Andrew'))
    let package = JSON.parse(message)
    let webSock = {
      ws,
      wss,
      webSocket,
      broadcast: function broadcast() {
        wss.clients.forEach(function each(client) {
          if (client.readyState === webSocket.OPEN) {
            client.send(JSON.stringify(package));
          }
        });
      },
      broadcastAllElse: function broadcast(package, clients, theWebsocket) {
        clients.forEach(function each(client) {
          if(client.client !== theWebsocket.ws && client.client.readyState === theWebsocket.webSocket.OPEN) {
            client.client.send(JSON.stringify(package))
          }
        });
      },
      broadcastRoom: function broadcast(package, clients, theWebsocket) {
        clients.forEach(function each(client) {
          if(client.client.readyState === theWebsocket.webSocket.OPEN) {
            client.client.send(JSON.stringify(package))
          }
        });
      }
    }
    wsRouter.parser(webSock, package);
  })
})

wss.on('open', function open() {
  ws.send('server-side established')
})

app.use(logger('dev'))

app.get('/', function (req, res) {
   res.send('Hello Good Sir');
})

app.listen(PORT, () => {
  console.log(`Server up and listening on port ${PORT}, in ${app.get('env')} mode.`);
});
