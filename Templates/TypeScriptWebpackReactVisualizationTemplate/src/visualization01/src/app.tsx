import React, { useMemo } from "react";
import { InputsEnum } from "./types/inputs";
import { OutputsEnum } from "./types/outputs";

type Props = {
  config: MooDConfig;
};

export const App: React.FC<Props> = ({ config }) => {
  useMemo(() => {
    const inputChangedSuper = config.functions.inputChanged;
    config.functions.inputChanged = (name: InputsEnum, value: any | never) => {
      inputChangedSuper(name, value);
      if (name == InputsEnum.ExampleInput) {
        config.functions.updateOutput(OutputsEnum.ExampleOutput, value);
      }
    };
  }, []);

  return <div>This is an example entrypoint</div>;
};
