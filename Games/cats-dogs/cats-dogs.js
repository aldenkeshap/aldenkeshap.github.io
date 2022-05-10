function setState(state) {
    const tiles = document.getElementsByClassName('tile');
    for (let i = 0; i < 49; i++) {
        const tile = tiles[i];
        let letter = state.board[i];
        if (letter == '') {
            letter = '-';
        }
        if (letter == 'C') {
            tile.style.background = "#CFC400";
        } else if (letter == 'D') {
            tile.style.background = "#00FF48";
        }
        tile.innerHTML = letter;
    }
}

function place(n) {
    const o = {
        game: Cookies.get('game'),
        method: 'place',
        location: n,
        token: Cookies.get('token'),
    };
    send(o);
}

function setPlayer(p) {
    console.log("PLAYER", p);
    const player = document.getElementById('player');
    if (p == "cat") {
        player.style.color = "#CFC400";
        player.innerHTML = 'Playing as cats';
    } else {
        player.style.color = "#00FF48";
        player.innerHTML = 'Playing as dogs';
    }
    
}

function connected() {
    send({
        method: 'reconnect',
        token: Cookies.get('token'),
        game: Cookies.get('game'),
    });
    const game = document.getElementById('game');
    game.innerHTML = 'Game: ' + Cookies.get('game');
}