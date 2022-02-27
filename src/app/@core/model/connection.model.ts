export interface IConnection {
  id?: number;
  url?: string;
  userName?: string;
  connectionName?: string;
  pass?: string;
  description?: string
}

export class ConnectionModel implements IConnection {
  constructor(
    public id?: number,
    public url?: string,
    public userName?: string,
    public connectionName?: string,
    public pass?: string,
    public description?: string
  ) {}
}
