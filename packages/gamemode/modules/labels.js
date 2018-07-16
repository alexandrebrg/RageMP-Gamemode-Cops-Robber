var DB = require('./db');
var ATM_pos = require('../data/atm_pos');
var Config = require('../data/config.json')

var Labels = [];
Labels[0] = {};
function loadLabels() {
    DB.Handle.query(`SELECT * FROM server_labels`, function(e, result) {
        if(e) return console.log(result);
        result.forEach(label => {
            i = Labels.length;
            while(Labels[i]) {
                i++
            }
            Labels[i] = mp.labels.new(label.text, new mp.Vector3(label.posx, label.posy, label.posz), {
                los: label.los,
                font: label.font,
                drawDistance: label.drawDistance,
                dimension: label.dimension
            });
            Labels[i].sqlid = label.id;
        });

    });
    return true;
}

function createLabelOffline(text, pos, dimension, distance = 50) {
    Labels[Labels.length] = mp.labels.new(text, pos, {
        dimension: dimension,
        drawDistance: distance
    });
    return Labels.length - 1;
}
module.exports.createLabelOffline = createLabelOffline;


function updateLabelOffline(id, text) {
    Labels[id].text = text;
}
module.exports.updateLabelOffline = updateLabelOffline;


function createLabel(text, pos, los, font, drawDistance, dimension) {
    if(!los) los = false;
    if(!font) font = 0;
    if(!dimension) dimension = Config.defaultDimension;
    if(!drawDistance) drawDistance = 50;
    DB.Handle.query(`INSERT INTO server_labels VALUES(
      "",
      "${text}",
      ${pos.x},
      ${pos.y},
      ${pos.z},
      ${los},
      ${font},
      ${drawDistance},
      ${dimension}  
    );`, function(e) { if(e) return console.log(e); });
    loadLabels();
    return true;
}
module.exports.createLabel = createLabel;

module.exports.Init = function() {
    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_labels (
        id int NOT NULL,
        text varchar(128) NOT NULL,
        posx float NOT NULL,
        posy float NOT NULL,
        posz float NOT NULL,
        los int NOT NULL DEFAULT 0,
        font int NOT NULL DEFAULT 0,
        drawDistance int NOT NULL DEFAULT 50,
        dimension int NOT NULL DEFAULT ${Config.defaultDimension}
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1; `)
    DB.Handle.query("ALTER TABLE `server_labels` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_labels` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );

    loadLabels();
}