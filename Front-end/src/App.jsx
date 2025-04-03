// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer"; 
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home"; 
// import { VoucherProvider } from "./context/VoucherProvider";
import "./styles/global.css";

function App() {
  return (
    // <VoucherProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
  );
}


export default App;
