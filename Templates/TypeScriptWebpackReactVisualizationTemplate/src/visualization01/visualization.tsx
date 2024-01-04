import React from "react";
import { createRoot } from "react-dom/client";
import Logger from "@helpers/logger";
import "./visualization.css";
import { ActionsEnum } from "src/types/actions";
import { InputsEnum, InputsTypes } from "src/types/inputs";
import { OutputsEnum } from "src/types/outputs";
import { App } from "src/app";

//
//    Entry function declaration
//
export function visualization(config: MooDConfig) {
  Logger.developmentMode = config?.style.DevelopmentMode;
  Logger.Log("Development mode is enabled, logging will be enabled");

  /**
   * The visualization state is stored in a string format
   * This visualization expects that string to be in a JSON format
   */
  let state: Vis.State | null = null;
  if (config?.state != null) {
    try {
      state =
        config?.state?.value != "" ? JSON.parse(config?.state?.value) : {};
    } catch (e) {
      throw new Error(`${e}
            Custom Visualisation State is not set up correctly, please ensure that the state is a valid JSON string`);
    }
  }

  //Example ways to reference config variables before we enter React
  const width = parseFloat(config.width);
  const height = parseFloat(config.height);
  const animation = config.animation;

  //This allows us to update what is inside the inputs whenever they changes
  const inputChangedSuper = config.functions.inputChanged;
  config.functions.inputChanged = <TInputKey extends InputsEnum>(
    name: TInputKey,
    value: InputsTypes[TInputKey]
  ) => {
    inputChangedSuper(name, value);
    config.inputs[name] = value;
  };

  Logger.Log("This is an example of a development log");

  const root = createRoot(document.getElementById(config.element));

  //App contains any React content we want to render
  root.render(<App config={config}></App>);
}
