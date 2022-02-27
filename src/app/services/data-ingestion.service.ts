import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {createRequestOption} from '../utils/request-util';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {EnvService} from '../env.service';

@Injectable({
  providedIn: 'root',
})

export class DataIngestionService {
  constructor(private http: HttpClient,
              private env: EnvService) {
  }

  getListConnectionByType(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/doSearchManagerConnection`, {
      params: options,
      observe: 'response',
    });
  }

  createGroup(req: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/addProcessGroup`, req, {observe: 'response'});
  }

  getAllListGroup(): Observable<any> {
    return this.http.get<any[]>(`${this.env.apiUrl}/getAllProcessGroup`, {observe: 'response'});
  }

  getOneFtpConnection(req: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/getOneFtpConnection`, {
      params: options,
      observe: 'response'
    });
  }

  getOneRdbms(req: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/getOneRdbms`, {
      params: options,
      observe: 'response'
    });
  }

  getOneHIVE(req: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/hive/find-one`, {
      params: options,
      observe: 'response'
    });
  }

  getOneKafka(req: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/getOneKafka`, {
      params: options,
      observe: 'response'
    });
  }

  getOneHdfsConnection(req: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.env.apiUrl}/getOneHdfsConnection`, {
      params: options,
      observe: 'response'
    });
  }

  addFlows(req: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/addFlows`, req, {observe: 'response'});
  }

  addFlowsHIVE(req: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/hive-flows/create`, req, {observe: 'response'});
  }

  doSearchFlows(req: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/doSearchFlows`, req, {observe: 'response'});
  }

  deleteFlowsHIVE(req: any): Observable<any> {
    const a = new FormData();
    a.append('id', req);
    return this.http.post<any>(`${this.env.apiUrl}/hive-flows/delete`, a, {observe: 'response'});
  }

  deleteFlows(req: any): Observable<any> {
    const a = new FormData();
    a.append('id', req);
    return this.http.post<any>(`${this.env.apiUrl}/deleteFlows`, a, {observe: 'response'});
  }

  editFlows(req: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/editFlows`, req, {observe: 'response'});
  }

  editFlowsHive(req: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/hive-flows/update`, req, {observe: 'response'});
  }

  editFlowsState(req: any): Observable<any> {
    const obj = new FormData();
    obj.append('state', req.state);
    obj.append('id', req.id);
    obj.append('nifiProcessgroupId', req.nifiProcessgroupId);
    return this.http.post<any>(`${this.env.apiUrl}/editFlowsState`, obj, {observe: 'response'});
  }
}
