const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { initGameRooms } = require('./gameRooms');

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://math-game-gules-six.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

console.log("Allowed origins:", allowedOrigins);

const app = express();
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("MindBattle Arena backend is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

initGameRooms(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
