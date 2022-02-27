import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {EnvService} from '../../env.service';

@Injectable({
  providedIn: 'root'
})
export class CallApiNifiService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getLog(processGroupId?): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/nifi-api/process-groups/${processGroupId}`, { observe: 'response' });
  }
  getChartDay(monitorProcessorId?): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/nifi-api/flow/processors/${monitorProcessorId}`, { observe: 'response' });
  }
  getAllFlow(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/nifi-api/flow/process-groups`, { observe: 'response' });
  }
  getValue(keyValue?): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/getValue/${keyValue}`, { observe: 'response' });
  }

}
