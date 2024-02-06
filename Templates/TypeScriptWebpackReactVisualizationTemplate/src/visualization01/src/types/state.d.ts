declare namespace Vis {
  interface State {
    [key: string | number | symbol]: any | undefined;
    ExampleState: boolean;
  }
}