const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/create', (req, res) => roomController.createRoom(req, res));
router.get('/:code', (req, res) => roomController.getRoom(req, res));
router.post('/:code/join', (req, res) => roomController.joinRoom(req, res));
router.post('/:code/leave', (req, res) => roomController.leaveRoom(req, res));
router.delete('/:code', (req, res) => roomController.deleteRoom(req, res));

module.exports = router;
