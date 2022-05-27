let socket;

function send(o) {
    console.log("SEND", o);
    socket.send(JSON.stringify(o));
}

// function initConnection(game) {
//     let token = Cookies.get('token');
//     console.log("IC", token);
//     if (token != "undefined" && token != undefined) {
//         send({
//             method: 'get',
//             game: game,
//             token: token,
//         });
//     } else {
//         send({
//             method: 'join',
//             game: game,
//         });
//     }
// }

function load() {
    socket = new WebSocket('ws://localhost:8765');
    // socket = new WebSocket('wss://limitless-ridge-62634.herokuapp.com');
    socket.addEventListener('open', function (event) {
        // initConnection();
        console.log("GET");
        connected();
    });
    socket.addEventListener('message', function (event) {
        const o = JSON.parse(event.data);
        console.log("O", o);
        
        if (o.type == "state") {
            setState(o.state);
            setPlayer(o.players[Cookies.get('token').slice(0, 4)]);
            // console.log("UC", o);
        } else if (o.type == 'token') {
            console.log("GOT TOKEN", o.token);
            Cookies.set('token', o.token);
            Cookies.set('game-type', o['game-type']);
            const p = o.players[o.token.slice(0, 4)];
            setPlayer(p);
            Cookies.set('game', o.game);
        } else {
            console.log('UNKNOWN MESSAGE', o);
        }
        console.log('Message from server ', event.data);
    });
}
