
const misc = require('/gamemode/cMisc.js');

function showCef(url) {
	misc.prepareToCef(1);
	misc.createCam(3223, 5349, 14, 0, 0, 218, 20);
        misc.openCef(url);        
}


mp.events.add({
    'cLoginUI' : () => {
            showCef('package://gamemode/browser/player/login/login.html');
    },
    'cRegisterUI' : () => {
            showCef('package://gamemode/browser/player/login/register.html');
    },
    'cTryLogin' : (pass, email) => {
            mp.events.callRemote('sTryLogin', pass, email);
    },
    'cFromRegisterToLogin': () => {
            mp.events.call("cCloseCef");
            mp.events.call("cLoginUI");
    },
    'cFromLoginToRegister': () => {
            mp.events.call("cCloseCef");
            mp.events.call("cRegisterUI");
    }
});