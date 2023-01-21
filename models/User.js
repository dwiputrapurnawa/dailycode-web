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
    },
    googleId: String,
    facebookId: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;