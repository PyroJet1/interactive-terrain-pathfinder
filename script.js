let gridWidth = 400;
let gridHeight = 300;
let cellWidth, cellHeight;
let zoomFactor = 0.04;

let WATER, SHORE, GRASS, MOUNTAIN, SNOW; 

function setup(){
    createCanvas(windowWidth, windowHeight);
    cellWidth = width / gridWidth;
    cellHeight = height / gridHeight;

    noiseDetail(7, 0.5)

    WATER = new Terrain('water', color(64, 123, 158), 10);
    SHORE = new Terrain('shore', color(238, 214, 175), 2);
    GRASS = new Terrain('grass', color(139, 172, 120), 1);
    MOUNTAIN = new Terrain('mountain', color(169, 157, 144), 5);
    SNOW = new Terrain('snow', color(255, 255, 255), 8)

    background(200);
    noLoop();

    console.log('Terrain initialized:', WATER, SHORE, GRASS, MOUNTAIN, SNOW);
}

function getTerrainType(noiseValue) {
    if (noiseValue < 0.4) return {terrain: WATER, min: 0, max: 0.4};
    if (noiseValue < 0.5) return {terrain: SHORE, min: 0.4, max: 0.5};
    if (noiseValue < 0.65) return {terrain: GRASS, min: 0.5, max: 0.65};
    if (noiseValue < 0.8) return {terrain: MOUNTAIN, min: 0.65, max: 0.8};
    return {terrain: SNOW, min: 0.8, max: 1.0};
}

function draw(){
    
    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){

            const noiseValue = noise(x * zoomFactor, y * zoomFactor);
            const terrainData = getTerrainType(noiseValue);
            
            const right = x < gridWidth-1 ? noise((x+1) * zoomFactor, y * zoomFactor) : noiseValue;
            const down = y < gridHeight-1 ? noise(x * zoomFactor, (y+1) * zoomFactor) : noiseValue;
            
            const slopeX = noiseValue - right;
            const slopeY = noiseValue - down;
            const slope = slopeX + slopeY;
            
            const lighting = map(slope, -0.3, 0.3, 0.4, 1.6);
            const constrainedLighting = constrain(lighting, 0.4, 1.6);
            
            let terrainColor = terrainData.terrain.getColor(noiseValue, terrainData.min, terrainData.max);
            
            fill(
                red(terrainColor) * constrainedLighting, 
                green(terrainColor) * constrainedLighting, 
                blue(terrainColor) * constrainedLighting
            );
            
            noStroke();
            rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
    }
    
}

function mouseClicked(){
}

function mouseMoved(){
}
