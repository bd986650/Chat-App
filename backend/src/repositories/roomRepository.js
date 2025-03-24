const Room = require('../models/Room');

class RoomRepository {
    async createRoom(code, expiresAt) {
        return await Room.create({ code, expiresAt, users: [] });
    }

    async findRoomByCode(code) {
        return await Room.findOne({ code });
    }

    async addUserToRoom(code, userId) {
        const room = await Room.findOne({ code });

        if (!room) return null;
        if (room.users.length >= 2) return { error: 'Room is full' };

        room.users.push(userId);
        await room.save();
        return room;
    }

    async removeUserFromRoom(code, userId) {
        const room = await Room.findOne({ code });

        if (!room) return null;

        room.users = room.users.filter(user => user !== userId);
        await room.save();

        return room;
    }

    async deleteRoom(code) {
        return await Room.deleteOne({ code });
    }
}

module.exports = new RoomRepository();
