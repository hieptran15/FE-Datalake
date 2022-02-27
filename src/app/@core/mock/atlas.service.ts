import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtlasService {
  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) {
  }

  execute(obj: Object): Observable<any> {
    return this.http.post(`${this.apiUrl}/atlas`, obj, {observe: 'response'});
  }
}
