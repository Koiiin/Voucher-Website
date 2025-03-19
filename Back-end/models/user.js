const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    //email: { type: String, required: true, unique: true }
});

// Tạo model "User" => MongoDB sẽ tạo collection "users" (tên model ở số nhiều)
const User = mongoose.model("User", userSchema);

module.exports = User;
