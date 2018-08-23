var Factions = require("../modules/factions");
var adminMessage = require("../messages/admin.json");
var Vehicles = require('../modules/vehicles');
var Logs = require('../modules/logs');
var Labels = require('../modules/labels');
var Biz = require('../modules/business');
var Players = require('../modules/players')


module.exports = {
    "sModalTreat" : (player, typeModal, id, args = null) => {
        args=JSON.parse(args);
        if(typeModal == "form") {
            if(id == "createFaction") {
                if(args[1] !== "0" && args[1] !== "1") return player.outputChatBox(adminMessage.prefix + "Restriction must be 0 (no) or 1 (yes) !");
                if(args[0] == "") return player.outputChatBox(adminMessage.prefix + "Faction name is needed!");
                Factions.createFaction(args[0], parseInt(args[1]), args[2], args[3]);
                Logs.Insert(`Player ${player.name} created a faction name ${args[0]}`)
                return player.outputChatBox(adminMessage.prefix + "Faction " + args[0] + " was created, with as leader " + args[2] + ".");
            }
            else if(id == "createPed") {
                if(args['2'] == "" || args['1'] == "" || args['0'] == "") return player.outputChatBox(adminMessage.prefix + "All fields must be filled !");
                if(!Factions.isFactionIDCorrect(args['0'])) return player.outputChatBox(adminMessage.prefix + "Faction does not exist !");
                Factions.createPed(args['0'], args['1'], args['2']);
                Logs.Insert(`Player ${player.name} create a ped for the faction ${Factions.getFactionName(args[0])}`);
                return player.outputChatBox(adminMessage.prefix + "The ped has been created and added to " + Factions.getFactionName(args['0']) + "!")
            }
            else if(id == "createVeh") {
                args[0] = parseInt(args[0]);
                if(args[0] == "" || args[1] == "" || args[2] == "" || args[3] == "") return player.outputChatBox(adminMessage.prefix + "All fields must be completed");
                if(!Factions.isFactionIDCorrect(args[0])) return player.outputChatBox(adminMessage.prefix + "Faction ID incorrect !");
                if(!Vehicles.isVehNameValid(args[1])) return player.outputChatBox(adminMessage.prefix + "Veh name is invalid!");
                if(args[4].length > 8) return player.outputChatBox(adminMessage.prefix + "Plate must be less than 8!");
                Logs.Insert(`Player ${player.name} created a vehicle!`);
                pos = player.position
                Vehicles.createVehicle(args[1], args[0], pos.x + 2, pos.y, pos.z + 3, player.heading, args[2], args[3], args[4], 0, args[5]);
            } 
            else if(id == "createTempVeh") {
                if(!Vehicles.isVehNameValid(args[0])) return player.outputChatBox(adminMessage.prefix + "Veh name is invalid!");
                pos = player.position
                Vehicles.createTempVehicle(args[0], pos.x + 2, pos.y, pos.z + 1, player.heading, args[1], 0, player.dimension);
                return player.notify("Vehicle created");
            } 
            else if(id == "editVeh") {
                if(!player.vehicle) return player.outputChatBox(adminMessage.prefix + "You are not in a vehicle !");
                if(!Vehicles.isVehNameValid(args[0])) return player.outputChatBox(adminMessage.prefix + "Veh name is invalid!");
                if(!Factions.isFactionIDCorrect(args[1])) return player.outputChatBox(adminMessage.prefix + "Faction ID invalid !");
                if(args[4].length > 8) return player.outputChatBox(adminMessage.prefix + "Plate must be less than 8!");
                if(Vehicles.editVehicle(player.vehicle.id, ["model", args[0]], ["faction_id", args[1]],["color", args[2], args[3]], ["plate",args[4], ["dimension", args[5]]])) {
                    Logs.Insert(`Player ${player.name} edited the vehicle id: ${player.vehicle.id}!`);
                    return player.outputChatBox(adminMessage.prefix + "Vehicle edited, don't forget to save it, if you want it to stay like this!");
                }
            } 
            else if(id == "createLabel") {
                if(args.length < 1) return player.outputChatBox(adminMessage.prefix + "Some fields are needed!");
                if(Labels.createLabel(args[0], player.position, parseInt(args[1]), parseInt(args[2]), parseInt(args[3]), parseInt(args[4]))) {
                    return player.outputChatBox(adminMessage.prefix + "You created a label.");
                }
            
            }else if(id == "createBiz") {
                Biz.CreateBiz(parseInt(args[0]), args[1], player.position.x, player.position.y, player.position.z, args[2]);
                return player.notify(adminMessage.prefixNotify + "Business created!");
            }
        } else if(typeModal == "selectModal") {
            if(id == "RespawnAllVeh") {
                Vehicles.respawnAllVehicles();
                Logs.Insert(`Player ${player.name} respawned all vehicles !`)
                return player.outputChatBox(adminMessage.prefix + "All vehicles respawned !");
            }
            else if(id == "saveVeh") {
                if(!player.vehicle) return player.outputChatBox(adminMessage.prefix + "You are not in a vehicle !");
                if(player.vehicle.temp) return player.notify("You can't save this veh, it is a temporary one.");
                Vehicles.saveVehicle(player.vehicle.id)
                return player.outputChatBox(adminMessage.prefix + "Vehicle saved !");
                

            }
            else if(id == "editVeh") {
                if(!player.vehicle) return player.outputChatBox(adminMessage.prefix + "You are not in a vehicle !");
                data = Vehicles.getVehicleData(player.vehicle.id);
                var options = [
                    [
                        "Vehicle Model",
                        "vehModel",
                        data.modelName
                    ],
                    [
                        "ID of Faction (1 if for everybody)",
                        "faction_id",
                        data.faction_id
                    ],
                    [
                        "Color 1",
                        "color",
                        data.getColor(0)
                    ],
                    [
                        "Color 2",
                        "color2",
                        data.getColor(1)
                    ],
                    [
                        "Vehicle Plate",
                        "plate",
                        data.numberPlate
                    ],
                    [
                        "Vehicle Dimension",
                        "dimension",
                        data.dimension
                    ]
                ];
                return player.call("cModal", ["editVeh", "Edit a Vehicle", "" ,options]);
            } else if(id == "createVeh") {
                var options = [
                    [
                        "ID of Faction (1 if for everybody)",
                        "faction_id"
                    ],
                    [
                        "Name of vehicle",
                        "name"
                    ],
                    [
                        "Color 1",
                        "color"
                    ],
                    [
                        "Color 2",
                        "color2"
                    ],
                    [
                        "Vehicle Plate",
                        "plate"
                    ],
                    [
                        "Vehicle dimension",
                        "dimension",
                        player.dimension
                    ]
                ];
                return player.call("cModal", ["createVeh", "Create Vehicle", "Create easily a vehicle for a faction!" ,options]);
            } else if(id == "createTempVeh") {
                var options = [
                    [
                        "Name of vehicle",
                        "name"
                    ],
                    [
                        "Color 1",
                        "color"
                    ]
                ];
                return player.call("cModal", ["createTempVeh", "Create Temporary Vehicle", "Create easily a vehicle, which is gone after a reboot!!" ,options]);
            } else if(id == "ResetWLevel") {
                if(!player.adminID.editID) return player.notify("No player selected ? Wtf ?");
                player.adminID.editID.call("clearWantedLevel");
                Players.updatePlayerWantedLevel(player.adminID.editID.id, 6, false);
                Players.destroyBlip(player.adminID.editID.id);
                Players.setPlayerBlips(player.adminID.editID.id);
            } else if(id == "savePlayer") {
                if(!player.adminID.editID) return player.notify("No player selected ? Wtf ?");
                Players.SavePlayerClass(player.adminID.editID.id);
            }
        }
    }
}