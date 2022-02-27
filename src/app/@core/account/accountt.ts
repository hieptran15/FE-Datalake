import {Authoritiess} from './authoritiess';
export class  Accountt {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  activated: boolean;
  langKey: string;
  createUser: string;
  createTime: Date;
  updateUser: string;
  updateTime: Date;
  userHdfs: number;
  authorities: Authoritiess[];
}
