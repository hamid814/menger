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

// indexs for each face in a cube
const facesArray = {
  11: [0, 1, 2, 3, 4, 5],
  10: [6, 7, 8, 9, 10, 11],
  21: [12, 13, 14, 15, 16, 17],
  20: [18, 19, 20, 21, 22, 23],
  31: [24, 25, 26, 27, 28, 29],
  30: [30, 31, 32, 33, 34, 35],
};

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
  100000
);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

// scene.add(new THREE.AxesHelper());

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

const cubeGeo = new THREE.BoxBufferGeometry();
const cubeMat = new THREE.MeshNormalMaterial();
// const cubeMat = new THREE.MeshStandardMaterial({
//   roughness: 0.6,
//   metalness: 0.4,
//   // wireframe: true,
// });

const n = 27;

const menger = new Menger(1, 9, new V(-n, 0, 0));
const menger2 = new Menger(2, 3, new V(0, 0, 0));
const menger3 = new Menger(3, 1, new V(n, 0, 0));
const menger4 = new Menger(4, 1 / 3, new V(n * 2, 0, 0));

// const menger = new Menger(4);

// 31019008
// 1802240
// 104704
// 6080
// 352
// 20

function createUsingBuffer(menger) {
  const size = menger.sth;

  const positions = menger.getPositions();

  console.log('faces: ', menger.facesCount);
  console.log('cubes count:', positions.length);

  const bufferGeo = new THREE.BufferGeometry();

  // two triangles for each face and three vertex each triangle and three ( xyz ) for each vertex
  const positionArray = new Float32Array(menger.facesCount * 2 * 3 * 3);
  const normalArray = new Float32Array(menger.facesCount * 2 * 3 * 3);

  const positionBA = new THREE.BufferAttribute(positionArray, 3);
  const normalBA = new THREE.BufferAttribute(normalArray, 3);

  let itteration = 0;

  const cube = new THREE.Mesh(cubeGeo, cubeMat);

  const cubePositionAttr = cube.geometry.attributes.position;
  const cubeNormalAttr = cube.geometry.attributes.normal;

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i].position;
    const faces = positions[i].faces;

    for (let j = 0; j < faces.length; j++) {
      const faceId = faces[j];
      const faceIndexes = facesArray[faceId];

      for (let k = 0; k < faceIndexes.length; k++) {
        let index = faceIndexes[k];
        index = indexArray[index];

        // size = menger.cubeSize
        const x = cubePositionAttr.array[index * 3] * size + pos.x;
        const y = cubePositionAttr.array[index * 3 + 1] * size + pos.y;
        const z = cubePositionAttr.array[index * 3 + 2] * size + pos.z;
        const nx = cubeNormalAttr.array[index * 3];
        const ny = cubeNormalAttr.array[index * 3 + 1];
        const nz = cubeNormalAttr.array[index * 3 + 2];

        positionBA.setXYZ(itteration, x, y, z);
        normalBA.setXYZ(itteration, nx, ny, nz);

        itteration++;
      }
    }
  }

  bufferGeo.setAttribute('position', positionBA);
  bufferGeo.setAttribute('normal', normalBA);

  const mesh = new THREE.Mesh(bufferGeo, cubeMat);

  scene.add(mesh);
}

function createUsingStatic() {
  const level = 3;
  const width = Math.pow(3, level);
  const positions = [];

  console.log('level:', level);

  for (let i = 1; i <= width; i++) {
    for (let j = 1; j <= width; j++) {
      for (let k = 1; k <= width; k++) {
        const v = new V(i, j, k);

        const isInMenger = isCube(v, width);

        !!isInMenger && positions.push(v);
      }
    }
  }

  const bufferGeo = new THREE.BufferGeometry();

  // two triangles for each face and three vertex each triangle and three ( xyz ) for each vertex
  const positionArray = new Float32Array(positions.length * 108);
  const normalArray = new Float32Array(positions.length * 108);

  const positionBA = new THREE.BufferAttribute(positionArray, 3);
  const normalBA = new THREE.BufferAttribute(normalArray, 3);

  let itteration = 0;

  const cube = new THREE.Mesh(cubeGeo, cubeMat);

  const cubePositionAttr = cube.geometry.attributes.position;
  const cubeNormalAttr = cube.geometry.attributes.normal;

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];

    for (let j = 0; j < indexArray.length; j++) {
      const index = indexArray[j];

      const x = cubePositionAttr.array[index * 3] + pos.x - width / 2;
      const y = cubePositionAttr.array[index * 3 + 1] + pos.y - width / 2;
      const z = cubePositionAttr.array[index * 3 + 2] + pos.z - width / 2;

      const nx = cubeNormalAttr.array[index * 3];
      const ny = cubeNormalAttr.array[index * 3 + 1];
      const nz = cubeNormalAttr.array[index * 3 + 2];

      positionBA.setXYZ(itteration, x, y, z);
      normalBA.setXYZ(itteration, nx, ny, nz);

      itteration++;
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
  createUsingBuffer(menger);
  createUsingBuffer(menger2);
  createUsingBuffer(menger3);
  createUsingBuffer(menger4);
  // createStandard();
  // createUsingStatic();

  render();

  setInterval(() => {
    console.log(
      'render calls:',
      renderer.info.render.calls,
      'tiangles: ',
      renderer.info.render.triangles
    );
  }, 1000);
}

startApp();

window.addEventListener('resize', () => window.location.reload());
