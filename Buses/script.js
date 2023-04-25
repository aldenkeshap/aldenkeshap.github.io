const BASE = "https://busrouter-1-p9387577.deta.app/"
// const BASE = "http://127.0.0.1:5000/";

let locations = {
    // from: [{}, 0, 0],
    // to: [{}, 0, 0],
};
let updated = {
    from: 0,
    to: 0,
}

async function find(q) {
    const r = await fetch(BASE + "find?q=" + q);
    const j = await r.json();
    // console.log('A F', j);
    return j;
}

function name(r) {
    const a = address(r);
    // console.log('DISPLAY', r);
    // console.log('ADDRESS', a);
    if (r.name) {
        // console.log("NAME", r.name);
        return [r.name, a];
    } else if (a) {
        // console.log("A");
        return [a, ''];
    } else {
        // console.log("NONE");
        return ['here', ''];
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

function search(self, id) {
    self.disabled = true;
    const i = document.getElementById(id);
    if (i.value.length <= 2) {
        clear_options();
        return;
    }
    const t = new Date().getTime();
    find(i.value).then((j) => {
        if (updated.id > t) {
            return;
        }
        updated.id = t;
        self.disabled = false;
        let grid = document.getElementById('locations');
        clear_options();
        let i = 0;
        for (const r of j) {
            const d = display(r[0]);
            append_option(id, d, r);
            i++;
            if (i >= 10) {
                break;
            }
        }
    });
}
function here(self, id) {
    self.disabled = true;
    const i = document.getElementById(id);
    if (navigator.geolocation) {
        // document.getElementById(id + '_options').innerHTML = '';
        const l = navigator.geolocation.getCurrentPosition((p) => {
            locations[id] = [{}, p.coords.latitude, p.coords.longitude];
            i.placeholder = 'Current location';
            self.disabled = false;
        });
    }
}

function append_option(loc, text, j) {
    let grid = document.getElementById('locations');
    let button = document.createElement('button');
    button.innerText = text;
    button.classList.add('to-result');
    button.classList.add('dark');
    button.onclick = () => {
        // ul.innerHTML = '';
        locations['to'] = j;
        let i = document.getElementById(loc);
        i.value = '';
        i.placeholder = display(j[0]);
        clear_options();
        updated.to = new Date.getTime();
    };
    grid.appendChild(button);
}
function clear_options() {
    let grid = document.getElementById('locations');
    for (let i = 0; i < grid.childNodes.length;) {
        let r = grid.childNodes[i];
        if (r.classList && r.classList.contains('to-result')) {
            grid.removeChild(r);
        } else {
            i++;
        }
    }
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

function go_route(self) {
    self.disabled = true;
    route().then((r) => {
        self.disabled = false;
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

function swap() {
    let from = document.getElementById('from'); 
    let to = document.getElementById('to'); 

    const q = locations.from[0];
    if (!q.keys) {
        locations.from = locations.to;
        locations.to = [];
        from.placeholder = to.placeholder;
        to.placeholder = '';
    } else {
        locations.from = locations.to;
        locations.to = q;

        const p = from.placeholder;
        from.placeholder = to.placeholder;
        to.placeholder = p;
    }
    
}