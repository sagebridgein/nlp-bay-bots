
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SendWhatsappTemplatePageRoutingModule } from './send-whatsapp-template-routing.module';
import { SendWhatsappTemplateModal } from './send-whatsapp-template.page';
import { TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/chat21-core/utils/utils';
import { HttpClient } from '@angular/common/http';
import { MarkedPipe } from 'src/app/directives/marked.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendWhatsappTemplatePageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [SendWhatsappTemplateModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SendWhatsappTemplateModalModule {}
