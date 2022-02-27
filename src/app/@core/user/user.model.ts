export interface IUser {
  id?: any;
  ips?: string;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean;
  alarmLeader?: boolean;
  langKey?: string;
  authorities?: string[];
  domains?: string[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  password?: string;
  phoneNumber?: string;
  groupId?: number;
  typeUser?: number;
  dHdfsUsers?: any[];
  listWpIp?: WpIp[];
}

export class User implements IUser {
  constructor(
    public index?: number,
    public ips?: string,
    public id?: any,
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public activated?: boolean,
    public alarmLeader?: boolean,
    public langKey?: string,
    public authorities?: any[],
    public domains?: string[],
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public password?: string,
    public phoneNumber?: string,
    public groupId?: number,
    public typeUser?: number,
    public ssoUserId?: string,
    public dHdfsUsers?: any[],
    public listWpIp?: WpIp[],
  ) {
  }
}

export interface WpIp {
  id?: any;
  userId?: number;
  ipAddress?: string;
  activated?: boolean;
  createAt?: Date;
  createBy?: number;
  updateAt?: Date;
  updateBy?: number;
}

export class WpIp implements WpIp {
  constructor(id?: any,
              userId?: number,
              ipAddress?: string,
              activated?: boolean,
              createAt?: Date,
              createBy?: number,
              updateAt?: Date,
              updateBy?: number,
  ) {
  }
}
