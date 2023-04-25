const BASE = "https://busrouter-1-p9387577.deta.app/"
// const BASE = "http://127.0.0.1:5000/";

let locations = {};

async function find(q) {
    const r = await fetch(BASE + "find?q=" + q);
    const j = await r.json();
    console.log('A F', j);
    return j;
}

function name(r) {
    const a = address(r);
    console.log('DISPLAY', r);
    console.log('ADDRESS', a);
    if (r.name) {
        console.log("NAME", r.name);
        return [r.name, a];
    } else if (a) {
        console.log("A");
        return [a, ''];
    } else {
        console.log("NONE");
    }
}

function address(r) {
    let a = '';
    if (r['addr:housenumber']) {
        a += r['addr:housenumber'] + ' ';
    }
    if (r['addr:street']) {
        a += r['addr:street'] + ' ';
    }
    return a;
}

function display(r) {
    const [main, sub] = name(r);
    let d = main;
    if (sub) {
        d += ' - ' + sub;
    }
    return d;
}

function search(id) {
    const i = document.getElementById(id);
    find(i.value).then((j) => {
        document.getElementById(id + '_options').innerHTML = '';
        for (const r of j) {
            const d = display(r[0]);
            append_option(id, d, r);
        }
    });
}
function here(id) {
    const i = document.getElementById(id);
    if (navigator.geolocation) {
        document.getElementById(id + '_options').innerHTML = '';
        const l = navigator.geolocation.getCurrentPosition((p) => {
            locations[id] = [{}, p.coords.latitude, p.coords.longitude];
            i.placeholder = 'Current location';
        });
    }
}

function append_option(loc, text, j) {
    let ul = document.getElementById(loc + '_options');
    let li = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = 'O';
    button.onclick = () => {
        ul.innerHTML = '';
        locations[loc] = j;
        let i = document.getElementById(loc);
        i.value = '';
        i.placeholder = display(j[0]);
    };
    li.appendChild(button);
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
}

async function route() {
    const f = `from=${locations.from[1]},${locations.from[2]}`;
    const t = `to=${locations.to[1]},${locations.to[2]}`;
    const w = 'weight=' + document.getElementById('weight').value;
    const r = await fetch(BASE + `route?${f}&${t}&${w}`);
    const j = await r.json();
    console.log(j);
    return j;
}

function go_route() {
    route().then((r) => {
        let ul = document.getElementById('directions');
        ul.innerHTML = '';
        for (const step of r) {
            let a = document.createElement('a');
            const mode = step.note.includes('Walk to ') ? "walking" : "driving";
            a.href = `https://maps.google.com/?saddr=&daddr=${step.end.lat},${step.end.lng}&directionsmode=${mode}`;
            let li = document.createElement('li');
            li.classList.add('step');
            let t = `${step.start.time}-${step.end.time} | ${step.note}`
            t = t.replace('<END>', name(locations.to[0])[0]);
            li.appendChild(document.createTextNode(t));
            a.appendChild(li)
            ul.appendChild(a);
        }
    });
}