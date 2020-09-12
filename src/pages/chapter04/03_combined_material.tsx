import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import DatGui, { DatColor, DatNumber, DatButton } from 'react-dat-gui';
import { Stats, TrackballControls } from 'drei';
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';

type SceneProps = {
  readonly count: number;
  readonly rotationSpeed: number;
  readonly color: Three.Color;
};

const Scene = ({ count, color, rotationSpeed }: SceneProps): JSX.Element => {
  const [cubes, setCubes] = React.useState<readonly Three.Group[]>([]);

  React.useEffect(() => {
    const delta = count - cubes.length;

    if (delta === 0) return;
    if (delta > 0) {
      const additionalCubes = [...new Array(delta)].map(() => {
        const size = Math.ceil(3 + Math.random() * 3);
        const geom = new Three.BoxGeometry(size, size, size);
        const mat0 = new Three.MeshDepthMaterial();
        const mat1 = new Three.MeshBasicMaterial({
          color,
          transparent: true,
          blending: Three.MultiplyBlending,
        });
        const cube = SceneUtils.createMultiMaterialObject(geom, [mat1, mat0]);
        // To prevent flickering but not seeing any flickering so commented out
        // cube.children[1].scale.set(0.99, 0.99, 0.99);
        /* eslint-disable functional/immutable-data */
        cube.castShadow = true;
        cube.position.x = -60 + Math.round(Math.random() * 100);
        cube.position.y = Math.round(Math.random() * 10);
        cube.position.z = -100 + Math.round(Math.random() * 150);
        /* eslint-enable functional/immutable-data */
        return cube;
      });
      setCubes(cubes.concat(additionalCubes));
    } else {
      setCubes(cubes.slice(0, count));
    }
  }, [color, count, cubes]);

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    cubes.forEach((cube) => {
      cube.rotation.x += rotationSpeed;
      cube.rotation.y += rotationSpeed;
      cube.rotation.z += rotationSpeed;
    });
    /* eslint-enable functional/immutable-data */
  });

  return (
    <>
      {cubes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
    </>
  );
};

type CameraProps = {
  readonly near: number;
  readonly far: number;
};

const Camera = ({ near, far }: CameraProps): null => {
  const { camera } = useThree();

  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    camera.near = near;
    camera.far = far;
    camera.updateProjectionMatrix();
    /* eslint-enable functional/immutable-data */
  }, [camera, far, near]);

  return null;
};

const Page = (): JSX.Element => {
  const material = React.useMemo(() => {
    return new Three.MeshDepthMaterial();
  }, []);

  const color = React.useMemo(() => new Three.Color(), []);

  const [state, setState] = React.useState({
    color: '#00ff00',
    rotationSpeed: 0.02,
    cubeCount: 10,
    near: 50,
    far: 110,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          position: [-50, 40, 50],
          near: state.near,
          far: state.far,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Camera near={state.near} far={state.far} />
          <Scene
            count={state.cubeCount}
            color={color.set(state.color)}
            rotationSpeed={state.rotationSpeed}
          />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>

      <DatGui data={state} onUpdate={setState}>
        <DatColor path="color" />
        <DatNumber path="rotationSpeed" min={0} max={0.5} step={0.01} />
        <DatButton
          label="Add Cube"
          onClick={() => {
            setState((s) => ({ ...s, cubeCount: s.cubeCount + 1 }));
          }}
        />
        <DatButton
          label="Remove Cube"
          onClick={() => {
            setState((s) => ({ ...s, cubeCount: s.cubeCount - 1 }));
          }}
        />
        <DatNumber path="near" min={0} max={100} step={1} />
        <DatNumber path="far" min={50} max={1000} step={1} />
      </DatGui>
    </>
  );
};

export default Page;
