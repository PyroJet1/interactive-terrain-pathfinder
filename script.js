let gridWidth = 200;
let gridHeight = 150;
let cellWidth, cellHeight;
let zoomFactor = 0.05;

function setup(){
    createCanvas(windowWidth, windowHeight);
    cellWidth = width / gridWidth;
    cellHeight = height / gridHeight;
    background(200);
    noLoop();
    redraw();
}

function draw(){
    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){
            const noiseValue = noise(x * zoomFactor, y * zoomFactor);
            fill(255 * noiseValue);
            noStroke();
            rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
    }
}

function mouseClicked(){
}

function mouseMoved(){
}

// function regenerateMap() {
//   redraw();
// }