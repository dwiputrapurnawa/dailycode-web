const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    fullname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: String,
    facebookId: String,
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["User"],
        required: true,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;