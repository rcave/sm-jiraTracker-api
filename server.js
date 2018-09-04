// BASE SETUP
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');

// Database
var db = require('./config/db.js');

// Load Activity Scheduler
var actvitiy = require('./activity/schedule/eod');

// Load Activity Scheduler
// Uncomment callback from /activity/common/tracker/tracker.js to run below
var previousActivity = require('./activity/schedule/activity.previous'); // UNCOMMENT TO RUN PREVIOUS ACTIVITY SCHEDULE
 
// Define app and configure
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

var port = process.env.PORT || 8000;

// ROUTER
var router = express.Router();

// ROUTES
// test route for /api
app.get('/', function(req, res) {

    res.status(200);
    res.send({
        "success": true,
        "message" : "WELCOME TO THE THUNDERDOME!"
    });

});

// dynamically include routes
fs.readdirSync('./server/features/').forEach(function (file) {
  
    var parent = file;

    fs.readdirSync('./server/features/' + parent + '/').forEach(function (file) {

        if(file.substr(-10) == '_routes.js') {
    
            route = require('./server/features/' + parent + '/' + file);
            route.controller(router);
            
        }

    });

});

// Configure app to run from /api when using router
app.use('/api', router);

app.listen(port);
console.log('Magic happens on port: ' + port);
