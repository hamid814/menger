const indexArray = [
  0,
  2,
  1,
  2,
  3,
  1,
  4,
  6,
  5,
  6,
  7,
  5,
  8,
  10,
  9,
  10,
  11,
  9,
  12,
  14,
  13,
  14,
  15,
  13,
  16,
  18,
  17,
  18,
  19,
  17,
  20,
  22,
  21,
  22,
  23,
  21,
];

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
document.body.appendChild(renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

// const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 1, 1000);
// camera.lookAt(0, 0, 0);
// camera.position.set(30, 30, 30);
// scene.add(camera);

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 30);
camera.lookAt(0, 0, 0);

new OrbitControls(camera, renderer.domElement);

const light1 = new THREE.PointLight(0x886666);
light1.position.set(30, 30, 30);
scene.add(light1);

const light2 = new THREE.PointLight(0x886666);
light2.position.set(-30, 30, -30);
scene.add(light2);

const light3 = new THREE.PointLight(0x886666);
light3.position.set(0, -30, 0);
scene.add(light3);

// scene.add(new THREE.AxesHelper());

const cubeGeo4 = new THREE.BoxBufferGeometry(1 / 3, 1 / 3, 1 / 3);
const cubeGeo3 = new THREE.BoxBufferGeometry();
const cubeGeo2 = new THREE.BoxBufferGeometry(3, 3, 3);
const cubeGeo1 = new THREE.BoxBufferGeometry(9, 9, 9);
const cubeMat = new THREE.MeshNormalMaterial();
// const cubeMat = new THREE.MeshStandardMaterial({
//   roughness: 0.6,
//   metalness: 0.4,
//   // wireframe: true,
// });

const mengerWidth = 27;

const menger1Pos = new V((mengerWidth / 2) * 3, 0, 0);
const menger1 = new Menger(1, 9, menger1Pos);
const cube1 = new THREE.Mesh(cubeGeo1, cubeMat);

const menger2Pos = new V(mengerWidth / 2, 0, 0);
const menger2 = new Menger(2, 3, menger2Pos);
const cube2 = new THREE.Mesh(cubeGeo2, cubeMat);

const menger3Pos = new V(mengerWidth / -2, 0, 0);
const menger3 = new Menger(3, 1, menger3Pos);
const cube3 = new THREE.Mesh(cubeGeo3, cubeMat);

const menger4Pos = new V((mengerWidth / -2) * 3, 0, 0);
const menger4 = new Menger(4, 1 / 3, menger4Pos);
const cube4 = new THREE.Mesh(cubeGeo4, cubeMat);

// 31019008
// 1802240
// 104704
// 6080
// 352
// 20

const positions1 = menger1.getPositions();
const positions2 = menger2.getPositions();
const positions3 = menger3.getPositions();
const positions4 = menger4.getPositions();

console.log(
  'cubes Count:',
  positions1.length + positions2.length + positions3.length + positions4.length
);

function createUsignBuffer(positions, cube) {
  const bufferGeo = new THREE.BufferGeometry();

  const positionArray = new Float32Array(positions.length * 108);
  const normalArray = new Float32Array(positions.length * 108);

  const positionBA = new THREE.BufferAttribute(positionArray, 3);
  const normalBA = new THREE.BufferAttribute(normalArray, 3);

  let num = 0;

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];

    cube.position.set(pos.x, pos.y, pos.z);

    const cubePositionAttr = cube.geometry.attributes.position;
    const cubeNormalAttr = cube.geometry.attributes.normal;

    for (let j = 0; j < indexArray.length; j++) {
      const index = indexArray[j];

      const x = cubePositionAttr.array[index * 3] + pos.x;
      const y = cubePositionAttr.array[index * 3 + 1] + pos.y;
      const z = cubePositionAttr.array[index * 3 + 2] + pos.z;

      const nx = cubeNormalAttr.array[index * 3];
      const ny = cubeNormalAttr.array[index * 3 + 1];
      const nz = cubeNormalAttr.array[index * 3 + 2];

      positionBA.setXYZ(j + i * 36, x, y, z);
      normalBA.setXYZ(j + i * 36, nx, ny, nz);
    }
  }

  bufferGeo.setAttribute('position', positionBA);
  bufferGeo.setAttribute('normal', normalBA);

  const mesh = new THREE.Mesh(bufferGeo, cubeMat);

  scene.add(mesh);
}

function createStandard() {
  positions.forEach((pos) => {
    const cube = new THREE.Mesh(cubeGeo, cubeMat);

    cube.position.set(pos.x, pos.y, pos.z);

    scene.add(cube);
  });
}

function render() {
  renderer.render(scene, camera);

  stats.update();

  requestAnimationFrame(render);
}

async function startApp() {
  await createUsignBuffer(positions1, cube1);
  await createUsignBuffer(positions2, cube2);
  await createUsignBuffer(positions3, cube3);
  await createUsignBuffer(positions4, cube4);
  // await createStandard();

  render();

  setInterval(() => {
    console.log('render calls:', renderer.info.render.calls);
  }, 1000);
}

startApp();

window.addEventListener('resize', () => window.location.reload());
