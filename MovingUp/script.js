window.onload = init;

const teamPrefixURL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/';
const rankingsURL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/rankings';
const liveScorePrefixURL = 'https://www.espn.com/mens-college-basketball/game?gameId=';


const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function removeSpaces(s) {
    return s.replace(/\s/g, '');
}

function setRankings(json) {
    const table = document.getElementById('table');
    const teams = json["rankings"][0]["ranks"].concat(json["rankings"][0]["others"]);
    for (const [index, data] of teams.entries()) {
        const first = data["firstPlaceVotes"] ? " (" + data["firstPlaceVotes"] + ")" : "";
        
        const rank = data["current"] ? data["current"] + first : "NR";
        const record = data["recordSummary"];
        const points = data["points"];

        const name = data["team"]["nickname"];
        const id = data["team"]["id"];

        const row = document.createElement('tr');
        row.setAttribute("id", "row" + id);

        const rankData = document.createElement("td");
        rankData.appendChild(document.createTextNode(rank));
        const pointsData = document.createElement("td");
        pointsData.appendChild(document.createTextNode(points));

        const recordData = document.createElement("td");
        recordData.appendChild(document.createTextNode(record));

        const nameData = document.createElement("td");
        nameData.appendChild(document.createTextNode(name));

        row.appendChild(nameData);
        row.appendChild(rankData);
        row.appendChild(pointsData);
        recordData.setAttribute("id", "record" + id);
        row.appendChild(recordData);

        table.appendChild(row);
        loadJSON(teamPrefixURL + id + "/schedule", setGames);

    }
}

function mondays() {
    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    var monday;
    if (date.getDay() == 1 && date.getHours() >= 13) {
        monday = date.setHours(1);
    } else if (date.getDay() == 1) {
        monday = date.setDate(date.getDate() - 7);
    } else if (date.getDay() == 0) {
        monday = date.setDate(date.getDate() - 6);
    } else {
        monday = date.setDate(date.getDate() - date.getDay() + 1);
    }
    monday = new Date(monday).setHours(1);
    var endMonday = new Date(monday);
    endMonday.setDate(endMonday.getDate() + 7);
    return [new Date(monday), endMonday];
}

function setGames(json) {
    const teamId = json["team"]["id"];
    var record = "0-0 (0-0)";

    const row = document.getElementById("row" + teamId);
    const [startDate, endDate] = mondays();
    for (game of json["events"]) {
        const date = new Date(game["competitions"][0]["date"]);
        
        const team1Id = game["competitions"][0]["competitors"][0]["id"];
        const team2Id = game["competitions"][0]["competitors"][1]["id"];
        const team = game["competitions"][0]["competitors"][team1Id == teamId ? 0 : 1];
        const opp = game["competitions"][0]["competitors"][team1Id == teamId ? 1 : 0];

        const location = team["homeAway"] == "home" ? "vs" : "at";
        const r = opp["curatedRank"]["current"]
        const rank = r == 99 || r == 0 ? "" : opp["curatedRank"]["current"] + " ";
        var result = location + " " + rank + opp["team"]["nickname"];
        var color;
        if (game["competitions"][0]["status"]["type"]["completed"] && team["score"]) {
            var wl;
            if (team["score"]["value"] > opp["score"]["value"]) {
                wl = "W";
                color = "60ff60";
            } else {
                wl = "L";
                color = "ff6060";
            }
            const score = wl + " " + team["score"]["value"] + "-" + opp["score"]["value"];
            result = result + " " + score;
        } else {
            color = date < Date.now() ? "6060ff" : "c8c8c8";

            const amPm = date.getHours() >= 12 ? "pm" : "am";
            var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
            var minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = minutes + "0";
            }
            const time = hours + ":" + minutes + " " + amPm;
            result = result + " on " + days[date.getDay()] + " " + time;
        }
        
        if (team["record"]) {
            record = team["record"][0]["displayValue"] + " (" + team["record"][1]["displayValue"] + ")";
        }        

        if (startDate < date && date < endDate) {
            const gameData = document.createElement("td");
            const link = document.createElement("a");
            const url = 'https://www.espn.com/mens-college-basketball/game?gameId=' + game["competitions"][0]["id"];
            link.setAttribute('href', url);
            link.appendChild(document.createTextNode(result));
            gameData.appendChild(link);
            gameData.setAttribute("style", "background-color: #" + color);
            row.appendChild(gameData);
        }
    }
    recordData = document.getElementById("record" + teamId);
    recordData.replaceChild(document.createTextNode(record), recordData.childNodes[0]);
}

function init() {
    loadJSON(rankingsURL, setRankings);
}
