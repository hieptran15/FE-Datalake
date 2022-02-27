import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {createRequestOption} from '../utils/request-util';
import {ICatItem} from '../model/cat-item.model';

type EntityResponseType = HttpResponse<ICatItem>;

@Injectable({
  providedIn: 'root',
})


export class CatItemService {
  constructor(private http: HttpClient) {
  }

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<ICatItem[]>(`${environment.apiUrl}/cat-items`, {
      params: options,
      observe: 'response',
    });
  }

  create(objModel: ICatItem): Observable<EntityResponseType> {
    return this.http.post<ICatItem>(`${environment.apiUrl}/cat-items`, objModel, {observe: 'response'});
  }

  update(objModel: ICatItem): Observable<EntityResponseType> {
    return this.http.put<ICatItem>(`${environment.apiUrl}/cat-items`, objModel, {observe: 'response'});
  }

  delete(id: any) {
    return this.http.delete(`${environment.apiUrl}/cat-items/${id}`);
  }

  find(id: number): Observable<ICatItem> {
    return this.http.get<any>(`${environment.apiUrl}/cat-items/${id}`, {observe: 'response'});
  }
}
