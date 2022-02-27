import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {createRequestOption} from '../../utils/request-util';

@Injectable({
  providedIn: 'root'
})
export class HdfsService {
  apiUrlFe = environment.apiUrlFe;
  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) {
  }

  getUserHdfs(): Observable<any> {
    console.log(this.apiUrl);
    return this.http.get(`${this.apiUrl}/browse-hdfs/getUserHdfs`, { observe: 'response'});
  }

  getClusters(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlFe}/clusters`, {observe: 'response'});
  }

  getHdfsByPath(host: string, path: string): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.apiUrlFe}/browse-hdfs/${host}/hdfs?path=/${path}`, {observe: 'response'});
  }

  getSize(host: string, username: string, path: string): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.apiUrlFe}/browse-hdfs/${host}/${username}/getSize?path=${path}`, {observe: 'response'});
  }

  getQuota(host: string, username: string, path: string): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.apiUrlFe}/browse-hdfs/${host}/${username}/getQuota?path=${path}`, {observe: 'response'});
  }

  delete(address: string, path: string): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('fsAddress', address);
    formData.append('srcPath', path);
    return this.http.post<HttpResponse<any>>(`${this.apiUrlFe}/fs-services/moveToTrash`, formData, {observe: 'response'});
  }

  newFolder(address: string, folderName: string, desPath: string): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('fsAddress', address);
    formData.append('folderName', folderName);
    formData.append('desPath', desPath);
    return this.http.post<HttpResponse<any>>(`${this.apiUrlFe}/fs-services/createFolder`, formData, {observe: 'response'});
  }

  moveTo(address: string, path: string, desPath: string): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('fsAddress', address);
    formData.append('srcPath', path);
    formData.append('desPath', desPath);
    return this.http.post<HttpResponse<any>>(`${this.apiUrlFe}/fs-services/move`, formData, {observe: 'response'});
  }

  copyTo(address: string, path: string, desPath: string): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('fsAddress', address);
    formData.append('srcPath', path);
    formData.append('desPath', desPath);
    return this.http.post<HttpResponse<any>>(`${this.apiUrlFe}/fs-services/copy`, formData, {observe: 'response'});
  }

  changePermission(address: string, path: string, name: string): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('fsAddress', address);
    formData.append('srcPath', path);
    formData.append('name', name);
    return this.http.post<HttpResponse<any>>(`${this.apiUrlFe}/fs-services/chmod`, formData, {observe: 'response'});
  }

  newFile(fsAddress: string, desPath: string, fileName: string, fileContent: string): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('fsAddress', fsAddress);
    formData.append('desPath', desPath);
    formData.append('fileName', fileName);
    formData.append('content', fileContent);
    return this.http.post<HttpResponse<any>>(`${this.apiUrlFe}/fs-services/createFile`, formData, {observe: 'response'});
  }
}
