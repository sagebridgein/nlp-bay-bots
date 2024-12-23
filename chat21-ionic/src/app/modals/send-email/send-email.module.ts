import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendEmailPageRoutingModule } from './send-email-routing.module';

import { SendEmailModal } from './send-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendEmailPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SendEmailModal]
})
export class SendEmailModalModule {}
