const DB = require('./db');

let Factions = [];

function loadFactions() {
    Factions[0] = {};
    DB.Handle.query(`Select * FROM server_factions`, function(e, result) {
        if(e) return console.log(e);
        result.forEach(function(fac) {
            Factions[fac['id']] = fac;
            Factions[fac['id']]['pos'] = [];
            DB.Handle.query(`SELECT * FROM server_spawnpoints WHERE faction_id = ?`, fac['id'], function(e, pos) {
                if(e) return console.log(e);
                pos.forEach(function(p) {
                    Factions[fac['id']]['pos'].push(p);
                });
            });
            Factions[fac['id']]['peds'] = [];
            DB.Handle.query(`SELECT * FROM server_peds WHERE faction_id = ?`, fac['id'], function(e, ped) {
                if(e) return console.log(e);
                ped.forEach(function(p) {
                    Factions[fac['id']]['peds'].push(p);
                });
                
            });
            
        });
    });
}

module.exports.createSpawnPoint = function(posx, posy, posz, angle, faction_id) {
    if(!Factions[faction_id]) return false;
    DB.Handle.query(`INSERT INTO server_spawnpoints(posx, posy, posz, angle, faction_id) VALUES (?,?,?,?,?)`, [posx, posy, posz, angle, faction_id], function(e) {
        if(e) return console.log(e);
    });
    return true;
};

module.exports.createFaction = function(name, restricted = 0, leader, desc, cop) {
    DB.Handle.query(`INSERT INTO server_factions VALUES ("", ?, ?, ?, ?, ?)`, [name, parseInt(restricted), leader, desc, cop], function(e) {
        if(e) return console.log(e);
        loadFactions();
        return true;
    });
};

module.exports.createPed = function(faction, hash, name) {
    DB.Handle.query(`INSERT INTO server_peds(hash, name, faction_id) VALUES (?,?,?)`, [parseInt(hash), name, parseInt(faction)], function(e) {
        if(e) return console.log(e);
        loadFactions();
        return true;
    });
};

module.exports.isFactionCops = function(id) {
    return !!(Factions[id]['cop']);
};

module.exports.randomSpawn = function(faction_id) {
    return Factions[faction_id]['pos'][Math.floor(Math.random() * (Factions[faction_id]['pos'].length))];
};

module.exports.isFactionRestricted = function(id) {
    return (Factions[id]['restricted'] === 1);
};

module.exports.getFactionData = function() {
    return Factions;
};

module.exports.isFactionIDCorrect = function(id) {    
    return ( typeof Factions[id] !== 'undefined' );
};

module.exports.getFactionName = function(id) {
    return Factions[id]['name'];
};


module.exports.Init =  function() {
    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_factions (
        id int(11) NOT NULL,
        name varchar(24) NOT NULL UNIQUE,
        restricted int NOT NULL DEFAULT 0,
        leader varchar(128) NOT NULL DEFAULT 'NoOne',
        \`desc\` varchar(128) NOT NULL DEFAULT 'A new gang is in town baby',
        cop int(11) NOT NULL DEFAULT 0,
        default_car varchar(54) NOT NULL DEFAULT 'exemplar'
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function() { } );
    DB.Handle.query("ALTER TABLE `server_factions` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_factions` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );

    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_spawnpoints (
        id int(11) NOT NULL,
        posx float NOT NULL,
        posy float NOT NULL,
        posz float NOT NULL,
        angle float NOT NULL,
        faction_id int(11) NOT NULL,
        dimension INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function() { } );
    DB.Handle.query("ALTER TABLE `server_spawnpoints` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_spawnpoints` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );

    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_peds (
        id int(11) NOT NULL,
        hash int NOT NULL,
        name varchar(24) NOT NULL,
        faction_id int NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1`);
    DB.Handle.query("ALTER TABLE `server_peds` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_peds` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );

    loadFactions();
};
