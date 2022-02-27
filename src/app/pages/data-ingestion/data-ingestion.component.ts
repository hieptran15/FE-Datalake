import {Component, OnInit} from '@angular/core';
import {EnvService} from '../../env.service';

@Component({
  selector: 'ngx-data-ingestion',
  templateUrl: './data-ingestion.component.html',
  styleUrls: ['./data-ingestion.component.scss']
})
export class DataIngestionComponent implements OnInit {
  constructor(
    private a: EnvService
  ) {

    if (a.enableDebug) {
    }
  }

  ngOnInit(): void {
  }

  checkActiveRoute(params) {
    const pathname = window.location.pathname;
    return pathname.includes(params);
  }
}
