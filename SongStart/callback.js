const urlParams = new URLSearchParams(window.location.hash.substring(1));
const headers = {
    'Authorization': `Bearer ${urlParams.get('access_token')}`,
    'Content-Type': 'application/json'
};


var deviceId = "";
var player;
window.onSpotifyWebPlaybackSDKReady = () => {
    const token = urlParams.get('access_token');
    player = new Spotify.Player({
        name: 'Song Start App',
        getOAuthToken: cb => { cb(token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        deviceId = device_id;
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
};

var started = false;
var timeLeft = 30 * 1000;
var playing = false;
var done = false;
var chosen = false;
var submitted = false;
var songs;
var songIndex = 0;
var songsCorrect = 0;
var guesses = 0;

function play() {
    if (!chosen) {
        start();
        return;
    } else if (done) {
        return;
    } else if (started) {
        const button = document.getElementById("button");
        if (playing) {
            const i = document.getElementById('song-name');
            i.focus();
            player.pause();
        } else {
            document.body.focus();
            player.resume();
        }
        playing = !playing;
        button.innerHTML = playing ? "Pause!" : "Play!";
    } else {
        songIndex++;
        
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [songs[songIndex].uri] }),
            headers: headers
        }).then(r => {
            started = true;
            playing = true;
            submitted = false;
            const button = document.getElementById("button");
            button.innerHTML = "Pause!";
        });
        
    }
}

function start() {
    getSongs().then(s => {
        songs = s;
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = songs[i];
            songs[i] = songs[j];
            songs[j] = temp;
        }

        const song = songs[0];
        console.log(song);
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [song.uri] }),
            headers: headers
        }).then(r => {
            started = true;
            playing = true;
            chosen = true;
            const button = document.getElementById("button");
            button.innerHTML = "Pause!";
        });
    });
    
}

async function getSongs() {
    const mode = document.getElementById("media-type").value;
    let id = document.getElementById("search-results").value;
    const res = await fetch(`https://api.spotify.com/v1/${mode}s/${id}/tracks`, {
        method: 'GET',
        headers: headers
    });
    let tempSongs = [];
    let json = await res.json();
    console.log(json);
    for (const song of json.items) {
        if (mode === 'playlist') {
            tempSongs.push(song.track);
        } else {
            tempSongs.push(song);
        }
    }
    return tempSongs;
}

async function getPlaylists() {
    return (await fetch("https://api.spotify.com/v1/me/playlists", {
        method: 'GET',
        headers: headers
    })).json();
}

function toOption(text, value) {
    let option = document.createElement("option");
}

function mediaTypeChange() {
    const type = document.getElementById("media-type");
    let options = document.getElementById("search-results");
    let topResult = document.getElementById("top-result");
    if (type.value === "playlist") {
        getPlaylists().then(playlists => {
            topResult.text = playlists.items.length ? "Choose playlist" : "No playlists exist";
            for (let i = options.length; i > 0; i--) {
                options.remove(i);
            }
            for (const playlist of playlists.items) {
                let option = document.createElement("option");
                option.text = playlist.name;
                option.value = playlist.id;
                options.add(option);
            }
        });
    } else if (type.value === "album") {
        topResult.text = "Search for an album"
    } else {
        topResult.text = "Select collection type"
    }
}

function submit() {
    let song = songs[songIndex];
    let button = document.getElementById("button");
    if (playing) {
        player.pause();
        button.innerHTML = "Play!";
        playing = false;
    }
    button.disabled = false;
    started = false;
    done = false;
    submitted = true;
    let input = document.getElementById("song-name");
    console.log(input.value, song.name, correct(input.value, song.name));
    input.value = "";
}

function cleanString(s) {
    let n = "";
    for (let c of s) {
        let p = c.toLowerCase().charCodeAt(0);
        if (97 <= p && p <= 122) {
            n += c.toLowerCase();
        }
    }
    return n;
}

function correct(guess, real) {
    if (levenshtein(cleanString(real), cleanString(guess)) <= 2) {
        songsCorrect++;
    }
    guesses++;
    document.getElementById('progress').innerHTML = `Progress: ${guesses}/${songs.length}`;
    document.getElementById('correct').innerHTML = `Correct: ${songsCorrect}/${guesses}`;
    document.getElementById('last').innerHTML = `Last: ${real}`;
    return levenshtein(cleanString(real), cleanString(guess)) <= 2;
}

async function search() {
    let search = document.getElementById("search").value;
    let topResult = document.getElementById("top-result");
    let res = await fetch(`https://api.spotify.com/v1/search?q=${search}&type=album&limit=10`, {
        method: 'GET',
        headers: headers
    })
    console.log(res);
    let reader = res.body.getReader();
    const decoder = new TextDecoder();
    let s = "";
    while (1) {
        const chunk = await reader.read();
        console.log(chunk.done);
        if (chunk.done) {
            break;
        } else {
            s += decoder.decode(chunk.value);
        }
    }
    const response = JSON.parse(s);
    console.log(response);
    let options = document.getElementById("search-results");
    for (let i = options.length; i > 0; i--) {
        options.remove(i);
    }
    for (const album of response.albums.items) {
        let option = document.createElement("option");
        option.text = `${album.name} by ${album.artists[0].name}`;
        option.value = album.id;
        options.add(option);
    }
    topResult.text = "Choose album"
}

function updateTimer() {
    const clock = document.getElementById("time");
    player.getCurrentState().then(state => {
        if (!state) {
            return;
        }
        const timeLeft = 30 * 1000 - state.position;
        clock.innerHTML = Math.max(0, Math.floor(timeLeft / 1000));
        if (timeLeft <= 0 && !done && !submitted) {
            done = true;
            player.pause();
            let button = document.getElementById("button");
            button.disabled = true;
            button.innerHTML = "Pause!";
        }
    });
}

setInterval(updateTimer, 1000);

function levenshtein(a, b) {
    if (!a || !b) {
        return (a || b).length;
    }
    let m = [];
    for (let i = 0; i <= b.length; i++) {
        m[i] = [i];
        if(i === 0) {
            continue;
        }
        for (let j = 0; j <= a.length; j++) {
            m[0][j] = j;
            if(j === 0) {
                continue;
            }
            m[i][j] = b.charAt(i - 1) == a.charAt(j - 1) ? m[i - 1][j - 1] : Math.min(
                m[i-1][j-1] + 1,
                m[i][j-1] + 1,
                m[i-1][j] + 1
            );
        }
    }
    return m[b.length][a.length];
};






