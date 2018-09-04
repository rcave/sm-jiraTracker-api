var tokenAuth = require('./../../middleware/token.auth');

exports.controller = function(router){

    // Load Models for musicians
    var auth = require('./authentication_models');

    // Set routes for musicians
    router.post('/register', auth.register);
    router.post('/login', auth.login);
    router.post('/authentication', tokenAuth, auth.status);

}
