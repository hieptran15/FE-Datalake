import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataBreadcrumbService {
  public siblingData = new Subject<any>();
  public ThreadPerformSR = new Subject<any>();
  public ThreadContentSR = new Subject<string>();
  public srById = new Subject<string>();

  constructor() {
  }

  public getData(): Observable<any> {
    return this.siblingData.asObservable();
  }

  public updateData(data: any): void {
    this.siblingData.next(data);
  }

  public StepNextThreadPerformSR(data: any): void {
    this.ThreadPerformSR.next(data);
  }

  public sendSR(data: string): void {
    this.ThreadContentSR.next(data);
  }

  public callSRById(data: string): void {
    this.srById.next(data);
  }


  // share status button thuc hien sr
  public ShareStatusSR = new BehaviorSubject(false);

  public updateShareStatusSRValue(data: boolean): void {
    this.ShareStatusSR.next(data)
  }
}
