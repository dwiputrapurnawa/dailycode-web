const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: String,
    user: userSchema,
    replies: [commentSchema]
}, {timestamps: true});

const Comment = mongoose.model("comment", commentSchema);

module.exports = {
    Comment,
    commentSchema,
}