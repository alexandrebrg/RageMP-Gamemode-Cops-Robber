const Factions = require('../modules/factions');
const Bizs = require('../modules/business');
const Players = require('../modules/players')
const Logs  = require('../modules/logs');
const Config = require('../data/config.json');
const PM = require('../messages/player.json')

module.exports = {



    "playerQuit" : (player, exitType, reason) => {
        if(Players.IsPlayerLogged(player.ID)) {
            console.log(`Player ${player.name} left, ${exitType}, reason: ${reason}`);
            Logs.Insert(`Player ${player.name} left the game (${exitType}), reason: ${reason}`);
            Players.SavePlayerClass(player.ID);
            Players.destroyBlip(player.ID);
            Players.DeletePlayerClass(player.ID);
        }
    },

    //ACTIONS
    "sAction": (player, actionID, ...args) => {
        switch(actionID) {
            case 0:
                player.call("cATMOpen");
                break;
            case 1:
                mp.events.call("hackerATM", player, args[0]);
                break;
            case 2:
                mp.events.call("PlayerRobberyStart", player, parseInt(args[0]));
                break;
            case 3:
                if(parseInt(args[1]) < Players.getPlayerCash(player.ID)){
                    player.health += player.health >= 100 ? 0 : args[2];
                    mp.events.call("sCashUpdate", player, -args[1]);
                    player.notify(`You bought <C>${args[0]}</C>, for ~g~$${args[2]}.`);                    
                } else { player.notify(PM.NotEnoughCash)}
                break;
            case 4:
                weapon = JSON.parse(args[0]);
                if(weapon.price < Players.getPlayerCash(player.ID)) {
                    mp.events.call("sCashUpdate", player, -weapon.price);
                    player.notify(`You bought <C>${weapon.displayName}</C>, for ~g~$${weapon.price}.`); 
                    player.giveWeapon(weapon.hash, weapon.ammo);
                } else { return player.notify(PM.NotEnoughCash); }
                break;
        }
    },

}