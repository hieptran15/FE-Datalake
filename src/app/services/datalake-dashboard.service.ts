import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatalakeDashboardService {


  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  LoadingSRFromDashboard(data): Observable<any> {
    const param = {status: data}
    return this.http.get(`${this.apiUrl}/sr-info/sta`, {observe: 'response', params: param})
  }

  checkDataNode(data): Observable<any> {

    const param = {clusterName: data}
    return this.http.get(`${this.apiUrl}/dashboard/data-node`, {observe: 'response', params: param});
  }

  checkNameNode(data): Observable<any> {
    const param = {clusterName: data}
    return this.http.get(`${this.apiUrl}/dashboard/name-node`, {observe: 'response', params: param});
  }

  checkDataVolume(data): Observable<any> {
    const param = {clusterName: data}
    return this.http.get(`${this.apiUrl}/dashboard/data`, {observe: 'response', params: param});
  }

  getCmCluster(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cm-cl`, {observe: 'response'});
  }

  checkDataBlock(data): Observable<any> {
    const param = {clusterName: data}
    return this.http.get(`${this.apiUrl}/dashboard/block`, {observe: 'response', params: param});
  }

  downloadFileDashboard(data): Observable<any> {
    const param = {fileName: data}
    return this.http.get(`${this.apiUrl}/sr-info/down-browser`, {observe: 'response'})
  }
}
