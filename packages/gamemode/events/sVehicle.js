var PM = require('../messages/player');
var Veh_Hash = require('../data/vehicle_hashes');
var Veh_prices = require('../data/custom_prices');
var Players = require('../modules/players')
var Config = require('../data/config.json')

module.exports = {
    "showVehicleCustom": (player, customID) => {
        if(!player.vehicle) return player.notify(PM.MustBeInVehicle);
        player.customID = customID;
        vehicle = player.vehicle;      
        
        player.call("fadeOut");
        setTimeout(function() {

            vehicle.position = new mp.Vector3(-343.84, -137.30, 38.6158, 38.63);
            vehicle.rotation = new mp.Vector3(0,0,-94.198791);
            vehicle.engine = true;

            player.position = new mp.Vector3(-342.9, -135.872, 39);
            player.heading = 290.486;

            player.dimension = Math.floor(Math.random() * 1000)
            vehicle.dimension = player.dimension;
            
            player.call("showVehicleCustomHUD", [Veh_Hash[vehicle.modelName], vehicle, Veh_prices]);
            player.call("fadeIn");
        }, 1000);
    },
    "playerExitVehicleCustom": (player, veh) => {
        custom = Config.Customs[player.customID];
        veh.position = new mp.Vector3(custom.Position.x, custom.Position.y, custom.Position.z);
        veh.rotation = new mp.Vector3(0,0,custom.Rotation.z);
        player.putIntoVehicle(veh, -1);
        player.dimension = Config.defaultDimension
        vehicle.dimension = Config.defaultDimension;

        setTimeout(function() { player.call("fadeIn"); }, 1000);
    },
    "playerPayVehicleCustom": (player, price) => {
        if(parseInt(price) < Players.getPlayerCash(player.ID)) {
            mp.events.call('sCashUpdate', player, -price);
            player.call('exitVehicleCustom');
        } else {
            player.notify(PM.NotEnoughCash);
        }
    },
    "vehicleApplyVehicleCustom": (player, veh, edits) => {
        edits = JSON.parse(edits);
        for(var key in edits) {
            veh.setMod(parseInt(key), parseInt(edits[key]));
        }
    },
    "showVehicleShop": (player, type) => {
        
    }
}