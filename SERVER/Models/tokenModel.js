const mongoose = require('mongoose');
const TokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: String,
    createdAt: { type: Date, default: Date.now, expires: '7d' }
});

const Token= mongoose.model("Token",TokenSchema)

module.exports=Token