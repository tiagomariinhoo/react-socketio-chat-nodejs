//Entry point for our server
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io')

//Cors middleware
app.use(cors());

const server = http.createServer(app);

// Passing the server that we created
// and the cors
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //Just to tell that it's okay accept socket communication with this url
    methods: ["GET", "POST"]
  }
});

//io is listening for this event
//with this id/name
io.on("connection", (socket) => {
  console.log(`User Connected ${socket.id}`)

  socket.on("join_room", (data) => {
    socket.join(data)
    console.log(`User with ID: ${socket.id} joined room: ${data}`)
  })

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id)
  })
})

server.listen(3001, () => {
  console.log('Server is running')
});