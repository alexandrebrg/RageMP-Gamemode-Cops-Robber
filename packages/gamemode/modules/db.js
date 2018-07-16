var mysql = require('mysql');

module.exports = {
	Handle: null,
    Connect: function(callback) {
        this.Handle = mysql.createConnection({
            host     : 'localhost', //do not use ip address as a host, create a dns if your mysql server is not hosted on same server/machine as ragemp server
            user     : 'root',
            password : '',
            database : 'gta5'
        });
        this.Handle.connect(function(e) {
            if ( !e ) { callback(); }
            else console.log ("DATABASE ERROR" + e);
         });        
    }
};
