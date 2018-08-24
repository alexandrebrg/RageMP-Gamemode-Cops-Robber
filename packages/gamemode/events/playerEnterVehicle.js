const Factions = require('../modules/factions');
const playerMessage = require('../messages/player');
const Players = require ('../modules/players')

module.exports = {
    "playerEnterVehicle" : (player, vehicle, seat) => {
        if(player.vehicle.temp) return true;
        if(Factions.isFactionRestricted(vehicle.faction_id) && !Players.PlayerHaveAccess(player.ID, vehicle.faction_id) && !player.adminID && seat == -1) { 
            player.removeFromVehicle();
            return player.call("ShowMidsizedShardMessage", ["~y~Argh!", `You must be from ~r~${Factions.getFactionName(vehicle.faction_id)} ~w~to drive this !`]);
        }
        if(Factions.isFactionRestricted(vehicle.faction_id) && !Players.PlayerHaveAccess(player.ID, vehicle.faction_id) && player.adminID && seat == -1) {            
            return player.call("ShowMidsizedShardMessage", ["~y~Argh!", `~r~You enter as Admin`]);
        }
        
    }
}