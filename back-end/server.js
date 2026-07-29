const WebSocket = require('ws'); // WebSocket Library
const http = require('http'); // HTTP Library

const server = http.createServer(); // Create HTTP Server

const wss = new WebSocket.Server({ server }); // WebSocket Listens to Port 8080
console.log('Server listening....');

const clients = new Map() // Memory Table

wss.on('connection', (ws) => { // When Connection Happens....
    let userId; // Placeholder for UserID

    ws.on('message', (data) => { // When Message Sends
        const msg = JSON.parse(data); // Parse Message that was sent.

      if (msg.type === 'register') { // If the message type is register...
        userId = msg.userId; // Set Placeholder UserId as userId embedded in msg
        clients.set(userId, ws); // Puts New Client in memory Table.
        return; // Return.
         }

      if (msg.type === 'relay') { // If Message is Relay....

        const target = clients.get(msg.to);  // Pick Intended client through Msg.to

        if (target && target.readyState === WebSocket.OPEN) { // If Client Socket is Still Live...
            target.send(JSON.stringify({ // Send Client User's Texts
                type: 'message',
                from: userId,
                text: msg.text
            }))
        }
       }

    })

   

    ws.on('close', () => clients.delete(userId)) // If Client Connect closed, Delete User.
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});