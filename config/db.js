var mysql = require('mysql');

var environment = process.env.SM_ENV || local;

var dbConfig = {
    local: {
        connectionLimit: 100,
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'sombreroman',
        debug: false,
    },
    testing: {
        connectionLimit: 100,
        host: '',
        user: '',
        password: '',
        database: '',
        debug: false
    },
    production: {
        connectionLimit: 100,
        host: process.env.SM_PROD_HOST,
        user: process.env.SM_PROD_USER,
        password: process.env.SM_PROD_PASS,
        database: process.env.SM_PROD_DB,
        debug: false
    }
}

if (environment === 'local') {

    environment = dbConfig.local;

} else if (environment === 'testing') {

    environment = dbConfig.testing;

} else if (environment === 'production') {

    environment = dbConfig.production;

} else {

    console.log("You're not hitting a valid database");

}

console.log(environment.host);

var pool = mysql.createPool(environment);

var connection = function (callback) {

    pool.getConnection(function (err, connection) {

        // if(err) throw err;
        // pass the error to the cb instead of throwing it
        if (err) {
          
            return callback(err);

        }
        
        callback(null, connection);
    
    });

};

exports.connection = connection;