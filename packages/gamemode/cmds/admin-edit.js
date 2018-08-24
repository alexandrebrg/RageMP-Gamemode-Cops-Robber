const adminMessage = require('../messages/admin.json');
const Factions = require('../modules/factions');
const Logs = require('../modules/logs');
const Players = require('../modules/players');
const ATMs = require('../modules/atm')
module.exports = {

    "acreate": (player, args) => {
        if(!player.adminID) return player.notify(adminMessage.NotEnoughRights);

        if(args[0] == "faction") { // Commande /create faction

            if(player.adminID.edit < 9) return player.notify(adminMessage.NotEnoughRights);
            var options = [
                [   
                    "Faction Name",
                    "name"
                ],
                [
                    "Restriction",
                    "restricted"
                ],
                [
                   "Leader Name",
                    "leader"
                ],
                [
                    "Little description",
                    "desc"
                ]
            ];
            return player.call("cModal", ["createFaction", "Create Faction", "Create easily a faction by theses 3 fields!",options]);
        }
        else if(args[0] == "label") {
            if(player.adminID.edit < 9) return player.notify(adminMessage.NotEnoughRights);
            var options = [
                [
                    "Label Text",
                    "text"
                ],
                [
                    "Can be saw through object ? (0/1) (Can be empty)",
                    "los"
                ],
                [
                    "Font ID (Can be empty)",
                    "font"
                ],
                [
                    "View distance (Can be empty)",
                    "drawDistance"
                ],
                [
                    "Label Dimension (Can be empty)",
                    "dimension"
                ]
            ];
            return player.call("cModal", ["createLabel", "Create a Label", "Create a label easily.", options]);
        }
        else if(args[0] == "ped") { // Commande /create ped

            if(player.adminID.edit < 9) return player.notify(adminMessage.NotEnoughRights);
            var options= [
                [
                    "Faction ID",
                    "faction"
                ],
                [
                    "Ped's Hash",
                    "hash"
                ],
                [
                    "Ped's Name",
                    "name"
                ]
            ];
            return player.call("cModal", ["createPed", "Add a ped to a faction", "We just need hash, faction_id & Name of ped",options]);

        }
        else if(args[0] == "biz") {

            if(player.adminID.edit < 9) return player.notify(adminMessage.NotEnoughRights);
            var options= [
                [
                    "Type of Business",
                    "type"
                ],
                [
                    "Name of the business",
                    "name"
                ],
                [
                    "Business dimension",
                    "dimension",
                    player.dimension
                ]
            ];
            return player.call("cModal", ["createBiz", "Create a Business", "Its very easy to do, and go!",options]);
        }
        else if(args[0] == "spawnpoint") {

            if(player.adminID.edit < 9) return player.notify(adminMessage.NotEnoughRights);
            var pos = player.position;
            if(!args[1]) return player.notify(adminMessage.syntax + " /acreate spawnpoint [faction_id]");
            if(Factions.createSpawnPoint(pos['x'], pos['y'], pos['z'], player.heading, parseInt(args[1]))) {
                Logs.Insert(`Player ${player.name} created a Spawnpoint for ${Factions.getFactionName(args[1])} faction!`);
                return player.outputChatBox(adminMessage.prefix + "Spawnpoint created for " + Factions.getFactionName(args[1]));
            } else {
                return player.outputChatBox(adminMessage.prefix + "This faction does not exist !");
            }           

        }
        else if(args[0] == "atm") {
            ATMs.SaveNewATM(player.position);
            player.notify("~r~ATM CREATED")
        } else { return player.notify(adminMessage.syntax + " /acreate [faction/label/ped/biz/spawpoint]"); }
    },
    "aplayer": (player, args) => {
        if(!player.adminID) return player.notify(adminMessage.NotEnoughRights);
        if(player.adminID.edit < 6) return player.notify(adminMessage.NotEnoughRights);
        if(!args[0]) return player.notify("You must enter a player ID")
        var options = [
            [
                "Reset Wanted Level",
                "ResetWLevel"
            ],
            [
                "Respawn player",
                "RespawnPlayer"
            ],
            [
                "Save Player",
                "savePlayer"
            ]
        ];
        player.adminID.editID = mp.players[parseInt(args[0])];
        return player.call("cSelectModal", ["What do you want to do to " + Players.getPlayerName(parseInt(args[0])), options])
    },
    "arespawn": (player) => {
        if(!player.adminID) return player.notify(adminMessage.NotEnoughRights);
        if(player.adminID.edit < 4) return player.notify(adminMessage.NotEnoughRights);
        var options = [
            [
                "Reload a player",
                "selectClass"
            ]
        ]
        return player.call("cSelectModal", ["What do you want to respawn ?",options]);
    },
    "aveh": (player) => {
        if(!player.adminID) return player.notify(adminMessage.NotEnoughRights);
        if(player.adminID.edit < 1) return player.notify(adminMessage.NotEnoughRights);
        var options = [
            [
                "Save vehicle",
                "saveVeh"
            ],
            [
                "Edit Vehicle",
                "editVeh"
            ],
            [
                "Create Vehicle",
                "createVeh"
            ],
            [
                "Create temporary Vehicle",
                "createTempVeh"
            ],
            [
                "Respawn all vehicles",
                "RespawnAllVeh"
            ],
            [
                "Respawn this vehicle",
                "RespawnThisVeh"
            ]
        ]
        return player.call("cSelectModal", ["What do you want to do ?",options]);

    }
}