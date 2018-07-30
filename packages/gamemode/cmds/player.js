var Players = require('../modules/players')
module.exports = {
    "jobhelp": (player, args) => {
        job = Players.getPlayerJob(player.ID);
        if(job == null) return player.notify("You don't have a job.");
        
    }
}