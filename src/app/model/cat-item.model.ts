export interface ICatItem {
  id?: number;
  itemId?: number;
  itemCode?: string;
  itemName?: string;
  itemValue?: string;
  categoryId?: number;
  categoryCode?: string;
  position?: number;
  description?: string;
  editable?: number;
  parentItemId?: number;
  status?: number;
  createTime?: string;
  createUser?: string;
  updateTime?: string;
  updateUser?: string;
}

export class CatItem implements ICatItem {
  constructor() {
  }
  id: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  itemValue: string;
  categoryId: number;
  categoryCode: string;
  position: number;
  description: string;
  editable: number;
  parentItemId: null;
  status: number;
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
}
