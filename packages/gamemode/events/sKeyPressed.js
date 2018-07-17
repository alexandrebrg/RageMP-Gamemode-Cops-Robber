var Bizs = require('../modules/business');
var ATMs = require ('../data/atm_pos.js');
var Players = require('../modules/players');
var PM = require('../messages/player.json')
var Factions = require('../modules/factions')

function isInRange(point, pos, range) {
    point = point.x + point.y + point.z;
    pos = pos.x + pos.y + pos.z;
    return (point - pos < range);
}


module.exports = {
    "sKeyPressed" : (player, key) => {
        if(key=="Y") {
            if(isInRange(new mp.Vector3(236.98, 217.663, 106.286),player.position, 2)) { // ATM of main LS BANK
                return player.call("cATMOpen");
            } else {
                var done = false;
                mp.markers.forEachInRange(player.position, 3, (b) => {
                    if(b.store && !b.robbed) {
                        switch(b.storeType) {
                            case 1:
                                player.call("247choice", [b.sqlid]);
                                break;
                            case 2:
                                player.call("AMMUNATIONchoice", [b.sqlid]);
                                break;
                        }
                        return false;
                    }
                    else if(b.store && b.robbed) {
                        player.notify("~r~(!) ~w~Store already robbed, wait some time!");
                    }
                    else if(b.teleporter && b.dimension == player.dimension && !done) {
                        if(b.faction != 1 && Players.PlayerHaveAccess(player.ID, b.faction) && !player.adminID) return player.notify(PM.AccessTP)
                        player.call("fadeOut");
                        setTimeout(function() {
                            if(b.veh && player.vehicle) {
                                veh = player.vehicle;
                                seat = player.seat;
                                player.vehicle.position = b.to;
                            } else if(!b.veh && player.vehicle) return player.notify(PM.IsInVehicle)
                            player.dimension = b.to_dimension;
                            player.position = b.to;
                            if(b.veh && typeof veh !== "undefined") {
                                player.putIntoVehicle(veh, seat)
                                player.vehicle.heading = b.to_angle;
                            }
                            player.heading = b.to_angle;
                            veh = null;
                            player.call("fadeIn");
                        }, 1000)


                        done = true;
                        return false;
                    } else if(b.arrest) {
                        mp.players.forEachInRange(player.position, 5, (p2) => {
                            if(Players.isPlayerCuffed(p2.ID) && Factions.isFactionCops(Players.getPlayerFaction(player.ID))) {
                                mp.events.call("PutPlayerInJail", player, p2);
                            }
                        });
                    } else if(b.atm) {
                        player.call("ATMChoice", [b.id]);
                    } else if(b.custom) {
                        mp.events.call("showVehicleCustom", player, b.customID);
                    } else if(b.carShop){                         
                        mp.events.call("showVehicleShop", player, b.carShopType);
                    }
                    
                });
            }
        }
    }
}