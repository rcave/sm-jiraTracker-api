var db = require('./../../../config/db');
var parseFeed = require('./../../../activity/common/activity.parser');

exports.getFullFeed = function (req, res) {

    parseFeed.activityParser(req.params.username, req.params.startDate, req.params.endDate, function(result){

        res.json(result);

    });
   
};

exports.getUserFeedRange = function (req, res) {

    db.connection(function (err, con) {

        function endDate(){

            if (req.params.endDate == req.params.startDate) {

                var originalEndDate = req.params.endDate;
                var splitEndDate = originalEndDate.split("-");

                var newED = new Date(splitEndDate[0], (splitEndDate[1] - 1), splitEndDate[2]);
                newED.setDate(newED.getDate() + 1);
                var eYear = newED.getFullYear();
                var eMonth = addZ(newED.getMonth() + 1);
                var eDay = addZ(newED.getDate());
                var endDateFinal = eYear + '-' + eMonth + '-' + eDay;

                return endDateFinal;

            } else {

                return req.params.endDate;

            }

        };

        con.query('SELECT * FROM member_activity WHERE jiraUsername=? AND published BETWEEN ? AND ?',
        [req.params.username, req.params.startDate, endDate()],
        function (err, rows, fields) {

            res.json({
                success: true,
                message: "Member Activity Retreived Successfully",
                total: rows.length,
                results: rows
            });

        });

        con.release();

    });
   
};

exports.getUserTicketTotal = function (req,res) {


    db.connection(function (err, con) {

        function endDate() {

            if (req.params.endDate == req.params.startDate) {

                var originalEndDate = req.params.endDate;
                var splitEndDate = originalEndDate.split("-");

                var newED = new Date(splitEndDate[0], (splitEndDate[1] - 1), splitEndDate[2]);
                newED.setDate(newED.getDate() + 1);
                var eYear = newED.getFullYear();
                var eMonth = addZ(newED.getMonth() + 1);
                var eDay = addZ(newED.getDate());
                var endDateFinal = eYear + '-' + eMonth + '-' + eDay;

                return endDateFinal;

            } else {

                return req.params.endDate;

            }

        };

        con.query('SELECT ticketId, published from member_activity where jiraUsername = ? and published BETWEEN ? and ?',
        [req.params.username, req.params.startDate, endDate()],
        function (err, rows, fields) {

            console.log(rows.length);
            
            if (rows.length > 0) {

                var finalTotal = [];
                var feedIndex = 0;
                var initialPush = true;


                function loop() {

                    var pushDescision = []

                    if (feedIndex < rows.length) {

                        var published = rows[feedIndex].published;
                        var splitPub = published.split("-");
                        var finalSplit = String(splitPub[0] + "-" + splitPub[1] + "-" + splitPub[2].split("T", 1));
                                            
                        var newResult = {
                            ticketId: rows[feedIndex].ticketId,
                            published: finalSplit
                        }

                        function checkResults(index){

                            if (finalTotal[index].ticketId == newResult.ticketId && finalTotal[index].published == newResult.published) {

                                return new Promise((resolve) => {
                                    pushDescision.push(1);
                                    resolve();
                                });

                            } else {

                                return new Promise((resolve) => {
                                    pushDescision.push(0);
                                    resolve();
                                });

                            }

                        }

                        if (initialPush) {

                            initialPush = false;
                            finalTotal.push(newResult);
                            feedIndex++;
                            loop();

                        } else {

                            let i;
                            let promises = [];

                            for (i = 0; i < finalTotal.length; i++){

                                promises.push(checkResults(i))
                                
                            }

                            Promise.all(promises)
                                .then(function(){

                                    if (pushDescision.indexOf(1) == -1) {


                                        finalTotal.push(newResult);
                                    
                                    }

                                    feedIndex++;
                                    loop();

                                });

                        }
                        
                    } else {

                        res.json({
                            success: true,
                            message: "member totals retrieved for specified total.",
                            total: finalTotal.length,
                            results: finalTotal
                        });

                    }

                }
                
                loop();

            } else {

                res.json({
                    success: false,
                    message: "member totals not retrieved for specified total.",
                    total: 0
                });

            }
                                            
        });

        con.release();

    });

};

exports.getUserTouchedTickets = function (req,res) {

        db.connection(function (err, con) {

        function endDate(){


            var originalEndDate = req.params.startDate;
            var splitEndDate = originalEndDate.split("-");

            var newED = new Date(splitEndDate[0], (splitEndDate[1] - 1), splitEndDate[2]);
            newED.setDate(newED.getDate() + 1);
            var eYear = newED.getFullYear();
            var eMonth = addZ(newED.getMonth() + 1);
            var eDay = addZ(newED.getDate());
            var endDateFinal = eYear + '-' + eMonth + '-' + eDay;

            return endDateFinal;

        };

        con.query('SELECT ticketId from member_activity where jiraUsername = ? and published BETWEEN ? and ? GROUP BY (ticketId)',
        [req.params.username, req.params.startDate, endDate()],
        function (err, rows, fields) {
            if (rows.length > 0) {

                res.json({
                    success: true,
                    message: "Member Activity Retreived Successfully.",
                    totalTickets: rows.length,
                    touchedTickets: rows,
                    endDate: endDate()
                });

            } else {

                res.json({
                    success: true,
                    message: "No Member Activity Retrieved for specified Range.",
                    endDate: endDate()
                });

            }
        });

        con.release();

    });

};

exports.getUserTouchedTicketsRange = function (req,res) {

    db.connection(function (err, con) {

        function endDate(){

            if (req.params.endDate == req.params.startDate) {

                var originalEndDate = req.params.endDate;
                var splitEndDate = originalEndDate.split("-");

                var newED = new Date(splitEndDate[0], (splitEndDate[1] - 1), splitEndDate[2]);
                newED.setDate(newED.getDate() + 1);
                var eYear = newED.getFullYear();
                var eMonth = addZ(newED.getMonth() + 1);
                var eDay = addZ(newED.getDate());
                var endDateFinal = eYear + '-' + eMonth + '-' + eDay;

                return endDateFinal;

            } else {

                return req.params.endDate;

            }

        };

        con.query('SELECT ticketId from member_activity where jiraUsername = ? and published BETWEEN ? and ? GROUP BY (ticketId)',
        [req.params.username, req.params.startDate, endDate()],
        function (err, rows, fields) {
            
            if (rows.length > 0) {

                res.json({
                    success: true,
                    message: "Member Activity Retreived Successfully.",
                    totalTickets: rows.length,
                    touchedTickets: rows,
                    endDate: endDate()
                });

            } else {

                res.json({
                    success: true,
                    message: "No Member Activity Retrieved for specified Range."
                });

            }

        });

        con.release();

    });

};

exports.getUserTouchedFirstTicketsRange = function (req,res) {

    db.connection(function (err, con) {
        
                function endDate(){
        
                    if (req.params.endDate == req.params.startDate) {
        
                        var originalEndDate = req.params.endDate;
                        var splitEndDate = originalEndDate.split("-");
        
                        var newED = new Date(splitEndDate[0], (splitEndDate[1] - 1), splitEndDate[2]);
                        newED.setDate(newED.getDate() + 1);
                        var eYear = newED.getFullYear();
                        var eMonth = addZ(newED.getMonth() + 1);
                        var eDay = addZ(newED.getDate());
                        var endDateFinal = eYear + '-' + eMonth + '-' + eDay;
        
                        return endDateFinal;
        
                    } else {
        
                        return req.params.endDate;
        
                    }
        
                };
        
                con.query('SELECT ticketId, published from member_activity where jiraUsername = ? and published BETWEEN ? and ? GROUP BY (ticketId) ORDER BY published ASC',
                [req.params.username, req.params.startDate, endDate()],
                function (err, rows, fields) {
                    
                    if (rows.length > 0) {
        
                        res.json({
                            success: true,
                            message: "Member Activity Retreived Successfully.",
                            totalTickets: rows.length,
                            touchedTickets: rows,
                            endDate: endDate()
                        });
        
                    } else {
        
                        res.json({
                            success: true,
                            message: "No Member Activity Retrieved for specified Range."
                        });
        
                    }
        
                });
        
                con.release();
        
            });

};

exports.getWorklog = function (req, res) {

    db.connection(function (err, con){

        function endDate(){


            var originalEndDate = req.params.startDate;
            var splitEndDate = originalEndDate.split("-");

            var newED = new Date(splitEndDate[0], (splitEndDate[1] - 1), splitEndDate[2]);
            newED.setDate(newED.getDate() + 1);
            var eYear = newED.getFullYear();
            var eMonth = addZ(newED.getMonth() + 1);
            var eDay = addZ(newED.getDate());
            var endDateFinal = eYear + '-' + eMonth + '-' + eDay;

            return endDateFinal;

        };

        con.query('SELECT jiraUsername, ticketId, worklog, published FROM member_activity WHERE jiraUsername=? AND worklog > 0 AND published BETWEEN ? AND ? ORDER BY published DESC',
        [req.params.username, req.params.startDate, endDate()],
        function (err, rows, fields) {

            if (rows.length > 0) {

                res.json({
                    success: true,
                    message: "Work Log Compiled.",
                    total: rows.length,
                    work: rows
                });

            } else {

                res.json({
                    success: true,
                    message: "No Member Activity Retrieved for specified Range."
                });

            }

        });

        con.release();

    });

};

// Fixing Dates
function addZ(n){return n<10? '0'+n:''+n;}