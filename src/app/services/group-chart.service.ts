import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {createRequestOption} from '../utils/request-util';
import {ICatItem} from '../model/cat-item.model';

@Injectable({
  providedIn: 'root'
})

export class GroupChartService {
  constructor(private http: HttpClient) {
  }

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${environment.apiUrl}/search`, {
      params: options,
      observe: 'response'
    });
  }

  getAll(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${environment.apiUrl}/getAllGroupChart`, {
      params: options,
      observe: 'response'
    });
  }

  getListGroupName(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${environment.apiUrl}/getAllGroupName`, {
      params: options,
      observe: 'response'
    });
  }

  getChartByGroupName(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${environment.apiUrl}/getChartByGroupName`, {
      params: options,
      observe: 'response'
    });
  }

  findJobForProcess(obj): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/searchJobProcess`, obj, {observe: 'response'});
  }

  addCm(obj): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cm`, obj, {observe: 'response'});
  }

  updateCm(obj): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cm/update`, obj, {observe: 'response'});
  }

  dosSearchCm(obj): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/cm`, {params: obj, observe: 'response'});
  }

  smServerInfo(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/sm-server`, {observe: 'response'});
  }

  getServerUser(data): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/cm-su`, {params: data, observe: 'response'});
  }

  getListWpGroup(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/wp/getListWpGroup`, {observe: 'response'});
  }

  searchForJob(obj): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/searchJobChart`, obj, {observe: 'response'});
  }

  searchForErrorsList(obj): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/searchForErrorsList`, obj, {observe: 'response'});
  }

  addJobForProcess(obj): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/addJobProcess`, obj, {observe: 'response'});
  }

  deleteJobForProcess(appId): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/deleteJobProcess/${appId}`, null, {observe: 'response'});
  }

  updateJobForProcess(obj, appId): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/updateJobProcess/${appId}`, obj, {observe: 'response'});
  }

  addGroupChart(obj): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/addGroupChart`, obj, {observe: 'response'});
  }

  updateGroupChart(obj, id): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/updateGroupChart/${id}`, obj, {observe: 'response'});
  }

  deleteGroupChart(id): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/deleteGroupChart/${id}`, null, {observe: 'response'});
  }

  startApp(id): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/apps/${id}/start`, null, {observe: 'response'});
  }

  stopApp(id): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/apps/${id}/stop`, null, {observe: 'response'});
  }

  restart(id): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/apps/${id}/restart`, null, {observe: 'response'});
  }

  viewLogApp(id): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/apps/${id}`, {observe: 'response'});
  }
}
