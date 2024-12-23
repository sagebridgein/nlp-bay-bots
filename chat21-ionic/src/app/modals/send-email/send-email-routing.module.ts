import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendEmailModal } from './send-email.page';

const routes: Routes = [
  {
    path: '',
    component: SendEmailModal
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendEmailPageRoutingModule {}
