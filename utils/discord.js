const r2 = require('r2');

module.exports = {
    
    /**
     * Gets the userID from a authorization code
     */
    getUserID: async authCode => {
        let user = await module.exports.getUser(authCode);
        console.log(user.id);
        return user.id;
    },

    getUser: async authCode => {
        try {
            return await r2('https://discord.com/api/users/@me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authCode}`
                }
            }).json;
        } catch (err) {
            console.error(err);
        }
    }
}