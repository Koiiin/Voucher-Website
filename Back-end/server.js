const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoute = require('./Routes/authRoute');
const userRoute = require('./Routes/userRoute');
const session = require('express-session');
const passport = require('passport');
const Momo = require("./Routes/payment");
const Voucher = require("./Routes/voucherRouter");
const morgan = require('morgan');
const fetch = require('node-fetch');
const voucherRouter = require('./Routes/voucherRouter');
const cartRouter = require('./Routes/cartRoute');
const startVoucherScheduler = require('./services/voucherService');
const cookieParser = require('cookie-parser');

// AI Chatbot
const chatbotRoutes = require("./Routes/aiRoute");

require('./config/passport');
require('./config/passportFB');
require('dotenv').config();

const path = require('path'); 
// Middleware setup
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_ACCESS_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(cors({
    origin: 'https://voucher-website-fe.onrender.com',
    credentials: true
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
// thme 
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use("/api", Momo);
app.use("/api", Voucher);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/vouchers", voucherRouter);
app.use("/api/cart", cartRouter);

const PORT = process.env.PORT || 3000;

// Khởi động server sau khi kết nối MongoDB thành công
const startServer = async () => {
    try {
        // Đợi kết nối MongoDB
        await connectDB();
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Sau khi kết nối thành công, khởi động server
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
            // Khởi chạy voucher scheduler
            startVoucherScheduler();
            console.log('✅ Voucher scheduler đã được khởi chạy');
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} đang được sử dụng. Hãy thử port khác hoặc tắt ứng dụng đang sử dụng port này.`);
                process.exit(1);
            } else {
                console.error('❌ Lỗi khởi động server:', err);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('❌ Không thể khởi động server:', error);
        process.exit(1);
    }
};

// Bắt đầu khởi động server
startServer();