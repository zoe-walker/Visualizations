declare namespace Vis {
  interface Data {
    ExampleVariable1: string,
    ExampleVariable2: boolean,
    ExampleVariable3: Array<Query>,
  }
  
  interface Query extends MooDElement {
    key: ID,
    Name: string,
    Value: Any,
  }
}