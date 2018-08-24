const Players = require('../modules/players');
const Factions = require('../modules/factions');
const PM = require('../messages/player');

module.exports = {
    "cuff": (player, args) => {
        arg = parseInt(args[0]);
        if(!Factions.isFactionCops(Players.getPlayerFaction(player.ID))) return player.notify(PM.NotCop);
        if(typeof arg == "undefined") return player.notify(PM.Syntax + PM.cuffArgument);
        if(!mp.players.exists(arg)) return player.notify(PM.PlayerNotFound);
        if(Players.getPlayerWantedLevel(mp.players[arg].ID) == 1) return player.notify(PM.PV);
        if(Players.getPlayerWantedLevel(mp.players[arg].ID) == 0) return player.notify(PM.NotWanted);
        if(Factions.isFactionCops(Players.getPlayerFaction(mp.players[arg].ID))) return player.notify(PM.PlayerCop);
        if(player == mp.players[arg]) return player.notify(PM.Myself);
        playerb = mp.players[arg];
        if(Players.isPlayerCuffed(mp.players[arg].ID)) {
            Players.setPlayerCuff(playerb.ID, false);
            playerb.call("cUnCuff"); 
            playerb.call("ShowShardMessage", ["~r~Uncuffed", "That's great!"]);
            playerb.stopAnimation();
        } else {
            Players.setPlayerCuff(playerb.ID, true);
            playerb.call("cCuff"); 
            playerb.call("ShowShardMessage", ["~r~Cuffed", "That's bad."]);
            playerb.playAnimation('mp_arresting', 'idle', 1, 49);
        }
    },
    "fine": (player, args) => {
        player.notify("Command in progress")
    }

}