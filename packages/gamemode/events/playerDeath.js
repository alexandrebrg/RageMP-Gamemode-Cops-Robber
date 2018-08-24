const Players = require('../modules/players');

module.exports = {    
    'playerDeath': (player, reason, killer) => {
        Players.destroyBlip(player.ID); // Prevent server crash :D
        Players.updatePlayerWantedLevel(player.ID, 6, false);

        player.call("ShowShardMessage", ["~r~Wasted", "You died."]);
        player.call("playerDead");
        player.call("clearWantedLevel", [false]);
        
        player.robbery = {};

        player.health = 100;

        setTimeout(() => { mp.events.call("loadPlayerFactionSelection", player); }, 9000);
    },
}