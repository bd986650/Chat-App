const Message = require('../models/Message');

class MessageRepository {
    async saveMessage(roomCode, sender, text) {
        return await Message.create({ roomCode, sender, text });
    }

    async getMessagesByRoom(roomCode) {
        return await Message.find({ roomCode }).sort({ timestamp: 1 });
    }
}

module.exports = new MessageRepository();