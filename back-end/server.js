const http = require("http");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK"); // Respond to health checks
});

const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on("connection", (ws) => {
  let userId;

  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    if (msg.type === "register") {
      userId = msg.userId;
      clients.set(userId, ws);
      return;
    }

    if (msg.type === "relay") {
      const target = clients.get(msg.to);
      if (target && target.readyState === WebSocket.OPEN) {
        target.send(
          JSON.stringify({
            type: "message",
            from: userId,
            text: msg.text,
          })
        );
      }
    }
  });

  ws.on("close", () => clients.delete(userId));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
