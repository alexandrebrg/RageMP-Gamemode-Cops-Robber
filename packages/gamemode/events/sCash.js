const Players = require('../modules/players');
const playerMessage = require('../messages/player');


module.exports = {
    "sCashUpdate": (player, value) => {
        Players.updatePlayerCash(player.ID, value)
        Players.SavePlayerClass(player.ID);
        return player.call('cCashUpdate', [value]);
    },
    "sBankUpdate": (player, value) => {
        Players.updatePlayerBank(player.id, value)
        Players.SavePlayerClass(player.ID);
        return player.call('cBankUpdate', [value]);
    },
    "sCashInit": (player) => {
        player.call('cCashUpdate', [Players.getPlayerCash(player.ID)]);
        player.call('cBankUpdate', [Players.getPlayerBank(player.ID)]);
        return true;
    },
    "sATMTry": (player, type, value) => {
        value = parseInt(value);
        if(value < 0) return player.notifyWithPicture("Bank", "Fleeca Bank",playerMessage.ATMNegativ, "CHAR_BANK_FLEECA", 9, false, 6);
        switch(type) {
            case "deposit":
                if(Players.depositBank(player.ID, value)) {
                    player.notifyWithPicture("Bank", "Fleeca Bank",playerMessage.TransationDone, "CHAR_BANK_FLEECA", 9, false);
                    Players.SavePlayerClass(player.ID);
                    player.call('cBankAndCashUpdate', ["deposit", value]);
                } else { player.notify(playerMessage.NotEnoughCash); }
            break;
            case "withdraw": 
                if(Players.withdrawBank(player.ID, value)) {
                    player.notifyWithPicture("Bank", "Fleeca Bank",playerMessage.TransationDone, "CHAR_BANK_FLEECA", 9, false);
                    player.call('cBankAndCashUpdate', ["withdraw", value]);
                    Players.SavePlayerClass(player.ID);
                } else { player.notify(playerMessage.NotEnoughBank); }
            break;
        }
    }
}