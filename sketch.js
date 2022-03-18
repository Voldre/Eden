let bird;

function setup() {
    createCanvas(400, 400, WEBGL);
    bird = loadModel('http://voldre.free.fr/Eden/bird.obj');
}

function draw() {
    background(20);
    model(bird);
}