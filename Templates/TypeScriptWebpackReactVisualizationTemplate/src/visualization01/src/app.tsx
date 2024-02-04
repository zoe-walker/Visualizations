import React, { useContext, useRef, useState } from "react";
import { InputsEnum } from "./types/inputs";
import { OutputsEnum } from "./types/outputs";
import { ConfigContext } from "@helpers/context/configContext";
import { useInput } from "@helpers/hooks/useInput";
import { useOutput } from "@helpers/hooks/useOutput";
import { useData } from "@helpers/hooks/useData";
import { useAction } from "@helpers/hooks/useAction";
import { ActionsEnum } from "./types/actions";

export type AppProps = {};

/**
 * App is the main React entry point for this Template's custom visualization
 */
export const App: React.FC<AppProps> = () => {
  // Directly read from the config, this is not preferred as mutating
  //  this will not automatically update the rest of the custom visualization
  const config = useContext(ConfigContext);

  // Get a reference to the "Example Click" action that we can call
  const [exampleClick] = useAction(ActionsEnum.Example_Click);

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
        <div> a width of: {config.width} </div>
        <div> a height of: {config.height}</div>
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
          Click to execute
        </button>
      </div>
    </div>
  );
};
