const fs = require('fs');

const cmds = [];

fs.readdirSync(path.resolve(global.Path, 'cmds')).forEach( function(i) {
    Object.assign(cmds, require('../cmds/' + i)); 
});

module.exports =
{
	"playerCommand": (player, cmdtext) =>
	{
		var params = cmdtext.split(" ");
		// params [ 0 ] it is always command name
		
        var cmd = cmds [ params[0] ];
        
        if(cmd != null)
		{
			params.splice(0,1);
			cmd(player, params);
		} else {
			player.notify("~r~This command does not exist");
		}
	}
};