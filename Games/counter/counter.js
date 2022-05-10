function setState(state) {
    const red = document.getElementById('count-red');
    const blue = document.getElementById('count-blue');
    console.log('SS T', state);
    red.innerHTML = state.red;
    blue.innerHTML = state.blue;
}

function setPlayer(p) {
    const player = document.getElementById("player");
    player.innerHTML = "I am " + p + "!";
    let c;
    if (p == "red") {
        c = "#ff0000";
    } else {
        c = "#0000ff";
    }
    for (const button of document.getElementsByClassName("add")) {
        button.style.background = c;
    }
}

function add(n) {
    const o = {
        method: 'add',
        n: n,
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