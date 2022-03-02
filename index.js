const { Server } = require('ws');
const express = require('express');
const cors = require('cors');

const server = express();

server.use(cors());

const wss = new Server({ server });
var master;
var slaves = [];
wss.on('connection', (ws, req) => {
  console.log(req.url);
  switch (req.url) {
    case '/master':
      master = ws;
      console.log('New master connected!!');
      master.on('message', (data) => {
        slaves.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data, { binary: false });
          }
        });
      });

    case '/slave':
      console.log('New slave connected!!');
      slaves.push(ws);
  }
});

server.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}`),
);
