export class Account {
/*  constructor() {
  }
  id: number;
  login: String;
  firstName: String;
  lastName: String;
  email: String;
  imageUrl: String;
  activate: boolean;
  langKey: String;
  createUser: String;
  createTime: Date;
  updateUser: String;
  updateTime: Date;
  userHdfs: number;*/
  // authorities: InMonth[];
  constructor(
    public activated: boolean,
    public authorities: {
      code: string,
      moduleId: number,
      moduleName: string,
      permissionId: number,
      roleGroup: string,
      userHdfsId: any,
      userHdfsName: any
    }[],
    public email: string,
    public firstName: string,
    public langKey: string,
    public lastName: string,
    public login: string,
    public imageUrl: string
  ) {}
}
