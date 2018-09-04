let PoliceAct = null;
const misc = require('/gamemode/cMisc.js');


mp.events.add({
    "CopActionPosition": (position) => {
        PoliceAct = position;
    }

});

mp.keys.bind(0x4D, false, function() { // M
    if(PoliceAct && !mp.players.local.chatState ) {
        mp.game.ui.setNewWaypoint(PoliceAct.x, PoliceAct.y);
    }
});

mp.keys.bind(0x71, false, function() { // F2
    misc.closeCef();
    player.freezePosition(false);
    mp.game.ui.displayHud(true);
    mp.players.local.inMenu = false;
});


mp.keys.bind(0x59, false, function() {
    if(!mp.players.local.inMenu && !mp.players.local.chatState) {
        mp.events.callRemote("sKeyPressed", "Y");
    }
});

mp.keys.bind(0x54, false, function() { // T
    if(!mp.players.local.chatState) mp.players.local.chatState = true;
});


mp.keys.bind(0x0D, false, function() { // Enter
    if(mp.players.local.chatState) mp.players.local.chatState = false;
});

