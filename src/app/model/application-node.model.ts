export interface IApplicationNode {
  id?: number;
  nodeCode?: string;
  nodeName?: string;
  nodeType?: string;
  clusterId?: number;
  treePath?: string;
  nodeInfo?: string;
  imagePath?: any;
  style?: string;
  url?: string;
  description?: string;
  status?: number;
  createTime?: string;
  createUser?: string;
  updateTime?: string;
  updateUser?: string;
}


export class ApplicationNode implements IApplicationNode {
  id: number;
  nodeCode: string;
  nodeName: string;
  nodeType: string;
  clusterId: number;
  treePath: string;
  url: string;
  nodeInfo: string;
  style: string;
  imagePath: any;
  description: string;
  status: number;
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
}
