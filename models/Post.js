const mongoose = require("mongoose");

const { adminSchema } = require("../models/Admin");
const { tagSchema } = require("../models/Tag");

const postSchema = new mongoose.Schema({

    title: String,
    content: String,
    img: String,
    author: adminSchema,
    tags: [tagSchema],
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;