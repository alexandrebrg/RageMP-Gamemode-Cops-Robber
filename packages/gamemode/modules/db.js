const mysql = require('mysql');

module.exports = {
	Handle: null,
    Connect: function(callback) {
        this.Handle = mysql.createConnection({
            host     : process.env.DB_HOST, 
            user     : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_DATABASE
        });
        this.Handle.connect(function(e) {
            if ( !e ) { callback(); }
            else console.log ("Can't connect to database: \n" + e);
         });        
    }
};
