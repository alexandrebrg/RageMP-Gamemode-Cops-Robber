const DB = require('./db');
const config = require('../data/config');

let Bizs = [];

function loadBiz() {
    DB.Handle.query(`SELECT * from server_biz`, function(e, result) {
        if(e) return console.log(e);
        result.forEach(e => {
            var biza = new Biz(e['id'], e['type'], e['name'], e['posx'], e['posy'], e['posz'], e['dimension']);
            Bizs[biza.id] = biza;        
        });

    });
}

const Biz = function(id, type, name, posx, posy, posz, dimension) {
    switch(type) {
        case 1:
            this.name = "~b~24/7";
            this.nameNotColored = "24/7"
            this.color = [63,191,191,255];
            blipID = 52;
            break;
        case 2:
            this.name = "~r~Ammunation";
            this.nameNotColored = "Ammunation"
            this.color = [191,63,63,255];
            blipID = 110;
            break;
        default:
            this.name = "Type unknown";
            this.nameNotColored = "Unknown"
            this.color = [191,63,63,255];
            blipID = 66;
            break;
    }

    this.id = id;
    this.type = type;
    this.pos = new mp.Vector3(posx, posy, posz);
    this.label = mp.labels.new(this.name,this.pos, {
        font: 0,
        dimension: dimension,
        drawDistance: 50
    });
    this.pos = new mp.Vector3(posx, posy, posz-2);
    this.marker = mp.markers.new(1, this.pos, 3, {
        dimension: dimension,
        color: this.color,
        visible: true
    });
    this.marker.sqlid = id;
    this.label.sqlid = id;
    this.marker.store = true;
    this.marker.storeType = type;
    this.blip = mp.blips.new(blipID, this.pos, {
        name: this.nameNotColored,
        dimension: dimension
    });
}

function setRobbed(id) {
    for( var i =1;i<Bizs.length;i++) {
        if(Bizs[i].id == id) {
            Bizs[id].marker.robbed = config.robberyTimer;
            Bizs[id].label.text = Bizs[id].nameNotColored + "~n~~r~Already robbed!";
            return true;
        }
    }
}
module.exports.setRobbed = setRobbed;

function resetRob(id) {
    for( var i =1;i<Bizs.length;i++) {
        if(Bizs[i].id == id) {
            Bizs[id].marker.robbed = false;
            Bizs[id].label.text = Bizs[id].name;
            return true;
        }
    }
}
module.exports.resetRob = resetRob;


function getBizsPos(){
    pos = [];
    for(var i =1;i<Bizs.length;i++) {
        pos.push([Bizs[i].pos, Bizs[i].id]);
    }
    return pos;
}
module.exports.getBizsPos = getBizsPos;
function getBizsMakers(){
    marker = [];
    id = [];
    for(var i =1;i<Bizs.length;i++) {
        marker.push(Bizs[i].marker);
        id.push(Bizs[i].id);
    }
    return [marker, id];
}
module.exports.getBizsMakers = getBizsMakers;

function GenerateBiz(type, name, posx, posy, posz, dimension) {
    DB.Handle.query(`INSERT INTO server_biz VALUES(
        "", 
        ${type},
        "${name}",
        ${posx},
        ${posy},
        ${posz},
        ${dimension}
    )`, function(e) { if(e) return console.log(e); } );
    return true;
}

module.exports.CreateBiz = function(type, name, posx, posy, posz, dimension) {
    GenerateBiz(type, name, posx, posy, posz, dimension);
    loadBiz();
}

module.exports.getBizType = function(id) {
    for( var i =1;i<Bizs.length;i++) {
        if(Bizs[i].id == id) {
            return Bizs[i].type;
        }
    }
}

module.exports.getBizPos = function(id) {
    for( var i =1;i<Bizs.length;i++) {
        if(Bizs[i].id == id) {
            return Bizs[i].pos;
        }
    }
}



module.exports.Init = function() {
    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_biz (
        id int NOT NULL,
        type int NOT NULL,
        name varchar(128) NOT NULL,
        posx float NOT NULL,
        posy float NOT NULL,
        posz float NOT NULL,
        dimension INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function() { } );
    DB.Handle.query("ALTER TABLE `server_biz` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_biz` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );

    loadBiz();
}
