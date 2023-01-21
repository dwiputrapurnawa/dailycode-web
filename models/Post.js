const mongoose = require("mongoose");

const { adminSchema } = require("../models/Admin")

const postSchema = new mongoose.Schema({
    title: {
        type: "String",
        required: true
    },
    content: {
        type: "String",
        required: true
    },
    author: {
        type: adminSchema,
        required: true
    },
    img: {
        type: "String",
        required: true
    }
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;