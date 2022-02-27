import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthoritiesConstant} from '../../../../authorities.constant';
import {NbDialogService} from "@nebular/theme";

@Component({
  selector: 'ngx-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit {
  @Input() data: any;
  @Output() handleEdit = new EventEmitter<number>();
  @Output() handleDelete = new EventEmitter<number>();
  authoritiesConstant = AuthoritiesConstant

  constructor(private router: Router, public dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    console.log(this.data.title);

  }

  edit() {
    this.handleEdit.emit(this.data.chartCode);
  }

  delete() {
    this.handleDelete.emit(this.data.chartCode);
  }

  navigateToDetail(value) {
    console.log(value);
    this.router.navigate(['/page/group-chart/group-chart-detail'], {
      state: {
        id: this.data.chartCode,
        typeOfViewDetail: this.data.typeOfViewDetail,
        title: value.title
      }
    })
  }
}
