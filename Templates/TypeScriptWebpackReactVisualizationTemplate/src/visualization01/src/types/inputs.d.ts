export enum InputsEnum {
  ExampleInput = "ExampleInput",
}

type InputsTypes = {
  [InputsEnum.ExampleInput]?: Number
}

declare global {
  namespace Vis {
    type Inputs = {
      [key in InputsEnum]: InputsTypes[key];
    }
  }
}