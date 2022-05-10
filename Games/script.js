let type = '';

function connected() {
}

function go() {
    const game = document.getElementById('game').value;
    send({
        method: 'join',
        game: game,
    });
}

function create(game) {
    type = game;
    console.log('CREATE', type);
    send({
        method: 'create',
        type: game,
    });

}

function setState() {
    console.log("GO SS");
}

function setPlayer(p) {
    console.log("GO SP", type, p);
    socket.close(3141, 'CUSTOM CLOSE');
    window.location.href = "./" + Cookies.get('game-type');
    
}