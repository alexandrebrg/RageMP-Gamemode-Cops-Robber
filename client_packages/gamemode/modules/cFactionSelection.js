const creatorCoords = {
    camera: new mp.Vector3(402.8664, -998.5515, -98.5),
    cameraLookAt: new mp.Vector3(402.8664, -996.4108, -98.5)
};
let creatorCamera;
const localPlayer = mp.players.local;
const misc = require('/gamemode/cMisc.js');

function showSelectionCef(url) {
	misc.prepareToCef(0);
    creatorCamera = mp.cameras.new("creatorCamera", creatorCoords.camera, new mp.Vector3(0, 0, 0), 45);
    creatorCamera.pointAtCoord(creatorCoords.cameraLookAt);
    creatorCamera.setActive(true);
    
    mp.game.ui.displayHud(false);
    localPlayer.clearTasksImmediately();
    localPlayer.freezePosition(true);

    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    misc.openCef(url);        
}

function leaveSelectionCef() {

    misc.closeCef();
    mp.game.ui.displayHud(true);
    localPlayer.freezePosition(false);
    localPlayer.setDefaultComponentVariation();
    creatorCamera.setActive(false);
	creatorCamera.destroy();
	creatorCamera = null;
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
}

mp.events.add({
    "cFactionSelection" : (data) => {
      showSelectionCef("package://gamemode/browser/player/selection/selection.html");  
      misc.injectCef("setup", data);
    },
    "cSkinChange" : (hash) => {
        mp.events.callRemote("sSkinChange", hash);
    },
    "cPedTitle" : (faction, text, color) => {
        mp.events.call("ShowMidsizedShardMessage", faction, text, color, false, true, 5000);
    },
    "cSelectFaction": (ped) => {
        mp.events.callRemote("loadPlayerFaction", ped);
    },
    "cSelectError": () => {
        misc.injectCef("showError");
    },
    "cFactionSelectionDone" : () => {
        leaveSelectionCef();
    }
});