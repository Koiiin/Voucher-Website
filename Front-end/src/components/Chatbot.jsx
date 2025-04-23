import React, { useState } from 'react';
import { getChatResponse } from '../services/chatService'; 
import '../styles/aiChatbot.css';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!message) return;
  
    // Gọi API để nhận phản hồi từ chatbot
    const reply = await getChatResponse(message);
  
    // Cập nhật kết quả mới lên màn hình (dạng từng cặp user - chatbot)
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: reply }
    ]);
  
    setMessage('');
  };
  
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Chatbot AI</div>

      <div className="chatbot-messages">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default Chatbot;
