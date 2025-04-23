// src/services/chatService.js
export const getChatResponse = async (message) => {
    const response = await fetch('http://localhost:3000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.reply;
    } else {
      console.error('Error fetching chat response');
      return 'Sorry, I could not understand your request.';
    }
  };
  