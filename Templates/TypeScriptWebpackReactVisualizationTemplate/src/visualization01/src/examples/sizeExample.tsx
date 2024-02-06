import { useSize } from "@helpers/hooks/useSize";
import React, { useRef } from "react";

export const SizeExample = () => {
  // Get the size of the custom visualization and a method to update this size
  //  Updating the size of a custom visualization requires overflow to be enabled
  //  in MooD BA for the visualization, this may be an experimental feature
  const [size, setSize] = useSize();
  const widthRef = useRef<HTMLInputElement>();
  const heightRef = useRef<HTMLInputElement>();

  return (
    <>
      <div>
        <div>Update the size of the custom visualization:</div>
        Width: <input ref={widthRef} type="number" />
        <div />
        Height: <input ref={heightRef} type="number" />
        <div />
        <button
          type="button"
          onClick={() => {
            setSize(
              parseFloat(widthRef.current.value),
              parseFloat(heightRef.current.value)
            );
          }}
        >
          Update Custom Visualization Size
        </button>
      </div>
      <br />
    </>
  );
};
