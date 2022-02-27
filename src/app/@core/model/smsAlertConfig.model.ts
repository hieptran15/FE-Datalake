import {Data} from '@angular/router';

export interface SmsAlertConfigModel {
  id?: number;
  userName?: string;
  isdn?: number;
  insertDate?: Data;
}

export interface SmsAlertConfigIsdnModel {
  id?: number;
  userName?: string;
  email?: string;
  typeAlert?: string;
  status?: number;
  isdn?: number;
}

export interface SmsAlertConfigGroupModel {
  id?: number;
  groupCode?: string;
  description?: string;
}
