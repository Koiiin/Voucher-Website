import React, { useState } from "react";
import { sendMessage } from "../services/chatService";

const Chatbot = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Thêm tin nhắn người dùng vào giao diện
    const userMessage = { sender: "user", message: input };
    setMessages([...messages, userMessage]);

    // Gửi tin nhắn đến chatbot API
    const botResponse = await sendMessage(input, userId);

    setMessages([...messages, userMessage, { sender: "bot", message: botResponse.message }]);

    setInput(""); 
  };

  return (
    <div style={styles.chatbox}>
      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <p key={index} style={msg.sender === "user" ? styles.userMsg : styles.botMsg}>
            {msg.sender === "user" ? "👤" : "🤖"} {msg.message}
          </p>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>Gửi</button>
      </div>
    </div>
  );
};

// CSS inline
const styles = {
  chatbox: {
    width: "300px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  messages: {
    maxHeight: "200px",
    overflowY: "auto",
  },
  userMsg: {
    textAlign: "right",
    color: "#007bff",
  },
  botMsg: {
    textAlign: "left",
    color: "#333",
  },
  inputContainer: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "5px",
  },
  button: {
    marginLeft: "5px",
    padding: "5px 10px",
  },
};

export default Chatbot;
