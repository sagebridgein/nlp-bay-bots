import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JsonMessagePageRoutingModule } from './json-message-routing.module';

import { JsonMessagePage } from './json-message.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from 'src/chat21-core/utils/utils';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JsonMessagePageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [JsonMessagePage]
})
export class JsonMessagePageModule {}
