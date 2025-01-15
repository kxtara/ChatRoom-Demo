const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { join } = require("node:path");
const { anonymousNames } = require("./constants");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend's origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true, // Allow cookies/auth (if needed)
  },
});

const users = {};

// Serve React's build files
app.use(express.static(join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

io.on("connection", (socket) => {

  const random = Math.floor(Math.random() * anonymousNames.length + 1);
  let username = anonymousNames[random];
  console.log(`${username} connected`)

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    users[socket.id] = { roomName, username };
    io.to(roomName).emit(
      "joinedRoom",
      `${username} joined the room ${roomName}`,
      username
    );
  });

  // Handle typing events
  socket.on("typing", (roomName) => {
    const senderInfo = users[socket.id];
    if (senderInfo) {
      io.to(roomName).emit("userTyping", { username: senderInfo.username });
    }
  });

  socket.on("stopTyping", (roomName) => {
    const senderInfo = users[socket.id];
    if (senderInfo) {
      io.to(roomName).emit("userStoppedTyping", { username: senderInfo.username });
    }
  });

  // Handle client messages
  socket.on("chat message", ({ room, message }) => {
    const senderInfo = users[socket.id]; // Retrieve the user's info
    if (senderInfo) {
      const { username } = senderInfo;
      io.to(room).emit("chat message", {
        sender: socket.id,
        message,
        user: username,
      });
    }
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
