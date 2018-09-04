exports.buildActivity = function (result, userId, jiraUsername, callback) {

    if (result.feed.entry) {

        var insertActivity = [];

        for (i = 0; i < result.feed.entry.length; i++) {

            // Check if worklog or extra information for activity is available
            //var ticketContent = 'test';

            let publishedDate = (function (){

                let initialDate = new Date(result.feed.entry[i].published[0]);
                console.log("initialDate: " + initialDate);
                let dateUpdate = new Date(initialDate.getTime()); //-(1* 60 * 60000));
                console.log('DATE UPDATE: ' + dateUpdate);
                let finalDate = dateUpdate.toDateString();
                console.log("Final Date: " + dateUpdate);

                return dateUpdate;

            }) (); 

            var ticketChanges = (function () {

                if (result.feed.entry[i].summary) {

                    return result.feed.entry[i].summary[0]._;

                } else if (result.feed.entry[i].content) {

                    return result.feed.entry[i].content[0]._

                } else {

                    return null;

                }

            }) ();

            var ticketLink = result.feed.entry[i].link[0].$.href.split("?", 1);

            var checkForWork = function() {
                
                var worklogs = result.feed.entry[i].title[0]._ + ticketChanges;
                var strippedLog1 = worklogs.split("ogged '");
                var splitLog = String(strippedLog1[1]);
                var finalSplit = splitLog.split("'");
                                            
                if (worklogs.indexOf("ogged") > 0) {

                    return finalSplit[0];

                } else {

                    return false

                }
                
            }();
            
            // insert to activity object specifically for this user/s feed 
            var userActivity = [
                userId, 
                jiraUsername, 
                ticketLink[0].slice(42),
                result.feed.entry[i].title[0]._, 
                ticketChanges,
                checkForWork,
                publishedDate
            ];

            // push userActivity to insertActivity array for db update
            insertActivity.push(userActivity);

        }

        callback(insertActivity);

    } else {
              
        console.log('No entries for ' + jiraUsername);

        callback();

    }

};