const Factions = require('../modules/factions');
const PM = require('../messages/player');
const Players = require ('../modules/players');

module.exports = {
    "playerEnterVehicle" : (player, vehicle, seat) => {
        if(player.vehicle.temp) return true;
        if(Factions.isFactionRestricted(vehicle.faction_id) && !Players.PlayerHaveAccess(player.ID, vehicle.faction_id) && !player.adminID && seat === -1) {
            player.removeFromVehicle();
            return player.call("ShowMidsizedShardMessage", [PM.EnterVehicle.title, `${PM.EnterVehicle.first_text} ~r~${Factions.getFactionName(vehicle.faction_id)} ~w~${PM.EnterVehicle.second_text}`]);
        }
        if(Factions.isFactionRestricted(vehicle.faction_id) && !Players.PlayerHaveAccess(player.ID, vehicle.faction_id) && player.adminID && seat === -1) {
            return player.call("ShowMidsizedShardMessage", [PM.EnterVehicle.title, PM.EnterVehicle.admin]);
        }
        
    }
};