function correctness(guess) {
    const correct = currentWord();

    let counts = new Map();
    for (const c of correct) {
        if (counts.has(c)) {
            counts.set(c, counts.get(c) + 1);
        } else {
            counts.set(c, 1);
        }
    }

    for (let i = 0; i < 5; i++) {
        if (guess[i] == correct[i]) {
            counts.set(correct[i], counts.get(correct[i]) - 1);
        }
    }

    let result = '';
    for (let i = 0; i < 5; i++) {
        if (guess[i] == correct[i]) {
            result += 'G';
        } else if (counts.has(guess[i]) && counts.get(guess[i]) > 0) {
            result += 'Y';
        } else {
            result += 'B';
        }
    }
    
    return result;
}