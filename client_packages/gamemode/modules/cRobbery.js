const timerBarLib = require("/gamemode/modules/lib/timerbars");

var player = mp.players.local;
let rewardBar = null;
let robberyBar = null;
let interval = null;

mp.events.add({

    "InterruptRobberyTimer": () => {
        if(interval) {
            clearInterval(interval);
            interval = null;
        }
        robberyBar.visible = false;
        robberyBar = null;

        rewardBar.visible = false;
        rewardBar = null;
    },
    "setRobberyTimer": (time) => {
        timeLeft = time;
        mp.events.call("ShowShardMessage", "Robbery started!", "Stay in the checkpoint to not interrupt it!", 0, 6);
        if(robberyBar == null) {
            robberyBar = new timerBarLib.TimerBar("TIME LEFT");  
            robberyBar.text = `${time}`;
        }
        interval = setInterval(function() {
            if(timeLeft == 0) {
                interval = clearInterval(interval);
                interval = null;
            }  else {
                timeLeft -= 1;  
                if(timeLeft % 2 === 0) {
                    robberyBar.textColor = [183, 0, 0, 255];
                } else {
                    robberyBar.textColor = [255, 255, 255, 255];
                }  
            }
            robberyBar.text = (timeLeft != 0) ? `${timeLeft}` : `Done`;  
        }, 1000);
    },
    "clearRobberyTimers": () => {
        robberyBar.visible = false;
        robberyBar = null;
        rewardBar.visible = false;
        return rewardBar = null;

    }

})