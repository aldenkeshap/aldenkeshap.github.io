window.onload = init;

function loadJSON(link, callback) {
  var req = new XMLHttpRequest();
  req.overrideMimeType("application/json");
  req.open("GET", link, true);
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == "200") {
      callback(JSON.parse(req.responseText));
    }
  };
  req.send(null);
}

function td(text, id) {
  let data = document.createElement("td");

  data.appendChild(document.createTextNode(text));
  if (id) {
    data.id = id;
  }
  return data;
}

function create_games(games, team, sport) {
  let row = document.createElement("td");
  for (const game of games) {
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(game_text(game, sport)));
    span.classList.add("game");
    span.classList.add(game.status);
    const index = document.getElementById(`game-1-${game.id}`) ? 2 : 1;
    span.id = `game-${index}-${game.id}`;
    span.team = team;
    span.title = `${output_time(game.date)} on ${game.broadcast}`;
    row.appendChild(span);
  }
  return row;
}

function game_text(game, sport) {
  let s;
  if (game.location == "away") {
    s = "at ";
  } else {
    s = "vs ";
  }
  if (game.rank > 0) {
    s = s.concat(game.rank, " ");
  }
  s = s.concat(game.opponent);

  if (game.status == "win" || game.status == "loss") {
    s = s.concat(" ", game_score(game));
  } else if (game.status == "future") {
    s = s.concat(", ", output_time(game.date));
  } else {
    loadJSON(
      `https://site.api.espn.com/apis/site/v2/sports/${SLUGS[sport]}/scoreboard/${game.id}`,
      (j) => loadScore(j, sport),
    );
  }

  return s;
  // return 'at 22 Miami L 64-66';
}

function game_score(game) {
  const letter = game.status == "win" ? "W" : "L";
  const ot = game.ot ? `/${game.ot}` : "";
  return `${letter}${ot} ${game.team_score}-${game.opponent_score}`;
}

function output_time(s) {
  const date = new Date(s);
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
  const hour = ((date.getHours() - 1) % 12) + 1;
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
  const noon = date.getHours() < 12 ? "am" : "pm";

  return `${day} ${time}${noon}`;
}

function game_time(status, score1, score2) {
  const half = status.period;
  if (status.clock == 0) {
    if (half == 1) {
      return "halftime";
    } else {
      if (score1 == 0 && score2 == 0) {
        return "about to start";
      } else if (score1 === score2) {
        return "end of period";
      } else {
        return "final";
      }
    }
  } else {
    let h;
    if (half === 1) {
      h = "1st";
    } else if (half === 2) {
      h = "2nd";
    } else if (half === 3) {
      h = "OT";
    } else {
      h = `${h - 2}OT`;
    }
    return `${status.displayClock} in ${h}`;
  }
}

function loadScore(json, sport) {
  // console.log("LS", json);
  let competition = json.competitions[0];
  const [a, b] = competition.competitors;
  let broadcasts = competition.broadcasts
    .map((b) => b.names.join("/"))
    .join("/");
  const time = game_time(json.status, a.score, b.score);

  if (time != "final") {
    setTimeout(() => {
      loadJSON(
        `https://site.api.espn.com/apis/site/v2/sports/${SLUGS[sport]}/scoreboard/${json.id}`,
        (j) => loadScore(j, sport),
      );
    }, 15 * 1000);
    // console.log("LS ST", new Date());
  }

  for (const index of [1, 2]) {
    let span = document.getElementById(`game-${index}-${json.id}`);
    if (span === null) {
      continue;
    }

    let left = span.innerText.split("\u{200B}")[0];

    let score;
    if (a.id == span.team) {
      score = `${a.score}-${b.score}`;
    } else {
      score = `${b.score}-${a.score}`;
    }

    span.innerText = `${left}\u{200B} ${score}, ${time} on ${broadcasts}`;
  }
}

const game1 = {
  opponent: "Miami",
  rank: 22,
  location: "away",
  status: "loss",
  team_score: 70,
  opponent_score: 75,
};

const game2 = {
  opponent: "Albany",
  rank: 0,
  location: "home",
  status: "future",
  date: "2022-12-30T22:00:00Z",
  // day: "Fri",
  // time: '9pm',
};

const exampleRanking = [
  {
    name: "Texas",
    "votes-first": 3,
    rank: 0,
    points: 123,
    record: "1-0",
    id: 251,
  },
];

function broadcasts(broadcasts) {}

function placeGames(json, week, teamRanking, sport) {
  const teamId = json.team.id;
  let record = document.getElementById(`record-${teamId}`);
  record.innerText = json.team.recordSummary;
  let currentGames = [];
  for (const game of json.events) {
    console.log("GAME", game);
    const w = game.week.number;
    if (w > week) {
      break;
    } else if (w < week) {
      continue;
    }

    let g = {
      opponent: "Miami",
      rank: undefined,
      location: "away",
      status: "loss",
      team_score: 70,
      opponent_score: 75,
    };
    const competition = game.competitions[0];
    const status = competition.status.type.name;
    g.date = competition.date;
    g.id = competition.id;
    g.ot = competition.status.type.altDetail;
    g.broadcast = competition.broadcasts
      .map((b) => b.media.shortName)
      .join("/");
    for (const comp of competition.competitors) {
      if (comp.id === teamId) {
        g.location = comp.homeAway;
        if (status === "STATUS_FINAL") {
          g.team_score = comp.score.value;
        }
      } else {
        g.opponent = comp.team.nickname;
        g.rank = teamRanking[comp.id];
        if (status === "STATUS_FINAL") {
          g.opponent_score = comp.score.value;
        }
      }
    }
    if (competition.neutralSite) {
      g.location = "neutral";
    }
    if (status === "STATUS_FINAL") {
      if (g.team_score > g.opponent_score) {
        g.status = "win";
      } else {
        g.status = "loss";
      }
    } else {
      if (new Date().toISOString() > competition.date) {
        g.status = "current";
      } else {
        g.status = "future";
      }
    }

    currentGames.push(g);
    // currentGames.push();
  }
  document
    .getElementById("games-" + teamId)
    .replaceWith(create_games(currentGames, teamId, sport));
}

function setRankings(json, week, teamRanking, sport) {
  let table = document.getElementById("table");
  // const games = json.games.data;
  // for (const team of json.ranking.data) {
  for (const team of json) {
    console.log(team);
    let row = document.createElement("tr");

    row.appendChild(td(team.name));
    if (team["votes-first"] > 0) {
      row.appendChild(td(`${team.rank} (${team["votes-first"]})`));
    } else if (team.rank > 0) {
      row.appendChild(td(team.rank));
    } else {
      row.appendChild(td("NR"));
    }
    row.appendChild(td(team.points));
    row.appendChild(td(team.record, `record-${team.id}`));
    // row.appendChild(create_games(games[team.id], team.id));

    console.log("TEAM", team);
    let games = create_games([], team.id, sport);
    games.id = "games-" + team.id;
    loadJSON(
      `https://site.api.espn.com/apis/site/v2/sports/${SLUGS[sport]}/teams/${team.id}/schedule`,
      (json) => placeGames(json, week, teamRanking, sport),
    );
    row.appendChild(games);

    table.appendChild(row);
  }
}

function setRankings2(json, sport) {
  let ranking = json.rankings[0];
  const week = +ranking.occurrence.value;
  let teams = ranking.ranks.concat(ranking.others);
  let ranks = [];
  let teamRanking = {};
  for (const team of teams) {
    teamRanking[team.team.id] = team.current;
    ranks.push({
      name: team.team.nickname,
      "votes-first": team.firstPlaceVotes,
      rank: team.current,
      points: team.points,
      record: team.recordSummary,
      id: team.team.id,
    });
  }
  setRankings(ranks, week, teamRanking, sport);
}

let sport = "men-bball";
const SLUGS = {
  "men-bball": "basketball/mens-college-basketball",
  "women-bball": "basketball/womens-college-basketball",
  baseball: "baseball/college-baseball",
  "men-lax": "lacrosse/mens-college-lacrosse",
};
function init() {
  const params = new URLSearchParams(window.location.search);
  let sport = params.get("sport") || "men-bball";
  let select = document.getElementById("sport");
  select.value = sport;
  initSport(sport);
}
function initSport(sport) {
  loadJSON(
    `https://site.api.espn.com/apis/site/v2/sports/${SLUGS[sport]}/rankings`,
    (j) => setRankings2(j, sport),
  );
  let ranking = [];

  // setRankings({});
}
