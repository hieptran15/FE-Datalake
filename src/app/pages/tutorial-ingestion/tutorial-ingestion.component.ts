import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-tutorial-ingestion',
  templateUrl: './tutorial-ingestion.component.html',
  styleUrls: ['./tutorial-ingestion.component.scss']
})
export class TutorialIngestionComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  scroll(target: HTMLElement): void {
    target.scrollIntoView({block: 'center', behavior: 'smooth'});
  }
}
