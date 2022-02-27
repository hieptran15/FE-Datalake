import {Component} from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div class="edit-footer">
      <span class="created-by" style="font-size: 12px">
<!--      Created with ♥ by <b><a href="https://akveo.page.link/8V2f" target="_blank">Akveo</a></b> 2019-->
        {{'footer.title' | translate}}
    </span>
    </div>
  `,
})
export class FooterComponent {
}
