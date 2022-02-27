import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {createRequestOption} from '../../utils/request-util';
import {EnvService} from '../../env.service';

@Injectable({
  providedIn: 'root'
})
export class IngestionDashboardSevices {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getChart(typePro?, timeType?, source?): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/dashboard/search?provisionning=${typePro}&timeType=${timeType}&source=${source}`, { observe: 'response' });
  }
  getChartById(timeType?, source?, id?): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/dashboard/search?timeType=${timeType}&source=${source}&flowId=${id}`, { observe: 'response' });
  }

  getChartByDate(monitorProcessorId?): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/nifi-api/flow/processors/${monitorProcessorId}`, { observe: 'response' });
  }

}
