player = mp.players.local


const timerBarLib = require("/gamemode/modules/lib/timerbars");
let jailTimeLeft = null;
let JailTimeLeftS = 0;
let jailTimeLeftTimer = null;

function updateTimeLeft() {
    JailTimeLeftS -= 1;
    jailTimeLeft.text = `${JailTimeLeftS}s`
    if(JailTimeLeftS == 0) {
        clearTimeout(jailTimeLeftTimer);
        jailTimeLeft.visible = false;
        jailTimeLeft = null;
    }
}

mp.events.add({
    "cCuff": () => {        
        player.setEnableHandcuffs(true);
        player.cuffed = true;
    },
    "cUnCuff": () => {
        player.setEnableHandcuffs(false);
        player.cuffed = false;
    },
    "setWantedLevel": (level) => {    
        if(level == 0) return false;
        mp.events.call("BN_ShowWithPicture", "Wanted!","Anonymous", "You are wanted from cops, take care buddy!", "CHAR_HUMANDEFAULT", 0, false, 6);
        mp.game.gameplay.setFakeWantedLevel(parseInt(level));
    },    
    "clearWantedLevel": (message = true) => {
        if(message) { mp.events.call("BN_ShowWithPicture", "Free, finally!","Anonymous", "You did great, you are no longer wanted!", "CHAR_HUMANDEFAULT", 0, false, 0); }
        mp.game.gameplay.setFakeWantedLevel(0);
    },
    "setJailTimeLeft": (time) => { 
        time = parseInt(time);       
        jailTimeLeft = new timerBarLib.TimerBar("TIME LEFT");
        jailTimeLeft.textColor = [255, 0, 0, 120];
        jailTimeLeft.text = `${time}s`;
        JailTimeLeftS = time;
        jailTimeLeftTimer = setInterval(updateTimeLeft, 1000);
        
    }
})

    // ATTACK
    control = [
        140,141,142,257,263,264,24,25,22, // ATTACK
        59, // CONTROL CAR DIRECTION
        69,92,114 // VEH IN ATTACK
    ]
mp.events.add('render', () => {
    control.forEach(element => {
        if(player.cuffed) {
            mp.game.controls.disableControlAction(2, element, true); 
        } else {
            mp.game.controls.enableControlAction(2, element, true);
        }
    });
});