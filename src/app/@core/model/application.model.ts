export interface IApplicationModel {
  id?: any;
  appliacationName?: any;
  appliacationType?: any;
}

export class Application implements IApplicationModel {
  constructor(
    id?: any,
    appliacationName?: any,
    appliacationType?: any,
  ) {
  }
}
