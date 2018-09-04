const camData = require('../data/cameras.json')

mp.events.add({
    "initCamSystem": (player, areaID)=> {
        player.call("initCamSystem",camData[areaID])
    }
})