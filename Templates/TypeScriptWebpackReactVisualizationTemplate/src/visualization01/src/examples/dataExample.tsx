import { useData } from "@helpers/hooks/useData";
import React from "react";

export const DataExample = () => {
  // Get the data for the first ExampleVariable by using the property name
  const exampleVariable1 = useData("ExampleVariable1");

  // Get the first valid data for the third ExampleVariable if it has a value
  const exampleVariable3 = useData((data: Vis.Data): Vis.Data.Query => {
    for (let i = 0; i < data.ExampleVariable3?.length; i++) {
      if (data.ExampleVariable3[i].Value != null)
        return data.ExampleVariable3[i];
    }
  });

  return (
    <>
      <div>
        This is an example data configuartion variable 1:{" "}
        {exampleVariable1 ?? "undefined"}
      </div>
      <br />
      <div>
        This is an example data configuartion variable 3:{" "}
        {exampleVariable3?.key ?? "undefined"}
      </div>
      <br />
    </>
  );
};
