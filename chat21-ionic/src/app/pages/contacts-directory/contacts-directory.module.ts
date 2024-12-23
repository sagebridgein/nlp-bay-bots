import { PresenceComponent } from '../../components/utils/presence/presence.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

import { ContactsDirectoryPageRoutingModule } from './contacts-directory-routing.module';
import { ContactsDirectoryComponent } from '../../components/contacts-directory/contacts-directory.component';

import { ContactsDirectoryPage } from './contacts-directory.page';
// import { ContactsDirectoryService } from '../../services/contacts-directory.service';
// import { TiledeskContactsDirectoryService } from '../../services/tiledesk/tiledesk-contacts-directory.service';


// export function contactsFactory(http: HttpClient) {
//   console.log('contactsFactory: ');
//   return new TiledeskContactsDirectoryService(http);
// }


@NgModule({
  providers: [
  // {
  //   provide: ContactsDirectoryService,
  //   useFactory: contactsFactory,
  //   deps: [HttpClient]
  //  }
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactsDirectoryPageRoutingModule,
    TranslateModule
  ],
  declarations: [
    ContactsDirectoryPage,
    ContactsDirectoryComponent,
    PresenceComponent
  ]
})
export class ContactsDirectoryPageModule {}
