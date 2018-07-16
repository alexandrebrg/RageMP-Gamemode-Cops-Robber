const timeBarLib = require('/gamemode/modules/lib/timerbars');
const misc = require('/gamemode/cMisc.js');
const NativeUI = require('/gamemode/modules/lib/nativeui');
const Menu = NativeUI.Menu;
const UIMenuItem = NativeUI.UIMenuItem;
const UIMenuListItem = NativeUI.UIMenuListItem;
const UIMenuCheckboxItem = NativeUI.UIMenuCheckboxItem;
const UIMenuSliderItem = NativeUI.UIMenuSliderItem;
const BadgeStyle = NativeUI.BadgeStyle;
const Point = NativeUI.Point;
const ItemsCollection = NativeUI.ItemsCollection;
const Color = NativeUI.Color;
const ListItem = NativeUI.ListItem;

var price = 0;
var ui = null;
var uiType = null;

var timeBar = null;

var vehHandle = null;
var playerVeh = null;
var vehPrices = null;
var vehP = 0;
var vehS = 0;

var vehDefaultP = 0;
var vehDefaultS = 0;

var modIndex = {
    0: "Spoilers",
    1: "Front Bumper",
    2: "Rear Bumper",
    3: "Side Skirt",
    4: "Exhaust",
    5: "Frame",
    6: "Grille",
    7: "Hood",
    8: "Fender",
    9: "Right Fender",
    10: "Roof",
    11: "Engine",
    12: "Brakes",
    13: "Transmission",
    14: "Horns",
    15: "Suspension",
    16: "Armor",
    18: "Turbo",
    22: "Headlights",
    23: "Front Wheels",
    20: "Util Shadow Silver",
    24: "Black Wheels",
    25: "Plate Holders",
    26: "Vanity Plates",
    27: "Trim Design",
    28: "Ornaments",
    29: "Dashboard",
    30: "Dial Design",
    31: "Door Speaker",
    32: "Seats",
    33: "Steering Wheel",
    34: "Shift Lever",
    35: "Plaques",
    36: "Speakers",
    37: "Trunk",
    38: "Hydraulics",
    39: "Engine Block",
    40: "Air filter",
    41: "Struts",
    42: "Arch Cover",
    43: "Aerials",
    44: "Trim",
    45: "Tank",
    46: "Windows",
    48: "Livery",
    62: "Plate",
    66: "Primary Color",
    67: "Secondary Color",
    69: "Window Tint",
}
var edits = {}

function exitCustom() {
    for(var key in edits) {
        playerVeh.setMod(parseInt(key), -1);
    }
    playerVeh.setColours(vehDefaultP, vehDefaultS);

    timeBar.visible = false;
    timeBar = null;

    price = 0; 
    ui = null;
    uiType = null;

    vehHandle = null;
    playerVeh = null;
    vehPrices = null;
    vehP = 0;
    vehS = 0;

    vehDefaultP = 0;
    vehDefaultS = 0;

   
}


function putInDefaultCam() {
    if(misc.camExist) misc.destroyCam();    
    misc.createCam(-340.07, -135.14, 39, 0, 0, 121, 50);
}

function addEditedItem(modType, modIndex) {
    if(modIndex == -1) return delete edits[parseInt(modType)];
    edits[parseInt(modType)] = parseInt(modIndex);
    price = updatePrice();
}

function updatePrice() {
    if(!timeBar) {
        timeBar = new timeBarLib.TimerBar("Price");
        timeBar.textColor = [114, 0, 0, 255];
    }
    let price = 0;
    for(var key in edits) {
        price += vehPrices[key][0] ? (vehPrices[key][parseInt(edits[key])] ? vehPrices[key][parseInt(edits[key])] : vehPrices[key][0]) : 0;    
    }
    timeBar.text = `$${price}`;
    return price;
}

function createMenu() {    
    if(ui) { ui.Close();  }
    ui = new Menu(vehHandle.displayName, "Custom your car !", new Point(50, 50));
}
function showMainMenu() {
    uiType = "home";
    createMenu();
    vehHandle.mods[66] = true;
    vehHandle.mods[67] = true;
    for(var key in vehHandle.mods) {        
        if(typeof modIndex[key] == "undefined") continue;
        item = new UIMenuItem(
            modIndex[key]
        );
        if(typeof edits[key] != "undefined") {
            if(typeof vehPrices[key][parseInt( edits[key] ) ] != "undefined" ) {
                item.SetRightLabel("$" + vehPrices[key][parseInt( edits[key] )]);
            } else {   
                if(typeof vehPrices[key][0] != "undefined" ) {
                    item.SetRightLabel("$" + vehPrices[key][0]);
                } else {
                    item.SetRightLabel("Unknown price" );
                }

            }
        } 
        ui.AddItem(item);
    }

    item = new UIMenuItem(
        "Save custom",
        "Argh! This action will make you lose money!"
    );
    ui.AddItem(item);
    ui.ItemSelect.on(item => {
        if (item instanceof UIMenuItem) {
            if(uiType == "home" && item.Text != "Save custom") {
                for(var key in vehHandle.mods){
                    if(modIndex[key] == item.Text) {
                        showSpecificMenu(key, item.Text);
                    }
                }                        
            } else if(item.Text == "Save custom") {
                uiType = "buyit";
                mp.events.call("payVehicleCustom", playerVeh, price);
                
            }                   
        }
    });
    ui.MenuClose.on(() => {
        if(uiType == "home") {
            mp.events.call("exitVehicleCustom");
        } 
    })
}

function showSpecificMenu(type, name) {
    uiType = type;
    createMenu();
    ui.AddItem(new UIMenuItem(
        "Back to menu"
    ));
    ui.AddItem(new UIMenuItem(
        "Default " + name
    ));

    switch(parseInt(uiType)) {
        case 62:
        case 0:
        case 4:
        case 2:
            misc.destroyCam();
            misc.createCam(-348.388, -137.387, 39, 0, 0, 270.4, 50);
            break;
        case 15:
        case 23:
            misc.destroyCam();
            misc.createCam(-341.156, -140.48, 39.028, 0, 0, 30.910, 50);
            mp.players.local.heading = -30;
            break;
        case 66:
        case 67:
            misc.destroyCam();
            misc.createCam(-339.07, -137.44, 40, -20, 0, 84.7, 50);
            break;
    }
    if(parseInt(uiType) != 66 && parseInt(uiType) != 67) {
        for(var i=0;i< vehHandle.mods[type].amount; i++) {
            item = new UIMenuItem(
                name + " " + String(parseInt(i) + 1),
                "Press enter to preview & select the item!"
            );
            if(vehPrices[uiType][parseInt(i)]) {
                item.SetRightLabel("$" + vehPrices[uiType][parseInt(i)])
            } else {
                item.SetRightLabel("Unknown price" );
            }
            ui.AddItem(item);
        }
    } else {
        arraytomax = [];
        for(var i=0;i<160;i++) { arraytomax.push(i); }
        if(parseInt(uiType) == 66) {
            ui.AddItem( new UIMenuSliderItem( name, arraytomax, vehDefaultP, "Change primary color") );
        } else {
            ui.AddItem( new UIMenuSliderItem( name, arraytomax, vehDefaultS, "Change secondary color") );
        }
        
    }

    ui.ItemSelect.on(item => {
        if (item instanceof UIMenuItem) {
            if(item.Text == "Back to menu") {
                ui.Close();
            }
            else if(item.Text == "Default " + name) {
                playerVeh.setMod(parseInt(uiType), -1);
                addEditedItem(uiType, -1);
            } else {
                addEditedItem(uiType, parseInt( (item.Text).slice(-1) ) - 1)
                playerVeh.setMod(parseInt(uiType), edits[uiType]); 
            }
            switch(parseInt(uiType)) {
                case 22:                        
                    playerVeh.setLights(3);
                    setTimeout(function() { playerVeh.setLights(1); }, 5000);
                    break;
                case 14:
                    playerVeh.startHorn(10000, 0, true);
                    break;
            }
        }
    });
    ui.SliderChange.on((item, index, value) => {
        if(parseInt(uiType) == 66) {
            vehP = parseInt(value);
        }
        if(parseInt(uiType) == 67) {
            vehS = parseInt(value);
        }     
        addEditedItem(uiType, parseInt(value))
        playerVeh.setColours(vehP, vehS);

    });
    ui.MenuClose.on(() => {
        if(uiType != "home") {
            showMainMenu();
            putInDefaultCam();
        }
    });
}


mp.events.add({
    "showVehicleCustomHUD": (vehData, vehicle, prices) => {
        if(vehData) {

            mp.game.audio.playSound(-1, "Garage_Open", "CAR_STEAL_2_SOUNDSET", true, 0, true);

            putInDefaultCam();
            mp.game.ui.displayRadar(false);
            mp.gui.chat.show(false);      
            player.freezePosition(true);
        
            vehHandle = vehData;
            playerVeh = vehicle;
            vehPrices = prices;

            colors = vehicle.getColours(vehDefaultP, vehDefaultS);
            vehDefaultP = colors.colorPrimary;
            vehDefaultS = colors.colorSecondary


            playerVeh.setEngineOn(true, true, false);
            
            showMainMenu();

        }
    },
    "exitVehicleCustom": () => {
        setTimeout(function() { mp.events.callRemote("playerExitVehicleCustom", playerVeh); exitCustom(); }, 1000);
        mp.events.call("fadeOut");
        mp.game.ui.displayRadar(true);
        mp.gui.chat.show(true);
        player.freezePosition(false);
        misc.destroyCam();
        if(ui) { ui.Close(); ui = null; }
    },
    "payVehicleCustom": (vehicle, price) => {
        mp.events.callRemote('vehicleApplyVehicleCustom', vehicle, JSON.stringify(edits));
        mp.events.callRemote('playerPayVehicleCustom', price);
    }
})