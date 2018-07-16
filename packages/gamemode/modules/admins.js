var DB = require('./db');

var AdminsOnline = [];

var Admin = function(sqlID, name, see, blame, edit) {
    this.sqlID = sqlID;
    this.name = name;
    this.see = see;
    this.blame = blame;
    this.edit = edit;
    this.ID = FindEmptySlot();
}

function FindEmptySlot () {
    for ( var i = 0; i < global.MAX_PLAYERS; i++ ) {
        if ( !IsAdminLogged(i) ) return i;   
    }
}

module.exports.CreateAdminClass = function(sqlid, name, see, blame, edit) {
    var playa = new Admin(sqlid, name, see, blame, edit);
    AdminsOnline [ playa.ID ] = playa;
    
    return {
        id: playa.ID,
        see: see,
        blame: blame,
        edit: edit
    };
}

module.exports.DeleteAdminClass = function(id) {
    delete AdminsOnline[id];
}

module.exports.GetAdminIDBySQLID = function(sqlid) {
    for ( var i = 0; i < global.MAX_PLAYERS; i++ ) {
        if (  IsPlayerLogged(i) ) {
            if ( AdminsOnline [ i ].sqlID == sqlid ) return i;
        }
    }    
}

function IsAdminLogged(id) {
    return ( typeof AdminsOnline[id] !== 'undefined' );
}
        
module.exports.IsAdminLogged = IsAdminLogged;

module.exports.Init = function() {
    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_admins (
        id int(11) NOT NULL,
        name varchar(24) NOT NULL UNIQUE,
        upgraded timestamp NOT NULL,
        see int(3) NOT NULL,
        blame int(3) NOT NULL,
        edit int(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function() { } );
    DB.Handle.query("ALTER TABLE `server_admins` ADD PRIMARY KEY (`id`);", function() { } );
}
