var Players = require('../modules/players')

module.exports = {
    
    "setWantedLevel" : (player, level) => {
        level = (level > 6) ? 6 : level < 0 ? 0 : level;
        Players.updatePlayerWantedLevel(player.ID, level);
        player.call("setWantedLevel", [level]);
    },
    "PutPlayerOutOfJail": (player) => {        
        player.position = new mp.Vector3(468.992 , -1023.63, 28.21397-1);
        player.call("cUnCuff");
    },
    "PutPlayerInJail": (player, p2) => {
        p2.call("fadeOut");
        setTimeout(function(){
            p2.position = new mp.Vector3(1686.212, 2520.229, 45.56486); // TP TO JAIL
            p2.heading = 116.1943;
    
            Players.setPlayerCuff(p2.ID, false); // LET CLIENT SIDE CUFFED FOR PREVENT STUPID ACTIONS
    
            p2.call("clearWantedLevel", [false]);
    
            p2WantedLevel = Players.getPlayerWantedLevel(p2.ID); // CALCUL JAIL TIME DEPENDING ON MONEY AND WANTED LEVEL
            Players.updatePlayerWantedLevel(p2.ID, p2WantedLevel, false);
            
            jailTime = Math.floor((Players.getPlayerCash(p2.ID) / 1000));
            jailTime += (p2WantedLevel == 2) ? 150 : 0;
            jailTime += (p2WantedLevel < 6 && p2WantedLevel > 2) ? (p2WantedLevel * 100) - 100 : 0;
            jailTime += (p2WantedLevel == 6) ? 600 : 0;
            Players.setJailTime(p2.ID, jailTime);
            
            p2.call("setJailTimeLeft", [jailTime]);
    
            mp.events.call("sCashUpdate", p2, -Players.getPlayerCash(p2.ID));
            mp.events.call("sCashUpdate", player, Players.getPlayerCash(p2.ID));
            p2.call("fadeIn");
    
            Players.notifyAllPlayers(`The player ~r~<C>${p2.name}</C>~w~ has been arrested by ~b~<C>${player.name}</C>`, "CHAR_CALL911", "Police Department")
    
            p2.call("ShowShardMessage", ["~r~Wasted", `You have been arrested, for ~r~${jailTime} ~w~seconds.`]);
        }, 1000);
    }

}