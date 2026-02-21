import TinyQueue from './node_modules/tinyqueue/index.js';
import { Terrain } from './terrain.js'

let gridWidth = 200;
let gridHeight = 150;
let cellWidth, cellHeight;
let zoomFactor = 0.04;

let sourcePoint = null
let destPoint = null

let WATER, SHORE, GRASS, MOUNTAIN, SNOW;
let terrainLayer;
let destLocked;
let terrainGrid = Array(gridWidth).fill(null).map(() => Array(gridHeight));
let pathData = null;
let terrainOpacity = 0;


window.setup = function setup(){
    createCanvas(windowWidth, windowHeight);
    cellWidth = width / gridWidth;
    cellHeight = height / gridHeight;

    noiseDetail(7, 0.5);

    WATER = new Terrain('water', color(64, 123, 158), 10);
    SHORE = new Terrain('shore', color(238, 214, 175), 2);
    GRASS = new Terrain('grass', color(139, 172, 120), 1);
    MOUNTAIN = new Terrain('mountain', color(169, 157, 144), 5);
    SNOW = new Terrain('snow', color(255, 255, 255), 8)

    terrainLayer = createGraphics(width, height);
    drawTerrain();

    document.getElementById('regenerate').addEventListener('click', regenerateMap);

    loop();
}

function getTerrainType(noiseValue) {
    if (noiseValue < 0.4) return {terrain: WATER, min: 0, max: 0.4};
    if (noiseValue < 0.5) return {terrain: SHORE, min: 0.4, max: 0.5};
    if (noiseValue < 0.65) return {terrain: GRASS, min: 0.5, max: 0.65};
    if (noiseValue < 0.8) return {terrain: MOUNTAIN, min: 0.65, max: 0.8};
    return {terrain: SNOW, min: 0.8, max: 1.0};
}

function regenerateMap(){
    noiseSeed(Math.random() * 10000);
    drawTerrain();
    sourcePoint = null;
    destPoint = null;
    destLocked = false;
    pathData = null;
}

function dijkstras(sourceX, sourceY){
    let distances = Array(gridWidth).fill(null).map(() => Array(gridHeight).fill(Infinity));
    let predecessors = Array(gridWidth).fill(null).map(() => Array(gridHeight).fill(null));

    distances[sourceX][sourceY] = 0;

    let pq = new TinyQueue([], (a,b) => a.dist - b.dist);
    pq.push({x: sourceX, y: sourceY, dist: 0});

    while (pq.length > 0){
        let current = pq.pop();
        let {x, y, dist} = current;

        if (dist > distances[x][y]) continue;

        const neighbors = [
            {x: x-1, y: y, weight: 1},
            {x: x+1, y: y, weight: 1},
            {x: x, y: y-1, weight: 1},
            {x: x, y: y+1, weight: 1},
            {x: x-1, y: y-1, weight: 1.4},
            {x: x+1, y: y-1, weight: 1.4},
            {x: x-1, y: y+1, weight: 1.4},
            {x: x+1, y: y+1, weight: 1.4}
        ];

        neighbors.forEach(neighbor => {
            let nx = neighbor.x;
            let ny = neighbor.y;

            if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight){
                let newDist = distances[x][y] + (terrainGrid[nx][ny].terrain.cost * neighbor.weight);

                if (newDist < distances[nx][ny]){
                    distances[nx][ny] = newDist;
                    predecessors[nx][ny] = {x,y};
                    pq.push({x: nx, y: ny, dist: newDist});
                }
            }
        });
    }

    console.log('DijkstraDONE!')
    return {distances, predecessors};
}

function drawTerrain(){

    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){

            const noiseValue = noise(x * zoomFactor, y * zoomFactor);
            const terrainData = getTerrainType(noiseValue);

            terrainGrid[x][y] = terrainData;

            const right = x < gridWidth-1 ? noise((x+1) * zoomFactor, y * zoomFactor) : noiseValue;
            const down = y < gridHeight-1 ? noise(x * zoomFactor, (y+1) * zoomFactor) : noiseValue;
            
            const slopeX = noiseValue - right;
            const slopeY = noiseValue - down;
            const slope = slopeX + slopeY;
            
            const lighting = map(slope, -0.3, 0.3, 0.4, 1.6);
            const constrainedLighting = constrain(lighting, 0.4, 1.6);
            
            let terrainColor = terrainData.terrain.getColor(noiseValue, terrainData.min, terrainData.max);
            
            terrainLayer.fill(
                red(terrainColor) * constrainedLighting, 
                green(terrainColor) * constrainedLighting, 
                blue(terrainColor) * constrainedLighting
            );

            
            terrainLayer.noStroke();
            terrainLayer.rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
    }
}

function drawPath(targetX, targetY){
    let current = {x: targetX, y: targetY}
    let { predecessors } = pathData;

    stroke(0,0,255,150);
    strokeWeight(4);
    noFill();

    beginShape();
    while (current != null){
        vertex(
            current.x * cellWidth + cellWidth / 2, 
            current.y * cellHeight + cellHeight / 2
        );
        
        current = predecessors[current.x][current.y];
    }
    endShape();
}

window.draw = function draw(){

    if (terrainOpacity < 255) {
        terrainOpacity += 5;
    }
    
    tint(255, terrainOpacity);
    image(terrainLayer, 0, 0);
    noTint();

    if (destPoint && pathData){
        drawPath(destPoint.x, destPoint.y)
    }

    if (sourcePoint){
        drawMarker(sourcePoint.x, sourcePoint.y, color(255,0,0));
    }
    if (destPoint){
        drawMarker(destPoint.x, destPoint.y, color(0,0,255));
    } 
}

function drawMarker(gridX, gridY, markerColor){
    fill(markerColor);
    stroke(255);
    strokeWeight(2);
    ellipse(
        gridX * cellWidth + cellWidth/2, 
        gridY * cellHeight + cellHeight/2, 
        cellWidth * 2, 
        cellHeight * 2
    );
}

window.mouseClicked = function mouseClicked(){

    let clickedElement = document.elementFromPoint(mouseX, mouseY);
    if (clickedElement && clickedElement.tagName === 'BUTTON') {
        return;
    }

    let gridX = floor(mouseX / cellWidth);
    let gridY = floor(mouseY / cellHeight);

    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight){
        if(sourcePoint == null){
            sourcePoint = {x: gridX, y: gridY};
            pathData = dijkstras(gridX, gridY);
        }
        else{
            destPoint = {x: gridX, y: gridY};
            destLocked = true;
            console.log("DestPoint:", gridX, " ", gridY);
        } 
    }
    
}

window.mouseMoved = function mouseMoved(){
    if (sourcePoint && !destLocked) {
        let gridX = floor(mouseX / cellWidth);
        let gridY = floor(mouseY / cellHeight);
        
        if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
            destPoint = {x: gridX, y: gridY};
        }
    }
}
