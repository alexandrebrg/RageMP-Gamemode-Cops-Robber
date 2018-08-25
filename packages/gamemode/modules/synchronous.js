let Peds = [];
mp.events.add({

    /**
     * Notification Simple
     */
    "Sync_Notify": (message) => {
        mp.players.forEach(element => {
            element.call("BN_Show", [message]);
        });
    },

    /**
     * Notification with Picutre / Title / Sender
     */
    "Sync_NotifyWithPicture": (title, sender, message, notifPic, icon = 0) => {
        mp.players.forEach(element => {
            element.call('BN_ShowWithPicture', [title, sender, message, notifPic, icon]);
        });
    },

    /**
     * Create the ped
     */
    "Sync_PedCreate": (name, model, position, heading = 0, callback = (streamPed) => streamPed.setAlpha(0), dimension = mp.players.local) => {
        if(Peds[name]) mp.events.call("Sync_PedRemove", [name]);
        Peds[name] = {
            "model": model,
            "position": position,
            "heading": heading,
            "dimension": dimension
        }
        mp.players.forEach(player => {
            player.call("Sync_PedCreate", [name, model, position, heading, callback, dimension])
        });
    },
    
    /**
     * Remove the ped
     */
    "Sync_PedRemove": (name) => {
        mp.players.forEach(player => {
            player.call("Sync_PedRemove", [name]);
        });
        delete Peds[name];
    },

    /**
     * teleport ped into vehicle
     */
    "Sync_PutPedInVehicle": (name, vehicle, seat) => {
        mp.players.forEach(player => {
            player.call('Sync_PutPedInVehicle', [name, vehicle, seat]);
        });
    },

});