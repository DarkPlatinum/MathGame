const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { initGameRooms } = require('./gameRooms');

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean);

const app = express();
app.use(cors({ origin: allowedOrigins }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

initGameRooms(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
