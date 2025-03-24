module.exports = function checkExpiration(room) {
    return new Date() > new Date(room.expiresAt);
};