const Logs = require('../modules/logs');


function showLoginCef(player) {
    player.call("cLoginUI");
}


module.exports =
{
	"playerReady" : player =>
	{
        player.admin = 0;
        player.call('clearWantedLevel', [false]);

        Logs.Insert("Player " + player.name + " (" + player.ip + ") connected on server");

        player.dimension = 1001;

        console.log("Player: " + player.name + " is now connected");

        showLoginCef(player);             
        
	}
}