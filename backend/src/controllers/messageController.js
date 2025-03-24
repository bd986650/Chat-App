const messageService = require('../services/messageService');

class MessageController {
    async sendMessage(req, res) {
        try {
            const { roomCode, sender, text } = req.body;
            const message = await messageService.saveMessage(roomCode, sender, text);
            res.status(201).json(message);
        } catch (error) {
            res.status(500).json({ message: 'error of sending message' });
        }
    }

    async getMessages(req, res) {
        try {
            const { roomCode } = req.params;
            const messages = await messageService.getMessages(roomCode);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ message: 'error of getting messages' });
        }
    }
}

module.exports = new MessageController();