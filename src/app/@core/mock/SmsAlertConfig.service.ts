import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {SmsAlertConfigGroupModel, SmsAlertConfigIsdnModel, SmsAlertConfigModel} from '../model/smsAlertConfig.model';
import {createRequestOption} from '../../utils/request-util';

@Injectable({
  providedIn: 'root'
})
export class SmsAlertConfigService {
  apiUrl = environment.apiUrl;
  loadData = new Subject();
  constructor(
    private http: HttpClient
  ) {
  }

  searchWpAlertUser(input): Observable<any> {
    const options = createRequestOption({input});
    return this.http.get<any>(`${this.apiUrl}/searchWpAlertUser`, {observe: 'response', params: options});
  }

  searchStatusOnAlerGroup(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/searchStatusOnAlerGroup`, {observe: 'response'});
  }

  updateWpAlertUser(smsAlertConfigModel: SmsAlertConfigModel): Observable<any> {
    if (smsAlertConfigModel.id) {
      return this.http.post<any>(`${this.apiUrl}/updateWpAlertUser/${smsAlertConfigModel.id}`, smsAlertConfigModel, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.apiUrl}/addWpAlertUser`, smsAlertConfigModel, {observe: 'response'});
    }
  }

  deleteWpAlertUser(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/deleteWpAlertUser/${id}`, {observe: 'response'});
  }

  /*alert isdn*/
  searchWpAlertIsdn(input): Observable<any> {
    const options = createRequestOption({input});
    return this.http.get<any>(`${this.apiUrl}/searchWpAlertIsdn`, {observe: 'response', params: options});
  }

  updateWpAlertIsdn(smsAlertConfigModel: SmsAlertConfigIsdnModel): Observable<any> {
    if (smsAlertConfigModel.id) {
      return this.http.post<any>(`${this.apiUrl}/updateWpAlertIsdn/${smsAlertConfigModel.id}`, smsAlertConfigModel, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.apiUrl}/addWpAlertIsdn`, smsAlertConfigModel, {observe: 'response'});
    }
  }

  deleteWpAlertIsdn(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/deleteWpAlertIsdn/${id}`, {observe: 'response'});
  }

  /*alert WpAlertGroup*/
  searchWpAlertGroup(str): Observable<any> {
    const options = createRequestOption({str});
    return this.http.get<any>(`${this.apiUrl}/searchWpAlertGroup`, {observe: 'response', params: options});
  }
  searchStatusOnAlertUserOn(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/searchStatusOnAlerUserOn`, {observe: 'response'});
  }

  updateWpAlertGroup(smsAlertConfigGroupModel: SmsAlertConfigGroupModel): Observable<any> {
    if (smsAlertConfigGroupModel.id) {
      return this.http.post<any>(`${this.apiUrl}/updateWpAlertGroup/${smsAlertConfigGroupModel.id}`, smsAlertConfigGroupModel, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.apiUrl}/addWpAlertGroup`, smsAlertConfigGroupModel, {observe: 'response'});
    }
  }

  deleteWpAlertGroup(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/deleteWpAlertGroup/${id}`, {observe: 'response'});
  }
}
