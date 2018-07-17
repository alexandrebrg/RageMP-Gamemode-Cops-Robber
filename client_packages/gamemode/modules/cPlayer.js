

const hudComponentID = 19;
const rankBarColor = 116;
const timerBarLib = require("/gamemode/modules/lib/timerbars")
const misc = require('/gamemode/cMisc.js');
const NativeUI = require('/gamemode/modules/lib/nativeui');

var player = mp.players.local;
let rewardBar = null;
let robberyBar = null;
let interval = null;

mp.events.add({
    "setWaypoint": (x, y) => {
        mp.game.ui.setNewWaypoint(x, y);
    },
    "fadeOut": () => {
        mp.game.cam.doScreenFadeOut(500);
    },
    "fadeIn": () => {
        mp.game.cam.doScreenFadeIn(1000);
    },
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

    },
    "setRewardBar": (reward) => {
        if(rewardBar == null) { 
            rewardBar = new timerBarLib.TimerBar("BENEFITS");
            rewardBar.textColor = [0, 200, 0, 255];
        }
        if(reward != 0) {            
            rewardBar.text = `$${reward}`;
        }
    },
    "cJobSelection": () => {
        mp.gui.chat.show(false);


        ui = new NativeUI.Menu("Select a job", "Select a job as Civil!", new NativeUI.Point(50,200));
        item = new NativeUI.UIMenuItem(
            "Hacker",
            "Hack stuff, little or big!"
        );
        item.SetLeftBadge(4);
        ui.AddItem(item);

        ui.ItemSelect.on(item => {
            switch(item.Text) {
                case "Hacker":
                    jobID = 0;
                    break;
            }
            mp.events.callRemote("sJobSelection", jobID);
            ui.Close();
            ui = null;
            mp.gui.chat.show(true);

        });
    },
    "playSound": (SoundName, SoundSetName) => {
        mp.game.audio.playSoundFrontend(1, SoundName, SoundSetName, true);
    },

    
    "ATMChoice": (id) => {
        mp.gui.chat.show(false);


        ui = new NativeUI.Menu("ATM", "Select what you want to do!", new NativeUI.Point(50,200));
        item = new NativeUI.UIMenuItem(
            "ATM Menu",
            "WithDraw / Deposit money"
        );
        ui.AddItem(item);
        item = new NativeUI.UIMenuItem(
            "Hack",
            "You need to be hacker for this."
        );
        ui.AddItem(item);
        item = new NativeUI.UIMenuItem(
            "Exit",
            "Exit, is exit, whatever it is !"
        );
        ui.AddItem(item);
        ui.ItemSelect.on(item => {
            switch(item.Text) {
                case "ATM Menu":
                    mp.events.callRemote("sAction", 0);
                    break;
                case "Hack":
                    mp.events.callRemote("sAction", 1, id);
                    break;
            }
            ui.Close();
            ui = null;
            mp.gui.chat.show(true);
        });
    },    
    "AMMUNATIONchoice": (id) => {
        mp.gui.chat.show(false);


        ui = new NativeUI.Menu("Ammunation", "Select what you want to do!", new NativeUI.Point(50,200));
        item = new NativeUI.UIMenuItem(
            "Buy weapons",
            ""
        );
        ui.AddItem(item);
        item = new NativeUI.UIMenuItem(
            "Hold up!",
            "Steal money!"
        );
        ui.AddItem(item);
        item = new NativeUI.UIMenuItem(
            "Exit",
            "Exit, is exit, whatever it is !"
        );
        ui.AddItem(item);
        ui.ItemSelect.on(item => {
            switch(item.Text) {
                case "Buy weapons":
                    break;
                case "Hold up!":
                    mp.events.callRemote("sAction", 2, id);
                    break;
            }
            ui.Close();
            ui = null;
            mp.gui.chat.show(true);
        });
    },    
    "247choice": (id) => {
        mp.gui.chat.show(false);


        ui = new NativeUI.Menu("24/7", "Select what you want to do!", new NativeUI.Point(50,200));
        item = new NativeUI.UIMenuItem(
            "Buy stuff",
            ""
        );
        ui.AddItem(item);
        item = new NativeUI.UIMenuItem(
            "Hold up!",
            "Steal money!"
        );
        ui.AddItem(item);
        item = new NativeUI.UIMenuItem(
            "Exit",
            "Exit, is exit, whatever it is !"
        );
        ui.AddItem(item);
        ui.ItemSelect.on(item => {
            switch(item.Text) {
                case "Buy stuff":
                    break;
                case "Hold up!":
                    mp.events.callRemote("sAction", 2, id);
                    break;
            }
            ui.Close();
            ui = null;
            mp.gui.chat.show(true);
        });
    },


    // HACKERS
    "hackerConsole": (type ) => {     
        mp.players.local.inMenu = true;
        misc.prepareToCef();
        player.freezePosition(true);
        mp.game.ui.displayHud(false);
        misc.openCef('package://gamemode/browser/player/hacker/hacker.html');
        switch(type) {
            case "ATM":
                misc.injectCef("setHackingType", "ATM")
        }
    },
    "hackerConsoleClose": () => {
        misc.closeCef();
        mp.players.local.inMenu = false;
        player.freezePosition(false);
        mp.game.ui.displayHud(true);
    },
    "hackerATMWithdraw": () => {
        mp.events.call("hackerConsoleClose");
        mp.events.callRemote("hackerATMWithdraw", mp.players.local);
    },
    "updateRankBar": (limit, nextLimit, previousXP) => {
        if (!mp.game.graphics.hasHudScaleformLoaded(hudComponentID)) {
            mp.game.graphics.requestHudScaleform(hudComponentID);
            while (!mp.game.graphics.hasHudScaleformLoaded(hudComponentID)) mp.game.wait(0);
    
            mp.game.graphics.pushScaleformMovieFunctionFromHudComponent(hudComponentID, "SET_COLOUR");
            mp.game.graphics.pushScaleformMovieFunctionParameterInt(rankBarColor);
            mp.game.graphics.popScaleformMovieFunctionVoid();
        }
    
        mp.game.graphics.pushScaleformMovieFunctionFromHudComponent(hudComponentID, "SET_RANK_SCORES");
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(limit);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(nextLimit);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(previousXP);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(player.getVariable("currentXP"));
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(player.getVariable("currentLevel"));
        mp.game.graphics.popScaleformMovieFunctionVoid();
    },
    "playerDead": () => {
        mp.game.gameplay.setFadeOutAfterDeath(true);
        setTimeout(function() {
            mp.game.cam.doScreenFadeIn(1000);
        }, 10000)
    }


}); 
