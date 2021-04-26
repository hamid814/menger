const x = 'x';
const y = 'y';
const z = 'z';

const edgesIndexes = {
  corner: [0, 2, 4, 6, 8, 9, 10, 11, 12, 14, 16, 18],
  cornerDirections: [
    { i: 0, d: x },
    { i: 2, d: z },
    { i: 4, d: x },
    { i: 6, d: z },
    { i: 8, d: y },
    { i: 9, d: y },
    { i: 10, d: y },
    { i: 11, d: y },
    { i: 12, d: x },
    { i: 14, d: z },
    { i: 16, d: x },
    { i: 18, d: z },
  ],
  edgesDirections: {
    x: [
      { i: 0, d: z },
      { i: 2, d: x },
      { i: 3, d: x },
      { i: 5, d: x },
      { i: 6, d: x },
      { i: 7, d: y },
      { i: 8, d: y },
      { i: 9, d: z },
      { i: 11, d: x },
      { i: 12, d: x },
      { i: 14, d: x },
      { i: 15, d: x },
    ],
    y: [
      { i: 0, d: y },
      { i: 1, d: y },
      { i: 2, d: y },
      { i: 3, d: y },
      { i: 4, d: x },
      { i: 6, d: z },
      { i: 8, d: x },
      { i: 10, d: z },
      { i: 12, d: y },
      { i: 13, d: y },
      { i: 14, d: y },
      { i: 15, d: y },
    ],
    z: [
      { i: 0, d: x },
      { i: 1, d: z },
      { i: 3, d: z },
      { i: 4, d: z },
      { i: 6, d: z },
      { i: 7, d: y },
      { i: 8, d: y },
      { i: 9, d: x },
      { i: 10, d: z },
      { i: 12, d: z },
      { i: 13, d: z },
      { i: 15, d: z },
    ],
  },
};

const getEdgeDirection = (type, index, edgeDirection) => {
  if (type === 'corner') {
    const item = edgesIndexes.cornerDirections.filter((d) => {
      return d.i === index;
    })[0];

    return item.d;
  } else if (type === 'edge') {
    const item = edgesIndexes.edgesDirections[edgeDirection].filter((d) => {
      return d.i === index;
    })[0];

    if (item) {
      return item.d;
    } else {
      return item;
    }
  }
};

class Menger {
  constructor(level, cubeSize, position, isMother, isEdge, direction) {
    this.level = level;
    this.position = position;
    this.cubeSize = cubeSize;
    this.width = cubeSize * Math.pow(3, level);
    this.children = [];
    this.childSize = this.width / 3;
    this.childrenType = null;
    this.isMother = isMother === undefined ? true : isMother;
    this.isEdge = isEdge === undefined ? false : isEdge;
    this.direction = direction;

    if (level === 1) {
      this.childrenType = 'cube';
    } else {
      this.childrenType = 'menger';
    }

    this.initChildren();
  }

  initChildren() {
    if (this.isMother) {
      let positions = [];

      const xP = this.position.x + this.childSize;
      const xM = this.position.x - this.childSize;
      const yP = this.position.y + this.childSize;
      const yM = this.position.y - this.childSize;
      const zP = this.position.z + this.childSize;
      const zM = this.position.z - this.childSize;

      // default positoins
      const dX = this.position.x;
      const dY = this.position.y;
      const dZ = this.position.z;

      positions[0] = new V(dX, yP, zM);
      positions[1] = new V(xP, yP, zM);
      positions[2] = new V(xP, yP, dZ);
      positions[3] = new V(xP, yP, zP);
      positions[4] = new V(dX, yP, zP);
      positions[5] = new V(xM, yP, zP);
      positions[6] = new V(xM, yP, dZ);
      positions[7] = new V(xM, yP, zM);

      positions[8] = new V(xP, dY, zP);
      positions[9] = new V(xP, dY, zM);
      positions[10] = new V(xM, dY, zM);
      positions[11] = new V(xM, dY, zP);

      positions[12] = new V(dX, yM, zM);
      positions[13] = new V(xP, yM, zM);
      positions[14] = new V(xP, yM, dZ);
      positions[15] = new V(xP, yM, zP);
      positions[16] = new V(dX, yM, zP);
      positions[17] = new V(xM, yM, zP);
      positions[18] = new V(xM, yM, dZ);
      positions[19] = new V(xM, yM, zM);

      if (this.childrenType === 'cube') {
        positions.forEach((pos) => {
          const child = new Cube(pos, this.childSize);

          this.children.push(child);
        });
      } else if (this.childrenType === 'menger') {
        positions.forEach((pos, i) => {
          let isEdge = false;
          let direction = undefined;

          if (edgesIndexes['corner'].indexOf(i) !== -1) {
            direction = getEdgeDirection('corner', i);

            isEdge = true;
          }

          const child = new Menger(
            this.level - 1,
            this.cubeSize,
            pos,
            false,
            isEdge,
            direction
          );

          this.children.push(child);
        });
      }
    } else {
      let positions = [];

      // posiotns minus and plus one cubeSize
      const xP = this.position.x + this.childSize;
      const xM = this.position.x - this.childSize;
      const yP = this.position.y + this.childSize;
      const yM = this.position.y - this.childSize;
      const zP = this.position.z + this.childSize;
      const zM = this.position.z - this.childSize;

      // default positoins ( menger center )
      const dX = this.position.x;
      const dY = this.position.y;
      const dZ = this.position.z;

      if (!this.isEdge) {
        // is not an edge

        positions[0] = new V(dX, yP, zM);
        positions[1] = new V(xP, yP, zM);
        positions[2] = new V(xP, yP, dZ);
        positions[3] = new V(xP, yP, zP);
        positions[4] = new V(dX, yP, zP);
        positions[5] = new V(xM, yP, zP);
        positions[6] = new V(xM, yP, dZ);
        positions[7] = new V(xM, yP, zM);

        positions[8] = new V(xP, dY, zP);
        positions[9] = new V(xP, dY, zM);
        positions[10] = new V(xM, dY, zM);
        positions[11] = new V(xM, dY, zP);

        positions[12] = new V(dX, yM, zM);
        positions[13] = new V(xP, yM, zM);
        positions[14] = new V(xP, yM, dZ);
        positions[15] = new V(xP, yM, zP);
        positions[16] = new V(dX, yM, zP);
        positions[17] = new V(xM, yM, zP);
        positions[18] = new V(xM, yM, dZ);
        positions[19] = new V(xM, yM, zM);
      } else {
        // is an edge
        if (this.direction === x) {
          positions = [
            new V(dX, yP, dZ),
            new V(dX, yP, zM),
            new V(xP, yP, zM),
            new V(xP, yP, zP),
            new V(dX, yP, zP),
            new V(xM, yP, zP),
            new V(xM, yP, zM),

            new V(dX, dY, zM),
            new V(dX, dY, zP),

            new V(dX, yM, dZ),
            new V(dX, yM, zM),
            new V(xP, yM, zM),
            new V(xP, yM, zP),
            new V(dX, yM, zP),
            new V(xM, yM, zP),
            new V(xM, yM, zM),
          ];
        } else if (this.direction === y) {
          positions = [
            new V(xP, yP, zM),
            new V(xP, yP, zP),
            new V(xM, yP, zP),
            new V(xM, yP, zM),

            new V(dX, dY, zM),
            new V(xP, dY, zM),
            new V(xP, dY, dZ),
            new V(xP, dY, zP),
            new V(dX, dY, zP),
            new V(xM, dY, zP),
            new V(xM, dY, dZ),
            new V(xM, dY, zM),

            new V(xP, yM, zM),
            new V(xP, yM, zP),
            new V(xM, yM, zP),
            new V(xM, yM, zM),
          ];
        } else if (this.direction === z) {
          positions = [
            new V(dX, yP, dZ),
            new V(xP, yP, zM),
            new V(xP, yP, dZ),
            new V(xP, yP, zP),
            new V(xM, yP, zP),
            new V(xM, yP, dZ),
            new V(xM, yP, zM),

            new V(xP, dY, dZ),
            new V(xM, dY, dZ),

            new V(dX, yM, dZ),
            new V(xP, yM, zM),
            new V(xP, yM, dZ),
            new V(xP, yM, zP),
            new V(xM, yM, zP),
            new V(xM, yM, dZ),
            new V(xM, yM, zM),
          ];
        }
      }
      if (!this.isEdge) {
        if (this.childrenType === 'cube') {
          positions.forEach((pos) => {
            const child = new Cube(pos, this.childSize);

            this.children.push(child);
          });
        } else if (this.childrenType === 'menger') {
          positions.forEach((pos, i) => {
            let isEdge = false;
            let direction = undefined;

            if (edgesIndexes['corner'].indexOf(i) !== -1) {
              direction = getEdgeDirection('corner', i);

              isEdge = true;
            }

            const child = new Menger(
              this.level - 1,
              this.cubeSize,
              pos,
              false,
              isEdge,
              direction
            );

            this.children.push(child);
          });
        }
      } else {
        // this is an edge menger
        if (this.childrenType === 'cube') {
          positions.forEach((pos) => {
            const child = new Cube(pos, this.childSize);

            this.children.push(child);
          });
        } else if (this.childrenType === 'menger') {
          positions.forEach((pos, i) => {
            let isEdge = false;
            let direction = getEdgeDirection('edge', i, this.direction);

            if (direction) {
              isEdge = true;
            }

            const child = new Menger(
              this.level - 1,
              this.cubeSize,
              pos,
              false,
              isEdge,
              direction
            );

            this.children.push(child);
          });
        }
      }
    }
  }

  setIsEdge(state) {
    this.isEdge = state;
  }

  getPositions() {
    const list = [];

    if (this.childrenType === 'cube') {
      this.children.forEach((cube) => {
        list.push(cube.position);
      });

      return list;
    } else if (this.childrenType === 'menger') {
      this.children.forEach((child) => {
        const poses = child.getPositions();

        poses.forEach((pos) => {
          list.push(pos);
        });
      });
      return list;
    }
  }

  drawP5() {
    this.children.forEach((child) => {
      child.drawP5();
    });
  }
}

class Cube {
  constructor(position, size) {
    this.position = position;
    this.size = size;
  }

  drawP5() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    box(this.size, this.size, this.size);
    pop();
  }
}

class V {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }

  mul(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
  }

  dev(vec) {
    this.x /= vec.x;
    this.y /= vec.y;
    this.z /= vec.z;
  }

  retsub(vec) {
    const newV = new V(this.x, this.y, this.z);

    newV.sub(vec);

    return newV;
  }

  retadd(xOrV, y, z) {
    const newV = new V(this.x, this.y, this.z);

    if (y === undefined && z === undefined) {
      // a vector is passed is args

      newV.add(vec);
    } else {
      // x, y ,z are passed in args

      const addV = new V(xOrV, y, z);

      newV.add(addV);
    }

    return newV;
  }

  retmul(vec) {
    const newV = new V(this.x, this.y, this.z);

    newV.mul(vec);

    return newV;
  }

  retdev(vec) {
    const newV = new V(this.x, this.y, this.z);

    newV.dev(vec);

    return newV;
  }
}
