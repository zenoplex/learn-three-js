import * as React from 'react';
import * as Three from 'three';
import { Canvas } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import DatGui, {
  DatNumber,
  DatFolder,
  DatBoolean,
  DatButton,
} from 'react-dat-gui';

type PlaneProps = {
  readonly width: number;
  readonly height: number;
};

const Plain = ({ width, height }: PlaneProps): JSX.Element => {
  return (
    <mesh
      visible
      position={[0, 0, 0]}
      rotation={[-0.5 * Math.PI, 0, 0]}
      receiveShadow>
      <planeGeometry attach="geometry" args={[width, height, 1, 1]} />
      <meshLambertMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

type AbstractShapeProps = {
  readonly geometry: Three.Geometry | Three.BufferGeometry;
  readonly material: Three.Material;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly position?: [number, number, number];
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly rotation?: [number, number, number];
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly scale?: [number, number, number];
  readonly visible?: boolean;
  readonly castShadow?: boolean;
};

const AbstractShape = ({
  geometry,
  rotation,
  position,
  scale,
  material,
  visible,
  castShadow,
}: AbstractShapeProps): JSX.Element => {
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
      visible={visible}
      castShadow={castShadow}
    />
  );
};

const wireframeMaterial = new Three.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
});
const lambertMaterial = new Three.MeshLambertMaterial({
  opacity: 0.6,
  color: 0x44ff44,
  transparent: true,
});
const geom = new Three.BoxBufferGeometry(5, 8, 3);

const planeWidth = 60;
const planeHeight = 40;

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    scale: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    translate: { x: 0, y: 0, z: 0 },
    visible: true,
  });

  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [-20, 25, 20],
        }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <Plain width={planeWidth} height={planeHeight} />

        <AbstractShape
          geometry={geom}
          material={wireframeMaterial}
          position={[state.position.x, state.position.y, state.position.z]}
          rotation={[state.rotation.x, state.rotation.y, state.rotation.z]}
          scale={[state.scale.x, state.scale.y, state.scale.z]}
          // translate={[state.translate.x, state.translate.y, state.translate.z]}
          visible={state.visible}
        />
        <AbstractShape
          geometry={geom}
          material={lambertMaterial}
          castShadow
          position={[state.position.x, state.position.y, state.position.z]}
          rotation={[state.rotation.x, state.rotation.y, state.rotation.z]}
          scale={[state.scale.x, state.scale.y, state.scale.z]}
          // translate={[state.translate.x, state.translate.y, state.translate.z]}
          visible={state.visible}
        />

        <ambientLight color={0x494949} />
        <spotLight
          color={0xffffff}
          intensity={1}
          distance={180}
          angle={Math.PI / 4}
          position={[-40, 30, 30]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <TrackballControls />
        <Stats />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatFolder title="scale" closed>
          <DatNumber path="scale.x" min={0} max={5} step={0.1} />
          <DatNumber path="scale.y" min={0} max={5} step={0.1} />
          <DatNumber path="scale.z" min={0} max={5} step={0.1} />
        </DatFolder>
        <DatFolder title="position" closed>
          <DatNumber path="position.x" min={-10} max={10} step={0.1} />
          <DatNumber path="position.y" min={-10} max={10} step={0.1} />
          <DatNumber path="position.z" min={-10} max={10} step={0.1} />
        </DatFolder>
        <DatFolder title="rotation" closed>
          <DatNumber path="rotation.x" min={-4} max={4} step={0.1} />
          <DatNumber path="rotation.y" min={-4} max={4} step={0.1} />
          <DatNumber path="rotation.z" min={-4} max={4} step={0.1} />
        </DatFolder>
        <DatFolder title="translate" closed>
          <DatNumber path="translate.x" min={-10} max={10} step={0.1} />
          <DatNumber path="translate.y" min={-10} max={10} step={0.1} />
          <DatNumber path="translate.z" min={-10} max={10} step={0.1} />
          <DatButton
            label="translate"
            onClick={() => {
              setState((state) => ({
                ...state,
                position: {
                  x: state.position.x + state.translate.x,
                  y: state.position.y + state.translate.y,
                  z: state.position.z + state.translate.z,
                },
              }));
            }}
          />
        </DatFolder>
        <DatBoolean path="visible" />
      </DatGui>
    </>
  );
};

export default Page;
