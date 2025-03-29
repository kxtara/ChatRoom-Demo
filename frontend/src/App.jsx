import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");
  const [prevRoom,setPrevRoom] = useState("")
  const [typingUsers, setTypingUsers] = useState([]);
  const [disableRoomBtn,setDisableRoomBtn] = useState(true)
  let typingTimeout;
  
  useEffect(() => {
    socket.on("chat message", ({ sender, message, user }) => {
      setMessages((prev) => [...prev, { sender, message, user }]);
    });

    socket.on("joinedRoom", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    // Listen for typing events
    socket.on("userTyping", ({ username }) => {
      if (!typingUsers.includes(username)) {
        setTypingUsers((prev) => [...prev, username]);
      }
    });

    socket.on("userStoppedTyping", ({ username }) => {
      setTypingUsers((prev) => prev.filter((user) => user !== username));
    });

    socket.on("disconnected", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("chat message");
      socket.off("joinedRoom");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("disconnected")
    };
  }, [typingUsers]);

  const handleJoinRoom = () => {
    setMessages([])
    if (room.trim()) socket.emit("joinRoom", room);
    setPrevRoom(room)
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Emit typing event
    if (room) {
      socket.emit("typing", room);

      // Clear previous timeout and set new one for stop typing
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", room);
      }, 1200);
    }
  };

  const handleSendMessage = () => {
    console.log("handleMessage",input)
    if (input.trim()) {
      socket.emit("chat message", { room, message : input });
      setInput("");
      socket.emit("stopTyping", room); // Stop typing after sending
    }
  };

  const handleRoomInput = (e) => {
    const val = e.target.value
    setRoom(val)
  }

  useEffect(() => {
    if (!room) {
      setDisableRoomBtn(true);
    } else if (room === prevRoom) {
      setDisableRoomBtn(true);
    } else {
      setDisableRoomBtn(false);
    }
  }, [room, prevRoom]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <div className="mb-4">
        <label>
          <input
            type="text"
            className="p-2 border rounded mr-2"
            placeholder="Enter room name"
            value={room}
            onChange={handleRoomInput}
          />
          <button
            className={`${disableRoomBtn ? "bg-blue-300" : "bg-blue-500"}  text-white px-4 py-2 rounded cursor-pointer`}
            onClick={handleJoinRoom}
            disabled={disableRoomBtn}
          >
            Join Room
          </button>
        </label>
      </div>
      <div className="flex-grow bg-white p-4 rounded shadow">
        <ul className="space-y-2">
          {messages.map((msg, index) => {
            return(
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
            </li>);
          })}
        </ul>
        <div className="text-sm text-gray-500 mt-2">
          {typingUsers.length > 0 && (
            <p>
              {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="p-2 border rounded mr-2 flex-grow"
          placeholder="Enter your message"
          value={input}
          onChange={handleInputChange}
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
