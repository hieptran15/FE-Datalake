export interface ICluster {
  fsName?: string;
  hdfsAddress?: string;
  uiName?: string;
}

  export class Cluster implements ICluster {
  constructor(
    public fsName?: string,
    public hdfsAddress?: string,
    public uiName?: string
  ) {}
}
