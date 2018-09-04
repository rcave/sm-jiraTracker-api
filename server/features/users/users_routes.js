var tokenAuth = require('./../../middleware/token.auth');

exports.controller = function(router){

    // Load Models for users
    var users = require('./users_models');

    // Set routes for users
    router.get('/users', tokenAuth, users.findAll);
    router.get('/users/userid=:userId', tokenAuth, users.findById);
    router.get('/users/username=:username', tokenAuth, users.findByUsername);
    router.put('/users/userid=:userId', tokenAuth, users.update);
    router.delete('/users/userid=:userId', tokenAuth, users.delete);

    // TODO: Add Admin middleware
    router.put('/users/tracked/userid=:userId', tokenAuth, users.toggleTracked);    

}
