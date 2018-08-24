const Players = require('./players'); 
const Bizs = require('./business');

let minuteInterval = null;
let fiveMinutesInterval = null;
let secondInterval = null;

function minuteIntervalFunction() {
    Players.updateSpentTime();
}
function fiveMinutesFunction() {    
    Players.SaveAllPlayersClass();
}

function blipsIntervalFunction() {
	mp.players.forEach( (player, id) => {
		if (Players.IsPlayerLogged(player.ID) && player.robbery && Players.playerBlipExist(player.ID) && player.health > 0) {
            Players.updateBlipPosition(player.ID, player.position);
		}
	});
}

function secondIntervalFunction() {
	mp.players.forEach( (player, id) => {
		if(Players.IsPlayerLogged(player.ID) && Players.isPlayerJailed(player.ID)) {
            Players.decreaseJailTime(player.ID);
            if(!Players.isPlayerJailed(player.ID)) {
                mp.events.call("PutPlayerOutOfJail", player);
            }
        }
    });
    mp.markers.forEach( (marker, id) => {
        if(marker.store && marker.robbed) {
            marker.robbed -= 1;
            if(marker.robbed == 0) {
                Bizs.resetRob(marker.sqlid);
            }
        }
    });
}

module.exports.Init = function() {
    minuteInterval = setInterval(minuteIntervalFunction, 60000);
    fiveMinutesInterval = setInterval(fiveMinutesFunction, 300000);
    blipsInterval = setInterval(blipsIntervalFunction, 200);
    secondInterval = setInterval(secondIntervalFunction, 1000);
}