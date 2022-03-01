const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 8082 });
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
