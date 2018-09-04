const CronJob = require('cron').CronJob;

// seconds minutes hours
let sendStandupsToQueue = new CronJob('00 27 10 * * 1-5', function () {

    var previousActivity = require('./activity/schedule/activity.previous');

    }, null,
    true,
    'America/New_York'
);