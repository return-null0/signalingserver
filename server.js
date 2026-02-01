const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Signaling Server is Running');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 

    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {

    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;

    if (numClients === 0) {
      socket.join(roomId);
      console.log(`User ${socket.id} created room ${roomId}`);
      socket.emit('room-created'); 

    } 
    else if (numClients === 1) {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      io.to(roomId).emit('room-joined'); 
    } 
    else {

      socket.emit('full-room');
    }
  });

  socket.on('chat-message', (payload) => {
    socket.to(payload.roomId).emit('chat-message', payload.text);
  });

  socket.on('media-toggle', (p) => socket.to(p.roomId).emit('media-toggle', p));
  
  socket.on('offer', (payload) => {

    socket.to(payload.roomId).emit('offer', payload.sdp);
  });

  socket.on('answer', (payload) => {
    socket.to(payload.roomId).emit('answer', payload.sdp);
  });

  socket.on('ice-candidate', (payload) => {
    socket.to(payload.roomId).emit('ice-candidate', payload.candidate);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});