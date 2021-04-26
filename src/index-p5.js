let menger;
let menger2;
let menger3;

function setup() {
  createCanvas(innerWidth, innerHeight, WEBGL);

  const center = new V(0, 0, 0);
  const left = new V(0, -130, 0);
  const right = new V(0, 130, 0);

  menger = new Menger(2, 15, center);

  menger2 = new Menger(1, 45, left);
  menger3 = new Menger(3, 5, right);

  createEasyCam();
}

function draw() {
  background(220);

  normalMaterial();

  menger.drawP5();
  menger2.drawP5();
  menger3.drawP5();

  // translate(60, 0, 0);
  // push();
  // box(30, 70, 70);
  // pop();

  // translate(-120, 0, 0);
  // push();
  // box(30, 70, 70);
  // pop();
}
