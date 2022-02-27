import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {createRequestOption} from '../utils/request-util';
import {IApplicationCluster} from '../model/application-cluster.model';

type EntityResponseType = HttpResponse<IApplicationCluster>;

@Injectable({
  providedIn: 'root',
})

export class ApplicationClusterService {
  constructor(private http: HttpClient) {
  }

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<IApplicationCluster[]>(`${environment.apiUrl}/application-clusters`, {
      params: options,
      observe: 'response',
    });
  }

  findByIds(ids?: any[]): Observable<any> {
    const options = createRequestOption({ids});
    return this.http.get<IApplicationCluster[]>(`${environment.apiUrl}/application-clusters/find-by-ids`, {
      params: options,
      observe: 'response',
    });
  }
  create(objModel: IApplicationCluster): Observable<EntityResponseType> {
    return this.http.post<IApplicationCluster>(`${environment.apiUrl}/application-clusters`, objModel, {observe: 'response'});
  }

  update(objModel: IApplicationCluster): Observable<EntityResponseType> {
    return this.http.put<IApplicationCluster>(`${environment.apiUrl}/application-clusters`, objModel, {observe: 'response'});
  }
  updateList(objModel: IApplicationCluster[]): Observable<EntityResponseType> {
    return this.http.put<IApplicationCluster>(`${environment.apiUrl}/application-clusters-list`, objModel, {observe: 'response'});
  }

  delete(id: any) {
    return this.http.delete(`${environment.apiUrl}/application-clusters/${id}`);
  }

  find(id: number): Observable<IApplicationCluster> {
    return this.http.get<any>(`${environment.apiUrl}/application-clusters/${id}`, {observe: 'response'});
  }
  getClusterService(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/application-clusters/${id}`, {
      observe: 'response'
    })
  }
}
