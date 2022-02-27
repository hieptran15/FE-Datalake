export interface ISupportRequest {
  id?: number;
  title?: string;
  type?: string;
  status?: string;
  fileUrl?: string;
  info?: string;
  userSendRequest?: string;
  userHandler?: any;
  fileListUser?: string;
  srCensorId?: number;
  listUserHandler?: string;
  createBy?: number;
}


export class SupportRequest implements ISupportRequest {
  id?: number;
  title?: string;
  type?: string;
  status?: string;
  fileUrl?: string;
  info?: string;
  userSendRequest?: string;
  userHandler?: any;
  fileListUser?: string;
  srCensorId?: number;
  listUserHandler?: string;
  createBy?: number;
}
