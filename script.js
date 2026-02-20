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
            
            let terrainColor;
            if (noiseValue < 0.4){
                terrainColor = color(64, 123, 158);
            }
            else if (noiseValue < 0.5){
                terrainColor = color(238, 214, 175);
            }
            else if (noiseValue < 0.65){
                terrainColor = color(139, 172, 120);
            }
            else if (noiseValue < 0.8){
                terrainColor = color(169, 157, 144);
            }
            else{
                terrainColor = color(255,255,255);
            }

            fill(terrainColor);
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