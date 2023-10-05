import React, { useMemo } from "react";
import { InputType } from "./types/input-type";
import { OutputType } from "./types/output-type";

type Props = {
  config: MooDConfig<
    Vis.Data.Root,
    Vis.Style.Root,
    Vis.Actions.Root,
    Vis.Inputs.Root,
    Vis.Outputs.Root
  >;
};

export const App: React.FC<Props> = ({ config }) => {
  useMemo(() => {
    const inputChangedSuper = config.functions.inputChanged;
    config.functions.inputChanged = (name: string, value: any) => {
      inputChangedSuper(name, value);
      if (name == InputType.ExampleInput) {
        config.functions.updateOutput(OutputType.ExampleOutput, value);
      }
    };
  }, []);

  return <div>This is an example entrypoint</div>;
};
