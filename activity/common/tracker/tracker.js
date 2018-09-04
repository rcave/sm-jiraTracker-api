var db = require('./../../../config/db');

var parseFeed = require('./../../../activity/common/activity.parser');
var dates = require('./../../common/dates');
var tackerBuilder = require('./tracker.builder');
var activity = require('./tracker.insert.activity');

var parsePending = true;
var usernameIndex = 0;

exports.logTrackedUsers = function (startDate, endDate , callback) {
    
    db.connection(function (err, con) {

        console.log('End of Day Schedule Launched');

        con.query('SELECT * FROM users WHERE tracked=1', 
        function(err, rows, fields){

            if (err) throw err;

            function parseLoop() {

                if (usernameIndex < rows.length) {

                    parseFeed.activityParser(rows[usernameIndex].jiraUsername, startDate, endDate, 
                    function(result) {

                        tackerBuilder.buildActivity(result, rows[usernameIndex].userId, rows[usernameIndex].jiraUsername, 
                        function(insertActivity) {

                            // call insert activity module to send insertActivity for user to db.
                            if (insertActivity) {

                                console.log(insertActivity.length);
                                activity.sendActivity(insertActivity, function(err) {


                                    if (err) throw err;

                                    usernameIndex++
                                    parseLoop();

                                });

                            } else {

                                usernameIndex++
                                parseLoop();

                            }

                        });

                    });

                } else {
                    
                    console.log("All users activity logged.");

                    // call the callback if needed
                    if (callback) {
                        callback();
                    }

                }
                
            }

            parseLoop();
            
        });

        con.release();
    
    });

};