const mongoose = require("mongoose");

const { adminSchema } = require("../models/Admin");

const postSchema = new mongoose.Schema({

    title: String,
    content: String,
    img: String,
    author: String,
    tags: [String],
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;