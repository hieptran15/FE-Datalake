import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {MakeConfigFileDbModel} from '../model/makeConfigFileDb.model';
import {createRequestOption} from '../../utils/request-util';
import {EnvService} from '../../env.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionManagementService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  doSearch(obj): Observable<any> {
    const params = createRequestOption(obj);
    return this.http.get<any>(`${this.env.apiUrl}/doSearchManagerConnection`, {
      params: params,
      observe: 'response'
    });
  }

  /*FTP*/
  addFtp(ftp: Object, id: number): Observable<any> {
    if (id === null) {
      return this.http.post<any>(`${this.env.apiUrl}/addFtp`, ftp, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/editFtp`, ftp, {observe: 'response'});
    }
  }

  deleteFtp(id): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/deleteFtp/id=${id}`, {observe: 'response'});
  }

  /*end*/

  /*Rdbms*/
  addRdbms(rdbms: Object, id: number): Observable<any> {
    if (id === null) {
      return this.http.post<any>(`${this.env.apiUrl}/addRdbms`, rdbms, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/editRdbms`, rdbms, {observe: 'response'});
    }
  }

  deleteRdbms(id): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/deleteRdbms/id=${id}`, {observe: 'response'});
  }

  /*end*/

  /*Rdbms*/
  addHdfs(hdfs: Object, id: number): Observable<any> {
    if (id === null) {
      return this.http.post<any>(`${this.env.apiUrl}/addHdfs`, hdfs, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/editHdfs`, hdfs, {observe: 'response'});
    }
  }

  deleteHdfs(id): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/deleteHdfs/id=${id}`, {observe: 'response'});
  }

  /*end*/

  /*Rdbms*/
  addKafka(kafka: Object, id: number): Observable<any> {
    if (id === null) {
      return this.http.post<any>(`${this.env.apiUrl}/addKafka`, kafka, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/editKafka`, kafka, {observe: 'response'});
    }
  }

  deleteKafka(id): Observable<any> {
    return this.http.delete<any>(`${this.env.apiUrl}/deleteKafka/id=${id}`, {observe: 'response'});
  }

  /*end*/

  /*HIVE*/
  addHIVE(hive: Object, id: number): Observable<any> {
    if (id === null) {
      return this.http.post<any>(`${this.env.apiUrl}/hive/save`, hive, {observe: 'response'});
    } else {
      return this.http.post<any>(`${this.env.apiUrl}/hive/update`, hive, {observe: 'response'});
    }
  }

  /*end*/

  /*searchById*/
  searchKafka(id: number) {
    return this.http.get<any>(`${this.env.apiUrl}/getOneKafka?id=${id}`, {observe: 'response'});
  }


  searchHdfs(id: number) {
    return this.http.get<any>(`${this.env.apiUrl}/getOneHdfsConnection?id=${id}`, {observe: 'response'});
  }


  searchFtp(id: number) {
    return this.http.get<any>(`${this.env.apiUrl}/getOneFtpConnection?id=${id}`, {observe: 'response'});
  }


  searchRdbms(id: number) {
    return this.http.get<any>(`${this.env.apiUrl}/getOneRdbms?id=${id}`, {observe: 'response'});
  }

  searchHive(id: number) {
    return this.http.get<any>(`${this.env.apiUrl}/hive/find-one?id=${id}`, {observe: 'response'});
  }

  /*end*/
}
