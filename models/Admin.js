const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Super Admin"],
        required: true
    }
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
    Admin,
    adminSchema,
}