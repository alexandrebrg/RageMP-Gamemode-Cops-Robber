const scaleForm = require('/gamemode/modules/lib/scaleForm');
const camerasManager = require('/gamemode/modules/lib/camerasManager')
let IsInCamSystem = false;

let CamSystemScaleForm = new scaleForm("traffic_cam");
let CamSystemIntruct = new scaleForm("instructional_buttons");
let CamSystemActual  = 0;
let camData = {};
let CamSystemCamera = false;

function CamSystemSetCam(camID) {
    let cam = camData[camID];
    CamSystemScaleForm.callFunction("SET_DETAILS", cam.details);
    if(CamSystemCamera){
        CamSystemCamera.setActiveCamera(false);
        camerasManager.destroyCamera("camSystem");
    }
    CamSystemCamera = camerasManager.createCamera("camSystem", "default", new mp.Vector3(cam.x, cam.y, cam.z), new mp.Vector3(cam.rx, cam.ry, cam.rz), 50, false)
    CamSystemCamera.setActiveCamera(true);
}


mp.events.add({
    "initCamSystem": (camDatas) => {

        // Security Cam
        CamSystemScaleForm.callFunction("SET_LAT_LONG", 27, 07, 14, 23)
        CamSystemScaleForm.callFunction("SET_CAM_DATE", 2, 16, 15);
        CamSystemScaleForm.callFunction("PLAY_CAM_MOVIE");
        camData = camDatas.cameras;

        // Instructionals
        CamSystemIntruct.callFunction("SET_DATA_SLOT_EMPTY");
        CamSystemIntruct.callFunction('CLEAR_BACKGROUNDS');
        CamSystemIntruct.callFunction("SET_DATA_SLOT", 0, "t_F", "Leave");
        CamSystemIntruct.callFunction("SET_DATA_SLOT", 1, "t_D", "Next Camera");
        CamSystemIntruct.callFunction("SET_DATA_SLOT", 2,  "t_Q", "Previous Camera");

        CamSystemIntruct.callFunction("DRAW_INSTRUCTIONAL_BUTTONS", -1);
        CamSystemSetCam(0);
        IsInCamSystem = true;  
        
        mp.gui.chat.show(false);
        mp.game.ui.displayRadar(false);
    },

    // Show the scaleform
    "render": () => {
        if(IsInCamSystem) {
            CamSystemScaleForm.renderFullScreen();
            CamSystemIntruct.renderFullScreen();
        }
    }
});

mp.keys.bind(0x44, false, () => { // D Next Camera
    if(!IsInCamSystem)
        return;
    CamSystemActual = camData.length-1 === CamSystemActual  ? 0 : CamSystemActual + 1;
    CamSystemSetCam(CamSystemActual);
});
mp.keys.bind(0x51, false, () => { // Q Previous Camera
    if(!IsInCamSystem)
        return;
    CamSystemActual = 0 === CamSystemActual ? camData.length -1 : CamSystemActual - 1;
    CamSystemSetCam(CamSystemActual);
});
mp.keys.bind(0x46, false, () => {
    if(!IsInCamSystem)
        return;
    CamSystemScaleForm.dispose();    
    setTimeout( () => { CamSystemScaleForm = new scaleForm("traffic_cam"); }, 10);
    setTimeout( () => { 
        CamSystemScaleForm.dispose(); 
        CamSystemIntruct.dispose();
        IsInCamSystem = false; 
        CamSystemCamera.setActiveCamera(false);
        camerasManager.destroyCamera("camSystem");
        mp.gui.chat.show(true);
        mp.game.ui.displayRadar(true);
    }, 3000);
});