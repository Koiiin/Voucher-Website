const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoute = require('./Routes/authRoute');
const userRoute = require('./Routes/userRoute');
const session = require('express-session');
const passport = require('passport');
const Momo = require("./routes/payment");
const Voucher = require("./Routes/voucherRouter");
const morgan = require('morgan');
const fetch = require('node-fetch');
const voucherRouter = require('./Routes/voucherRouter');
const cartRouter = require('./Routes/cartRoute');

// AI Chatbot
const chatbotRoutes = require("./Routes/aiRoute");

require('./config/passport');
require('./config/passportFB');
require('dotenv').config();

connectDB();
app.use(morgan('dev'));

app.use(session({
    secret: process.env.JWT_ACCESS_KEY,
    resave: false,
    saveUninitialized: false
}));


app.use(cors({
    origin: 'http://localhost:5173', // địa chỉ front-end
    credentials: true // cho phép gửi cookie từ frontend
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use("/api", Momo);
app.use("/api", Voucher);

// AI chatbot
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/vouchers", voucherRouter);

app.use("/api/cart", cartRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
});