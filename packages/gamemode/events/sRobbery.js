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
        player.call("setRewardBar", [player.robbery.benefits]);
        Players.notifyCops(PM.RobberyInProgress, player.position);

        let timeLeft = Config.storeType[parseInt(bizType)].timeLeft;
        let wantedlevel = Config.storeType[parseInt(bizType)].wantedlevel;
        player.call("setRobberyTimer", [timeLeft]);
        player.robbery.timeLeft = timeLeft;
        player.call("setWantedLevel", [Players.updatePlayerWantedLevel(player.ID, wantedlevel)];)

        player.robbery.interval = setInterval(function() {
            timeLeft -= 1;
            player.robbery.benefits = player.robbery.benefits + Math.floor(Math.random() * Config.storeCashPerSecond);
            player.call("setRewardBar", [player.robbery.benefits]);

            if(timeLeft === 0) { mp.events.call("PlayerRobberyDone", player); clearInterval(player.robbery.interval); }
        }, 1000); 
        
    },
    "PlayerRobberyInterrupted": (player) => {
        mp.events.call("sCashUpdate", player, player.robbery.benefits);
        player.call("InterruptRobberyTimer");
        player.notify(PM.RobberyInterrupted);
    },
    "PlayerRobberyDone": (player) => {
        clearInterval(player.robbery.interval)
        mp.events.call("sCashUpdate", player, player.robbery.benefits);
        setTimeout(function() { player.call("clearRobberyTimers"); }, 5000);
        player.notify(PM.RobberyDone);
    },
    "playerExitColshape": (player, shape) => {
        if(player.robbery.timeLeft === "undefined")
            return;
        if(player.robbery.timeLeft > 0)
            return mp.events.call("PlayerRobberyInterrupted", player);
    }
}