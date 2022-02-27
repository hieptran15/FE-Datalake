export interface IHdfs {
  access_time?: number;
  block_replication?: number;
  blocksize?: number;
  group?: string;
  isdir?: boolean;
  length?: number;
  modification_time?: number;
  owner?: string;
  path?: string;
  permission?: string;
  size?: number;
  quota?: number;
  isLoading?: boolean;
}

export class Hdfs implements IHdfs {
  constructor(
    public access_time?: number,
    public block_replication?: number,
    public blocksize?: number,
    public group?: string,
    public isdir?: boolean,
    public length?: number,
    public modification_time?: number,
    public owner?: string,
    public path?: string,
    public permission?: string,
    public size?: number,
    public quota?: number,
    public isLoading?: boolean
  ) {
  }
}
