export interface INodeTypeInput {
  id?: number;
  nodeType?: string;
  fieldName?: string;
  displayName?: string;
  inputType?: string;
  defaultValue?: string;
  source?: string;
  dataType?: string;
  isRequired?: number;
  priority?: number;
  description?: string;
  status?: number;
  createTime?: string;
  createUser?: string;
  updateTime?: string;
  updateUser?: string;
}

export class NodeTypeInput implements INodeTypeInput {
  constructor() {
  }
  id: null;
  nodeType: null;
  fieldName: null;
  displayName: null;
  inputType: null;
  defaultValue: null;
  source: null;
  dataType: null;
  isRequired?: number;
  priority?: number;
  description: null;
  status: null;
  createTime: null;
  createUser: null;
  updateTime: null;
  updateUser: null;
}
