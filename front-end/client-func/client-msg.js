const ws = new WebSocket("ws://localhost:8080"); // I will Make a Render Server Later.

ws.onopen = () => { // when connections established
    ws.send(JSON.stringify({ type: 'register', userId: 'alice' }));
};

ws.onmessage = (event) => { // When server sends this user something...
    const msg = JSON.parse(event.data); // parses the event data
    console.log(`${msg.from}: ${msg.text}`); // logs the data
}

function sendMessage(to, text) { // a function used to send user message, like with send button.
    ws.send(JSON.stringify({ type: 'relay', to, text }))
}

