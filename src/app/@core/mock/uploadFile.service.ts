import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExportFileModel} from '../model/exportFile.model';
import {createRequestOption} from '../../utils/request-util';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
  }

  getListServer(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getListServer`, {observe: 'response'});
  }

  getPathFolders(serverListSelected: string): Observable<any> {
    const options = createRequestOption({serverListSelected});
    return this.http.get(`${this.apiUrl}/getListPath`, {observe: 'response', params: options});
  }

  uploadFile(multipartFile: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/uploadFileToServer`, multipartFile, {observe: 'response'});
  }

  getLog(logAll): Observable<any> {
    const options = createRequestOption({logAll});
    return this.http.get(`${this.apiUrl}/getLog`, {observe: 'response', params: options});
  }

  reset(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cleanTempFile`, {observe: 'response'});
  }

  checkHierarchy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkHierarchy`, {observe: 'response'});
  }

  getFileName(form: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/getListFileName`, form, {observe: 'response'});
  }

  downloadFile(form: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/getDataFile`, form, {responseType: 'blob'});
  }
}
