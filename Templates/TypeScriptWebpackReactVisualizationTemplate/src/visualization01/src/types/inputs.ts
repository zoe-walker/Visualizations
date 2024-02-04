export enum InputsEnum {
  Example_Input = "Example Input",
}

export interface InputsTypes {
  [InputsEnum.Example_Input]?: Number
}

declare global {
  namespace Vis {
    type Inputs = {
      [key in InputsEnum]: InputsTypes[key];
    }
  }
}