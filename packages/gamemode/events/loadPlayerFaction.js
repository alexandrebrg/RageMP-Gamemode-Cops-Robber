const Factions = require('../modules/factions');
const Players = require('../modules/players');
const Logs = require('../modules/logs');
const Config = require('../data/config.json');

module.exports = {
    "loadPlayerFaction" : (player, ped) => {
        ped = JSON.parse(ped);
        if(Factions.isFactionRestricted(ped.faction_id) && !Players.PlayerHaveAccess(player.ID, ped.faction_id) && !player.adminID)  return player.call("ShowShardMessage", ["Can't join", "This team is restrited, candidate for it on forum!", 1, 6, 3000]);
        if(Players.getPlayerWantedLevel(player.ID) > 0 && Factions.isFactionCops(ped.faction_id)) return player.call("ShowShardMessage", ["Can't join", "You are wanted, you can't join this team.", 1, 6, 3000]);
        Players.setPlayerFaction(player.ID, ped.faction_id);
        Logs.Insert(`Player ${player.name} joined ${Factions.getFactionName(ped.faction_id)} faction!`);
        switch(ped.faction_id) {
            case 1:
                break;
            case 2:
                player.health = 100;
                player.armor = 100;
                break;
        }
        player.dimension = Config.defaultDimension;
        player.call('cFactionSelectionDone');
        mp.events.call("sCashInit", player, Players.getPlayerCash(player.ID));

        spawnpoint = Factions.randomSpawn(ped.faction_id);
        player.position = new mp.Vector3(spawnpoint['posx'], spawnpoint['posy'], spawnpoint['posz']);
        player.heading = spawnpoint['angle'];
        player.model =ped.hash;

        player.call('setWantedLevel', [Players.getPlayerWantedLevel(player.ID)]);

        player.robbery = {};        
        Players.setPlayerBlips(player.id);
        if(!Factions.isFactionCops(ped.faction_id)) {
            player.call("cJobSelection", [JSON.stringify(Config.Jobs)]);
        }
    }
}

mp.events.add({
    "sSkinChange": (player, hash) => {
        player.model = hash;
        return true;
    }
})