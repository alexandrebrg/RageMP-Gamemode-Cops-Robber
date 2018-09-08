const Factions = require('../modules/factions');
const Bizs = require('../modules/business');
const Players = require('../modules/players');
const Config = require('../data/config.json');
const PM = require('../messages/player.json')

module.exports = {

    "PlayerRobberyStart": (player, biz) => {
        if(Factions.isFactionCops(Players.getPlayerFaction(player.ID))) return player.notify(PM.PlayerIsCopRob);
        player.robbery.biz = biz;
        player.robbery.benefits = 100;
        bizType = Bizs.getBizType(biz);
        Bizs.setRobbed(biz);
        timeLeft = 0;
        player.call("setRewardBar", [player.robbery.benefits]);
        Players.notifyCops(PM.RobberyInProgress, player.position);
        if(bizType === 1) {
            timeLeft = Config.storeType1Time;
            player.call("setRobberyTimer", [timeLeft]);
            player.robbery.timeLeft = timeLeft;
            player.call("setWantedLevel", [Players.updatePlayerWantedLevel(player.ID, 1)]);
        } else if(bizType === 2) {
            timeLeft = Config.storeType2Time;
            player.call("setRobberyTimer", [timeLeft]);
            player.robbery.timeLeft = timeLeft;
            player.call("setWantedLevel", [Players.updatePlayerWantedLevel(player.ID, 2)]);
        }

        player.robbery.interval = setInterval(function() {
            timeLeft -= 1;
            mp.markers.forEachInRange(player.position, 10, (b) => {
                if(b.store && b.sqlid === player.robbery.biz) {
                    player.robbery.benefits = player.robbery.benefits + Math.floor(Math.random() * Config.storeCashPerSecond);
                    player.call("setRewardBar", [player.robbery.benefits]);
                } else {
                    clearInterval(player.robbery.interval);
                    mp.events.call("PlayerRobberyInterrupted", player);
                }
            });

            if(timeLeft === 0) { mp.events.call("PlayerRobberyDone", player); clearInterval(player.robbery.interval); }
        }, 1000); 
        
    },
    "PlayerRobberyInterrupted": (player) => {
        mp.events.call("sCashUpdate", player, player.robbery.benefits);
        player.call("InterruptRobberyTimer");
        player.notify(PM.RobberyInterrupted);
    },
    "PlayerRobberyDone": (player) => {
        mp.events.call("sCashUpdate", player, player.robbery.benefits);
        setTimeout(function() { player.call("clearRobberyTimers"); }, 5000);
        player.notify(PM.RobberyInterrupted);
    }
}