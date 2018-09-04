var db = require('./../../config/db.js');
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

    console.log('Multipass inserted for authorization.');
   
        // Initialize
        var token = req.headers['x-access-token'];
        var userId = req.headers['userid'];

        // decode token
        if (token) {

            if (userId) {

                db.connection(function (err, con) {

                    if (err) {

                        throw err;

                    } else {
                        
                        con.query('SELECT * FROM users WHERE userId="' + userId + '"',
                        function(err, rows, fields) {

                            if (err) {

                                throw err;

                            } else {

                                if (rows[0].secret) {

                                    // verifies secret and checks exp
                                    jwt.verify(token, rows[0].secret, function(err, decoded) {
                                    if (err) {
                                        return res.json({ success: false, message: 'Failed to authenticate token.' });
                                    } else {
                                        // if everything is good, save to request for use in other routes
                                        req.decoded = decoded;
                                        next();
                                    }
                                    });

                                } else {

                                    // if there is no token
                                    // return an error
                                    return res.status(403).send({
                                        success: false,
                                        message: 'No token or invalid token was provided.'
                                    });

                                }

                            }

                            con.release();

                        });

                    }

                });

            } else {

                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });

            }

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token or invalid token was provided.'
            });

        }

};
