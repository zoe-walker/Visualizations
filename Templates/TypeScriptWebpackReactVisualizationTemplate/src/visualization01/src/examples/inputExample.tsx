import { useInput } from "@helpers/hooks/useInput";
import React from "react";
import { InputsEnum } from "src/types/inputs";

export const InputExample = () => {
  // Listen to the input "Example Input"
  const exampleInput = useInput(InputsEnum.Example_Input);

  return (
    <>
      <div>
        This is an example input: {exampleInput?.toString() ?? "undefined"}
      </div>
      <br />
    </>
  );
};
