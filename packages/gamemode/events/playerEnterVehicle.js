const Factions = require('../modules/factions');
const PM = require('../messages/player');
const Players = require ('../modules/players');
const carPrices = require('../data/vehicle_shop.json');

module.exports = {
    "playerEnterVehicle" : (player, vehicle, seat) => {
        if(!player.vehicle.temp && Factions.isFactionRestricted(vehicle.faction_id) && !Players.PlayerHaveAccess(player.ID, vehicle.faction_id) && !player.adminID && seat === -1) {
            player.removeFromVehicle();
            return player.call("ShowMidsizedShardMessage", [PM.EnterVehicle.title, `${PM.EnterVehicle.first_text} ~r~${Factions.getFactionName(vehicle.faction_id)} ~w~${PM.EnterVehicle.second_text}`]);
        }
        if(!player.vehicle.temp && Factions.isFactionRestricted(vehicle.faction_id) && !Players.PlayerHaveAccess(player.ID, vehicle.faction_id) && player.adminID && seat === -1) {
            return player.call("ShowMidsizedShardMessage", [PM.EnterVehicle.title, PM.EnterVehicle.admin]);
        }
        //reseller job
        if(Players.getPlayerJob( player.id ) == 1) {
            for(var key in carPrices) {
                let vehClass = parseInt(key);
                if([20,21].indexOf(vehClass) !== -1) continue;
                for(var veh in carPrices[key]) {
                    if(carPrices[key][veh].hash == player.vehicle.model) {
                        player.notify(PM.VehicleResellable + ` (<C>~r~${carPrices[key][veh].price / 10}</C>)`)
                        break;
                    }
                }
            }
        }
    }
};