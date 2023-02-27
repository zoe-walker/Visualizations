/**
 * The data that is supplied to the visualisation through the config variable
 */
type MooDConfig<
    ConfigData,
    ConfigStyle,
    ConfigActions,
    ConfigInputs,
    ConfigOutputs
> = {
    version: string;
    element: string;

    width: string;
    height: string;
    overflowX: boolean;
    overflowY: boolean;

    animation: boolean;

    actions?: ConfigActions;
    data: ConfigData | { data: null };
    style?: ConfigStyle;
    outputs?: ConfigInputs;
    inputs?: ConfigOutputs;

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
 * Base type to be expanded on for visualisation config
 *
 * The data, conforming to the data shape defined by the visualization, for the visualization to render
 */
// type MooDData = {};

/**
 * Used by MooD to determine the element inside MooD
 */
type ID = string;

/**
 * Used by MooD to pass colours to/from the visuialisation
 */
type Colour = string;

/**
 * Used by MooD to pass shapes to/from the visuialisation
 */
type Shape = string;

/**
 * Used by MooD to pass images to/from the visuialisation
 */
type Image = string;

/**
 * Used by MooD to pass dates to/from the visuialisation
 *
 * Note MooD BA delivers Date scalar type values as a string that conforms to ISO8601, e.g. '2020-06-01T12:01:02-01:00'.
 */
type MooDDate = string;

/**
 * Used by MooD to pass dates to/from the visuialisation
 *
 * Values for the "elements" type may be a single element unique id string,
 * a comma separated list of unique ids or an array of unique ids representing the element instances
 */
type Elements = string | string[];

/**
 * Used by MooD to allow any type of variable to be passed in/out
 */
type Any = boolean | number | string | MooDDate;

/**
 * Used by MooD to determine that the variable being passed is a MooD Element
 */
interface MooDElement {
    ID?: string;
}

/**
 * Used by MooD to determine that the variable being passed is a MooD Meta Model
 */
interface MooDMeta {}

/**
 * Base type to be expanded on for visualisation config
 *
 * This type should conform to the structure of the style.JSON property defined in the visualization.config.json file, or be null if no style is defined
 */
// type MooDStyle = {};

/**
 * Base type to be expanded on for visualisation config
 *
 * The MooD config inputs/output variable
 */
// type MooDIO = {
//     name: string,
//     displayName: string,
//     type: Any,
//     default: Any
// };

/**
 * The MooD config state variable
 *
 * @member  value - a JSON formatted string
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
    name?: string;
    iconImage: string;
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
    dataChanged: (data: object) => void;
    inputChanged: (name: string, value: any) => void;
    updateOutput: (name: string, value: any) => void;
    updateSize: (width: number, height: number) => void;
    updateState: (state: string) => void;
    performAction: (name: string, id: string, event: object) => void;
    hasAction: (
        name: string,
        id: string | string[],
        callback: Function
    ) => void;
};
