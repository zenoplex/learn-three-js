import * as React from 'react';
import * as Three from 'three';
import {
  DatString,
  DatNumber,
  DatBoolean,
  DatFolder,
  DatSelect,
} from 'react-dat-gui';

type Props<T extends Three.Material> = {
  readonly material: T;
  readonly state: {
    readonly opacity: number;
    readonly transparent: boolean;
    readonly visible: boolean;
    readonly side: Three.Side;
    readonly colorWrite: boolean;
    readonly flatShading: boolean;
    readonly premultipliedAlpha: boolean;
    readonly dithering: boolean;
    readonly shadowSide: Three.Side;
    readonly vertexColors: boolean;
    readonly fog: boolean;
  };
};

const BasicMaterialDatFolder = <T extends Three.Material>({
  material,
  state,
  ...props // extra props from DatGui is passed via cloneElement thus required to work
}: Props<T>): JSX.Element => {
  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */
    material.opacity = state.opacity;
    material.transparent = state.transparent;
    material.visible = state.visible;
    material.side = Number(state.side);
    material.colorWrite = state.colorWrite;
    material.flatShading = state.flatShading;
    material.premultipliedAlpha = state.premultipliedAlpha;
    material.dithering = state.dithering;
    material.shadowSide = Number(state.shadowSide);
    material.vertexColors = state.vertexColors;
    material.fog = state.fog;
    /* eslint-enable functional/immutable-data */
  }, [material, state]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <DatFolder title="Three.Material" closed={false} {...props}>
      <DatString path="id" />
      <DatString path="uuid" />
      <DatString path="name" />
      <DatNumber path="opacity" min={0} max={1} step={0.01} />
      <DatBoolean path="transparent" />
      <DatBoolean path="visible" />
      <DatSelect
        path="side"
        options={[Three.FrontSide, Three.BackSide, Three.DoubleSide]}
      />
      <DatBoolean path="colorWrite" />
      <DatBoolean path="flatShading" />
      <DatBoolean path="premultipliedAlpha" />
      <DatBoolean path="dithering" />
      <DatSelect
        path="shadowSide"
        options={[Three.FrontSide, Three.BackSide, Three.DoubleSide]}
      />
      <DatSelect
        path="vertexColors"
        options={[Three.NoColors, Three.FaceColors, Three.VertexColors]}
      />
      <DatBoolean path="fog" />
    </DatFolder>
  );
};

export default BasicMaterialDatFolder;
