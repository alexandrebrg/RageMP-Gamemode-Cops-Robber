var Factions = require('../modules/factions');
var Bizs = require('../modules/business');
var Players = require('../modules/players')
var Logs  = require('../modules/logs');
var Config = require('../data/config.json');
var PM = require('../messages/player.json')

module.exports = {

    "PlayerRobberyStart": (player, biz) => {
        if(Factions.isFactionCops(Players.getPlayerFaction(player.ID))) return player.notify("~r~You can't rob, you are a cop!");
        player.robbery.biz = biz;
        player.robbery.benefits = 100;
        bizType = Bizs.getBizType(biz);
        Bizs.setRobbed(biz);
        timeLeft = 0;
        player.call("setRewardBar", [player.robbery.benefits]);
        Players.notifyCops("A robbery is in progress, need anybody here!", player.position);
        if(bizType == 1) {
            timeLeft = Config.storeType1Time;
            player.call("setRobberyTimer", [timeLeft]);
            player.robbery.timeLeft = timeLeft;
            player.call("setWantedLevel", [Players.updatePlayerWantedLevel(player.ID, 1)]);
        } else if(bizType == 2) {
            timeLeft = Config.storeType2Time;
            player.call("setRobberyTimer", [timeLeft]);
            player.robbery.timeLeft = timeLeft;
            player.call("setWantedLevel", [Players.updatePlayerWantedLevel(player.ID, 2)]);
        }

        player.robbery.interval = setInterval(function() {
            timeLeft -= 1;
            mp.markers.forEachInRange(player.position, 10, (b) => {
                if(b.store && b.sqlid == player.robbery.biz) {                    
                    player.robbery.benefits = player.robbery.benefits + Math.floor(Math.random() * Config.storeCashPerSecond);
                    player.call("setRewardBar", [player.robbery.benefits]);
                } else {
                    clearInterval(player.robbery.interval);
                    mp.events.call("PlayerRobberyInterrupted", player);
                }
            });

            if(timeLeft == 0) { mp.events.call("PlayerRobberyDone", player); clearInterval(player.robbery.interval); }
        }, 1000); 
        
    },
    "PlayerRobberyInterrupted": (player) => {
        mp.events.call("sCashUpdate", player, player.robbery.benefits);
        player.call("InterruptRobberyTimer");
        player.notify("Robbery interrupted");
    },
    "PlayerRobberyDone": (player) => {
        mp.events.call("sCashUpdate", player, player.robbery.benefits);
        setTimeout(function() { player.call("clearRobberyTimers"); }, 5000);
        player.notify("Robbery done");
    },


    'playerDeath': (player, reason, killer) => {
        Players.destroyBlip(player.ID);
        player.call("ShowShardMessage", ["~r~Wasted", "You died."]);
        player.call("playerDead");
    },
    "playerQuit" : (player, exitType, reason) => {
        console.log(`Player ${player.name} left, ${exitType}, reason: ${reason}`);
        Logs.Insert(`Player ${player.name} left the game (${exitType}), reason: ${reason}`);
        Players.SavePlayerClass(player.ID);
        Players.destroyBlip(player.ID);
        Players.DeletePlayerClass(player.ID);
    },

    //ACTIONS
    "sAction": (player, actionID, ...args) => {
        switch(actionID) {
            case 0:
                player.call("cATMOpen");
                break;
            case 1:
                mp.events.call("hackerATM", player, args[0]);
                break;
            case 2:
                mp.events.call("PlayerRobberyStart", player, parseInt(args[0]));
                break;
            case 3:
                if(parseInt(args[1]) < Players.getPlayerCash(player.ID)){
                    player.health += player.health >= 100 ? 0 : args[2];
                    mp.events.call("sCashUpdate", player, -args[1]);
                    player.notify(`You bought <C>${args[0]}</C>, for ~g~$${args[2]}.`);                    
                } else { player.notify(PM.NotEnoughCash)}
                break;
        }
    },

}