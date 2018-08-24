const Players = require('../modules/players');

mp.events.add({
    "playerChat": (player, message) => {
        wantedlevel = Players.getPlayerWantedLevel(player.ID);
        faction = Players.getPlayerFaction(player.ID);
        color = null;
        switch(wantedlevel) {
            case 0:
                color = "#FFFFFF";
                break;
            case 1,2:
                color = "#e0d216";
                break;
            case 3,4:
                color = "#e08c16";
                break;
            case 5,6:
                color = "#a00c0c";
                break;
        }
        if(faction == 2) return color = "#032a96";
        player.outputChatBox(`!{${color}}${player.name}[${player.id}]: !{#FFFFFF}${message}`);
    }
});