import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JsonMessagePage } from './json-message.page';

const routes: Routes = [
  {
    path: '',
    component: JsonMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JsonMessagePageRoutingModule {}
