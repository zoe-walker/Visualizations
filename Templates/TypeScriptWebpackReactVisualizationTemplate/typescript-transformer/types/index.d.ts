declare namespace Vis {
  //If this file is failing because of global variables you need to
  // run generate-types at least once and ensure there are the generic type files
  //The global variable may still say they are erorring, if this is the case
  // open the vistualization.ts of your project and it should resolve the issues
}

/**
 * The data that is supplied to the visualisation through the config variable
 *
 * This file uses Global Namespaces to allow easier type referencing inside the
 *  the visualization files so types may not look accurate inside this file
 */
type MooDConfig = {
  version: string;
  element: string;

  width: string;
  height: string;
  overflowX: boolean;
  overflowY: boolean;

  animation: boolean;

  actions?: Vis.Actions;
  data?: Vis.Data;
  style?: Vis.Style;
  outputs?: Vis.Outputs;
  inputs?: Vis.Inputs;

  state?: MooDState;

  masterId: string;
  elementURL: string;
  elementIconURL: string;
  iconURL: string;
  id: string;

  functionNames: [
    "errorOccurred",
    "navigate",
    "dataChanged",
    "inputChanged",
    "updateOutput",
    "updateSize",
    "pdateState",
    "hasAction",
    "performAction"
  ];
  functions: MooDFunctions;
};

/**
 * The MooD config state variable
 *
 * @member value - a JSON formatted string
 */
type MooDState = {
  available: string[];
  id: string;

  editable: boolean;
  scope: string;

  value: string;
};

/**
 * The MooD config actions variable
 */
type MooDAction = {
  title: string;
  description: boolean;
  actions: (
    | MooDNavigateAction
    | MooDInputChangedAction
    | MoodOutputChangedAction
  )[];
};

/**
 * An interface for the base of all MooD actions
 */
interface MooDActionBase {
  method: string;
  title: string;
  name: string;
  iconImage?: string;
}

/**
 * An interface for the any MooD navigation actions
 */
interface MooDNavigateAction extends MooDActionBase {
  master: string;
}

/**
 * An interface for the any actions that listen to an input being changed
 */
interface MooDInputChangedAction extends MooDActionBase {}

/**
 * An interface for the any actions that update MooD with a new output
 */
interface MoodOutputChangedAction extends MooDActionBase {}

/**
 * The functions object holds functions used to interact between Active Enterprise and the Visualization and vice versa.
 *
 * The Visualization is expected to override (assign) new functions to those that it wants to react to, all functions have an implementation which should not raise exceptions.
 */
type MooDFunctions = {
  errorOccurred: (error: Error) => void;

  dataChanged: (data: Vis.Data) => void;

  inputChanged: <TInputKey extends keyof Vis.Inputs>(
    name: TInputKey,
    value: Vis.Inputs[TInputKey] | undefined
  ) => void;

  updateOutput: <TOutputKey extends keyof Vis.Outputs>(
    name: TOutputKey,
    value: Vis.Outputs[TOutputKey] | undefined
  ) => void;

  updateSize: (width: number, height: number) => void;

  updateState: (state: string) => void;

  performAction: (name: keyof Vis.Actions, id: string, event: object) => void;

  hasAction: (
    name: keyof Vis.Actions,
    id: string | string[],
    callback: Function
  ) => void;
};
