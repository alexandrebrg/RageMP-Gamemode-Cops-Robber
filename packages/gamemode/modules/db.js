var mysql = require('mysql');

module.exports = {
	Handle: null,
    Connect: function(callback) {
        this.Handle = mysql.createConnection({
            host     : 'localhost', 
            user     : 'root',
            password : '',
            database : 'gta5'
        });
        this.Handle.connect(function(e) {
            if ( !e ) { callback(); }
            else console.log ("Can't connect to database: \n" + e);
         });        
    }
};
