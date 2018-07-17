var DB = require('./db');
var Factions = require('./factions');
var Config = require('../data/config.json');
var Labels = require('../modules/labels')

var PlayersOnline = [];

var Player = function(sqlID, name, email, spenttime, access, cash, bank, wantedlevel, hacker) {

    this.sqlID = sqlID;
    this.name = name;
    this.email = email;
    this.spenttime = spenttime;
    this.access = access;
    this.cash = cash;
    this.bank = bank;
    this.wantedlevel = wantedlevel;
    this.hacker = hacker;
    

    this.blip = false;
    this.job = null;
    this.cuffed = false;
    this.ID = FindEmptySlot();
    this.jail = null;
    this.faction = 0;
}

function FindEmptySlot () {
    for ( var i = 0; i < global.MAX_PLAYERS; i++ ) {
        if ( !IsPlayerLogged(i) ) return i;   
    }
}
/**
 * 
 * @param {int} id Player ID
 */
module.exports.isPlayerJailed = function(id) {
    return (PlayersOnline[id].jail > 0) ? true : false;
}
/**
 * 
 * @param {int} id Player ID
 * @param {int} time Time in jail left
 */
module.exports.setJailTime = function(id, time) {
    return PlayersOnline[id].jail = time;
}
/**
 * For timers
 * @param {int} id Player ID 
 */
module.exports.decreaseJailTime = function(id) {
    return PlayersOnline[id].jail -= 1;
}
/**
 * Return player name
 * @param {int} id Player id
 */
module.exports.getPlayerName = function(id) {
    return PlayersOnline[id].name;
}
/**
 * Return if blip exist
 * @param {int} id player ID
 */
module.exports.playerBlipExist = function(id) {
    return typeof PlayersOnline[id].blip != "undefined";
}
/**
 * Is player cuffed
 * @param {int} id player id
 */
module.exports.isPlayerCuffed = function(id) {
    return PlayersOnline[id].cuffed;
}
/**
 * Change player cuff
 * @param {int} id Player id
 * @param {boolean} toggle Player cuff state
 */
module.exports.setPlayerCuff = function(id, toggle) {    
    return PlayersOnline[id].cuffed = toggle;
}
/**
 * Create blip for player
 * @param {int} id player id
 */
module.exports.setPlayerBlips = function (id) {
    blip = PlayersOnline[id];
    icon = (blip.faction == 2) ? 60 : 1;
    blip.blip = mp.blips.new(icon, new mp.Vector3(0,0,0));
	blip.blip.name = blip.name;
    blip.blip.dimension = Config.defaultDimension;

    blip.blip.color = getBlipColor(id);
}

function getBlipColor(id) {
    blip = PlayersOnline[id];
    let color = 0;
    if(blip.faction == 1) {
        if(blip.wantedlevel == 0) color = 4;
        if(blip.wantedlevel == 1) color = 46;
        if(blip.wantedlevel > 1 && blip.wantedlevel < 4) color = 81;
        if(blip.wantedlevel >= 4) color = 1;
    } else if(Factions.isFactionCops(blip.faction) && blip.faction !== 4) {
        color = 63;
    } else if(Factions.isFactionCops(blip.faction) && blip.faction == 4) {
        color = 83;
    }
    return color;

}
/**
 * Destroy blip (Called when dead for example)
 * @param {int} id player id
 */
module.exports.destroyBlip = function(id) {
    PlayersOnline[id].blip.destroy();
    PlayersOnline[id].blip = false;
}
/**
 * Update blip !
 * @param {int} id player id
 * @param {Vector3} position Player position
 */
module.exports.updateBlipPosition = function(id, position) {
    blip = PlayersOnline[id];
    blip.blip.color = getBlipColor(id);
    blip.blip.position = position;
} 
/**
 * Update player wanted level
 * @param {int} id Player id
 * @param {int} level Level added
 * @param {boolean} positiv If added or subtracted
 */
module.exports.updatePlayerWantedLevel = function(id, level, positiv = true) {
    if(positiv) {
        PlayersOnline[id].wantedlevel += (PlayersOnline[id].wantedlevel +level > 6) ? 6 : level;
    } else {
        PlayersOnline[id].wantedlevel -= (PlayersOnline[id].wantedlevel - level < 0) ? PlayersOnline[id].wantedlevel : level;        
    }
    return PlayersOnline[id].wantedlevel;
}
/**
 * Return player wanted level
 * @param {int} id player id
 */
module.exports.getPlayerWantedLevel = function(id ) {
    return PlayersOnline[id].wantedlevel;
}
/**
 * Return if player have access
 * @param {int} id player id
 * @param {int} faction_id Faction id
 */
module.exports.PlayerHaveAccess = function(id, faction_id) {
    for(var i=0;i<PlayersOnline[id].access.length;i++) {
        if(PlayersOnline[id].access[i].faction_id == faction_id) return true;
    } 
    return false;
}
/**
 * Return player cash
 * @param {int} id player id
 */
module.exports.getPlayerCash = function(id) {
    return PlayersOnline[id].cash;
}
/**
 * Return player faction ID
 * @param {int} id player id
 */
module.exports.getPlayerFaction = function(id) {
    return PlayersOnline[id].faction;
}
/**
 * Return player bank account 
 * @param {int} id player id
 */
module.exports.getPlayerBank = function(id) {
    return PlayersOnline[id].bank;
}
/**
 * Return player job ID
 * @param {int} id player id
 */
module.exports.getPlayerJob = function(id) {
    return PlayersOnline[id].job;
}
/**
 * Deposit money in bank (Check if cash is good also for doing this)
 * @param {int} id Player id
 * @param {int} money Value added / substracted
 */
module.exports.depositBank = function(id, money) {
    if(PlayersOnline[id].cash < money) return false;
    updatePlayerBank(id, money);
    updatePlayerCash(id, -money);
    return true;
}
/**
 * Get money from bank (Check if can do it also)
 * @param {int} id player id
 * @param {int} money value added / substracted
 */
module.exports.withdrawBank = function(id, money) {
    if(PlayersOnline[id].bank < money) return false;
    updatePlayerBank(id, -money);
    updatePlayerCash(id, money);
    return true;
}
/**
 * Add money to player bank (Not SET)
 * @param {int} id player id
 * @param {int} money Value of money
 */
function updatePlayerBank(id, money) {
    PlayersOnline[id].bank += money;
    return PlayersOnline[id].bank;
}
module.exports.updatePlayerBank = updatePlayerBank;

/**
 * Add money to player cash (NOT SET)
 * @param {int} id player id
 * @param {int} money Value
 */
function updatePlayerCash(id, money) {
    PlayersOnline[id].cash += money;
    return PlayersOnline[id].cash;
    
}
module.exports.updatePlayerCash = updatePlayerCash;
/**
 * Set player faction by ID
 * @param {int} id player id
 * @param {int} faction_id Faction ID
 */
module.exports.setPlayerFaction = function(id, faction_id) {
    return PlayersOnline[id].faction = faction_id;
}
/**
 * Set player job by id
 * @param {int} id player id
 * @param {int} job JOB ID
 */
module.exports.setPlayerJob = function(id, job) {
    return PlayersOnline[id].job = job;
}
/**
 * Get SQL field by job id
 * @param {int} id Player id
 */
function getPlayerJobField(id) {
    switch(PlayersOnline[id].job) {
        case 0:
            return "hacker";
    }
}

module.exports.getPlayerJobField = getPlayerJobField;
/**
 * Return player XP
 * @param {int} id player ID
 */
module.exports.getPlayerXP = function(id) {
    return PlayersOnline[id][getPlayerJobField(id)];
}
/**
 * Add xp to player NOT SET
 * @param {int} id player id
 * @param {int} xp XP Amount
 */
module.exports.changeXP = function(id, xp) {
    return PlayersOnline[id][getPlayerJobField(id)] += xp;

}
/**
 * SET XP to player data job
 * @param {int} id player id
 * @param {int} xp xp amount
 */
module.exports.setXP = function(id, xp) {
    return PlayersOnline[id][getPlayerJobField(id)] = xp;
}
/**
 * Update player spent time to all players
 */
module.exports.updateSpentTime = function() {

    for(var i=0; i<mp.players.length;i++) {
        if(IsPlayerLogged(mp.players[i].ID)) {
            PlayersOnline[ mp.players[i].ID ].spenttime += 1;
        }
    }
    return PlayersOnline.length;
}
/**
 * Send chat message to cops
 * @param {string} message Message
 */
module.exports.sendMessageToCops = function(message) {
    PlayersOnline.forEach(e => {
        if(e.faction == 2) {
            mp.players[player.ID].outputChatBox(message); 
        }
    });
}
/**
 * Notify Cops & create position of action
 * @param {string} message Notify string
 * @param {Vector3} position Player position
 */
module.exports.notifyCops = function(message, position) {
    mp.players.forEach( (player, id) => {
        if(player.faction == 2) {
            mp.players[player.ID].call("CopActionPosition", [position]);
            mp.players[player.ID].notifyWithPicture("Emergency!", "Police Center", message + "~n~~b~Press M to go there !", "CHAR_CALL911", 0, false, 6, -1) 
            mp.players[player.ID].call("playSound", ["CHALLENGE_UNLOCKED", "HUD_AWARDS"]);
        }
    });
}
/**
 * Create notification for all players
 * @param {string} message Notification message
 * @param {string} char Image of the notification by default CHAR _CALL911
 * @param {string} title Title of notification by default ""
 * @param {string} desc Desc of notification by default "" 
 */
module.exports.notifyAllPlayers = function(message, char = "CHAR_CALL911", title= "", desc = "") {
    mp.players.forEach( (player, id) => {
        mp.players[player.ID].notifyWithPicture(title, desc, message, char, 0, false, 0, 18) 
    });
}
/**
 * Create player class
 * @param {int} sqlid Player SQL ID
 * @param {string} name Player Name
 * @param {string} email  Player email
 */
module.exports.CreatePlayerClass = function(sqlid, name, email) {
    DB.Handle.query(`SELECT * from server_players WHERE id = ${sqlid}`, function(e, result){
        if(e) return console.log(e);
        result = result[0];
        var playa = new Player(sqlid, name, email, result['spenttime'], [], result['cash'], result['bank'], result['wantedlevel'], result['hacker']);
        PlayersOnline [ playa.ID ] = playa;
        mp.players[playa.ID].ID = playa.ID;
        SetPlayerAccess(playa.ID);
    });
}
/**
 * From sql id get player access
 * @param {int} id SQL ID
 */
module.exports.SetPlayerAccess = function(id) {
    DB.Handle.query(`SELECT * from server_access WHERE player_id = ? `, PlayersOnline[id].sqlid, function(e, result) {  
        if(result[0]) {
            PlayersOnline[id].access = result;
        } else { PlayersOnline[id].access = []; }
    });
}

module.exports.UpdatePlayerClass = function() {

}
/**
 * Save player datas
 * @param {int} id Player ID
 */
function SavePlayerClass(id) {
    query = `UPDATE server_players SET `;
    for(var key in PlayersOnline[id]) {
        i = PlayersOnline[id];
        if(Array.isArray(key) || ["sqlID", "faction", "access", "ID", "blip", "job", "cuffed"].indexOf(key) != -1) continue;
        query += `${key} = `;
        query += (typeof i[key] == "number") ? i[key] : `"${i[key]}"`;
        query += ","
    }
    query = query.substring(0, query.length - 1);
    query += ` WHERE id = ${PlayersOnline[id].sqlID}`;
    DB.Handle.query(query, function(e) {
        if(e) return console.log(e);
        return true;
    });
}
module.exports.SavePlayerClass = SavePlayerClass;

/**
 * Save all players class
 */
module.exports.SaveAllPlayersClass = function() {
    for(var i = 0; i < PlayersOnline.length; i++) {
        SavePlayerClass(i);
    }
}
/**
 * Delete player class when disconnected
 * @param {int} id player id
 */
module.exports.DeletePlayerClass = function(id) {
    delete PlayersOnline[id];
}
/**
 * Return class iD from sqlid
 * @param {int} sqlid Player sql id
 */
module.exports.GetPlayerIDBySQLID = function(sqlid) {
    for ( var i = 0; i < global.MAX_PLAYERS; i++ ) {
        if (  IsPlayerLogged(i) ) {
            if ( PlayersOnline [ i ].sqlID == sqlid ) return i;
        }
    }    
}
/**
 * Is player logged & registered
 * @param {int} id player id
 */
function IsPlayerLogged(id) {
    return ( typeof PlayersOnline[id] !== 'undefined' );
}
        
module.exports.IsPlayerLogged = IsPlayerLogged;

module.exports.Init = function() {
    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_players (
        id int(11) NOT NULL,
        name varchar(24) NOT NULL UNIQUE,
        email varchar(156) NOT NULL UNIQUE,
        password varchar(128) NOT NULL,
        spenttime int NOT NULL DEFAULT 0,
        cash bigint NOT NULL DEFAULT 10000,
        bank bigint NOT NULL DEFAULT 10000,
        wantedlevel int NOT NULL DEFAULT 0,
        jail INT NOT NULL DEFAULT 0,
        hacker int NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function() { } );
    DB.Handle.query("ALTER TABLE `server_players` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_players` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );

    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_access (
        player_id int NOT NULL,
        faction_id int NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function(){ });

    // MARKER ARREST LSPD 

    for(var key in Config.Arrests){
        ap = Config.Arrests[key];
        marker = mp.markers.new(1, new mp.Vector3(ap.Position.x , ap.Position.y,ap.Position.z-1), 3, {
            color: [15,0,255, 125],
            dimension: Config.defaultDimension
        });
        marker.arrest = true;
        blip = mp.blips.new(188, new mp.Vector3(ap.Position.x , ap.Position.y,ap.Position.z), {
            dimension: Config.defaultDimension,
            color: 1,
            name: "Arrest Point"
        });
        Labels.createLabelOffline("Press ~b~Y~w~ to arrest any ~r~cuffed~w~ player", new mp.Vector3(ap.Position.x , ap.Position.y,ap.Position.z), Config.defaultDimension);
    }

    // VEHICLE LS CUSTOM MARKER
    for(var key in Config.Customs){
        custom = Config.Customs[key];
        marker = mp.markers.new(1, new mp.Vector3(custom.Position.x, custom.Position.y, custom.Position.z -1), 3, {
            color: [15,0,255, 125],
            dimension: Config.defaultDimension
        });
        marker.custom = true;
        marker.customID = parseInt(key);
        blip = mp.blips.new(72, new mp.Vector3(custom.Position.x, custom.Position.y, custom.Position.z ), {
            dimension: Config.defaultDimension,
            color: 4,
            name: "Vehicle Custom"
        });
        Labels.createLabelOffline("Press ~b~Y~w~ to enter in the ~p~Custom", new mp.Vector3(custom.Position.x, custom.Position.y, custom.Position.z ), Config.defaultDimension);
    };

    for(var key in Config.CarShop) {
        if(typeof Config.CarShop[key].Position == "undefined") continue;
        carshop = Config.CarShop[key];
        marker = mp.markers.new(1, new mp.Vector3(carshop.Marker.x, carshop.Marker.y, carshop.Marker.z -1), 3, {
            color: [15,0,255, 125],
            dimension: Config.defaultDimension
        });
        marker.carShop = true;
        marker.carShopType = key;
        blip = mp.blips.new(carshop.Blip, new mp.Vector3(carshop.Marker.x, carshop.Marker.y, carshop.Marker.z ), {
            dimension: Config.defaultDimension,
            color: 4,
            name: carshop.Name
        });
        Labels.createLabelOffline("Press ~b~Y~w~ to enter in the ~p~Shop", new mp.Vector3(carshop.Marker.x, carshop.Marker.y, carshop.Marker.z ), Config.defaultDimension);
    
    }
  
}
