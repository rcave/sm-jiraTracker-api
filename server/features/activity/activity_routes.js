var tokenAuth = require('./../../middleware/token.auth');

exports.controller = function(router){

    // Load Models for users
    var activity = require('./activity_models');

    // Set routes for users
    router.get('/activity/raw/:username/:startDate/:endDate', tokenAuth, activity.getFullFeed);
    router.get('/activity/feed/range/:username/:startDate/:endDate', tokenAuth, activity.getUserFeedRange);
    router.get('/activity/touched/:username/:startDate', tokenAuth, activity.getUserTouchedTickets);
    router.get('/activity/touched/range/:username/:startDate/:endDate', tokenAuth, activity.getUserTouchedTicketsRange);
    router.get('/activity/touched/first/range/:username/:startDate/:endDate', tokenAuth, activity.getUserTouchedFirstTicketsRange);
    router.get('/activity/totals/:username/:startDate/:endDate', tokenAuth, activity.getUserTicketTotal);
    router.get('/activity/worklog/:username/:startDate', tokenAuth, activity.getWorklog);

}
