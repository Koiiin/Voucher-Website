// gửi tin nhắn đến chatbot API

import axios from "axios";
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const sendMessage = async (message, userId) => {
    try {
        const response = await axios.post(API_URL, {
            userId,
            message,
        });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Failed to send message" };
    }
};