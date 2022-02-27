export interface IConfigFileDb {
  id?: number;
  description?: string;
  source?: string;
  removePath?: string;
  tableName?: string;
  idGroup?: number;
  maxTime?: number;
  locationPath?: string;
  sqlCommand?: string;
  isActive?: number;
  createCommand?: string;
}

export class ConfigFileDbModel implements IConfigFileDb {
  constructor(
    public id?: number,
    public description?: string,
    public source?: string,
    public removePath?: string,
    public tableName?: string,
    public idGroup?: number,
    public maxTime?: number,
    public locationPath?: string,
    public sqlCommand?: string,
    public isActive?: number,
    public createCommand?: string
  ) {}
}
