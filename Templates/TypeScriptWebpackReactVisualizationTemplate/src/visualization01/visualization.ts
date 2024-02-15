import React from "react";
import { createRoot } from "react-dom/client";
import Logger from "@helpers/logger";
import { App, AppProps } from "src/app";
import { ConfigContext } from "@helpers/context/configContext";
import {
  getVisualizationConfig,
  getVisualizationState,
  setVisualizationConfig,
} from "@helpers/config";
import { ActionsEnum } from "src/types/actions";
import { InputsEnum } from "src/types/inputs";
import { OutputsEnum } from "src/types/outputs";
import "./visualization.css";

//
//    Entry function declaration
//
export function visualization(config: MooDConfig) {
  Logger.developmentMode = config?.style.DevelopmentMode;
  Logger.Log("Development mode is enabled, logging will be enabled");

  //Update the global Custom Visualization config object
  setVisualizationConfig(config);

  //Example ways to reference config variables before we enter React
  const width = parseFloat(config.width);
  const height = parseFloat(config.height);
  const animation = config.animation;
  const state = getVisualizationState(true);

  Logger.Log("This is an example of a development log");

  //Create the React root element with the element provided by MooD BA
  const root = createRoot(document.getElementById(config.element));

  //App contains any React content we want to render,
  // we pass the config to these by using a React Context
  root.render(
    React.createElement(
      ConfigContext.Provider,
      { value: getVisualizationConfig() },
      React.createElement<AppProps>(App, {})
    )
  );
}
