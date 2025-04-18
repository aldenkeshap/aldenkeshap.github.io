// import * as wasm from "./pkg/bootstrap.js";

let full = "";
let common = "";
fetch("./common.txt").then((resp) => {
  if (resp.ok) {
    resp.text().then((t) => (common = t));
  }
});
fetch("./full.txt").then((resp) => {
  if (resp.ok) {
    resp.text().then((t) => (full = t));
  }
});

function wordList() {
  let list = document.getElementById("word-list").value;
  if (list === "full") {
    return full;
  } else if (list === "common") {
    return common;
  } else {
    console.log("UNKNOWN WORD LIST", list);
    return "";
  }
}

const LETTER_COUNTS = {
  3: "BDLNORT",
  2: "ACEFGHIKMPSWY",
  1: "JUVXZ",
  0: "Q",
};

function letterProgress(e) {
  let letters = document.getElementById("letters").value.toUpperCase().trim();
  let len = letters.length;
  let s = Math.min(len, 99).toString();
  s = s.length == 1 ? " " + s : s;

  let progress = document.getElementById("letter-progress");
  progress.innerHTML = s + "/12";
  progress.classList.remove("red");
  progress.classList.remove("green");
  // progress.classList.remove("black");
  let fail = false;
  if (len > 12 || letters.match(/[^A-Z]/g)) {
    fail = true;
  }
  for (const [limit, limitedLetters] of Object.entries(LETTER_COUNTS)) {
    for (const l of limitedLetters) {
      let occurences = len - letters.replaceAll(l, "").length;
      if (occurences > limit) {
        fail = true;
      }
    }
  }
  if (!fail && len === 12) {
    progress.classList.add("green");
    document.getElementById("solve").disabled = false;
  } else {
    if (fail) {
      progress.classList.add("red");
    }
    document.getElementById("solve").disabled = true;
  }
}

function draw() {
  tile(5, 5, "A");
  tile(6, 5, "A");
}

function display(solution) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = "48px monospace";
  ctx.imageSmoothingEnabled = true;

  let size = canvas.width;
  let squares = 12;
  function pos(x, y) {
    return [(x / squares) * size, (y / squares) * size];
  }
  function tile(x, y, letter) {
    const [l, t] = pos(x, y);
    ctx.fillStyle = "rgb(210 180 140)";
    ctx.strokeStyle = "rgb(0 0 0)";
    ctx.lineWidth = 3;
    ctx.fillRect(l, t, size / squares, size / squares);
    ctx.strokeRect(l, t, size / squares, size / squares);

    ctx.fillStyle = "rgb(0 0 0)";
    const [a, b] = pos(x + 0.25, y + 0.8);
    ctx.fillText(letter, a, b);
  }

  const rows = solution.split("/");
  const yOffset = Math.floor((12 - rows.length) / 2);
  const xOffset = Math.floor((12 - rows[0].length) / 2);

  ctx.fillStyle = "rgb(204 204 204)";
  ctx.fillRect(0, 0, size, size);
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const c = rows[y][x];
      if (c !== " ") {
        tile(x + xOffset, y + yOffset, c);
      }
    }
  }
}

let words = [];
function findWords(e) {
  const letters = document.getElementById("letters").value;
  document.getElementById("words-search").value = "";

  words = get_words(wordList(), letters.toUpperCase());
  showWords("");
}

function showWords(start) {
  const wordsDiv = document.getElementById("words");
  wordsDiv.innerHTML = "";

  words.sort();
  // console.log(words);
  for (const word of words) {
    if (!word.startsWith(start.toUpperCase())) {
      continue;
    }
    const p = document.createElement("p");
    p.classList.add("word");
    const text = document.createTextNode(word);
    p.appendChild(text);

    wordsDiv.appendChild(p);
  }
  wordsDiv.scrollTop = 0;
}

function wordSearch(e) {
  const start = document.getElementById("words-search").value;
  showWords(start);
}

let solutions = [];
let solutionIndex = 0;
let done = true;
function updateSolution() {
  const last = document.getElementById("last");
  const next = document.getElementById("next");
  const index = document.getElementById("index");

  const tail = done ? "" : "+";
  if (solutions.length === 0) {
    if (done) {
      display(" NO      //SOLUTIONS//   FOUND");
    } else {
      display("SEARCHING");
    }
    last.disabled = true;
    next.disabled = true;
    index.innerText = `0/0${tail}`;
    return;
  }

  if (solutions.length >= 1000) {
    index.innerText = `${solutionIndex + 1}/many`;
  } else {
    index.innerText = `${solutionIndex + 1}/${solutions.length}${tail}`;
  }

  last.disabled = solutionIndex == 0;
  next.disabled = solutionIndex == solutions.length - 1;
  display(solutions[solutionIndex]);
}
function next(e) {
  solutionIndex++;
  updateSolution();
}
function last(e) {
  solutionIndex--;
  updateSolution();
}

let wordIndex = 0;
let solutionLetters = "";
function solve(e) {
  solutionLetters = document.getElementById("letters").value;
  // words = get_words(full, solutionLetters);
  findWords(null);
  wordIndex = 0;
  // solutions = get_solutions(letters, full);
  // display(solutions[0]);
  // if (solutions.length === 0) {
  //   display(" NO      //SOLUTIONS//   FOUND");
  // }
  // display(solutions[0]);
  solutions = [];
  solutionIndex = 0;
  updateSolution();
  findSolutions(solutionLetters);
}

function findSolutions(letters) {
  if (letters !== solutionLetters) {
    return;
  }
  let word = words[wordIndex];
  console.log("FW", word, wordIndex, words.length, solutions.length);
  let p = getSolutions(letters.toUpperCase(), wordList(), word, solutions);
  p.then((r) => {
    if (letters !== solutionLetters) {
      return;
    }
    solutions = solutions.concat(r);
    wordIndex++;
    done = wordIndex === words.length;
    console.log("FW DONE?", done);
    updateSolution();
    if (!done && solutions.length < 1000) {
      setTimeout(() => findSolutions(letters), 0);
    }
  });
}

window.onload = function () {
  document.getElementById("letters").oninput = letterProgress;
  document.getElementById("words-search").oninput = wordSearch;
  document.getElementById("find-words").onclick = findWords;
  document.getElementById("solve").onclick = solve;
  document.getElementById("last").onclick = last;
  document.getElementById("next").onclick = next;
};

import init, { get_words, get_solutions } from "./pkg/qless.js";

async function run() {
  await init();
}

async function getSolutions(a, b, c, d) {
  return get_solutions(a, b, c, d);
}

run();
