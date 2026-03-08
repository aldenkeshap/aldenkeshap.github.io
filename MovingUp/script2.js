function td(text, id) {
  let data = document.createElement("td");

  data.appendChild(document.createTextNode(text));
  if (id) {
    data.id = id;
  }
  return data;
}

// =========================================

import init, {
  init_panics,
  get_scores,
  Sport,
  Ranking,
  Game,
} from "./moving_up.js";
await init();

init_panics();

const params = new URLSearchParams(window.location.search);
const sportName = params.get("sport") || "men-bball";

let select = document.getElementById("sport");
select.value = sportName;

await run_sport(sportName);

async function run_sport(sportName) {
  const timezoneOffset = new Date().getTimezoneOffset();
  let sport = Sport.from_name(sportName);

  const url = sport.rankings_url();
  let ranks = Ranking.from_json(await (await fetch(url)).text());

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
    row.appendChild(td(team.votes));
    row.appendChild(td(team.record, `record-${team.id}`));
    row.appendChild(td("", "games-" + team.id));

    table.appendChild(row);
  }

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
        span.id = `game-${teamId}-${p.game.id}`;
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
      await (await fetch(scoreboard_url)).text(),
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
  window.location.search = params.toString();
  console.log("SELECT", s);
  run_sport(this.value);
};
