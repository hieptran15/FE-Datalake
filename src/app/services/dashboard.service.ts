import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {createRequestOption} from '../utils/request-util';

@Injectable({
  providedIn: 'root',
})

export class DashboardService {
  constructor(private http: HttpClient) {
  }

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${environment.apiUrl}/search`, {
      params: options,
      observe: 'response',
    });
  }

}
