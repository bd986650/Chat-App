const roomRepository = require('../repositories/roomRepository');
const generateCode = require('../utils/generateCode');
const checkExpiration = require('../utils/checkExpiration');

class RoomService {
    async roomCreate() {
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        return await roomRepository.createRoom(code, expiresAt);
    }

    async getRoom(code) {
        const room = await roomRepository.findRoomByCode(code);
        if (!room) return null;

        if (checkExpiration(room)) {
            await roomRepository.deleteRoom(code);
            return null;
        }

        return room;
    }

    async joinRoom(code, userId) {
        return await roomRepository.addUserToRoom(code, userId);
    }

    async leaveRoom(code, userId) {
        return await roomRepository.removeUserFromRoom(code, userId);
    }

    async deleteRoom(code) {
        return await roomRepository.deleteRoom(code);
    }
}

module.exports = new RoomService();
