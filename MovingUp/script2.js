function td(text, id) {
  let data = document.createElement("td");

  data.appendChild(document.createTextNode(text));
  if (id) {
    data.id = id;
  }
  return data;
}

async function load(url) {
  if (url.includes("espn.com")) {
    return await load_normal(url);
  } else {
    return await load_proxy(url);
  }
}

async function load_normal(url) {
  return await (await fetch(url)).text();
}

async function load_proxy(url) {
  for (let i = 0; i < 5; i++) {
    try {
      // let j = await (
      //   await fetch(
      //     `https://whateverorigin.org/get?url=${encodeURIComponent(url)}`,
      //   )
      // ).json();
      // return j.contents;
      return await (
        await fetch(`https://corsproxy.io/?url=${encodeURIComponent(url)}`)
      ).text();
    } catch (error) {
      console.log("LP ERR", error);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

// =========================================

import init, {
  init_panics,
  get_scores,
  Sport,
  Ranking,
  Game,
  Teams,
  RankingType,
} from "./moving_up.js";
await init();

init_panics();

const params = new URLSearchParams(window.location.search);
const sportName = params.get("sport") || "men-bball";
const rankingName = params.get("ranking") || "espn";

let select = document.getElementById("sport");
select.value = sportName;
init_rankings(sportName, rankingName);
let rankings = document.getElementById("ranking");

await run_sport(sportName, rankingName);

function init_rankings(sportName, rankingName) {
  let sport = Sport.from_name(sportName);

  let rankings = document.getElementById("ranking");
  rankings.innerHTML = "";
  for (const ranking of RankingType.options(sport)) {
    let option = document.createElement("option");
    option.value = ranking.get_slug();
    option.innerText = ranking.get_name();
    rankings.appendChild(option);
  }
  // setTimeout(() => {
  //   console.log("RANK", rankings, rankingName);

  // }, 3000);
  rankings.value = rankingName;
}

async function run_sport(sportName, rankingName) {
  const timezoneOffset = new Date().getTimezoneOffset();
  let sport = Sport.from_name(sportName);
  init_rankings(sportName, rankingName);

  let ranking_option = RankingType.options(sport)[0];
  for (const option of RankingType.options(sport)) {
    if (option.get_slug() === rankingName) {
      ranking_option = option;
    }
  }
  console.log("RO", ranking_option);

  if (ranking_option.hide_points()) {
    let header = document.getElementById("points-header");
    if (header) {
      header.remove();
    }
  }

  const teams = Teams.get_teams(await load(Teams.teams_url(sport)));
  console.log("TEAMS1", teams);
  const url1 = ranking_option.get_url1();
  console.log(url1);
  ranking_option.add_weeks(teams, await load(url1));

  if (!ranking_option.ranking_ready()) {
    const url2 = ranking_option.get_url2();
    console.log("TEAMS2", teams);
    ranking_option.add_specific(teams, await load(url2));
  }

  console.log(ranking_option);

  // let links = Ranking.get_weeks(await load_proxy(Ranking.ncbwa_url()));
  // console.log("LINKS", links);

  // let ncbwa = Ranking.from_ncbwa(teams, await load_proxy(links[0]));
  // console.log("NCBWA", ncbwa);

  // const url = sport.rankings_url();
  // let ranks = Ranking.from_json(await load(url));
  let ranks = ranking_option.get_ranking();
  console.log("RANKS1", ranks);

  let table = document.getElementById("table");
  while (true) {
    let row = table.lastChild;
    console.log("ROW", row);
    if (row.tagName == "TBODY") {
      break;
    }

    row.remove();
  }

  for (const team of ranks.teams) {
    let row = document.createElement("tr");

    row.appendChild(td(team.name));
    row.appendChild(td(team.show_rank()));
    if (!ranking_option.hide_points()) {
      let points = td(team.votes);
      points.classList.add("points");
      row.appendChild(points);
    }

    row.appendChild(td(team.record, `record-${team.id}`));
    row.appendChild(td("", "games-" + team.id));

    table.appendChild(row);
  }

  // if (ranking_option.hide_points()) {
  //   for (const elem of document.getElementsByClassName("points")) {
  //     elem.hidden = true;
  //   }
  // }

  const json_by_day = await Promise.all(
    ranks.scoreboard_urls(sport).map((url) => fetch(url).then((r) => r.text())),
  );
  let perspectives_by_day = json_by_day.map((j) => {
    return get_scores(sport, ranks, timezoneOffset, j);
  });

  for (const perspectives of perspectives_by_day) {
    for (const p of perspectives) {
      for (const teamId of p.perspectives) {
        let span = document.createElement("span");
        const id = `game-${teamId}-${p.game.id}`;
        if (document.getElementById(id)) {
          continue;
        }
        span.id = id;
        span.appendChild(document.createTextNode(p.game.show(teamId)));
        span.classList.add("game");
        span.classList.add(p.game.class(teamId));

        span.title = p.game.tooltip();

        let record = document.getElementById(`record-${teamId}`);
        const r = p.game.record(teamId);
        if (r.length > 0) {
          record.innerText = r;
        }

        let games = document.getElementById(`games-${teamId}`);
        games.appendChild(span);
      }
    }
  }

  const scoreboard_url = ranks.scoreboard_today(sport);
  setInterval(async () => {
    console.log("INT", sportName);

    let perspectives = get_scores(
      sport,
      ranks,
      timezoneOffset,
      await load(scoreboard_url),
    );

    for (const p of perspectives) {
      for (const teamId of p.perspectives) {
        // console.log("P")
        let span = document.getElementById(`game-${teamId}-${p.game.id}`);
        console.log(`game-${teamId}-${p.game.id}`);
        span.innerText = p.game.show(teamId);

        const cls = p.game.class(teamId);
        if (!span.classList.contains(cls)) {
          span.classList.remove("future", "current");
          span.classList.add(cls);
        }
      }
    }
  }, 10000);
}
let interval;

select.onchange = function (s) {
  let params = new URLSearchParams(window.location.search);
  params.set("sport", this.value);
  params.set("ranking", "espn");
  window.location.search = params.toString();
  // console.log("SELECT", s);
  // run_sport(this.value, "espn");
};

rankings.onchange = function (s) {
  let params = new URLSearchParams(window.location.search);
  params.set("ranking", this.value);
  window.location.search = params.toString();
  // console.log("R SELECT", s);
  // run_sport(params.get("sport"), this.value);
};
