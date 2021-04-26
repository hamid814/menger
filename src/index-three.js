const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 20);
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

const center = new V(0, 0, 0);

const menger = new Menger(2, 1, center);

// 31019008
// 1802240
// 104704
// 6080
// 352
// 20

const positions = menger.getPositions();

console.log('cubes Count:', positions.length);

// const cubeGeo = new THREE.BoxGeometry();
const cubeGeo = new THREE.BoxBufferGeometry();
// const cubeMat = new THREE.MeshNormalMaterial();
const cubeMat = new THREE.MeshStandardMaterial({
  roughness: 0.6,
  metalness: 0.4,
  wireframe: true,
});

const bufferGeo = new THREE.BufferGeometry();
const bufferArray = new Float32Array(positions.length * 72);
const normalBufferArray = new Float32Array(positions.length * 72);
const indexBufferArray = new Uint16Array(positions.length * 36);
const bufferAttribute = new THREE.BufferAttribute(bufferArray, 3);
const normalBufferAttribute = new THREE.BufferAttribute(normalBufferArray, 3);
const indexBufferAttribute = new THREE.BufferAttribute(indexBufferArray, 1);

num = 0;

// positions.forEach((pos, i) => {
for (let i = 0; i < positions.length; i++) {
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  const pos = positions[i];
  cube.position.set(pos.x, pos.y, pos.z);

  const cubePositionAttr = cube.geometry.attributes.position;
  const cubeNormalAttr = cube.geometry.attributes.normal;
  const cubeIndex = cube.geometry.index;
  num++;

  for (let j = 0; j < cubePositionAttr.count; j++) {
    const j3 = j * 3;

    const x = cubePositionAttr.array[j3] + pos.x;
    const y = cubePositionAttr.array[j3 + 1] + pos.y;
    const z = cubePositionAttr.array[j3 + 2] + pos.z;

    const nx = cubeNormalAttr.array[j3];
    const ny = cubeNormalAttr.array[j3 + 1];
    const nz = cubeNormalAttr.array[j3 + 2];

    bufferAttribute.setXYZ(j + i * 24, x, y, z);
    normalBufferAttribute.setXYZ(j + i * 24, nx, ny, nz);
  }

  for (let j = 0; j < cubeIndex.count; j++) {
    const x = cubeIndex.array[j];

    indexBufferAttribute.setX(j + i * 36, x + i * 24);
  }
}

console.log(num);

bufferGeo.setAttribute('position', bufferAttribute);
bufferGeo.setAttribute('normal', normalBufferAttribute);
bufferGeo.setIndex(indexBufferAttribute);

console.log(bufferGeo);

const mesh = new THREE.Mesh(
  bufferGeo,
  new THREE.MeshNormalMaterial({ side: 2 })
);

scene.add(mesh);

positions.forEach();

function render() {
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
render();

console.log('render calls:', renderer.info.render.calls);
