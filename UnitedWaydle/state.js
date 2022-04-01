function getShuffle() {
    let l = [];
    for (let i = 0; i < words.length; i++) {
        l.push(`${i}`);
    }
    for (let i = words.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = l[i];
        l[i] = l[j];
        l[j] = t;
    }
    return l.join('/');
}

function currentIndex() {
    let indexes = Cookies.get('shuffle').split('/');
    return +indexes[+Cookies.get('index')];
}
function lastWord() {
    return (+Cookies.get('index')) == (words.length - 1);
}

function increaseIndex() {
    Cookies.set('index', +Cookies.get('index') + 1);
}

function currentWord() {
    return currentEntry().word;
}

function currentEntry() {
    return words[currentIndex()];
}