const PM = require('../messages/player');
const Veh_Hash = require('../data/vehicle_hashes');
const Custom_prices = require('../data/custom_prices');
const Players = require('../modules/players')
const Config = require('../data/config.json')
const Car_Shop = require('../data/vehicle_shop.json');
const Vehicle = require('../modules/vehicles')

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
            
            player.call("showVehicleCustomHUD", [Veh_Hash[vehicle.modelName], vehicle, Custom_prices]);
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
        data = Config.CarShop[type];
        vehClass = Config.CarShop[type].Class
        vehData = [];
        for(var i =0; i < vehClass.length; i++) {
            vehData[ i ] = Car_Shop[ vehClass[i] ];
        }
        player.dimension = Math.random() * 10000;
        player.position = new mp.Vector3(data.Marker.x, data.Marker.y, data.Marker.z);

        player.call("showVehicleShop", [ JSON.stringify(vehData), JSON.stringify(data), type]);
    },
    "exitVehicleShop": (player) => {
        player.dimension = Config.defaultDimension;
    },
    "buyVehicleShop": (player, type, vehicle) => {
        vehicle = JSON.parse(vehicle);
        if(vehicle.price < Players.getPlayerCash(player.ID)) {
            mp.events.call("sCashUpdate", player, -vehicle.price);
            randomPos = Config.CarShop[type].Park;
            randomPos = randomPos[Math.floor(Math.random() * Object.keys(randomPos).length)];
            vehicleBought = Vehicle.createOwnedVehicle(vehicle.model, randomPos.x, randomPos.y, randomPos.z, randomPos.rz)
            vehicleBought.owner = player.name;
            player.dimension = Config.defaultDimension;
            player.call("exitVehicleShop")
            player.call("ShowShardMessage", ["~g~Success!", "Your vehicle is waiting for you at the waypoint on your minimap!"])
            player.call("setWaypoint", [randomPos.x, randomPos.y])
        } else { player.notify(PM.VehicleBuyNotEnoughMoney); }
    },
    "vehicleDeath": (vehicle) => {
        vehicle.destroy();
        console.log(vehicle);
    }
}