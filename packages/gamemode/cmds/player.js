var Players = require('../modules/players');
var PM = require('../messages/player.json')

module.exports = {
    "suicide": (player) => {
        if(Players.getPlayerWantedLevel(player.ID) > 0) return player.notify(PM.MustNotBeWanted);
        // Should add the action with the gun, as in the solo player
        player.health =1;
    },
    "jobhelp": (player, args) => {
        job = Players.getPlayerJob(player.ID);
        if(job == null) return player.notify("You don't have a job.");
        
    }
}