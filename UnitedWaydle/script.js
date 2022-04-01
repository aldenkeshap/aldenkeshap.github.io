let guesses = 0;
let enabled = false;

function getLetter(i) {
    // let letters = document.getElementsByClassName("letter");
    // return letters[i];
    return document.getElementById(`letter-${i}`);
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

function pressKey(k, skip) {
    const i = getCurrent();
    if ((skip || enabled) && Math.floor(i / 5) <= guesses) {
        getLetter(i).innerHTML = k;
        if (!skip) {
            Cookies.set('letters', Cookies.get('letters') + k);
        }
    } else {
        console.log("PK FAIL");
    }
}

function backspace() {
    let i = getCurrent();
    if (i != guesses * 5) {
        getLetter(i - 1).innerHTML = '';
        Cookies.set('letters', Cookies.get('letters').slice(0, -1));
    }
}

colors = {
    B: 'black',
    Y: 'yellow',
    G: 'green',
};
function makeGuess(skip) {
    let guess = '';
    for (let i = 0; i < 5; i++) {
        let letter = getLetter(i + 5 * guesses);
        guess += letter.innerHTML;
    }

    if (guess.length != 5 || !allowed.includes(guess.toLowerCase())) {
        console.log('MG', skip);
        if (!skip) {
            shake();
        }

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
    if (!skip) {
        Cookies.set('letters', Cookies.get('letters') + '/');
    }
    if (result == 'GGGGG') {
        enabled = false;
        setTimeout(success, 500);
    } else if (guesses == 6) {
        enabled = false;
        setTimeout(success, 500);
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
    let message = document.getElementById('message');
    message.innerHTML = "Congratulations, you've solved this puzzle. ";
    message.hidden = false;
    showPopup();
}
function failed() {
    let message = document.getElementById('message');
    message.innerHTML = "You've run out of guesses to solve this puzzle. ";
    const correct = currentWord();
    message.innerHTML += `The correct answer was ${correct}. `;
    message.hidden = false;
    showPopup();
}

function showPopup() {
    let letterGrid = document.getElementsByClassName('grid-container')[0];
    letterGrid.classList.add("darken");
    let keyboard = document.getElementsByClassName('keyboard')[0];
    keyboard.classList.add("darken");

    const current = currentEntry();
    let word = document.getElementById("word");
    word.innerHTML = currentWord();
    let message = document.getElementById('message');
    message.innerHTML += current.desc;
    let info = document.getElementById('info');
    info.href = current.link;
    let scroll = document.getElementById('scroll');
    scroll.scroll(0, 0)
    document.getElementById('popup').hidden = false;

}

function reset() {
    for (let letterBox of document.getElementsByClassName("letter-box")) {
        letterBox.classList.remove("black");
        letterBox.classList.remove("yellow");
        letterBox.classList.remove("green");
        letterBox.children[0].innerHTML = "";
    }
    for (let key of document.getElementsByClassName("key")) {
        key.classList.remove("black");
        key.classList.remove("yellow");
        key.classList.remove("green");
    }

    let letterGrid = document.getElementsByClassName('grid-container')[0];
    letterGrid.classList.remove("darken");
    let keyboard = document.getElementsByClassName('keyboard')[0];
    keyboard.classList.remove("darken");
    document.getElementById('popup').hidden = true;
    guesses = 0;
    enabled = true;
    if (lastWord()) {
        Cookies.set('index', 0);
        Cookies.set('shuffle', getShuffle());
    } else {
        increaseIndex();
    }
    
    updateTitle();
    Cookies.set('letters', '');
}

function hideKeyboard() {
    let keys = document.getElementsByClassName("key");
    for (let key of keys) {
        key.hidden = true;
    }
}

function updateTitle() {
    let title = document.getElementById("title");
    title.innerHTML = `United Waydle`;
}

function shake() {
    for (let i = 0; i < 5; i++) {
        let letter = document.getElementsByClassName('letter-box')[guesses * 5 + i];
        letter.classList.remove('shake');
        letter.classList.add('shake');
        setTimeout(function () {
            letter.classList.remove('shake');
        }, 1000);
    }
    console.log('SHAKE!');
}

let allowed;
function setup() {
    document.addEventListener('keydown', function (e) {
        if (e.code.startsWith('Key') && e.key.length == 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            pressKey(e.key.toUpperCase(), false);
        } else if (e.key == 'Backspace') {
            backspace();
        } else if (e.key == 'Enter') {
            makeGuess();
        }
        
    });
    fetch("./guesses.txt").then(x => x.text()).then(q => {
        allowed = q.split(/\n/);
        for (const k of Cookies.get('letters')) {
            if (k == '/') {
                makeGuess(true);
            } else {
                pressKey(k, true);
            }
        }
        enabled = true;
    });
    if (!Cookies.get('index')) {
        Cookies.set('index', 0);
    }
    if (!Cookies.get('letters')) {
        Cookies.set('letters', '');
    }
    if (!Cookies.get('shuffle')) {
        Cookies.set('shuffle', getShuffle());
    }
    for (let letterBox of document.getElementsByClassName("letter-box")) {
        letterBox.addEventListener('touchend', function (e) {
            e.preventDefault();
        });
    }
    for (let keyBox of document.getElementsByClassName("key-box")) {
        keyBox.addEventListener('touchend', function (e) {
            e.preventDefault();
            // pressKey(keyBox.children[0].innerHTML);
            keyBox.children[0].click();
            console.log("CLICK");
        });
    }
    updateTitle();

}

