import * as React from 'react';
import * as Three from 'three';
import { Canvas } from 'react-three-fiber';
import { Stats, TrackballControls } from 'drei';
import DatGui, { DatNumber } from 'react-dat-gui';

type SceneProps = {
  readonly xCount: number;
  readonly yCount: number;
};

const Scene = ({ xCount, yCount }: SceneProps): JSX.Element => {
  const pointMaterial = new Three.PointsMaterial({
    size: 2,
    vertexColors: true,
  });
  const geometry = React.useMemo(() => {
    const geom = new Three.Geometry();

    new Array(xCount).fill(null).forEach((_, i) => {
      new Array(yCount).fill(null).forEach((_, j) => {
        geom.vertices.push(
          new Three.Vector3((-xCount / 2 + i) * 4, (-yCount / 2 + j) * 4, 0),
        );
        geom.colors.push(new Three.Color(Math.random() * 0xffffff));
      });
    });

    return geom;
  }, [xCount, yCount]);

  return (
    <>
      <points args={[geometry, pointMaterial]} />
    </>
  );
};

const Page = (): JSX.Element => {
  const [state, setState] = React.useState({
    xCount: 30,
    yCount: 20,
  });

  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        camera={{ fov: 45, position: [0, 0, 150] }}
        shadowMap
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}>
        <Scene xCount={state.xCount} yCount={state.yCount} />
        <Stats />
        <TrackballControls />
      </Canvas>

      <DatGui data={state} onUpdate={setState}>
        <DatNumber path="xCount" min={0} max={30} step={1} />
        <DatNumber path="yCount" min={0} max={30} step={1} />
      </DatGui>
    </>
  );
};

export default Page;
