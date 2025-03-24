require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const socketManager = require('./sockets/socketManager');

// main express
const app = express();
const server = http.createServer(app);

// middlewares
app.use(cors());
app.use(express.json());

// routes
const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

// websockets
socketManager(server);

// connection to db
connectDB();
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`server started: ${PORT}`);
})