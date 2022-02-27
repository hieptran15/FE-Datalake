import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {createRequestOption} from '../utils/request-util';
import {IApplicationNode} from '../model/application-node.model';

type EntityResponseType = HttpResponse<IApplicationNode>;

@Injectable({
  providedIn: 'root',
})

export class ApplicationNodeService {
  constructor(private http: HttpClient) {
  }
    query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<IApplicationNode[]>(`${environment.apiUrl}/application-nodes`, {
      params: options,
      observe: 'response',
    });
  }

  getAllForGraph(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<IApplicationNode[]>(`${environment.apiUrl}/application-nodes/get-all-for-graph`, {
      params: options,
      observe: 'response',
    });
  }

  getNodeService(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/application-nodes/${id}`, {
      observe: 'response'
    })
  }

  create(objModel: FormData) {
    return this.http.post(`${environment.apiUrl}/application-nodes`, objModel);
  }

  update(objModel: FormData) {
    return this.http.put(`${environment.apiUrl}/application-nodes`, objModel);
  }

  updateList(objModel: IApplicationNode[]): Observable<EntityResponseType> {
    return this.http.put<IApplicationNode>(`${environment.apiUrl}/application-nodes-list`, objModel, {observe: 'response'});
  }

  delete(id: any) {
    return this.http.delete(`${environment.apiUrl}/application-nodes/${id}`);
  }
  deleteServer(id: any) {
    return this.http.delete(`${environment.apiUrl}/node-servers/${id}`);
  }

  find(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/application-nodes/${id}`, {observe: 'response'});
  }
}
