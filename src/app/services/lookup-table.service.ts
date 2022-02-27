import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnvService} from '../env.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupTableService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private env: EnvService) {
  }

  etlJobInfos(data: any): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/etl-job-infos`, {
      params: data,
      observe: 'response'
    })
  }

  downLoadEtlJobList(data): Observable<any> {
    return this.http.get(`${this.apiUrl}/etl-job-infos/down`, {params: data, responseType: 'arraybuffer'});
  }
}
