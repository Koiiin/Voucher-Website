const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000
        });
        console.log(`✅ Kết nối MongoDB thành công: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Kết nối thất bại!', error);
        process.exit(1);
    }
};

module.exports = connectDB;
