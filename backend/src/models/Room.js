const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    users: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
