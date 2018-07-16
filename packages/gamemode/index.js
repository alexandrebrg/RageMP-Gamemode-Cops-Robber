"use strict";

var DB = require('./modules/db');
var fs = require('fs');
var path = require('path');

var Events = [];

global.MAX_PLAYERS = 100;
global.Path = __dirname;

DB.Connect(function() {
    
    fs.readdirSync(path.resolve(__dirname, 'events')).forEach( function(i) {
        Events = Events.concat( require('./events/' + i ) );
    });
    
    Events.forEach(function(i){
        mp.events.add(i);   
    });
    mp.events.call ( 'ServerInit' );
});
