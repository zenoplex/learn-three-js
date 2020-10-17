type Mesh = import('three').Mesh;
type Geometry = import('three').Geometry;

declare module 'three-js-csg-es6' {
  // eslint-disable-next-line functional/no-class
  export class ThreeBSP {
    constructor(geom: Mesh<Geometry>);

    subtract(bsp: ThreeBSP): this;

    intersect(bsp: ThreeBSP): this;

    union(bsp: ThreeBSP): this;

    toMesh(): Mesh<Geometry>;
  }
}
