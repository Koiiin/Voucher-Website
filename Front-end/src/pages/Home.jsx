import React from "react";
import Chatbot from "../components/Chatbot";

const Home = () => {
// Giả lập user ID để test chatbotchatbot
  const userId = "user123"; 

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chào mừng bạn đến với Website Voucher 🎉</h1>
      <p style={styles.subtitle}>Khám phá và trao đổi voucher ngay hôm nay!</p>

      {/* Chatbot */}
      <div style={styles.chatContainer}>
        <Chatbot userId={userId} />
      </div>
    </div>
  );
};

const styles = {
    container: {
      textAlign: "center",
      padding: "20px",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "#666",
    },
    chatContainer: {
      marginTop: "20px",
    },
  };
  
  export default Home;