import * as React from 'react';
import * as Three from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import DatGui, {
  DatFolder,
  DatNumber,
  DatBoolean,
  DatButton,
  DatSelect,
} from 'react-dat-gui';
import { Stats, TrackballControls } from 'drei';
import { ThreeBSP } from 'three-js-csg-es6';

const Ground = (): JSX.Element => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -30, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
      <meshPhongMaterial attach="material" color={0xffffff} />
    </mesh>
  );
};

type Action = 'subtract' | 'intersect' | 'union' | 'none';

const doAction = (
  subject: ThreeBSP,
  object: ThreeBSP,
  action: Action,
): ThreeBSP => {
  switch (action) {
    case 'subtract':
      return subject.subtract(object);
    case 'intersect':
      return subject.intersect(object);
    case 'union':
      return subject.union(object);
    default:
      return subject;
  }
};

type SceneProps = {
  readonly sphere1PosX: number;
  readonly sphere1PosY: number;
  readonly sphere1PosZ: number;
  readonly sphere1Scale: number;
  readonly sphere2PosX: number;
  readonly sphere2PosY: number;
  readonly sphere2PosZ: number;
  readonly sphere2Scale: number;
  readonly sphere2Action: Action;
  readonly cubePosX: number;
  readonly cubePosY: number;
  readonly cubePosZ: number;
  readonly cubeScale: number;
  readonly cubeAction: Action;
  readonly rotateResult: boolean;
  readonly hideWireframes: boolean;
  readonly lastRender: number;
};

const Scene = ({
  sphere1PosX,
  sphere1PosY,
  sphere1PosZ,
  sphere1Scale,
  sphere2PosX,
  sphere2PosY,
  sphere2PosZ,
  sphere2Scale,
  sphere2Action,
  cubePosX,
  cubePosY,
  cubePosZ,
  cubeScale,
  cubeAction,
  rotateResult,
  hideWireframes,
  lastRender,
}: SceneProps): JSX.Element => {
  const ref = React.useRef<Three.Mesh<Three.Geometry>>();
  const step = React.useRef(0);

  useFrame(() => {
    /* eslint-disable functional/immutable-data */
    if (!ref.current || !rotateResult) return;

    step.current = step.current + 0.01;
    ref.current.rotation.x = step.current;
    ref.current.rotation.y = step.current;
    ref.current.rotation.z = step.current;
    /* eslint-enable functional/immutable-data */
  });

  const normalMaterial = React.useMemo(() => {
    return new Three.MeshNormalMaterial();
  }, []);

  const wireframeMaterial = React.useMemo(() => {
    const mat = new Three.MeshBasicMaterial({
      transparent: true,
      opacity: 0.5,
      wireframe: true,
    });
    return mat;
  }, []);
  const sphereGeometry = React.useMemo(() => {
    const geom = new Three.SphereGeometry(5, 20, 20);
    return geom;
  }, []);

  const sphere1Ref = React.useRef<Three.Mesh>(null);
  const sphere2Ref = React.useRef<Three.Mesh>(null);
  const cubeRef = React.useRef<Three.Mesh>(null);
  const [resultMesh, setResultMesh] = React.useState<Three.Mesh | null>(null);

  React.useEffect(() => {
    if (!sphere1Ref.current || !sphere2Ref.current || !cubeRef.current) return;

    const sphere1Bsp = new ThreeBSP(sphere1Ref.current);
    const sphere2Bsp = new ThreeBSP(sphere2Ref.current);
    const cubeBsp = new ThreeBSP(cubeRef.current);

    const result1Bsp = doAction(sphere1Bsp, sphere2Bsp, sphere2Action);
    const result2Bsp = doAction(result1Bsp, cubeBsp, cubeAction);

    const resultMesh = result2Bsp.toMesh();
    resultMesh.geometry.computeFaceNormals();
    resultMesh.geometry.computeVertexNormals();

    setResultMesh(resultMesh);
  }, [lastRender, cubeAction, sphere2Action]);

  return (
    <>
      <group ref={ref}>
        {resultMesh ? (
          <primitive object={resultMesh} material={normalMaterial} />
        ) : null}
      </group>

      {!hideWireframes ? (
        <group>
          <mesh
            ref={sphere1Ref}
            geometry={sphereGeometry}
            material={wireframeMaterial}
            position={[sphere1PosX, sphere1PosY, sphere1PosZ]}
            scale={[sphere1Scale, sphere1Scale, sphere1Scale]}
          />
          <mesh
            ref={sphere2Ref}
            geometry={sphereGeometry}
            material={wireframeMaterial}
            position={[sphere2PosX, sphere2PosY, sphere2PosZ]}
            scale={[sphere2Scale, sphere2Scale, sphere2Scale]}
          />

          <mesh
            ref={cubeRef}
            material={wireframeMaterial}
            position={[cubePosX, cubePosY, cubePosZ]}
            scale={[cubeScale, cubeScale, cubeScale]}>
            <boxGeometry attach="geometry" args={[5, 5, 5]} />
          </mesh>
        </group>
      ) : null}

      <Ground />
      <ambientLight color={0x343434} />
      <spotLight
        color={0xffffff}
        position={[-10, 30, 40]}
        castShadow
        decay={2}
        penumbra={0.05}
        shadow-camera-fov={15}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    sphere1PosX: -3,
    sphere1PosY: 0,
    sphere1PosZ: 0,
    sphere1Scale: 1,
    sphere2PosX: 3,
    sphere2PosY: 0,
    sphere2PosZ: 0,
    sphere2Scale: 1,
    sphere2Action: 'subtract' as const,
    cubePosX: -7,
    cubePosY: 0,
    cubePosZ: 0,
    cubeScale: 1,
    cubeAction: 'subtract' as const,
    rotateResult: false,
    hideWireframes: false,
  });

  const [lastRender, setLastRender] = React.useState(Date.now());

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{
          fov: 45,
          position: [0, 20, 20],
        }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <React.Suspense fallback={null}>
          <Scene
            sphere1PosX={state.sphere1PosX}
            sphere1PosY={state.sphere1PosY}
            sphere1PosZ={state.sphere1PosZ}
            sphere1Scale={state.sphere1Scale}
            sphere2PosX={state.sphere2PosX}
            sphere2PosY={state.sphere2PosY}
            sphere2PosZ={state.sphere2PosZ}
            sphere2Scale={state.sphere2Scale}
            sphere2Action={state.sphere2Action}
            cubePosX={state.cubePosX}
            cubePosY={state.cubePosY}
            cubePosZ={state.cubePosZ}
            cubeScale={state.cubeScale}
            cubeAction={state.cubeAction}
            rotateResult={state.rotateResult}
            hideWireframes={state.hideWireframes}
            lastRender={lastRender}
          />
        </React.Suspense>
        <Stats />
        <TrackballControls />
      </Canvas>
      <DatGui data={state} onUpdate={setState}>
        <DatFolder title="Sphere1" closed={false}>
          <DatNumber path="sphere1PosX" min={-15} max={15} step={1} />
          <DatNumber path="sphere1PosY" min={-15} max={15} step={1} />
          <DatNumber path="sphere1PosZ" min={-15} max={15} step={1} />
          <DatNumber path="sphere1Scale" min={0} max={10} step={1} />
        </DatFolder>
        <DatFolder title="Sphere2" closed={false}>
          <DatNumber path="sphere2PosX" min={-15} max={15} step={1} />
          <DatNumber path="sphere2PosY" min={-15} max={15} step={1} />
          <DatNumber path="sphere2PosZ" min={-15} max={15} step={1} />
          <DatNumber path="sphere2Scale" min={0} max={10} step={1} />
          <DatSelect
            path="sphere2Action"
            options={['subtract', 'intersect', 'union', 'none']}
          />
        </DatFolder>
        <DatFolder title="Cube" closed={false}>
          <DatNumber path="cubePosX" min={-15} max={15} step={1} />
          <DatNumber path="cubePosY" min={-15} max={15} step={1} />
          <DatNumber path="cubePosZ" min={-15} max={15} step={1} />
          <DatNumber path="cubeScale" min={0} max={10} step={1} />
          <DatSelect
            path="cubeAction"
            options={['subtract', 'intersect', 'union', 'none']}
          />
        </DatFolder>
        <DatButton
          label="calculate"
          onClick={() => {
            setLastRender(Date.now());
          }}
        />
        <DatBoolean path="rotateResult" />
        <DatBoolean path="hideWireframes" />
      </DatGui>
    </>
  );
};

export default Page;
