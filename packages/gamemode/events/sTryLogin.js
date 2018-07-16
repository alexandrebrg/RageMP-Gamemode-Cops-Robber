var Logs = require('../modules/logs');

function hashPassword(str) {
    const cipher = crypto.createCipher('aes192', 'a pass');
	let encrypted = cipher.update(str, 'utf8', 'hex'); 
    encrypted += cipher.final('hex');
    return encrypted;
}

function showSuccess(player) {
    const str = "showSuccess();";
    player.call("cInjectCefLogin", [str]);
}

function showError(player) {
    let str = "showError();";
    if (player.name === "WeirdNewbie") str += "showDefNameError();"
    player.call("cInjectCefLogin", [str]);
}

module.exports = {
    'sTryLogin' : (player, pass, email) => {
        const hash = hashPassword(pass);
		if (hash !== player.password) {
            Logs.Insert(`${player.name} entered wrong password!`);
            return showError(player);
        }
        if (email !== player.info.email) {
            Logs.Insert(player.name + "entered wrong email!");
            return showError(player);
        }
        showSuccess(player); 


        setTimeout(function() {
            Logs.Insert("Player " + player.name + " logged in.");
            player.call("cCloseCefAndDestroyCam");
            mp.events.call('loadPlayer', player);
        }, 2000);
    }
}