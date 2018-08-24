const adminMessage = require('../messages/admin.json');
module.exports = {
    "test": (player, args) => {
        player.health = -1;
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