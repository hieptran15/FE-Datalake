export interface IApplicationCluster {
  treeStatus?: string;
  id?: number;
  clusterCode?: string;
  clusterName?: string;
  parentId?: number;
  treePath?: string;
  style?: string;
  description?: string;
  status?: number;
  createTime?: string;
  createUser?: string;
  updateTime?: string;
  updateUser?: string;
}

export class ApplicationCluster implements IApplicationCluster {
  treeStatus?: string;
  id: number;
  clusterCode: string;
  clusterName: string;
  parentId: number;
  treePath: string;
  style: string;
  description: string;
  status: number;
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
}
