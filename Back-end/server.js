const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const passport = require('passport');
const Momo = require("./routes/payment");
const Voucher = require("./routes/voucher")
require('./config/passport');

require('dotenv').config();

connectDB();

app.use(cors());

app.use(passport.initialize());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use("/api", Momo);
app.use("/api", Voucher);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
});