const Labels = require('./labels')
const ATM_pos = require('../data/atm_pos');
const Config = require('../data/config.json')

let ATMs = [];

const ATM = function(pos) {
    this.labelID = Labels.createLabelOffline("ATM", pos, 0, 15);
    this.marker = mp.markers.new(1, {x: pos.x, y: pos.y, z: pos.z -1}, 1, {
        dimension: Config.defaultDimension,
        color: [7,155,9,125]
    });
    this.marker.atm = true;    
    this.blip = mp.blips.new(207, pos, {
        dimension: Config.defaultDimension,
        color: 52,
        name: "ATM"
    });
}


function SaveNewATM(pos) {
    ATM_pos.push([ATM_pos.length,pos.x,pos.y,pos.z]);
    fs = require('fs');
    fs.writeFile('./packages/gamemode/data/atm_pos.js', "module.exports = " + JSON.stringify(ATM_pos), function(err) {
        if(err) console.log(err);
    });
}
module.exports.SaveNewATM = SaveNewATM;


module.exports.Init = () => {
    ATM_pos.forEach(e => {
        i = ATMs.length;
        ATMs[i] = ATM(new mp.Vector3(e[1], e[2], e[3]));
    });
}