const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Kết nối MongoDB thành công!");
    }
    catch {
        console.error("❌ Kết nối thất bại!", error);
        process.exit(1);
    }
}

module.exports = connectDB;