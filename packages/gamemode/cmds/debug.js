const adminMessage = require('../messages/admin.json');
let default_veh = require('../data/default_vehicle.json');

module.exports = {
    "test": (player, args) => {
        player.call("test");
    },
    "createSP": (player, args) => {
        let fs = require('fs');
        let p = JSON.parse(fs.readFileSync('packages/gamemode/data/default_vehicle.json').toString());
        let m = {}
        m = p;
        m[Object.keys(p).length] = {"position":player.vehicle.position,"heading":player.vehicle.heading};
        fs.writeFile('packages/gamemode/data/default_vehicle.json', JSON.stringify(m), (e) => { if(e) console.log(e) });
    },
    "getdim": (player) => {
        player.outputChatBox("Your dimension: " + player.dimension)
    },
    "dim": (player, args) => {
        player.dimension = parseInt(args[0]);
    },
        
    "mypos": (player, args) =>
    {
        if(player.adminID == 'undefined') return player.outputChatBox(adminMessage.NotEnoughRights)
        player.outputChatBox(player.position.x + " " + player.position.y + " " + player.position.z + " angle: " + player.heading);
        if(player.vehicle) {
            player.outputChatBox('Vehicle heading: ' + player.vehicle.heading);
        }
    },
    "goto": (player, args) =>
    {
        if(player.adminID == 'undefined') return player.outputChatBox(adminMessage.NotEnoughRights)
        if(player.vehicle) veh = player.vehicle;
        player.outputChatBox(args[0] + " " + args[1] + " " + args[2]);
        player.position = new mp.Vector3(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]));
        if(typeof veh != "undefined") {
            veh.position = new mp.Vector3(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]));
            player.putIntoVehicle(veh, -1);
        }
    }
}