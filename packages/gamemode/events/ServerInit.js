const Players = require('../modules/players');
const Logs = require('../modules/logs');
const Admins = require('../modules/admins');
const Factions = require('../modules/factions');
const Vehicles = require('../modules/vehicles');
const Labels = require('../modules/labels');
const Biz = require('../modules/business');
const Timers = require('../modules/timers');
const Teleporters = require('../modules/teleporters');
const ATMs = require('../modules/atm')

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