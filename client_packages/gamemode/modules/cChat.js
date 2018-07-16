mp.events.add('ChatUpdate', ( message) =>{
    mp.gui.chat.push(message);
});
mp.events.add('changeChatState', (toggle) => {
    mp.players.local.chatState = toggle;
});
