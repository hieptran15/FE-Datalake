import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {createRequestOption} from '../utils/request-util';
import {ICatItem} from '../model/cat-item.model';
import {EnvService} from '../env.service';

type EntityResponseType = HttpResponse<ICatItem>;

@Injectable({
  providedIn: 'root',
})


export class RoleManagementService {
  constructor(private http: HttpClient, private env: EnvService) {
  }

  apiUrl = environment.apiUrl;

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/searchDHdfsUser`, {
      params: options,
      observe: 'response',
    });
  }

  getListPermission(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/permissionHdfsUser`, {
      params: options,
      observe: 'response',
    });
  }

  create(objModel: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/addDHdfsUser`, objModel, {observe: 'response'});
  }

  update(objModel: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/updateDHdfsUser/${objModel.id}`, objModel, {observe: 'response'});
  }


  delete(id: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/deleteDHdfsUser/${id}`, null, {observe: 'response'});
  }

  find(id: number): Observable<ICatItem> {
    return this.http.get<any>(`${this.env.apiUrl}/cat-items/${id}`, {observe: 'response'});
  }
}
