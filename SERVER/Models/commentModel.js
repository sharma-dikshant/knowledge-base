const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment: { type: String, required: true },  
    authorId: { type: String, required: true }, // ID of the user who made the comment
    postId: { type: String, required: true }, // ID of the post the comment belongs to
    createdAt: { type: Date, default: Date.now } // Timestamp for when the comment was made
});

module.exports = mongoose.model('Comment', CommentSchema);
