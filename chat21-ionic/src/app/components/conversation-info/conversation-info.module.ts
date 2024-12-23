import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoContentComponent } from './info-content/info-content.component';
import { InfoSupportGroupComponent } from './info-support-group/info-support-group.component';
import { InfoDirectComponent } from './info-direct/info-direct.component';
import { InfoGroupComponent } from './info-group/info-group.component';
import { AdvancedInfoAccordionComponent } from './advanced-info-accordion/advanced-info-accordion.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    InfoContentComponent,
    InfoSupportGroupComponent,
    InfoDirectComponent,
    InfoGroupComponent,
    AdvancedInfoAccordionComponent
  ],
  exports:[
    InfoContentComponent,
    InfoSupportGroupComponent,
    InfoDirectComponent,
    InfoGroupComponent,
    AdvancedInfoAccordionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule
  ]
})
export class ConversationInfoModule { }
