const mongoose = require('mongoose');
// const { shouldParseToolCall } = require('openai/lib/ResponsesParser.mjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true,  //Loại bỏ khoảng trắng đầu cuối
        minlength: 6,
        maxlenght: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 8,
        maxlenght: 40
    },
    password: {
        type : String,
        required: false, 
        minlength: 8,
        maxlenght: 30
    },
    admin: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        unique: true,
        required: false,
        sparse: true // Cho phép nhiều bản ghi có giá trị null
    }
},  { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;