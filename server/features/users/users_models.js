var db = require('./../../../config/db');

exports.findAll = function(req, res) {

    db.connection(function (err, con) {

        if (err) {

            throw err;

        } else {

            con.query('SELECT userId, username, firstname, lastname, email, tracked FROM users',
            function(err, rows, fields) {

                if (err) {

                    throw err;

                } else {

                    res.status(200);
                    res.send(rows);

                }

            });

        }

        con.release();

    });

};

exports.findById = function(req, res) {

    db.connection(function (err, con) {

        if (err) {

            throw err;

        } else {

            con.query('SELECT userId, username, firstname, lastname, email, tracked FROM users WHERE userId=?',
            [req.params.userId],
            function(err, rows, fields) {

                if (err) {

                    throw err;

                } else {

                    res.status(200);
                    res.send(rows);

                }

            });

        }

        con.release();

    });

};

exports.findByUsername = function(req, res) {

    db.connection(function (err, con) {

        if (err) {

            throw err;

        } else {

            con.query('SELECT userId, username, firstname, lastname, email, tracked FROM users WHERE username=?',
            [req.params.username],
            function(err, rows, fields) {

                if (err) {

                    throw err;

                } else {

                    res.status(200);
                    res.send(rows);
                }

            });

        }

        con.release();

    });

};

exports.update = function(req, res) {

    db.connection(function (err, con) {

        if (err) {

            throw err;

        } else {

            con.query('SELECT firstname, lastname, email FROM users WHERE userId=?',
            [req.params.userId],
            function(err, rows, fields) {

                if (err) { 
                    
                    throw err 
                
                } else if (rows.length > 0) {
                    
                    var currInfo = rows[0];

                    var updateUser = {
                        firstname: req.query.firstname || currInfo.firstname,
                        lastname: req.query.lastname || currInfo.lastname,
                        email: req.query.email || currInfo.email, 
                    };

                    con.query('UPDATE users SET ? WHERE userId=?', [
                        updateUser,
                        req.params.userId
                    ],
                    function(err, rows, fields) {

                        if (err) {

                            throw err;

                        } else {

                            res.status(200);
                            res.send({
                                "success": true,
                                "message": "User updated successfully.",
                                "changedRows": rows.changedRows
                            });

                        }

                    });

                } else {

                    res.status(200);
                    res.send({
                        "success": false,
                        "message": "User does not exist."
                    });

                }

            });

        }

        con.release();

    });

};

exports.delete = function(req, res) {

    db.connection(function (err, con) {

        if (err) {

            throw err;

        } else {

            con.query('SELECT * FROM users WHERE userId=?', 
            [req.params.userId], 
            function(err, rows, fields) {

                if (err) {

                    throw err;

                } else if (rows.length > 0) {

                    if (req.headers['userid'] === req.params.userId) {

                        res.status(200);
                        res.send({
                            "success": false,
                            "message": "Current User cannot be deleted."
                        });

                    } else {
                    
                        con.query('DELETE FROM users WHERE userId=?',
                        [req.params.userId],
                        function(err, rows, fields) {

                            if (err) {
                                
                                throw err;

                            } else {

                                res.status(200);
                                res.send({
                                    "success": true,
                                    "message": "User has been deleted."
                                });

                            }

                        });

                    }

                } else {

                    res.status(200);
                    res.send({
                        "success": false,
                        "message": "User does not exist."
                    });

                }

            });

        }

        con.release();

    });

};

exports.toggleTracked = function(req,res) {
    
        db.connection(function (err, con) {
            
            if (err) {
    
                throw err;
    
            } else {
    
                con.query('SELECT tracked FROM users WHERE userId=?',
                [req.params.userId],
                function(err, rows, fields) {
    
                    if (err) { 
                        
                        throw err 
                    
                    } else if (rows.length > 0) {
                        
                        let updateUser;
                        var currentTracking = rows[0].tracked;
    
                        if (currentTracking === 0 ) {
    
                            updateUser = {
                                tracked: 1
                            }
    
                        } else if (currentTracking === 1) {
    
                            updateUser = {
                                tracked: 0
                            }
    
                        }
    
                        con.query('UPDATE users SET ? WHERE userId=?', [
                            updateUser,
                            req.params.userId
                        ],
                        function(err, rows, fields) {
    
                            if (err) {
    
                                throw err;
    
                            } else {
    
                                res.status(200);
                                res.send({
                                    "success": true,
                                    "message": function(){
                                        if (updateUser.tracked === 0) {
                                            return "User is no longer being tracked by the SombreroMan Jira Tracker."
                                        } else if (updateUser.tracked === 1) {
                                            return "User is now being tracked by the SombreroMan Jira Tracker."
                                        } else {
                                            return "D'oh, something went wrong!";
                                        }
                                    }(),
                                    "changedRows": rows.changedRows
                                });
    
                            }
    
                        });
    
                    } else {
    
                        res.status(200);
                        res.send({
                            "success": false,
                            "message": "User does not exist."
                        });
    
                    }
    
                });
    
            }
    
                con.release();
    
        });
    
    }