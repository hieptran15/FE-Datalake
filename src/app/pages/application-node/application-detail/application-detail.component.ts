import {Component, Input, OnInit} from '@angular/core';
import {IApplicationModel} from '../../../@core/model/application.model';
import {Page} from '../../../@core/model/page.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'ngx-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss'],
})
export class ApplicationDetailComponent implements OnInit {
  columns = [
    {name: 'STT', prop: 'id', flexGrow: 0.5},
    {name: 'Tên ứng dụng', prop: 'itemName', flexGrow: 3},
    {name: 'Loại ứng dụng', prop: 'itemValue', flexGrow: 3},
    {name: 'Hành động', prop: 'action_btn', flexGrow: 2},
  ];
  @Input() page = new Page();
  application: IApplicationModel[] = new Array<IApplicationModel>();
  constructor(protected http: HttpClient) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }


  ngOnInit(): void {
    this.query().subscribe(res => {
      this.application = res;
    });
  }

  query(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}cat-items`);
  }
}
