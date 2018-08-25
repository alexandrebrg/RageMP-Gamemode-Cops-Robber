const creatorCoords = {
    defaultVehiclePos: new mp.Vector3(1238.73, 3127.76, 40),
    defaultVehicleHeading: 105.3756,
    defaultPlayerPos: new mp.Vector3(1235.752, 3125.74, 40.414),
    defaultPlayerHeading: 98.969,

    secondVehiclePos: new mp.Vector3(1244.42, 3124.09, 40.02),
    secondVehicleHeading: 102.2796,
    secondPlayerPos: new mp.Vector3(1241.7493, 3124.7, 40.41409),
    secondPlayerHeading: 104.090,

    differenceX: 13.361,
    differenceY: 3.7668,

    differenceCamX: 1240.704956 - 1241.7493,
    differenceCamY: 3124.385498 - 3124.7,
    differenceCamZ: 40.97242736 - 40.41409,

    differenceCamRX: -2.933977,
    differenceCamRZ: -74.1895

};
let creatorCamera;
const localPlayer = mp.players.local;
const misc = require('/gamemode/cMisc.js');
var cFactionON = false;
var cFactionData =[];
var cCurrentFaction = 1;
var cFactionLoading = false;
var camManager = require('/gamemode/modules/lib/camerasManager/');


let sc = mp.game.graphics.requestScaleformMovie("instructional_buttons");
let scInst = 0;


function isEven(n) {
    return n % 2 == 0;
 }
 

function AddInstructionalStart()
{
	scInst = 0;
	mp.game.graphics.drawScaleformMovieFullscreen(sc, 255, 255, 255, 0, false);
    mp.game.graphics.pushScaleformMovieFunction(sc, "CLEAR_ALL");
    mp.game.graphics.popScaleformMovieFunctionVoid();
    mp.game.graphics.pushScaleformMovieFunction(sc, "SET_CLEAR_SPACE");
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(200);
    mp.game.graphics.popScaleformMovieFunctionVoid();
}

function AddInstructionalButton(text, button) 
{
	mp.game.graphics.pushScaleformMovieFunction(sc, "SET_DATA_SLOT");
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(scInst);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(button);
	mp.game.graphics.pushScaleformMovieFunctionParameterString(text);
    mp.game.graphics.popScaleformMovieFunctionVoid();
	scInst++;
}

function AddInstructionalButtonCustom(text, button)
{
	mp.game.graphics.pushScaleformMovieFunction(sc, "SET_DATA_SLOT");
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(scInst);
    mp.game.graphics.pushScaleformMovieFunctionParameterString(button);
	mp.game.graphics.pushScaleformMovieFunctionParameterString(text);
    mp.game.graphics.popScaleformMovieFunctionVoid();
	scInst++;
}

function AddInstructionalEnd(type)
{
	mp.game.graphics.pushScaleformMovieFunction(sc, "DRAW_INSTRUCTIONAL_BUTTONS");
	mp.game.graphics.pushScaleformMovieFunctionParameterInt(type);
    mp.game.graphics.popScaleformMovieFunctionVoid();
    mp.game.graphics.pushScaleformMovieFunction(sc, "SET_BACKGROUND_COLOUR");
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(192);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(57);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(43);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(65);
    mp.game.graphics.popScaleformMovieFunctionVoid();
}

function loadFactionStuff() {
    
    for(var i = 1; i < cFactionData.length; i++) {
        element = cFactionData[i];
        index = i-1;
        carPos = isEven(index) ? creatorCoords.secondVehiclePos : creatorCoords.defaultVehiclePos;
        playerPos = isEven(index) ? creatorCoords.secondPlayerPos : creatorCoords.defaultPlayerPos;
        FactionSelectionCreatePed(i, 0);
        cFactionData[i].currentPed = 0;

        cFactionData[i].veh = mp.vehicles.new(mp.game.joaat(element['default_car']), {x:carPos.x+index*creatorCoords.differenceX, y:carPos.y+index*creatorCoords.differenceY, z:carPos.z},
        {
            numberPlate: "Select",
            heading: 105,
            dimension: localPlayer.dimension,
        });
    }
    FactionSelectionPutCameraOnPed(1);
}

function FactionSelectionPutCameraOnPed(factionid) {
    var faction = cFactionData[factionid];
    cCurrentFaction = factionid;
    if(!creatorCamera) {
        creatorCamera = camManager.createCamera('selectFaction', 'default', new mp.Vector3(faction.ped.position.x + creatorCoords.differenceCamX, faction.ped.position.y + creatorCoords.differenceCamY, faction.ped.position.z + creatorCoords.differenceCamZ), new mp.Vector3(creatorCoords.differenceCamRX, 0, creatorCoords.differenceCamRZ), 50)
        creatorCamera.setActiveCamera(true);
    } else {
        camManager.setActiveCameraWithInterp(creatorCamera, new mp.Vector3(faction.ped.position.x + creatorCoords.differenceCamX, faction.ped.position.y + creatorCoords.differenceCamY, faction.ped.position.z + creatorCoords.differenceCamZ), new mp.Vector3(creatorCoords.differenceCamRX, 0, creatorCoords.differenceCamRZ), 1500, 0, 0);
    }
    mp.events.call("cPedTitle", faction.name, faction.desc, (faction.cop));    
    mp.game.mugboard.show(cFactionData[factionid].ped, cFactionData[factionid].peds[ cFactionData[factionid].currentPed ].name, "", cFactionData[factionid].name, "")
}

function FactionSelectionNextSkin() {
    var peds = cFactionData[cCurrentFaction]['peds'];
    var currentPed = cFactionData[cCurrentFaction].currentPed;
    cFactionData[cCurrentFaction].currentPed =  currentPed >= peds.length-1 ? 0 : currentPed + 1;
    let oldPed = cFactionData[cCurrentFaction].ped;
    mp.game.mugboard.hide(oldPed);
    FactionSelectionCreatePed(cCurrentFaction, cFactionData[cCurrentFaction].currentPed);
    mp.game.mugboard.show(cFactionData[cCurrentFaction].ped, cFactionData[cCurrentFaction].peds[ cFactionData[cCurrentFaction].currentPed ].name, "", cFactionData[cCurrentFaction].name, "")
}

function FactionSelectionPreviousSkin() {
    var peds = cFactionData[cCurrentFaction]['peds'];
    var currentPed = cFactionData[cCurrentFaction].currentPed;
    cFactionData[cCurrentFaction].currentPed =  currentPed == 0 ? peds.length - 1: currentPed - 1;
    let oldPed = cFactionData[cCurrentFaction].ped;
    mp.game.mugboard.hide(oldPed);
    FactionSelectionCreatePed(cCurrentFaction, cFactionData[cCurrentFaction].currentPed);
    mp.game.mugboard.show(cFactionData[cCurrentFaction].ped, cFactionData[cCurrentFaction].peds[ cFactionData[cCurrentFaction].currentPed ].name, "", cFactionData[cCurrentFaction].name, "")
}

function FactionSelectionCreatePed(factionid, pedid) {
    var index = factionid - 1;
    if(cFactionData[factionid].ped) cFactionData[factionid].ped.destroy();
    carPos = isEven(index) ? creatorCoords.secondVehiclePos : creatorCoords.defaultVehiclePos;
    playerPos = isEven(index) ? creatorCoords.secondPlayerPos : creatorCoords.defaultPlayerPos;
    cFactionData[factionid].ped = mp.peds.new(cFactionData[factionid]['peds'][pedid]['hash'], {x:playerPos.x+index*creatorCoords.differenceX, y:playerPos.y+index*creatorCoords.differenceY, z:playerPos.z}, isEven(index) ? creatorCoords.secondPlayerHeading : creatorCoords.defaultPlayerHeading, (streamPed) => {
        // Ped Streamed
        streamPed.setAlpha(0);
    }, localPlayer.dimension);
    cFactionData[factionid].ped.position = {x:playerPos.x+index*creatorCoords.differenceX, y:playerPos.y+index*creatorCoords.differenceY, z:playerPos.z};
}

mp.events.add('render', () => {
    if(cFactionON) {
    
        mp.game.ui.setTextFont(7);
        mp.game.ui.setTextEntry2("STRING");
        mp.game.ui.addTextComponentSubstringPlayerName("Choose a faction to continue");
        mp.game.ui.drawSubtitleTimed(1, true);
        AddInstructionalStart();
        AddInstructionalButtonCustom("Validate", "t_V");
        AddInstructionalButtonCustom("Previous Faction", "t_S");
        AddInstructionalButtonCustom("Next Faction", "t_Z");
        AddInstructionalButtonCustom("Previous Skin", "t_Q");
        AddInstructionalButtonCustom("Next Skin", "t_D");
        AddInstructionalEnd(1);   

    
    }
});

mp.keys.bind(0x44, false, () => { // D
    if(!cFactionON) return; 
    if(mp.players.local.chatState) return;
    if(cFactionLoading) return;
    FactionSelectionNextSkin();
});

mp.keys.bind(0x51, false, () => { //Q
    if(!cFactionON) return; 
    if(mp.players.local.chatState) return;
    if(cFactionLoading) return;
    FactionSelectionPreviousSkin();
});


mp.keys.bind(0x5A, false, () => { // Z
    if(!cFactionON) return; 
    if(mp.players.local.chatState) return;
    FactionSelectionPutCameraOnPed(cCurrentFaction == cFactionData.length-1 ? 1 : cCurrentFaction + 1)
    
});

mp.keys.bind(0x53, false, () => { //S
    if(!cFactionON) return; 
    if(mp.players.local.chatState) return;
    FactionSelectionPutCameraOnPed(cCurrentFaction == 1 ? cFactionData.length-1 : cCurrentFaction - 1)
    
});

mp.keys.bind(0x56, false, function() { // V
    if(!cFactionON) return; 
    if(mp.players.local.chatState) return;
    mp.events.call("cSelectFaction", JSON.stringify(cFactionData[  cCurrentFaction  ]['peds'][ cFactionData[cCurrentFaction].currentPed ]))
});

mp.events.add({
    "cFactionSelection" : (data) => {
        cFactionON = true;
        mp.game.ui.displayHud(false);
        localPlayer.clearTasksImmediately();
        localPlayer.freezePosition(true);
        cFactionData = data;
        loadFactionStuff();
        mp.events.call('changeChatState', false);
        mp.gui.chat.show(false);
        mp.game.ui.displayRadar(false);
    },
    "cSkinChange" : (hash) => {
        mp.events.callRemote("sSkinChange", hash);
    },
    "cPedTitle" : (faction, text, factionCop) => {
        mp.events.call("ShowShardMessage", faction, text, 0, factionCop === 0 ? 27 : 26, 5000);
    },
    "cSelectFaction": (ped) => {
        mp.events.callRemote("loadPlayerFaction", ped);
    },
    "cSelectError": () => {
        misc.injectCef("showError");
    },
    "cFactionSelectionDone" : () => {
        camManager.setActiveCameraWithInterp(creatorCamera, new mp.Vector3(1327.133, 3148.955, 42), new mp.Vector3(creatorCoords.differenceCamRX, -80, creatorCoords.differenceCamRZ), 1500, 0, 0);
        setTimeout( () => {
            mp.events.call("fadeOut");
        }, 1000)
        setTimeout(() => {
            mp.game.ui.displayHud(true);
            localPlayer.freezePosition(false);
            localPlayer.setDefaultComponentVariation();
            cFactionON = false;
            mp.game.ui.displayHud(true);
            localPlayer.freezePosition(false);
            localPlayer.setDefaultComponentVariation();
            mp.events.call('changeChatState', true);
            mp.gui.chat.show(true);
            creatorCamera.setActiveCamera(false);
            camManager.destroyCamera(creatorCamera)
            mp.game.ui.displayRadar(true);
            for(var i=1;i<cFactionData.length;i++) {
                cFactionData[i].ped.destroy();
                cFactionData[i].veh.destroy();
            }            
        }, 1500);
        setTimeout( () => {
            mp.events.call("fadeIn");
        }, 2500)
    }
});
camManager.on('startInterp', (camera) => { 
    if(cFactionON) return cFactionLoading = true;
});
camManager.on('stopInterp', (camera) => {
      if(cFactionON) return cFactionLoading = false;
});