const Room = require('../models/Room');
const generateCode = require('../utils/generateCode');
const checkExpiration = require('../utils/checkExpiration.js');

class RoomController {
    async createRoom(req, res) {
        try {
            const { roomName } = req.body;
            if (!roomName) {
                return res.status(400).json({ message: 'Room name is required' });
            }

            const code = generateCode();
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

            const newRoom = new Room({ code, roomName, expiresAt, users: [] });
            await newRoom.save();

            res.status(201).json(newRoom);
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ message: 'Error creating room', error });
        }
    }

    async getRoom(req, res) {
        try {
            const { code } = req.params;
            const room = await Room.findOne({ code });

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            if (checkExpiration(room)) {
                await Room.deleteOne({ code });
                return res.status(400).json({ message: 'Room has been deleted. Time has expired' });
            }

            const timeLeft = new Date(room.expiresAt) - new Date();
            setTimeout(async () => {
                await Room.deleteOne({ code });
                console.log(`Room ${code} has been deleted. Time has expired`);
            }, timeLeft);

            res.json({ code: room.code, expiresAt: room.expiresAt, users: room.users });
        } catch (error) {
            console.error('Error fetching room:', error);
            res.status(500).json({ message: 'Error fetching room' });
        }
    }

    async joinRoom(req, res) {
        try {
            const { code } = req.params;
            const { userId } = req.body;

            const room = await Room.findOne({ code });

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            if (!room.users.includes(userId)) {
                room.users.push(userId);
                await room.save();
            }

            res.json(room);
        } catch (error) {
            console.error('Error joining room:', error);
            res.status(500).json({ message: 'Error entering the room' });
        }
    }

    async leaveRoom(req, res) {
        try {
            const { code } = req.params;
            const { deviceId } = req.body;
    
            let room = await Room.findOne({ code });
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }
    
            room.users = room.users.filter(id => id !== deviceId);
            await room.save();
    
            // // If there are no users left, delete the room.
            // if (room.users.length === 0) {
            //     await Room.deleteOne({ code });
            //     return res.json({ message: 'The room has been removed because there is no one left in it.' });
            // }
    
            res.json({ message: 'User leaved the room' });
        } catch (error) {
            console.error('The error of leaving the room:', error);
            res.status(500).json({ message: 'The error of leaving the room' });
        }
    }

    async deleteRoom(req, res) {
        try {
            const { code } = req.params;
            const result = await Room.deleteOne({ code });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.json({ message: 'Room was deleted' });
        } catch (error) {
            console.error('Error deleting room:', error);
            res.status(500).json({ message: 'Error deleting room' });
        }
    }
}

module.exports = new RoomController();
