function setState(state) {
    const squares = document.getElementsByClassName('square');
    console.log('STATE', state);
    for (let i = 0; i < 9; i++) {
        const square = squares[i];
        let letter = state.board[i];
        if (letter == '') {
            letter = '-';
        }
        square.innerHTML = letter;
    }
    const result = document.getElementById('result');
    if (state.result !== '') {
        result.innerHTML = state.result;
    } else if (state.turn) {
        turn.innerHTML = 'O to move';
    } else {
        turn.innerHTML = 'X to move';
    }
    
}

function setPlayer(p) {
    const player = document.getElementById("my-team");
    player.innerHTML = "I am " + p + "!";
}

function place(n) {
    const o = {
        method: 'place',
        location: n,
        token: Cookies.get('token'),
        game: Cookies.get('game'),
    };
    send(o);
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