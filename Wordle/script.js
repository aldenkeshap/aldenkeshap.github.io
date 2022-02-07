function editClick(i) {
    for (let edit of edits) {
        edit.classList.remove("active");
    }
    for (let row of rows) {
        for (let button of row) {
            button.classList.remove("active");
        }
    }
    for (let button of rows[i]) {
        button.classList.add("active");
    }
    let clicked = edits[i];
    clicked.classList.add("active");
}

function toggle(row, column) {
    let button = rows[row][column];
    if (button.classList.contains('black')) {
        button.classList.remove('black');
        button.classList.add('yellow');
    } else if (button.classList.contains('yellow')) {
        button.classList.remove('yellow');
        button.classList.add('green');
    } else {
        button.classList.remove('green');
        button.classList.add('black');
    }
    makeGuess();
}

function keypress(e) {
    let row = 0;
    for (; row < 6; row++) {
        if (edits[row].classList.contains('active')) {
            break;
        }
    }
    let column = 0;
    for (; column < 5; column++) {
        if (rows[row][column].innerText == '-') {
            break;
        }
    }
    console.log('RC', row, column, rows[row][column], e);
    if (e.key == 'Backspace') {
        if (column > 0) {
            rows[row][column - 1].innerText = '-';
        }
    } else if (e.key.length == 1 && e.key.match(/[a-z]/i)) {
        if (column < 5) {
            rows[row][column].innerText = e.key.toUpperCase();
        }
        if (column == 4 && row < 5) {
            editClick(row + 1);
        }
    }
    makeGuess();
}

let edits = [];
let rows = [];

window.onload = function () {
    let grid = document.getElementById("letter-grid");
    for (let row = 0; row < 6; row++) {
        let rowList = [];
        for (let column = 0; column < 6; column++) {
            let button = document.createElement("button");
            button.style.gridRow = row + 1;
            button.style.gridColumn = column + 1;
            button.onclick = function () {
                toggle(row, column);
            }
            if (column < 5) {
                let text = document.createTextNode('-');
                button.appendChild(text);
                button.classList.add("character");
                button.classList.add("black");
                rowList.push(button);
            } else if (column == 5) {
                let icon = document.createElement("i");
                icon.classList.add("fas");
                icon.classList.add("fa-edit");
                let i = edits.length;
                button.onclick = function () {
                    editClick(i);
                }
                button.classList.add("edit");
                button.appendChild(icon);
                edits.push(button);
            }
            grid.appendChild(button);
        }
        rows.push(rowList);
    }
    editClick(0);
}

document.addEventListener('keyup', keypress);