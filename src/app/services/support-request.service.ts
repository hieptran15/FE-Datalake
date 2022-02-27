import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupportRequestService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAllSupportRequestInfo(data): Observable<any> {
    return this.http.get(`${this.apiUrl}/sr-info`, {
      params: data,
      observe: 'response',
    });
  }

  getSupportRequestInfoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sr-info/${id}`, {
      observe: 'response',
    });
  }

  getAllUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/getAll`, {
      observe: 'response',
    });
  }

  getAllUserBySrId(data): Observable<any> {
    return this.http.get(`${this.apiUrl}/sr-censor`, {
      params: data,
      observe: 'response',
    });
  }

  getListUserMapping(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sr-us/${id}`, {observe: 'response'});
  }

  getAllLbRpApp(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lb-rp-app`, {observe: 'response'});
  }

  getWpUserIp(data): Observable<any> {
    return this.http.get(`${this.apiUrl}/wp-user-ip`, {
      params: data,
      observe: 'response',
    });
  }

  getWp(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/wp/${id}`, {observe: 'response'});
  }

  getListWpThrift(): Observable<any> {
    return this.http.get(`${this.apiUrl}/wp/getListWpThrift`, {
      observe: 'response',
    });
  }

  getListThriftById(data): Observable<any> {
    return this.http.get(`${this.apiUrl}/wp-thr`, {
      params: data,
      observe: 'response',
    });
  }

  updateResult(data): Observable<any> {
    return this.http.get(`${this.apiUrl}/sr-censor/update`, {
      params: data,
      observe: 'response',
    });
  }

  getListServer(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sm-server`, {observe: 'response'});
  }

  createOrSaveSr(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/sr-info`, data, {
      observe: 'response',
    });
  }

  // thuc hien sr - check step 1
  checkServer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sr-info/che-sv`, data, {
      observe: 'response',
    });
  }

  checkUserAndIp(data: string): Observable<any> {
    const params = {srId: data};
    return this.http.get(`${this.apiUrl}/sr-info/che-user-ip`, {
      observe: 'response',
      params: params,
    });
  }

  checkThrift(data: any): Observable<any> {
    // const params = new HttpParams();
    // params.append('listThriftId', data);
    // const params = {listThriftId: data};
    const params = {wpThriftId: data};

    return this.http.get(`${this.apiUrl}/sr-info/che-thr`, {
      observe: 'response',
      params: params,
    });
  }

  // check api de thuc hien sr
  checkCanActionSR(data: any): Observable<any> {
    const params = {srId: data};
    return this.http.get(`${this.apiUrl}/sr-censor/check-result`, {
      observe: 'response',
      params: params,
    });
  }

  // download file step 3
  downloadFile(data: any): Observable<any> {
    const params = {fileName: data};
    return this.http.get(`${this.apiUrl}/sr-info/down`, {
      responseType: 'blob',
      params: params,
    });
  }

  // check thuc hien phieu yeu cau
  RunActionSR(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sr-info/exe`, data, {
      observe: 'response',
    });
  }

  // get data perform log
  GetPerformLog(data: any): Observable<any> {
    const params = {userName: data};
    return this.http.get(`${this.apiUrl}/sm-loger`, {
      observe: 'response',
      params: params,
    });
  }

  // action complete
  // sr-info/update/status
  ActionCompleteSR(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/sr-info/update/status?id=${data.id}&status=${data.status}`,
      {observe: 'response'}
    );
  }

  updateSr(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/sr-info/update`, data, {
      observe: 'response',
    });
  }

  // chay phan tram load sr

  LoadingMathSR(data): Observable<any> {
    const params = {srId: data};
    return this.http.get(`${this.apiUrl}/sr-us/math-total`, {
      observe: 'response',
      params: params,
    });
  }
}
