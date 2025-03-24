const messageRepository = require('../repositories/messageRepository');

class MessageService {
    async saveMessage(roomCode, sender, text) {
        return await messageRepository.saveMessage(roomCode, sender, text);
    }

    async getMessages(roomCode) {
        return await messageRepository.getMessagesByRoom(roomCode);
    }
}

module.exports = new MessageService();