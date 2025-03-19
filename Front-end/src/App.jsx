// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VoucherDetail from "./pages/VoucherDetail";
import Header from "./components/Header";
import Footer from "./components/Footer"; 
import { VoucherProvider } from "./context/VoucherProvider";
import "./styles/global.css";

function App() {
  return (
    <VoucherProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/voucher/:id" element={<VoucherDetail />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </VoucherProvider>
  );
}


export default App;
