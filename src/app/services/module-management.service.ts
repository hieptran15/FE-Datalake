import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { createRequestOption } from '../utils/request-util';
import { ICatItem } from '../model/cat-item.model';
import { EnvService } from '../env.service';

type EntityResponseType = HttpResponse<ICatItem>;

@Injectable({
  providedIn: 'root',
})
export class ModuleManagementService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private env: EnvService) {}

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/searchModule`, {
      params: options,
      observe: 'response',
    });
  }

  getListPermission(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/permissionsDefault`, {
      params: options,
      observe: 'response',
    });
  }

  create(objModel: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/addModule`, objModel, {
      observe: 'response',
    });
  }

  update(objModel: any): Observable<any> {
    return this.http.post<any>(
      `${this.env.apiUrl}/updateModule/${objModel.id}`,
      objModel,
      { observe: 'response' }
    );
  }

  delete(id: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/deleteModule/${id}`, null, {
      observe: 'response',
    });
  }

  find(id: number): Observable<ICatItem> {
    return this.http.get<any>(`${this.env.apiUrl}/cat-items/${id}`, {
      observe: 'response',
    });
  }

  // update new module with list config
  getAllListConfig(): Observable<any> {
    return this.http.get<any>(
      `${this.env.apiUrl}/commonservice/getAll`,
      {
        observe: 'response',
      }
    );
  }
// add config
  createListConfig(data:any):Observable<any> {
      return this.http.post<any>(`${this.env.apiUrl}/commonservice/save`, data, {observe:'response'})
  }
  // update list config
  updateListConfig(data:any):Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/commonservice/update`, data, {observe:'response'})
  }
}
