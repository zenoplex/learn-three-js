import * as React from 'react';

const mergeRefs = <T>(
  refs: ReadonlyArray<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        // eslint-disable-next-line functional/immutable-data
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
};

export default mergeRefs;
