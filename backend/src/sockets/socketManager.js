const socketIO = require('socket.io');

module.exports = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('User is connected:', socket.id);

        socket.on('joinRoom', (roomCode) => {
            socket.join(roomCode);
            console.log(`User ${socket.id} is connected to room ${roomCode}`);
        });

        socket.on('sendMessage', (data) => {
            io.to(data.roomCode).emit('receiveMessage', data);
        });

        socket.on('disconnect', () => {
            console.log('User is disconnected:', socket.id);
        })
    })
}