var cash = 0;
var cash_update = null;
var bank = 0;
var bank_update = null;
var stop_timeout1;
var stop_timeout2;
var stop_timeout3;
var stop_timeout4;
let bankBar = null;
let cashBar = null;

const misc = require('/gamemode/cMisc.js');
const timerBarLib = require("/gamemode/modules/lib/timerbars");

function showCef(url) {
	misc.prepareToCef(1);
    misc.openCef(url);        
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


mp.events.add('render', () => {
    
    if(bank_update != undefined || bank_update != null){
        if(bank_update < 0){
            mp.game.graphics.drawText(`-$${numberWithCommas(Math.abs(bank_update))}`, [0.80, 0.13], {scale: [0.65,0.65], color:[224, 50, 50, 255], font: 7});
        }else{
            mp.game.graphics.drawText(`+$${numberWithCommas(bank_update)}`, [0.80, 0.13], {scale: [0.65,0.65], color:[255, 255, 255, 255], font: 7})
        }
    }
    if(cash_update != undefined || cash_update != null){
        if(cash_update < 0){
            mp.game.graphics.drawText(`-$${numberWithCommas(Math.abs(cash_update))}`, [0.80, 0.17], {scale: [0.65,0.65], color:[224, 50, 50, 255], font: 7});
        }else{
            mp.game.graphics.drawText(`+$${numberWithCommas(cash_update)}`, [0.80, 0.17], {scale: [0.65,0.65], color:[114, 204, 114, 255], font: 7})
        }
    }
});
function destroy_cash_add(){
    cash_update = null;
}
function destroy_bank_add(){
    bank_update = null;
}
let setMoney = (money_cash_update = null) =>{
    cash += money_cash_update;
    cash_update = money_cash_update;

    if(cashBar == null) {
        cashBar = new timerBarLib.TimerBar("CASH");
        cashBar.textColor = [114, 204, 114, 255];
    }

    cashBar.text = "$" + cash;
    clearTimeout(stop_timeout2);
    stop_timeout2 = setTimeout(destroy_cash_add, 5000);
}
let setBank = (money_bank_update = null) =>{
    bank += money_bank_update;
    bank_update = money_bank_update;

    if(bankBar == null) {
        bankBar = new timerBarLib.TimerBar("BANK");
    }

    bankBar.text = "$" + bank;
    clearTimeout(stop_timeout4);
    stop_timeout4 = setTimeout(destroy_bank_add, 5000);
}
mp.events.add('cCashUpdate', setMoney);
mp.events.add('cBankUpdate', setBank);

mp.events.add({
    "cATMOpen": (player) => {
        showCef("package://gamemode/browser/player/atm/atm.html");
    },
    "cATMTry": (type, value) => {
        misc.closeCef();
        mp.events.callRemote("sATMTry", type, value);
    },
    "cATMExit": (player) => {
        misc.closeCef();
    },
    'cBankAndCashUpdate': (type, value) => {
        switch(type) {
            case "deposit":
                setMoney(-value);
                setBank(value);
                break;
            case "withdraw":
                setMoney(value);
                setBank(-value);
                break;
        }
    }
});
