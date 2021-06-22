import { useEffect, useRef } from "react";


/**
 * Previous value hook
 *
 * @param value Current value
 * @returns Previous value
 */
export const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [ value ]);

  return ref.current;
};
