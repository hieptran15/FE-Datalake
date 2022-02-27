import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {createRequestOption} from '../utils/request-util';
import {INodeTypeInput} from '../model/node-type-input.model';


type EntityResponseType = HttpResponse<INodeTypeInput>;

@Injectable({
  providedIn: 'root',
})


export class NodeTypeInputService {
  constructor(private http: HttpClient) {
  }

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<INodeTypeInput[]>(`${environment.apiUrl}/node-type-inputs`, {
      params: options,
      observe: 'response',
    });
  }

  create(objModel: INodeTypeInput): Observable<EntityResponseType> {
    return this.http.post<INodeTypeInput>(`${environment.apiUrl}/node-type-inputs`, objModel, {observe: 'response'});
  }

  update(objModel: INodeTypeInput): Observable<EntityResponseType> {
    return this.http.put<INodeTypeInput>(`${environment.apiUrl}/node-type-inputs`, objModel, {observe: 'response'});
  }

  delete(id: any) {
    return this.http.delete(`${environment.apiUrl}/node-type-inputs/${id}`);
  }

  find(id: number): Observable<INodeTypeInput> {
    return this.http.get<any>(`${environment.apiUrl}/node-type-inputs/${id}`, {observe: 'response'});
  }
}
