const fetch = require('node-fetch');

const getChatResponse = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        messages: [{ role: 'user', content: message }],
        stream: false  // rất quan trọng để tắt chế độ stream
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    const reply = data.message?.content || 'Không có phản hồi từ chatbot.';
    res.json({ reply });

  } catch (error) {
    console.error('Error in chatbot API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getChatResponse };
