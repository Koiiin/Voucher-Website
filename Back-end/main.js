const https = require('https');
const port = 3000;
let express = require("express");
const cors = require("cors");

require("dotenv").config();
const connectDB = require("./database/database");
const authRoutes = require("./Routes/AuthRoutes");
const Category = require("./Routes/categoryR")



let app = express()
app.use(cors({ origin: "*" }));
//ketnoiDB
connectDB();

// Cho phép tất cả các origin truy cập
app.use(cors());

//connfig de nhan gia tir tu nguoi dung gui len 
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 


//su dung api cho auth(dang nhap, dang ki )
app.use("/api", authRoutes);
// phan loai va ley 
app.use("/api",Category)




app.listen(port, function () {
	console.log( 'https://localhost3000' )
}) 