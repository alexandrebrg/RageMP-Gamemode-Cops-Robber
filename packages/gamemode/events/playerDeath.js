const Players = require('../modules/players');
const PM = require('../messages/player.json');

module.exports = {    
    'playerDeath': (player, reason, killer) => {
        Players.destroyBlip(player.ID); // Prevent server crash :D
        Players.updatePlayerWantedLevel(player.ID, 6, false);

        player.call("ShowShardMessage", [PM.PlayerDead.title, PM.PlayerDead.text]);
        player.call("playerDead");
        player.call("clearWantedLevel", [false]);
        
        player.robbery = {};

        player.health = 100;

        setTimeout(() => { mp.events.call("loadPlayerFactionSelection", player); }, 9000);
    },
}