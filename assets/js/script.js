const cnv = document.getElementById("myCanvas");
const ctx = cnv.getContext("2d");

let cnvStyleWidth = Math.floor(cnv.getBoundingClientRect().width);
let cnvStyleHeight = Math.floor(cnv.getBoundingClientRect().height);
cnv.width = cnvStyleWidth;
cnv.height = window.innerHeight;
cnv.style.width = cnv.width + "px";
cnv.style.height = cnv.height + "px";

// EVENT LISTENERS

const eventKeyDown = event => {
    switch (event.key) {
        case 'p':
            togglePause();
            break;
        case 'f':
            toggleFrame();
            break;
    }
};

document.addEventListener('keydown', eventKeyDown);

// RENDERING

function drawCell(i, j, fill) {
    const oldStyle = ctx.fillStyle;
    ctx.fillStyle = fill;
    ctx.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
    ctx.fillStyle = oldStyle;
}

// FIELD STUFF

const cellSize = 10;
const fieldWidth = Math.floor(cnv.width / cellSize);
const fieldHeight = Math.floor(cnv.height / cellSize);
const fieldSize = fieldWidth * fieldHeight;
emptyField = () => new Array(fieldSize); //Uint8Array(fieldSize);
let field = emptyField();

setCell = (g, x, y, val) => {
    x = ((x % fieldWidth) + fieldWidth) % fieldWidth;
    y = ((y % fieldHeight) + fieldHeight) % fieldHeight;
    g[y * fieldWidth + x] = val;
}

getCell = (g, x, y) => {
    x = ((x % fieldWidth) + fieldWidth) % fieldWidth;
    y = ((y % fieldHeight) + fieldHeight) % fieldHeight;
    return g[y * fieldWidth + x];
}

// SIM LOOP

let paused = true;

function init() {
    simulate();
    render();
}

function toggleFrame() {
    simulate();
    render();
}

function clearField() {
    field = emptyField();
    render();
}

function togglePause() {
    paused = !paused;
    if (!paused) update();
}

function render() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    for (let x = 0; x < fieldWidth; ++x) {
        for (let y = 0; y < fieldHeight; ++y) {
            drawCell(x, y, getCell(field, x, y));
        }
    }
}

function update() {
    if (paused) return;
    simulate();
    render();
    requestAnimationFrame(update);
}

let move = 0;
function simulate() {
    const newField = emptyField();

    for (let i = 0; i < fieldWidth; i += 2) {
        for (let j = 0; j < fieldHeight; j += 2) {
            setCell(newField, i, j, "#800000");
        }
    }
    for (let i = 1; i < fieldWidth; i += 2) {
        for (let j = 1; j < fieldHeight; j += 2) {
            setCell(newField, i, j, "#800000");
        }
    }
    setCell(newField, move++, 0, "#800000");

    field = newField;
}

init();
update();
