const Labels = require('./labels')
const ATM_pos = require('../data/atm_pos');
const Config = require('../data/config.json')
const GamePOI = require('../modules/gamepoi')

let ATMs = [];

const ATM = function(pos) {
    let item = new GamePOI(pos, 1, {atm: true});
    item.createMarker(1, {dimension: Config.defaultDimension, color:[7,155,9,125]});
    item.createColshape("circle", true, "colshapeATMMenu");
    item.createBlip(207, 52, "ATM");
    return item;
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