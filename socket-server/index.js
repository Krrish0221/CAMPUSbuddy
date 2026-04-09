const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Example: broadcast order status to room
  socket.on('order_update', (data) => {
    io.to(data.room).emit('order_status', data);
  });

  // Example: broadcast issue status update
  socket.on('issue_update', (data) => {
    io.to(data.room).emit('issue_status', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Socket.io server listening on port ${PORT}`);
});

module.exports = io;
