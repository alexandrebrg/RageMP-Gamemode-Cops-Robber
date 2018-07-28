var Players = require('../modules/players');
var Logs = require('../modules/logs');
var Admins = require('../modules/admins');
var Factions = require('../modules/factions');
var Vehicles = require('../modules/vehicles');
var Labels = require('../modules/labels');
var Biz = require('../modules/business');
var Timers = require('../modules/timers');
var Teleporters = require('../modules/teleporters');
var ATMs = require('../modules/atm')

module.exports.ServerInit = function() {
    Players.Init();

    Logs.Init();

    Admins.Init();

    Factions.Init();

    Vehicles.Init();

    Labels.Init();

    Biz.Init();

    Timers.Init();

    Teleporters.Init();

    ATMs.Init();
    
    console.log("Starter");
}