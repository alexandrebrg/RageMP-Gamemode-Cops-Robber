var DB = require('../modules/db');
var Players = require('../modules/players');
var Admins = require('../modules/admins');
var Factions = require('../modules/factions');


module.exports = {
    'loadPlayer' : player => {        

        DB.Handle.query(`SELECT * from server_admins WHERE id = ? LIMIT 1`, player.info.sqlid, function(e, resulte){ 
            player.outputChatBox("!{FF0000} You are connected as staff on this server!");
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
        player.spawn(new mp.Vector3(402.8664, -996.4108, -100.00027));
        player.heading = -185.0;
        player.dimension =  Math.floor(Math.random() * 1000);
        player.call('cFactionSelection', [Factions.getFactionData()]);

    }
}