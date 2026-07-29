const ws = new WebSocket("wss://websocket-messager-1.onrender.com"); // Connected to my WebSocket Server

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

function sendPublicMessage(text) {
    ws.send(JSON.stringify({ type: 'public', text }))
}