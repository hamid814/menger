let mengerP5;
let menger2P5;
let menger3P5;

function setup() {
  createCanvas(innerWidth, innerHeight, WEBGL);

  const center = new V(0, 0, 0);
  const left = new V(0, -130, 0);
  const right = new V(0, 130, 0);

  mengerP5 = new Menger(2, 15, center);

  menger2P5 = new Menger(1, 45, left);
  menger3P5 = new Menger(3, 5, right);

  createEasyCam();
}

function draw() {
  background(220);

  normalMaterial();

  mengerP5.drawP5();
  menger2P5.drawP5();
  menger3P5.drawP5();

  // translate(60, 0, 0);
  // push();
  // box(30, 70, 70);
  // pop();

  // translate(-120, 0, 0);
  // push();
  // box(30, 70, 70);
  // pop();
}
