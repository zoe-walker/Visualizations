import { useVisualizationError } from "@helpers/hooks/useVisualizationError";
import React from "react";

export const ErrorExample = () => {
  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            // Get a reference to the ErrorOccurred method for the Custom Visualization
            useVisualizationError("This is an example of an error message");
          }}
        >
          Send an error to the Custom Visualization
        </button>
      </div>
      <br />
    </>
  );
};
