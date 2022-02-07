function tape(answer, guess) {
    letterCounts = {};
    for (let c of answer) {
        let current = letterCounts[c] || 0;
        letterCounts[c] = current + 1;
    }
    // console.log("T1", letterCounts);
    let result = ['', '', '', '', ''];

    let incorrect = [];
    for (let i = 0; i < 5; i++) {
        let a = answer[i];
        let g = guess[i];
        if (a === g) {
            letterCounts[a] -= 1;
        }
    }
    // console.log("T2", letterCounts);
    for (let i = 0; i < 5; i++) {
        let a = answer[i];
        let g = guess[i];
        // console.log('T-F', a, g, letterCounts, result);
        if (a === g) {
            result[i] = 'g';
        } else if (letterCounts[g] > 0) {
            result[i] = 'y';
            letterCounts[g] -= 1;
        } else {
            result[i] = 'b';
        }
    }
    // console.log("T3", letterCounts);
    return result.join('');
}

function filter(options, guess, result) {
    let fits = [];
    for (let option of options) {
        if (tape(option, guess) === result) {
            fits.push(option);
        }
    }
    return fits;
}

let currentPairs = new Map();
function makeGuess() {
    let any = false;
    let pairs = new Map();
    for (let row of rows) {
        let guess = '';
        let result = '';
        if (row[4].innerText != '-') {
            any = true;
            for (let button of row) {
                guess += button.innerText.toLowerCase();
                if (button.classList.contains('green')) {
                    result += 'g';
                } else if (button.classList.contains('yellow')) {
                    result += 'y';
                } else {
                    result += 'b';
                } 
            }
            console.log('ROW', guess, result);
            pairs.set(guess, result);
        }
    }
    if (any) {
        console.log('MG', pairs);
        let update = false;
        if (currentPairs.size != pairs.size) {
            update = true;
        } else {
            for (let [key, old] of currentPairs) {
                if (!pairs.has(key) || old !== pairs.get(key)) {
                    update = true;
                    break;
                }
            }
        }
        console.log('UPDATE', update, currentPairs, pairs);
        if (update) {
            let options = answers;
            for (let [guess, result] of pairs) {
                options = filter(options, guess, result);
            }
            bestGuess(options);
            currentPairs = pairs;
        }
        
    }
}

function bestGuess(options) {
    let box = document.getElementById('suggestion');
    if (options.length == 1) {
        box.innerText = "Right answer: " + options[0];
        return;
    }
    let best = '';
    let bestScore = options.length * 2;
    for (let guess of answers) {
        let results = new Map();
        let reasonable = true;
        for (let answer of options) {
            let r = tape(answer, guess);
            let current = results.get(r) || 0;
            current += 1;
            if (current > bestScore) {
                reasonable = false;
                break;
            }
            results.set(r, current);
        }
        if (!reasonable) {
            continue
        }
        let score = Math.max(...results.values());
        if (options.indexOf(guess) != -1) {
            score -= 0.5;
        }
        if (score < bestScore) {
            bestScore = score;
            best = guess;
        }
    }
    
    if (bestScore > -10) {
        box.innerText = "Suggested guess: " + best;
    } else {
        box.innerText = "That doesn't seem possible";
    }
}

let answers = 5;

let guesses = 6;

fetch("./answers.txt").then(x => x.text()).then(q => {answers = q.split(/\n/)});

fetch("./guesses.txt").then(x => x.text()).then(q => {guesses = q.split(/\n/)});

