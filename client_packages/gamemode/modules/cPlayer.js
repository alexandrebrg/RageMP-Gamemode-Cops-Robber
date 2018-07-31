

const hudComponentID = 19;
const rankBarColor = 116;
const timerBarLib = require("/gamemode/modules/lib/timerbars")
const misc = require('/gamemode/cMisc.js');
const NativeUI = require('/gamemode/modules/lib/nativeui');

var player = mp.players.local;
let rewardBar = null;
let robberyBar = null;
let interval = null;
let camera = null;

let weaponName = null; // Ammunation stuff


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
    "cJobSelection": (jobs) => {
        mp.gui.chat.show(false);

        jobs = JSON.parse(jobs);
        var job = null;

        ui = new NativeUI.Menu("Select a job", "Select a job as Civil!", new NativeUI.Point(50,200));

        for(var key in jobs) {
            item = new NativeUI.UIMenuItem(
                "Choose " + jobs[key].name,
                jobs[key].description
            );
            if(jobs[key].badge) item.SetLeftBadge(jobs[key].badge);
            ui.AddItem(item);
        }
        ui.AddItem( new NativeUI.UIMenuItem("I don't want a job", "Not having job is not important !"));
        ui.ItemSelect.on( (item, Index) => {
            for(var key in jobs) {
                if("Choose " + jobs[key].name != item.Text) continue;
                mp.events.callRemote("sJobSelection", parseInt(key));
                job = parseInt(key);
                ui.Close();
            }
        });
        ui.MenuClose.on( () => {
            if(job == null) return player.notify("You choose to not have a job, no problem !");
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
    "AMMUNATIONchoice": (id, weapons) => {
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
                    ui.Close();
                    mp.events.call("AmmunationItemsChoice", weapons);
                    break;
                case "Hold up!":
                    ui.Close();
                    mp.events.callRemote("sAction", 2, id);
                    break;
            }
        });
        ui.MenuClose.on( () => {
            mp.gui.chat.show(true);
            ui = null;
        })
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
                    ui.Close();
                    mp.events.call("247ItemsChoice");
                    break;
                case "Hold up!":
                    mp.events.callRemote("sAction", 2, id);
                    break;
                default:
                    ui.Close();
                    break;
            }
        });
        ui.MenuClose.on( () => {
            mp.gui.chat.show(true);
            ui = null;
        })
    },
    "AmmunationItemsChoice": (weapons) => {
        if(!weapons) return mp.gui.chat.push("There is no weapon to sell here")
        weapons = JSON.parse(weapons);
        weaponName = Object.keys(weapons)[0]
        var weapon = "Buy this weapon for ~g~$~w~" + weapons[Object.keys(weapons)[0]].price;

        mp.gui.chat.show(false);


        camera = mp.cameras.new('weapon', new mp.Vector3(weapons[weaponName].x, weapons[weaponName].y, weapons[weaponName].z), mp.game.cam.getGameplayCamRot(2), 45);
        camera.setActive(true);
        camera.pointAtCoord(weapons[weaponName].wx, weapons[weaponName].wy, weapons[weaponName].wz);

        mp.game.cam.renderScriptCams(true, false, 0, true, false);
        mp.players.local.freezePosition(true);

        
        ui = new NativeUI.Menu("Ammunation", "Buy the weapon you need", new NativeUI.Point(50, 50));
        weaponsArray = [];
        for(var key in weapons){
            weaponsArray.push( weapons[key].displayName);
        }
        var item = new NativeUI.UIMenuListItem(
            "Weapon",
            "Select a weapon to buy !",
            new NativeUI.ItemsCollection(weaponsArray)
        );
        ui.AddItem(item);
        ui.ListChange.on( (UIMenuListItem, Index) => {
            for(var key in weapons) {
                if(weapons[key].displayName != weaponsArray[ Index ] ) continue;
                weaponData = weapons[key];
            }
            camera.setCoord(weaponData.x, weaponData.y, weaponData.z);
            camera.pointAtCoord(weaponData.wx, weaponData.wy, weaponData.wz);
            item.Description = "Buy this weapon for ~g~$~w~" + weaponData.price; 
            weapon = weaponData;
        });
        ui.AddItem( new NativeUI.UIMenuItem(
            "Buy this weapon"
        ));
        ui.ItemSelect.on( (item, index) => {
            if(item.Text == "Buy this weapon") {
                mp.events.callRemote("sAction", 4,JSON.stringify(weapon));
            }
        });
        ui.MenuClose.on( () => {
            ui = null;
            mp.gui.chat.show(true);
            camera.destroy(true);
            camera = null;          
        
            mp.game.cam.renderScriptCams(false, false, 0, true, false);
        
            mp.players.local.freezePosition(false);
        });
        
    },
    "247ItemsChoice": () => {
        mp.gui.chat.show(false);
        ui = new NativeUI.Menu("24/7", "Select what you want to do!", new NativeUI.Point(50,200));
        items = {
            "Apple": {name:"Apple",desc:"Nice to get some health more!",price:"20",health:10},
            "Chips": {name:"Chips",desc:"May make you fat!",price:"30",health:20},
            "Bread": {name:"Bread",desc:"Bread, it's good, it's french, as the developer is!",price:"50",health:30}
        }
        for(var key in items) {
            item = items[key];
            fitem = new NativeUI.UIMenuItem(item.name, item.desc);
            fitem.SetRightLabel("~g~$" + item.price);
            ui.AddItem( fitem );
        }
        ui.ItemSelect.on ( (item, index) => {
            for(var key in items) {
                if(item.Text != key) continue;
                mp.events.callRemote("sAction", 3, item.Text, items[key].price, items[key].health);
            }
        });
        ui.MenuClose.on( () => {
            mp.gui.chat.show(true);
            ui = null;
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
