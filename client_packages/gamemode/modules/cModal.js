
const misc = require('/gamemode/cMisc.js');



mp.events.add({
    'cModal' : ( type, title, desc,args) => {
            misc.prepareToCef(1);
            misc.openCef('package://gamemode/browser/modals/modal.html');
            misc.injectCef("popup",type,title,desc,args);
    },
    'cModalTreat' : (type, data) => {
        misc.closeCef();
        mp.events.callRemote("sModalTreat", "form", type, data);
    },
    'cCancelModal' : () => {
        misc.closeCef();
    },
    "cSelectModal" : (title, args) => {
            misc.prepareToCef(1);
            misc.openCef('package://gamemode/browser/modals/selectModal.html');
            misc.injectCef("popup", title, args);
    },
    'cSelectModalTreat': (type) => {
        misc.closeCef();
        mp.events.callRemote("sModalTreat", "selectModal",type);
    }
});