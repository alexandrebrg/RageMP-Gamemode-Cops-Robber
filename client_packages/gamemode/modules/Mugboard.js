const scriptConst = {
    boardPropName: "prop_police_id_board",
    textPropName: "prop_police_id_text",
    renderTargetName: "ID_Text",
    animDictionary: "mp_character_creation@lineup@male_a",
    animName: "loop_raised"
};

let Mugboards = []


mp.game.mugboard = {
    show: (ped, title, topText, midText, bottomText, rank = -1) => mp.events.call("MB_Show", ped, title, topText, midText, bottomText, rank),
    hide: (ped) => mp.events.call("MB_Hide", ped)
}

mp.events.add("MB_Show", (ped, title, topText, midText, bottomText, rank = -1) => {
    if (Mugboards[ped.handle] !== null) {
        // create props
        let mugboard = {
            boardHandle: null,
            textHandle: null,
            scaleformHandle: null,
            renderTargetID: null
        };
        mugboard.boardHandle = mp.objects.new(mp.game.joaat(scriptConst.boardPropName), ped.position, new mp.Vector3(), 255, 0);
        mugboard.textHandle = mp.objects.new(mp.game.joaat(scriptConst.textPropName), ped.position, new mp.Vector3(), 255, 0);

        // load scaleform & set up the content
        mugboard.scaleformHandle = mp.game.graphics.requestScaleformMovie("mugshot_board_01");
        while (!mp.game.graphics.hasScaleformMovieLoaded(mugboard.scaleformHandle)) mp.game.wait(0);

        mp.game.graphics.pushScaleformMovieFunction(mugboard.scaleformHandle, "SET_BOARD");
        mp.game.graphics.pushScaleformMovieFunctionParameterString(title);
        mp.game.graphics.pushScaleformMovieFunctionParameterString(midText);
        mp.game.graphics.pushScaleformMovieFunctionParameterString(bottomText);
        mp.game.graphics.pushScaleformMovieFunctionParameterString(topText);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(0);
        if (rank > -1) mp.game.graphics.pushScaleformMovieFunctionParameterInt(rank);
        mp.game.graphics.popScaleformMovieFunctionVoid();

        // set up rendertarget
        mp.game.ui.registerNamedRendertarget(scriptConst.renderTargetName, false);
        mp.game.ui.linkNamedRendertarget(mp.game.joaat(scriptConst.textPropName));
        mugboard.renderTargetID = mp.game.ui.getNamedRendertargetRenderId(scriptConst.renderTargetName);

        // attach to the player
        mugboard.boardHandle.attachTo(ped.handle, ped.getBoneIndex(28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, false, false, false, false, 2, true);
        mugboard.textHandle.attachTo(ped.handle, ped.getBoneIndex(28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, false, false, false, false, 2, true);

        // animation
        mp.game.streaming.requestAnimDict(scriptConst.animDictionary);
        while (!mp.game.streaming.hasAnimDictLoaded(scriptConst.animDictionary)) mp.game.wait(0);
        ped.taskPlayAnim(scriptConst.animDictionary, scriptConst.animName, 8.0, -8.0, -1, 1, 0.0, false, false, false);
        Mugboards[ped.handle] = mugboard;
        hasMugshotBoard = true;
        mp.gui.chat.push("" + ped.handle);
    }
});

mp.events.add("MB_Hide",  (ped) => {
    if (Mugboards[ped.handle].boardHandle != null) Mugboards[ped.handle].boardHandle.destroy();
    if (Mugboards[ped.handle].textHandle != null) Mugboards[ped.handle].textHandle.destroy();
    if (Mugboards[ped.handle].scaleformHandle != null) mp.game.graphics.setScaleformMovieAsNoLongerNeeded(Mugboards[ped.handle].scaleformHandle);
    if (Mugboards[ped.handle].renderTargetID != null) mp.game.ui.releaseNamedRendertarget(mp.game.joaat(scriptConst.renderTargetName)); 
    Mugboards[ped.handle].boardHandle = null;
    Mugboards[ped.handle].textHandle = null;
    Mugboards[ped.handle].scaleformHandle = null;
    Mugboards[ped.handle].renderTargetID = null;
    Mugboards[ped.handle]

    ped.stopAnimTask(scriptConst.animDictionary, scriptConst.animName, -4.0);
    if (mp.game.streaming.hasAnimDictLoaded(scriptConst.animDictionary)) mp.game.streaming.removeAnimDict(scriptConst.animDictionary);

    hasMugshotBoard = false;
});


mp.events.add("render", () => {
    
    if (Mugboards.length !== 0) {
        Mugboards.forEach( (element, index) => {
            scriptHandles = Mugboards[index];
            mp.game.ui.setTextRenderId(scriptHandles.renderTargetID);
            mp.game.graphics.drawScaleformMovie(scriptHandles.scaleformHandle, 0.405, 0.37, 0.81, 0.74, 255, 255, 255, 255, 0);
            mp.game.ui.setTextRenderId(1);
        });
    }
})