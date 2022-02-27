import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IJob} from '../model/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  apiUrl = environment.apiUrlFe;

  constructor(
    private http: HttpClient
  ) { }

  getJobs(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.apiUrl}/job/getListJobInfo`, { observe: 'response' });
  }

  getJobDetail(id: string): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.apiUrl}/job/${id}`, { observe: 'response' });
  }

  getAssetImage(): Observable<any> {
    return this.http.get('./assets/sample.png', { responseType: 'blob' });
  }

  create(job: IJob): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('jobName', job.jobName.trim());
    formData.append('base64Img', job.base64Img);
    formData.append('fileURL', job.fileURL);
    formData.append('base64File', job.base64File);
    formData.append('description', job.description);
    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/job`, formData, { observe: 'response' });
  }

  update(job: IJob): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('jobId', job.jobId);
    formData.append('jobName', job.jobName.trim());
    formData.append('description', job.description);
    formData.append('base64Img', job.base64Img);
    formData.append('fileURL', job.fileURL);
    formData.append('base64File', job.base64File);
    formData.append('oldFile', job.oldFile);
    formData.append('oldImage', job.oldImage);
    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/editJob`, formData, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.apiUrl}/deleteJob/${id}`, { observe: 'response' });
  }

  download(fileName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/file/${fileName}`, { responseType: 'blob' });
  }
}
