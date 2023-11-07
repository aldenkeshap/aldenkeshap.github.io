window.onload = init;

function loadJSON(link, callback) {
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', link, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == "200") {
            callback(JSON.parse(req.responseText));
        }
    };
    req.send(null);
}

function td(text) {
    let data = document.createElement("td");
    data.appendChild(document.createTextNode(text));
    return data;
}

function create_games(games, team) {
    let row = document.createElement("td");
    for (const game of games) {
        let span = document.createElement("span");
        span.appendChild(document.createTextNode(game_text(game)));
        span.classList.add('game');
        span.classList.add(game.status);
        span.id = `game-${game.id}`;
        span.team = team;
        row.appendChild(span);
    }
    return row;
}

function game_text(game) {
    let s;
    if (game.location == 'away') {
        s = 'at ';
    } else {
        s = 'vs ';
    }
    if (game.rank > 0) {
        s = s.concat(game.rank, ' ');
    }
    s = s.concat(game.opponent);

    if (game.status == 'win' || game.status == 'loss') {
        s = s.concat(' ', game_score(game));
    } else if (game.status == 'future') {
        s = s.concat(', ', output_time(game.date));
    } else {
        loadJSON(`https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard/${game.id}`, loadScore);
    }

    return s;
    // return 'at 22 Miami L 64-66';
}

function game_score(game) {
    const letter = game.status == 'win' ? 'W' : 'L';
    return `${letter} ${game.team_score}-${game.opponent_score}`;
}

function output_time(s) {
    const date = new Date(s);
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const hour = (date.getHours() - 1) % 12 + 1;
    let time;
    if (date.getMinutes() == 0) {
        time = `${hour}`;
    } else if (date.getMinutes() < 10) {
        // const time = hour.concat(':0', date.minute);
        time = `${hour}:0${date.getMinutes()}`;
    } else {
        // const time = hour.concat(':', date.minute);
        time = `${hour}:${date.getMinutes()}`;
    }
    const noon = date.getHours() < 12 ? 'am' : 'pm';
    
    return `${day} ${time}${noon}`;
}

function game_time(status, tied) {
    const half = status.period;
    if (status.clock == 0) {
        if (half == 1) {
            return 'halftime';
        } else {
            if (tied) {
                return 'end of regulation'
            } else {
                return 'final';
            }
            
        }
    } else {
        const h = half == 1 ? '1st' : '2nd';
        return `${status.displayClock} in ${h}`;
    }
}

function loadScore(json) {
    let span = document.getElementById(`game-${json.id}`);
    let left = span.innerText.split('\u{200B}')[0];
    const [a, b] = json.competitions[0].competitors;
    console.log("LS", json);
    let score;
    if (a.id == span.team) {
        score = `${a.score}-${b.score}`;
    } else {
        score = `${b.score}-${a.score}`;
    }

    const time = game_time(json.status, a.score == b.score);
    span.innerText = `${left}\u{200B} ${score}, ${time}`;
    if (time != 'final') {
        setTimeout(() => {
            loadJSON(`https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard/${json.id}`, loadScore);
        }, 15 * 1000);
        console.log("LS ST", new Date());
    }
    
}

const game1 = {
    opponent: 'Miami',
    rank: 22,
    location: 'away',
    status: 'loss',
    team_score: 70,
    opponent_score: 75,
};

const game2 = {
    opponent: "Albany",
    rank: 0,
    location: 'home',
    status: 'future',
    date: '2022-12-30T22:00:00Z',
    // day: 'Fri',
    // time: '9pm',
}

function setRankings(json) {
    let table = document.getElementById('table');
    const games = json.games.data;
    for (const team of json.ranking.data) {
        console.log(team);
        let row = document.createElement('tr');

        row.appendChild(td(team.name));
        if (team['votes-first'] > 0) {
            row.appendChild(td(`${team.rank} (${team['votes-first']})`));
        } else if (team.rank > 0) {
            row.appendChild(td(team.rank));
        } else {
            row.appendChild(td('NR'));
        }
        row.appendChild(td(team.points));
        row.appendChild(td(team.record));
        row.appendChild(create_games(games[team.id], team.id));

        table.appendChild(row);
    }
}


function init() {
    loadJSON('https://movingup-1-f6142101.deta.app/ranking', setRankings)
}
