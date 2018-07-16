var Logs = require('../modules/logs');
var DB = require('../modules/db');
var Players = require('../modules/players');

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
    player.call("cInjectCefLogin", [str]);
}
function showErrorLength(player) {
    let str = "showErrorLength();";
    player.call("cInjectCefLogin", [str]);
}

module.exports = {
    'sTryRegister' : (player, pass, email) => {
        const hash = hashPassword(pass);
        if ( typeof player.ID === 'undefined' || Players.IsPlayerLogged ( player.ID ) ) {
            DB.Handle.query("SELECT null FROM server_players WHERE name = ? OR email = ?", [player.name, email],function(e, result) {
                if (!e) {
                    if ( !result.length ) {
                        if ( pass >= 6 ) {
                            DB.Handle.query("INSERT INTO server_players (name, email, password) VALUES (?,?,?)", [player.name, email, hash], function(e) {
                                if ( e ) console.log ( e );   
                                    showSuccess(player);      


                                    setTimeout(function() {
                                        Logs.Insert("Player " + player.name + " logged in.");
                                        player.call("cCloseCefAndDestroyCam");
                                        mp.events.call('loadPlayer', player);
                                    }, 2000);
                            });
                        } else showErrorLength(player); 
                    } else showError(player); 
                } else console.log (e);
            });
        } else console.log("[DEBUG:] ERROR!")
    }
}