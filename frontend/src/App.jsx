import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    // Listen for chat messages
    socket.on("chat message", ({ sender, message, user }) => {
      setMessages((prev) => [...prev, { sender, message, user }]);
    });

    // Listen for room join confirmation
    socket.on("joinedRoom", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("chat message");
      socket.off("joinedRoom");
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id);
    });
  }, []);

  const handleJoinRoom = () => {
    if (room.trim()) socket.emit("joinRoom", room);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      socket.emit("chat message", { room, message: input });
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <div className="mb-4">
        <label>
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
        </label>
      </div>
      <div className="flex-grow bg-white p-4 rounded shadow">
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`p-2 rounded ${
                msg.sender === socket.id
                  ? "bg-blue-200 text-right"
                  : msg.sender === "system"
                  ? "bg-gray-300 text-center"
                  : "bg-green-200 text-left"
              }`}
            >
              {msg.sender === "system" ? (
                <span>{msg.message}</span>
              ) : (
                <span>
                  {msg.sender === socket.id ? " " : `${msg.user}: `}
                  {msg.message}
                </span>
              )}
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
