var request = require('superagent');
var parseString = require('xml2js').parseString;

exports.activityParser = function(username, date1, date2, callback) {

    var startDate = new Date(date1).getTime();
    var endDate = new Date(date2).setHours(23,59,59,999);
    //setHours(23,59,59,999);

    request
        .get('https://' + process.env.JIRA_USERNAME + ':' + process.env.JIRA_PSW + '@bluesombrero.atlassian.net/activity?streams=user+IS+' + username + '&streams=update-date+BETWEEN+'+ startDate + '+' + endDate)
        .buffer()
        .type('xml')
        .end(function (err, res) {

            if (err) {

                callback(err);

            } else {

                parseString(res.text, function (error, result) {

                    if (error) {

                        callback(error);

                    } else if (callback) {
                        
                        callback(result);
                    
                    } 
            
                });
           
            }
        
        });

};