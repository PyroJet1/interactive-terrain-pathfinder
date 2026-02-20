
function setup(){
    createCanvas(600,600);
    background(200);
    noLoop();
}

function draw(){
    for (x = 0; x < width; x++){
        for (y = 0; y < height; y++){
            set(x,y, color(255*Math.random()));
        }
    }
    updatePixels();
}

function mouseClicked(){

}

function mouseMoved(){

}

// function regenerateMap() {
//   redraw();
// }