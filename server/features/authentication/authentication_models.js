var db = require('./../../../config/db');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var randomstring = require('randomstring');
var token = require('./../../token/token.gen.js');

exports.register = function(req, res) {

    // TODO: error handling when username, email and/or password are not sent in request

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var encryptedPassword = bcrypt.hashSync(password, 10);

    db.connection(function(err, con) {

        if (err) { 
        
            throw err 
    
        } else {
                
            con.query('SELECT * FROM users WHERE username=?', [username], 
            function(err, rows, fields) {

                if (err) {

                    throw err;

                } else if(rows.length > 0 ) {

                    res.status(409);
                    res.json({
                        "success": false,
                        "message": "Username is already taken, please enter a different username!"
                    });

                } else {

                    var randomSecret = randomstring.generate({
                        length: 12,
                        charset: 'alphabetic'
                    });

                    con.query('INSERT INTO users (username,email,password,secret) VALUES ("' + username + '","' + email + '","' + encryptedPassword + '","' + randomSecret + '")',
                    function (err, rows, fields) {

                        if (err) {

                            throw err;

                        } else {

                            res.status(200);
                            res.json({
                                "success": true,
                                "message": "Successful Registration"
                            });
                        }

                    });
                }

            });
    
        }

        con.release();

    });

};

exports.login = function(req, res) {

    // TODO: error handling when username and/or password are not sent in request

    var username = req.body.username;
    var password = req.body.password;

    db.connection(function(err, con) {

        con.query('SELECT * FROM users WHERE username=?',
        [username],
        function(err, rows, fields) {

            if (err) {

                throw err;

            } else if(rows.length > 0 ) {

                var newToken = token(username, rows[0].secret);
                var encryptedPassword = rows[0].password;
                var validPassword = bcrypt.compareSync(password, encryptedPassword); // true
                //console.log(validPassword);

                if (validPassword) {
                    res.status(200);
                    res.json({
                        "success": true,
                        "message": "Login Successful",
                        "userId": rows[0].userId,
                        "token": newToken
                    });

                } else {

                    res.status(409);
                    res.json({
                        "success": false,
                        "message": "Username or Password was incorrect, please try again."
                    });

                }

            } else {

                res.status(409);
                res.json({
                    "success": false,
                    "message": "Username or Password was incorrect, please try again."
                });

            }
        
        });

        con.release();

    });

};

exports.status = function(req, res) {

    res.status(200);
    res.json({
        "success": true,
        "message": "Valid Access Token"
    });
    
};
