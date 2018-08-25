let Peds = [];
mp.events.add({

    "Sync_PedCreate": (name, model, position, heading = 0, callback, dimension = mp.players.local) => {
        let ped = mp.peds.new(model, position, heading, (streamPed) => streamPed.setAlpha(0), dimension);
        Peds[name] = ped;
    },
    
    "Sync_PedRemove": (name) => {
        if(!name) return;
        Peds[name].destroy();
        delete Peds[name];
    },

    "Sync_PutPedInVehicle": (name, veh, seat) => {
        if(!name || !veh) return;
        let ped = Peds[name];
        ped.taskEnterVehicle(veh.handle, -1, seat, 2, 16, 0);
    }

});