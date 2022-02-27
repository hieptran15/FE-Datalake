import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OpenRequestComponent} from './open-request/open-request.component';
import {SupportRequestComponent} from './support-request.component';


const routes: Routes = [
  {
    path: '',
    component: SupportRequestComponent
  },
  {
    path: 'open-request',
    component: OpenRequestComponent
  },
  {
    path: 'request-details/:id',
    component: OpenRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRequestRoutingModule {
}
