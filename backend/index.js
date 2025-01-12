const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { join } = require("node:path");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend's origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true, // Allow cookies/auth (if needed)
  },
});

// Serve React's build files
app.use(express.static(join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room: ${roomName}`);
    socket.emit("joinedRoom", `You joined the room: ${roomName}`);
  });


// Handle client messages
  socket.on("chat message", ({ room, message }) => {
    console.log(room,message)
    if (room) {
      console.log(`Message to room ${room}: ${message}`);
      io.to(room).emit("chat message", message); // Broadcast only to the specified room
    }
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
