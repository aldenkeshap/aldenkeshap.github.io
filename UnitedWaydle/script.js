let guesses = 0;

function getLetter(i) {
    let letters = document.getElementsByClassName("letter");
    return letters[i];
}

function getCurrent() {
    let letters = document.getElementsByClassName("letter");
    for (let i = 0; i < 30; i++) {
        let letter = letters[i];
        if (!letter.innerHTML) {
            return i;
        }
    }
}

function pressKey(k) {
    const i = getCurrent();
    if (Math.floor(i / 5) <= guesses) {
        getLetter(i).innerHTML = k;
    }
}

function backspace() {
    let i = getCurrent();
    if (i != guesses * 5) {
        getLetter(i - 1).innerHTML = '';
    }
}

colors = {
    B: 'black',
    Y: 'yellow',
    G: 'green',
};
function makeGuess() {
    let guess = '';
    for (let i = 0; i < 5; i++) {
        let letter = getLetter(i + 5 * guesses);
        guess += letter.innerHTML;
    }

    if (guess.length != 5 || !allowed.includes(guess.toLowerCase())) {
        return;
    }
    const result = correctness(guess);

    let letterBoxes = document.getElementsByClassName("letter-box");
    for (let i = 0; i < 5; i++) {
        let letterBox = letterBoxes[i + 5 * guesses];
        const color = colors[result[i]];
        // console.log('MG', i, color, letterBox.classList, letterBox)
        letterBox.classList.add(color);
    }
    guesses++;
    updateKeyColors(guess, result);
    if (result == 'GGGGG') {
        success();
    } else if (guesses == 6) {
        failed();
    }
}

function updateKeyColors(guess, result) {
    for (let i = 0; i < 5; i++) {
        let key = getKey(guess[i]);
        const classes = [...key.classList];
        if (classes.includes('yellow') && result[i] == 'G') {
            key.classList.remove('yellow');
            key.classList.add('green');
        } else {
            key.classList.add(colors[result[i]])
        }
    }
}
function getKey(k) {
    let keys = document.getElementsByClassName("key");
    for (let key of keys) {
        if (key.innerHTML == k) {
            return key;
        }
    }
}

function success() {
    hideKeyboard();
    let message = document.getElementById('message');
    message.innerHTML = "Congratulations, you've solved today's United Waydle. Come back tomorrow for another one!";
    message.hidden = false;
    hideKeyboard();
}
function failed() {
    hideKeyboard();
    let message = document.getElementById('message');
    message.innerHTML = "You've run out of guesses to solve today's United Waydle. ";
    const correct = currentWord();
    message.innerHTML += `The correct answer was ${correct}. Come back tomorrow for another one!`;
    message.hidden = false;
}

function hideKeyboard() {
    let keys = document.getElementsByClassName("key");
    for (let key of keys) {
        key.hidden = true;
    }
}

let allowed;
function setup() {
    document.addEventListener('keydown', function (e) {
        if (e.code.startsWith('Key') && e.key.length == 1) {
            pressKey(e.key.toUpperCase());
        } else if (e.key == 'Backspace') {
            backspace();
        } else if (e.key == 'Enter') {
            makeGuess();
        }
        
    });
    fetch("./guesses.txt").then(x => x.text()).then(q => {allowed = q.split(/\n/)});
}

