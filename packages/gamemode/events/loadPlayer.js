const DB = require('../modules/db');
const Players = require('../modules/players');
const Admins = require('../modules/admins');
const Factions = require('../modules/factions');
const PM = require('../messages/player.json');


module.exports = {
    'loadPlayer' : player => {        

        DB.Handle.query(`SELECT * from server_admins WHERE id = ? LIMIT 1`, player.info.sqlid, function(e, resulte){ 
            player.outputChatBox(PM.ConnectedAsStaff);
            player.adminID = Admins.CreateAdminClass(player.info.sqlid, player.name, resulte[0]["see"], resulte[0]["blame"], resulte[0]["edit"]);
        });   
        
        Players.CreatePlayerClass(player.info.sqlid, player.name, player.info.email);

        // NOTIFICATIONS SYSTEM

        player.notify = function(message, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
            this.call("BN_Show", [message, flashing, textColor, bgColor, flashColor]);
        };
    
        player.notifyWithPicture = function(title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
            this.call("BN_ShowWithPicture", [title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor]);
        };

        mp.events.call("loadPlayerFactionSelection", player);
    },
    "loadPlayerFactionSelection": player => {
        player.spawn(new mp.Vector3(1198, 3114, 40.4));
        player.heading = 281.0829;
        player.dimension = Math.floor(Math.random() * 1000);
        player.call('cFactionSelection', [Factions.getFactionData()]);

    }
};