import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExportFileModel} from '../model/exportFile.model';
import {createRequestOption} from '../../utils/request-util';

@Injectable({
  providedIn: 'root'
})
export class HdfsFileService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
  }

  resetMode(): Observable<any> {
    return this.http.post(`${this.apiUrl}/resetMode`, {observe: 'response'});
  }

  getDataFromServer(exportFileModel: ExportFileModel): Observable<any> {

    return this.http.post(`${this.apiUrl}/getDataFromServer`, exportFileModel, {observe: 'response'});
  }

  writeFile(multipartFile: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/writeFile`, multipartFile, {observe: 'response'});
  }

  downloadFile(file): Observable<any> {
    const options = createRequestOption({file});
    return this.http.get(`${this.apiUrl}/file`, {responseType: 'blob', params: options});
  }
}
