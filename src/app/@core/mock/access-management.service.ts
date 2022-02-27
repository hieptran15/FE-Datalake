import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {createRequestOption} from '../../utils/request-util';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessManagementService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
  }

  gitListApp(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(`${this.apiUrl}/getListApp`, {params: options, observe: 'response'});
  }

  getListUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getListUser`);
  }

  getListCluster(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getListCluster`);
  }

  getListAuthConnection(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(`${this.apiUrl}/getListAuthConnection2`, {params: options, observe: 'response'});
  }

  updateAuthConnection(req?: any) {
    return this.http.post<any>(`${this.apiUrl}/updateAuthConnection2`, req, {observe: 'response'});
  }

  addApp(req?: any) {
    return this.http.post<any>(`${this.apiUrl}/addApp`, req, {observe: 'response'});
  }

  updateApp(req?: any) {
    return this.http.post<any>(`${this.apiUrl}/updateApp`, req, {observe: 'response'});
  }

  getUser() {
    return this.http.get<any>(`${this.apiUrl}/getUser`, {observe: 'response'});
  }

  addAuthConnection(fileName, object): Observable<HttpResponse<any>> {
    const formData = new FormData();
    fileName && formData.append('file', fileName);
    formData.append('acIdList', object.userId);
    formData.append('appIdList', object.appId);
    formData.append('startTime', object.startTime);
    formData.append('endTime', object.endTime);
    formData.append('reason', object.reason);
    formData.append('cronTab', object.cronTab);
    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/addAuthConnection2`, formData, {observe: 'response'});
  }

  prepareAddAuthConnection(object): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('acIdList', object.acIdList);
    formData.append('appIdList', object.appIdList);
    object.startTime && formData.append('startTime', object.startTime);
    object.endTime && formData.append('endTime', object.endTime);
    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/prepareAddAuthConnection2`, formData, {observe: 'response'});
  }

  getListAppParentOrChildren(object) {
    const req = {
      ClusterId: object.clusterId ? object.clusterId : '',
      appId: object.appId ? object.appId : '',
      rpAppId: object.rpAppId ? object.rpAppId : ''
    };
    const options = createRequestOption(req);
    return this.http.get(`${this.apiUrl}/getListAppParentOrChildren`, {params: options, observe: 'response'});
  }

  doSearchLbConnect(keySearch, typeSearch): Observable<any> {
    return this.http.get(`${this.apiUrl}/lb-connect?keySearch=${keySearch}&typeSearch=${typeSearch}`, {observe: 'response'})
  }

  createLbConnection(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lb-connect`, data, {observe: 'response'})
  }

  updateLbConnection(data: any, id: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lb-connect/update/${id}`, data, {observe: 'response'})
  }

  updateStatusLbConnection(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/lb-connect/update-status?status=${data.status}&id=${data.id}`, {observe: 'response'})
  }

  getAllLbRpApp(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lb-rp-app`, {observe: 'response'})
  }

  wpUserIp(id): Observable<any> {
    return this.http.get(`${this.apiUrl}/wp-user-ip?userId=${id}`, {observe: 'response'})
  }

  getAllUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/getAll`, {observe: 'response'})
  }

  getRpAppThriftId(req?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/lb-rp-app/thrift`, {params: req, observe: 'response'})
  }
}
