export interface IApplicationRealation {
  createTime?: string,
  createUser?: string,
  description?: string,
  id?: number,
  label?: string,
  leftClusterId?: number,
  leftClusterName?: string,
  leftNodeId?: number,
  leftNodeName?: string,
  rightClusterId?: number,
  rightClusterName?: string,
  rightNodeId?: number,
  rightNodeName?: string,
  status?: number,
  style?: string,
  updateTime?: string,
  updateUser?: string,
}


export class ApplicationRelation implements IApplicationRealation {
  createTime?: string;
  createUser?: string;
  description?: string;
  id?: number;
  label?: string;
  leftClusterId?: number;
  leftClusterName?: string;
  leftNodeId?: number;
  leftNodeName?: string;
  rightClusterId?: number;
  rightClusterName?: string;
  rightNodeId?: number;
  rightNodeName?: string;
  status?: number;
  style?: string;
  updateTime?: string;
  updateUser?: string;
}
