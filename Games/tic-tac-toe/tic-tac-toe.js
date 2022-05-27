let turn;
let player;

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
        turn = '';
    } else if (state.turn) {
        result.innerHTML = 'O to move';
        turn = 'O';
    } else {
        result.innerHTML = 'X to move';
        turn = 'X';
    }
    update();
}

function update() {
    let play = turn == player;
    for (let button of document.getElementsByClassName('square')) {
        button.disabled = !play;
    }
}

function setPlayer(p) {
    const playerElement = document.getElementById("my-team");
    playerElement.innerHTML = "I am " + p + "!";
    player = p;
    update();
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