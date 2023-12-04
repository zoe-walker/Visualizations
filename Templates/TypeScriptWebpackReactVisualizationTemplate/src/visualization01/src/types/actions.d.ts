export enum ActionsEnum {
  Example_Click = "Example_Click",
}

interface ActionsTypes {
  [ActionsEnum.Example_Click]: MooDAction,
}

declare global {
  namespace Vis {
    type Actions = {
      [key in ActionsEnum]: ActionsTypes[key];
    }
  }
}