const DB = require('./db');
const Veh_Hashes = require('../data/vehicle_hashes');
const Config = require('../data/config.json');

let Vehicles = [];
/**
 * load all vehicle (Only local)
 */
function loadVehicles() {
    DB.Handle.query(`SELECT * FROM server_vehicles`, function(e, result) {
        if(e) return console.log(e);
        for(var i =0; i<result.length; i++) {
            spawnVeh(i, result[i]);
        };
    })
}
/**
 * Spawn vehicle from veh datas
 * @param {int} id Vehicle ID
 * @param {Array} veh Vehicle datas
 */
function spawnVeh(id, veh) {
    if(Vehicles[id]) return false;
    Vehicles[id] = mp.vehicles.new(mp.joaat(veh.name), new mp.Vector3(veh.posx, veh.posy, veh.posz), {
        color: veh.color,
        heading: veh.angle,
        locked: veh.locked,
        numberPlate: veh.plate,
        dimension: veh.dimension
    });
    Vehicles[id].numberPlate = veh.plate;
    Vehicles[id].setColor(veh.color1, veh.color2);
    Vehicles[id].color1 = veh.color1;
    Vehicles[id].color2 = veh.color2;
    Vehicles[id].sqlid = veh.id;
    Vehicles[id].faction_id = veh.faction_id;
    Vehicles[id].modelName = veh.name;
    setVehMods(veh.id);   
    return true;
}


/**
 * Get all veh mod by Veh id
 * @param {int} id Veh id
 */
function setVehMods(id) {
    DB.Handle.query(`SELECT * FROM server_vehicles_mods WHERE veh_id = ${id+1}`, function(e, result) {
        if(e) return console.log(e);
        result.forEach(mod => {
            Vehicles[id].setMod(parseInt(mod.modType), parseInt(mod.modIndex));
        });
    });
}
/**
 * Destroy a vehicle
 * @param {int} id Veh id
 */
function destroyVehicle(id) {
    if(!Vehicles[id]) return false;
    Vehicles[id].destroy();
    delete Vehicles[id];
}
module.exports.destroyVehicle = destroyVehicle;
/**
 * 
 * @param {int} id SQL ID
 * @param {string} name Veh name (Not hashed)
 * @param {int} faction_id Faction id if has one
 * @param {float} posx Position X
 * @param {float} posy Position y
 * @param {float} posz POsition Z
 * @param {float} angle Angle of vehicle
 * @param {int} color1 First color PRIMARY
 * @param {int} color2 Second color SECONDARY
 * @param {string} plate Vehicle plate MAX 8 CHAR
 * @param {int} locked DEFAULT 0 VEHICLE IS LOCKED
 * @param {int} dimension Default 0
 */
function saveVehicleData(id, name, faction_id, posx, posy, posz, angle, color1,color2, plate, locked, dimension = Config.defaultDimension) {
    DB.Handle.query(`UPDATE server_vehicles SET 
    name = "${name}", 
    faction_id = ${faction_id}, 
    posx = ${posx},
    posy = ${posy},
    posz = ${posz},
    angle = ${angle},
    color1 = ${color1},
    color2 = ${color2},
    plate = "${plate}",
    locked = ${locked},
    dimension = ${dimension}
    WHERE id = ${id}`, function(e) { if(e) return console.log(e); } );
    return true;
}
/**
 * Save a mod
 * @param {int} id VEH ID
 * @param {Object} mod Veh mod object
 */
function saveVehicleMod(id, mod) {
    DB.Handle.query(`SELECT * FROM server_vehicles_mods WHERE veh_id = ${id} AND modType = ${mod.modType}`, function(e, result) {
        if(e) return console.log(e);
        if(result[0]) {
            DB.Handle.query(`UPDATE server_vehicles_mods SET modIndex = ${mod.modIndex} WHERE veh_id = ${id} AND modType = ${mod.modType}`, function(e, result) {
                if(e) return console.log(e);
            });
        } else {
            DB.Handle.query(`INSERT INTO server_vehicles_mods VALUES ("", ${id}, ${mod.modType}, ${mod.modIndex})`, function(e, result) {
                if(e) return console.log(e);
            });
        }
    });
}


module.exports.getVehicleData = function(id) { return Vehicles[id]; }

function editVehicle(id, ...args) {
    if(!Vehicles[id]) return false;
    args.forEach(e => {
        switch(e[0]) {
            case "model":
                Vehicles[id].model = mp.joaat(e[1]);
                Vehicles[id].modelName = e[1];
                break;
            case "faction_id":
                Vehicles[id].faction_id = parseInt(e[1]);
                break;
            case "color":
                Vehicles[id].setColor(parseInt(e[1]), parseInt(e[2]));
                break;
            case "plate":
                Vehicles[id].numberPlate = e[1];
                break;   
            case "dimension":
                Vehicles[id].dimension = e[1];
                break;         
        }
    });
    return true;    
}
module.exports.editVehicle = editVehicle;

function isVehNameValid(name) {
    return (typeof Veh_Hashes[name] !== "undefined");
}
module.exports.isVehNameValid = isVehNameValid;

function getVehNameFromHash(hash) {
    for(var key in Veh_Hashes) {
        if(hash == Veh_Hashes[key]['hash']) {
            model = key;
            break;
        }
    }
    return model;
}

function saveVehicle(id) {
    if(!Vehicles[id] || Vehicles[id].temp) return false;
    v = Vehicles[id];
    model = getVehNameFromHash(v.model);
    pos = v.position;
    heading = v.heading;
    saveVehicleData(v.sqlid, model, v.faction_id, pos.x, pos.y, pos.z, heading, v.getColor(0), v.getColor(1), v.numberPlate, v.locked, v.dimension);
    for(var i=0; i < 57;i++) {
        mod = v.getMod(i);
        if(mod == 255) continue;
        saveVehicleMod(v.sqlid, { modType: i, modIndex: mod});
    }
    return true;
}
module.exports.saveVehicle = saveVehicle;

module.exports.respawnAllVehicles = function() {
    for(var i = 0; i < Vehicles.length; i++) {
        destroyVehicle(i);
    }
    loadVehicles();
}

function loadNewVeh() {
    DB.Handle.query(`SELECT * FROM server_vehicles ORDER BY id DESC LIMIT 1`, function(e, result) {
        if(e) return console.log(e);
        spawnVeh(Vehicles.length, result[0]);
    })
}

module.exports.createTempVehicle = function(name, posx, posy, posz, angle, color1, dimensione) {
    id = Vehicles.length;
    Vehicles[id] = mp.vehicles.new(mp.joaat(name), new mp.Vector3(posx, posy, posz), {
        heading: angle,
        dimension: dimensione
    });
    Vehicles[id].temp = true;
    Vehicles[id].setColor(color1);
    Vehicles[id].modelName = name;
    return Vehicles[id];
}

module.exports.createOwnedVehicle = function(model, posx, posy, posz, angle) {
    id = Vehicles.length;
    Vehicles[id] = mp.vehicles.new(model, new mp.Vector3(posx, posy, posz), {
        heading: angle,
        dimension: Config.defaultDimension
    });
    Vehicles[id].owned = true;
    Vehicles[id].faction_id = 1;
    return Vehicles[id];
}
module.exports.createVehicle = function(name, faction_id, posx, posy, posz, angle, color1,color2, plate, locked, dimension) {
    DB.Handle.query(`INSERT INTO server_vehicles(faction_id, name, posx, posy, posz, angle, color1,color2, plate, locked, dimension) VALUES (
        ${faction_id},
        "${name}",
        ${posx},
        ${posy},
        ${posz},
        ${angle},
        ${color1},
        ${color2},
        "${plate}",
        ${locked},
        ${dimension}
    )`, function(e) { 
        if(e) return console.log(e);        
        loadNewVeh();
    });
    return true;
}

module.exports.Init = function() {
    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_vehicles (
        id int NOT NULL,
        faction_id int NOT NULL DEFAULT 1,
        hash bigint NOT NULL,
        posx float NOT NULL,
        posy float NOT NULL,
        posz float NOT NULL,
        angle float NOT NULL,
        color1 int NOT NULL DEFAULT 0,
        color2 int NOT NULL DEFAULT 0,
        plate varchar(8) NOT NULL DEFAULT "None",
        locked int NOT NULL DEFAULT 0,
        dimension int NOT NULL DEFAULT ${Config.defaultDimension}
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function(){ });
    DB.Handle.query("ALTER TABLE `server_vehicles` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_vehicles` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );


    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_vehicles_mods (
        id int NOT NULL,
        veh_id int NOT NULL,
        modType int NOT NULL,
        modIndex int NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function(){ });
    DB.Handle.query("ALTER TABLE `server_vehicles_mods` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_vehicles_mods` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );

    loadVehicles();

}