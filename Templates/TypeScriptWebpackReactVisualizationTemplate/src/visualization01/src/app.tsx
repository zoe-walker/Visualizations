import React, { useContext, useRef, useState } from "react";
import { InputsEnum } from "./types/inputs";
import { OutputsEnum } from "./types/outputs";
import { ConfigContext } from "@helpers/context/configContext";
import { useInput } from "@helpers/hooks/useInput";
import { useOutput } from "@helpers/hooks/useOutput";
import { useData } from "@helpers/hooks/useData";
import { useAction } from "@helpers/hooks/useAction";
import { ActionsEnum } from "./types/actions";
import { useSize } from "@helpers/hooks/useSize";
import { useVisualizationState } from "@helpers/hooks/useVisualizationState";
import { useVisualizationError } from "@helpers/hooks/useVisualizationError";
import { useStrictAction } from "@helpers/hooks/useStrictAction";
import { useHasAction } from "@helpers/hooks/useHasAction";

export type AppProps = {};

/**
 * App is the main React entry point for this Template's custom visualization
 */
export const App: React.FC<AppProps> = () => {
  // Directly read from the config, this is not preferred as mutating
  //  this will not automatically update with the rest of the custom visualization
  //  nor will it update the rest of the custom visualization when values are changed
  const config = useContext(ConfigContext);

  // Get the state of the custom visualization
  const [visualizationState, setVisualizationState, rawVisualizationState] =
    useVisualizationState();

  // Get the size of the custom visualization
  const [size, setSize] = useSize();
  const widthRef = useRef<HTMLInputElement>();
  const heightRef = useRef<HTMLInputElement>();

  // Get a reference to the "Example Click" action that we can call
  const exampleClick = useAction(ActionsEnum.Example_Click);

  // Get a reference to the "Example Click" action that we can call
  //  but only if the action has been set up in MooD BA
  const [exampleClickStrict, exampleClickStrictHasAction] = useStrictAction(
    ActionsEnum.Example_Click
  );

  // Get a reference to the hasAction for "Example Click"
  //  that we can call to check if it exists
  const hasExampleClick = useHasAction(ActionsEnum.Example_Click);

  // Get the data for the first ExampleVariable by using the property name
  const [exampleVariable1] = useData("ExampleVariable1");

  // Get the first valid data for the third ExampleVariable if it has a value
  const [exampleVariable3] = useData((data: Vis.Data): Vis.Data.Query => {
    for (let i = 0; i < data.ExampleVariable3?.length; i++) {
      if (data.ExampleVariable3[i].Value != null)
        return data.ExampleVariable3[i];
    }
  });

  // Listen to the input "Example Input"
  const [exampleInput] = useInput(InputsEnum.Example_Input);

  // Allow updating the "Example Output" of this custom visualization
  //  MooD BA Output Interactions must use the name of the output as it's action setting I.E:
  //  "Uses the element as the value for the output" = Example Output
  const [setExampleOutput, exampleOutput] = useOutput(
    OutputsEnum.Example_Output
  );
  const [localOutput, setLocalOutput] = useState<string>(null);

  // Allow updating the "Example Output 2" of this custom visualization
  const [setExampleOutput2, exampleOutput2] = useOutput(
    OutputsEnum.Example_Output_2
  );
  const exampleOutput2Ref = useRef<HTMLInputElement>();

  return (
    <div>
      <div>
        This is an example entrypoint for a Custom Visualization with:
        <div> a version number of: {config.version}</div>
        <div> a width of: {size.width} </div>
        <div> a height of: {size.height}</div>
      </div>
      <br />

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

      <div>
        <div>Update the state of the custom visualization:</div>
        {rawVisualizationState}
        <div />
        <button
          type="button"
          onClick={() => {
            visualizationState.ExampleState = !visualizationState.ExampleState;
            setVisualizationState(visualizationState);
          }}
        >
          Invert Custom Visualization Example State
        </button>
      </div>
      <br />

      <div>
        This is an example data configuartion variable:{" "}
        {exampleVariable1 ?? "undefined"}
      </div>
      <br />

      <div>
        This is an example input: {exampleInput?.toString() ?? "undefined"}
      </div>
      <br />

      <div>
        <div>
          This is an example output:
          <div>Local Id: {localOutput?.toString() ?? "undefined"}</div>
          <div>
            Exposed Output Id: {exampleOutput?.toString() ?? "undefined"}
          </div>
        </div>
        <input
          type="text"
          onChange={(event) => {
            setLocalOutput(event.currentTarget.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            setExampleOutput(localOutput);
          }}
        >
          Update Exposed Output Id
        </button>
      </div>
      <br />

      <div>
        <div>
          This is an example output 2:
          <div>
            Exposed Output 2: {exampleOutput2?.toString() ?? "undefined"}
          </div>
        </div>
        <input ref={exampleOutput2Ref} type="text" />
        <button
          type="button"
          onClick={() => {
            setExampleOutput2(parseFloat(exampleOutput2Ref?.current?.value));
          }}
        >
          Update Exposed Output 2
        </button>
      </div>
      <br />

      <div>
        This button will execute {ActionsEnum.Example_Click} and provide the id
        from ExampleVariable3: {exampleVariable3?.key ?? "undefined"}
        <div />
        <button
          type="button"
          onClick={(event) => {
            exampleClick(exampleVariable3?.key ?? "", event);
          }}
        >
          Click to execute action
        </button>
      </div>
      <br />

      <div>
        This button will execute {ActionsEnum.Example_Click} and provide the id
        <div />
        from ExampleVariable3: {exampleVariable3?.key ?? "undefined"}
        <div />
        only if {ActionsEnum.Example_Click} has been set up in MooD BA
        <div />
        <button
          type="button"
          onClick={(event) => {
            exampleClickStrict(exampleVariable3?.key ?? "", event)
              .then(() => {
                alert(`${ActionsEnum.Example_Click} has executed successfully`);
              })
              .catch(() => {
                alert(`${ActionsEnum.Example_Click} has failed to execute`);
              });
          }}
        >
          Click to execute strict action
        </button>
      </div>
      <br />

      <div>
        This button will execute a check on {ActionsEnum.Example_Click}
        <div />
        with the Id: {exampleVariable3?.key ?? "undefined"}
        <div />
        and return if {ActionsEnum.Example_Click} has been set up in MooD BA:
        <div />
        <button
          type="button"
          onClick={() => {
            hasExampleClick(exampleVariable3?.key ?? "").then((result) => {
              if (result) {
                alert(`${ActionsEnum.Example_Click} has been set up`);
              } else {
                alert(`${ActionsEnum.Example_Click} has not been set up yet`);
              }
            });
          }}
        >
          Click to execute hasAction
        </button>
      </div>
    </div>
  );
};
