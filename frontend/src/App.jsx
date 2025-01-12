import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    // Listen for chat messages
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for room join confirmation
    socket.on("joinedRoom", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat message");
      socket.off("joinedRoom");
    };
  }, []);

  const handleJoinRoom = () => {
    console.log("Frontend:",room)
    if (room.trim()) {
      socket.emit("joinRoom", room);
      console.log(`Joining room: ${room}`);
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      socket.emit("chat message", { room, message: input });
      setInput(""); // Clear message input
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <div className="mb-4">
        <input
          type="text"
          className="p-2 border rounded mr-2"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      </div>
      <div className="flex-grow bg-white p-4 rounded shadow">
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className="p-2 bg-gray-200 rounded">
              {msg}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="p-2 border rounded mr-2 flex-grow"
          placeholder="Enter your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
