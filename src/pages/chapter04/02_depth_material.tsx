import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { DatNumber, DatBoolean, DatFolder, DatButton } from 'react-dat-gui';
import { Stats, TrackballControls } from 'drei';
import BasicMaterialDatFolder from '~/components/BasicMaterialPropertyDatGui';

type SceneProps = {
  readonly count: number;
  readonly rotationSpeed: number;
};

const Scene = ({ count, rotationSpeed }: SceneProps): JSX.Element => {
  const [cubes, setCubes] = React.useState<readonly Three.Mesh[]>([]);

  React.useEffect(() => {
    const delta = count - cubes.length;

    if (delta === 0) return;
    if (delta > 0) {
      const additionalCubes = [...new Array(delta)].map(() => {
        const size = Math.ceil(3 + Math.random() * 3);
        const geom = new Three.BoxBufferGeometry(size, size, size);
        const mat = new Three.MeshLambertMaterial({
          color: Math.random() * 0xffffff,
        });
        const cube = new Three.Mesh(geom, mat);
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
  }, [count, cubes]);

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

type OverrideMaterialProps = {
  readonly material: Three.Material;
};

const OverrideMaterial = ({ material }: OverrideMaterialProps): null => {
  const { scene } = useThree();

  React.useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    scene.overrideMaterial = material;
  }, [material, scene]);

  return null;
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

  const [state, setState] = React.useState({
    id: material.id,
    uuid: material.uuid,
    name: material.name,
    opacity: material.opacity,
    transparent: material.transparent,
    visible: material.visible,
    side: material.side,
    colorWrite: material.colorWrite,
    flatShading: material.flatShading,
    premultipliedAlpha: material.premultipliedAlpha,
    dithering: material.dithering,
    shadowSide: material.shadowSide,
    vertexColors: material.vertexColors,
    fog: material.fog,
    //
    wireframe: false,
    wireframeLinewidth: material.wireframeLinewidth,
    //
    rotationSpeed: 0.02,
    cubeCount: 10,
    near: 50,
    far: 110,
  });

  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    material.wireframe = state.wireframe;
    material.wireframeLinewidth = state.wireframeLinewidth;
    /* eslint-enable functional/immutable-data */
  }, [material, state.wireframe, state.wireframeLinewidth]);

  return (
    <>
      <Canvas
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
          <OverrideMaterial material={material} />
          <Camera near={state.near} far={state.far} />
          <Scene count={state.cubeCount} rotationSpeed={state.rotationSpeed} />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>

      <BasicMaterialDatFolder
        state={state}
        material={material}
        onUpdate={setState}>
        <DatFolder title="Three.MeshDepthMaterial" closed={false}>
          <DatBoolean path="wireframe" />
          <DatNumber path="wireframeLinewidth" min={0} max={10} step={0.1} />
        </DatFolder>
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
      </BasicMaterialDatFolder>
    </>
  );
};

export default Page;
