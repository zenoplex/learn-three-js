import * as React from 'react';
import * as Three from 'three';
import DatGui, {
  DatString,
  DatNumber,
  DatBoolean,
  DatFolder,
  DatSelect,
} from 'react-dat-gui';

type Props<T extends Three.Material> = {
  readonly material: T;
  readonly state: Partial<T> & { readonly color: string };
  readonly onUpdate: (data: any) => void;
  readonly children: React.ReactNode;
};

const BasicMaterialDatFolder = <T extends Three.Material>({
  material,
  state,
  onUpdate,
  children,
}: Props<T>): JSX.Element => {
  React.useEffect(() => {
    /* eslint-disable functional/immutable-data */

    (Object.keys(state) as readonly (keyof typeof state)[])
      .filter(
        (item) =>
          item !== 'id' &&
          item !== 'name' &&
          item !== 'uuid' &&
          item !== 'selectedItem',
      )
      .forEach((item) => {
        // @ts-expect-error Not going to do instanceOf check
        if (item === 'color') material.color = new Three.Color(state.color);
        else if (item === 'side') material.side = Number(state.side);
        else if (item === 'shadowSide') material.side = Number(state.side);
        else if (item in material) material[item] = state[item];
      });
    /* eslint-enable functional/immutable-data */
  }, [material, state]);

  return (
    <DatGui data={state} onUpdate={onUpdate}>
      <DatFolder title="Three.Material" closed={false}>
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
      {children}
    </DatGui>
  );
};

export default BasicMaterialDatFolder;
