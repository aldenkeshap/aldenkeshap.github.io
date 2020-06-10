function load(link, callback) {
    var req = new XMLHttpRequest();
    // req.overrideMimeType("application/json");
    req.open('GET', link, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == "200") {
            callback(req.responseText);
        }
    };
    req.send(null);
}

function run() {
    const code = document.getElementById('chacmaCode');
    // const url = 'localhost:8001/?code=' + btoa(code.value);
    const e = base32.encode(code.value);
    const url = 'http://nedla2004.pythonanywhere.com/?code=' + e;
    console.log(url);
    const outputBox = document.getElementById('output');
    outputBox.value = 'Loading...';
    load(url, setOutput);
}

function setOutput(output) {
    const outputBox = document.getElementById('output');
    outputBox.value = output;
}