import * as React from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import * as Three from 'three';
import DatGui, { DatNumber, DatColor } from 'react-dat-gui';

const BoundingWallMaterial = new Three.MeshPhongMaterial({ color: 0xa0522d });

const BoundingWall = (): JSX.Element => {
  return (
    <>
      {/* left wall */}
      <mesh position={[15, 1, -25]} material={BoundingWallMaterial}>
        <boxBufferGeometry attach="geometry" args={[70, 2, 2]} />
      </mesh>
      {/* right wall */}
      <mesh position={[15, 1, 25]} material={BoundingWallMaterial}>
        <boxBufferGeometry attach="geometry" args={[70, 2, 2]} />
      </mesh>
      {/* top wall */}
      <mesh position={[-19, 1, 0]} material={BoundingWallMaterial}>
        <boxBufferGeometry attach="geometry" args={[2, 2, 50]} />
      </mesh>
      {/* bottom wall */}
      <mesh position={[49, 1, 0]} material={BoundingWallMaterial}>
        <boxBufferGeometry attach="geometry" args={[2, 2, 50]} />
      </mesh>
    </>
  );
};

const Ground = (): JSX.Element => {
  return (
    <>
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[15, 0, 0]}
        receiveShadow>
        <planeBufferGeometry attach="geometry" args={[70, 50]} />
        <meshPhongMaterial attach="material" color={0x9acd32} />
      </mesh>
    </>
  );
};

const House = (): JSX.Element => {
  return (
    <>
      {/* Roof */}
      <mesh position={[25, 8, 0]} receiveShadow castShadow>
        <coneBufferGeometry attach="geometry" args={[5, 4]} />
        <meshPhongMaterial attach="material" color={0x8b7213} />
      </mesh>
      {/* Base */}
      <mesh position={[25, 3, 0]} receiveShadow castShadow>
        <cylinderBufferGeometry attach="geometry" args={[5, 5, 6]} />
        <meshPhongMaterial attach="material" color={0xffe4c4} />
      </mesh>
    </>
  );
};

const Tree = (): JSX.Element => {
  return (
    <>
      {/* trunk */}
      <mesh position={[-10, 4, 0]} receiveShadow castShadow>
        <boxBufferGeometry attach="geometry" args={[1, 8, 1]} />
        <meshPhongMaterial attach="material" color={0x8b4513} />
      </mesh>
      {/* leaves */}
      <mesh position={[-10, 12, 0]} receiveShadow castShadow>
        <sphereBufferGeometry attach="geometry" args={[4]} />
        <meshPhongMaterial attach="material" color={0x00ff00} />
      </mesh>
    </>
  );
};

type PointLightProps = {
  readonly color: string;
  readonly distance: number;
  readonly rotationSpeed: number;
};

const PointLight = ({
  color,
  distance,
  rotationSpeed,
}: PointLightProps): JSX.Element => {
  const sphereLightMesh = React.useMemo(() => {
    const geom = new Three.SphereBufferGeometry(0.2);
    const mat = new Three.MeshBasicMaterial({ color: 0xac6c25 });
    const mesh = new Three.Mesh(geom, mat);
    // mesh.position = new Three.Vector3(3, 0, 5);
    return mesh;
  }, []);
  const pointLight = React.useMemo(() => {
    const light = new Three.PointLight('#ccffcc');
    /* eslint-disable functional/immutable-data */
    light.decay = 0.1;
    light.castShadow = true;
    /* eslint-enable functional/immutable-data */
    return light;
  }, []);

  const pointLightHelper = React.useMemo(() => {
    return new Three.PointLightHelper(pointLight);
  }, [pointLight]);

  const shadowHelper = React.useMemo(() => {
    return new Three.CameraHelper(pointLight.shadow.camera);
  }, [pointLight.shadow.camera]);

  const invert = React.useRef(1);
  const phase = React.useRef(0);

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    pointLight.position.copy(sphereLightMesh.position);
    pointLightHelper.update();
    shadowHelper.update();

    if (phase.current > 2 * Math.PI) {
      invert.current = invert.current * -1;
      phase.current -= 2 * Math.PI;
    } else {
      phase.current += rotationSpeed;
    }

    sphereLightMesh.position.x = +(14 * Math.cos(phase.current));
    sphereLightMesh.position.y = 5;
    sphereLightMesh.position.z = +(25 * Math.sin(phase.current));

    if (invert.current < 0) {
      sphereLightMesh.position.x =
        invert.current * (sphereLightMesh.position.x - 14) + 14;
    }
    /* eslint-enable functional/immutable-data */
  });

  return (
    <>
      <primitive object={pointLight} color={color} distance={distance} />
      <mesh>
        <sphereBufferGeometry attach="geometry" args={[0.2]} />
        <meshBasicMaterial attach="material" color={0xac6c25} />
      </mesh>
      <primitive object={pointLightHelper} />
      <primitive object={shadowHelper} />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    ambientColor: '#0c0c0c',
    pointColor: '#ccffcc',
    distance: 100,
    intensity: 1,
    rotationSpeed: 0.01,
  });

  return (
    <>
      <Canvas
        shadowMap
        camera={{
          fov: 45,
          position: [-30, 40, 30],
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new Three.Color(0x000000));
        }}>
        <BoundingWall />
        <Ground />
        <House />
        <Tree />
        <PointLight
          color={state.pointColor}
          distance={state.distance}
          rotationSpeed={state.rotationSpeed}
        />
        <ambientLight color={state.ambientColor} intensity={state.intensity} />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatColor path="ambientColor" />
        <DatColor path="pointColor" />
        <DatNumber path="intensity" min={0} max={3} step={0.1} />
        <DatNumber path="distance" min={0} max={100} step={1} />
        <DatNumber path="rotationSpeed" min={0.01} max={0.1} step={0.01} />
      </DatGui>
    </>
  );
};

export default Page;
