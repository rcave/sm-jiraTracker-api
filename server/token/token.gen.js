var jwt = require('jsonwebtoken');

module.exports = function(userId, secret) {

    var claims = {
        sub: userId,
     	iss: 'SOMBREROMAN',
     	permissions: 'keystothekingdom'
    }

    var newToken =  jwt.sign(claims, secret, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    });

    return newToken;

};
