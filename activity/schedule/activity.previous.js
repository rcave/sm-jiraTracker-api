var db = require('./../../config/db');
var dateLoop = 0;

function clearMemberActivity() {

    db.connection(function (err, con) {
        
        con.query('DELETE FROM member_activity',
        function (err, rows, fields) {

            if (err) {
                throw err;
                console.log("ERROR: Could not delete anything.");
            } else {

                console.log("cleared");

                con.query('select * from member_activity', function(err, rows, fields) {

                    if (err) {
                        throw err;
                        console.log("ERROR: Tried to pull from Member Activity after 'ClearMemberActivity' was executed");
                    }

                    if (rows.length <= 0) {

                        console.log("member_activty table cleared");

                    } else {

                        console.log("member_activity table still has records");

                    }

                });

            }

        });

        con.release();

    });

};

 clearMemberActivity();

function startDate() {

    var sd = new Date();
    sd.setDate(sd.getDate() - dateLoop);
    console.log("startDate: " + sd);
    var sYear = sd.getFullYear();
    var sMonth = sd.getMonth() + 1;
    var sDay = sd.getDate();
    return sYear + '.' + sMonth + '.' + sDay; 

};

function loop() {

    var tracker = require('./../common/tracker/tracker');

    if (dateLoop < 90) {

        tracker.logTrackedUsers(startDate(), startDate(), function(){

            delete require.cache[require.resolve('./../common/tracker/tracker.js')]
            dateLoop++;
            loop();

        });

    }

}

loop();


