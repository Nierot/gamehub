const crypto = require('crypto');

module.exports = {

    generateGameCode: () => {
        return module.exports._generateRandomString(4);
    },

    generateUserID: () => {
        return module.exports._generateRandomString(20);
    },

    _generateRandomString: length => {
        return crypto.randomBytes(Math.round(length/2)).toString('hex');
    },
}