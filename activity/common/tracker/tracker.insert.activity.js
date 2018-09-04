var db = require('./../../../config/db.js');

exports.sendActivity = function (activity, callback) {

    console.log('Activity Released')
    console.log('Activity: ' + activity);

    db.connection(function (err, con) {

        console.log('End of Day Schedule Launched');

        con.query('INSERT INTO member_activity (userId, jiraUsername, ticketId, ticketActivity, ticketChanges, worklog, published) VALUES ?',
        [activity], 
        function(err, rows, fields){

            if (err) callback(err);

            console.log('Rows Inserted: ' + rows);

            callback();

        });

        con.release();

    });

};