export interface IMakeConfigFileDb {
  id?: number;
  idCommand?: number;
  idCommandCreate?: number;
  idConnection?: number;
  selectCommand?: string;
  fetchSize?: number;
  usePartition?: boolean;
  numFields?: number;
  numExes?: number;
  numParts?: number;
  selectDescription?: string;
  useSubpartition?: boolean;
  createSqlCommand?: string;
  createDescription?: string;
  tableName?: string;
  locationPath?: string;
  removePath?: string;
  source?: string;
  description?: string;
  active?: boolean;
  idGroup?: number;
  maxTime?: number;
  params ?: any;
}

export class MakeConfigFileDbModel implements IMakeConfigFileDb {
  constructor(
    public  id?: number,
    public idConnection?: number,
  public selectCommand?: string,
  public fetchSize?: number,
  public usePartition?: boolean,
  public numFields?: number,
  public numExes?: number,
  public numParts?: number,
  public selectDescription?: string,
  public useSubpartition?: boolean,
  public createSqlCommand?: string,
  public createDescription?: string,
  public tableName?: string,
  public locationPath?: string,
  public removePath?: string,
  public source?: string,
  public description?: string,
  public active?: boolean,
  public idGroup?: number,
  public maxTime?: number,
    public params?: any
  ) {}
}
