import { TooltipDirective } from './../directives/tooltip.directive';
import { OptionsComponent } from './../chatlib/conversation-detail/message/options/options.component';
import { HeaderConversationsListUnassigned } from './../components/conversations-list/header-conversations-list-unassigned/header-conversations-list-unassigned.component';
import { NavbarComponent } from './../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NetworkOfflineComponent } from './../components/network-offline/network-offline.component';
import { ContactsDirectoryComponent } from './../components/contacts-directory/contacts-directory.component';
import { HtmlComponent } from './../chatlib/conversation-detail/message/html/html.component';

import { TextComponent } from '../chatlib/conversation-detail/message/text/text.component';
import { ReturnReceiptComponent } from '../chatlib/conversation-detail/message/return-receipt/return-receipt.component';
import { InfoMessageComponent } from '../chatlib/conversation-detail/message/info-message/info-message.component';
import { ImageComponent } from '../chatlib/conversation-detail/message/image/image.component';
import { FrameComponent } from '../chatlib/conversation-detail/message/frame/frame.component';
import { ActionButtonComponent } from '../chatlib/conversation-detail/message/buttons/action-button/action-button.component';
import { LinkButtonComponent } from '../chatlib/conversation-detail/message/buttons/link-button/link-button.component';
import { TextButtonComponent } from '../chatlib/conversation-detail/message/buttons/text-button/text-button.component';
import { BubbleMessageComponent } from '../chatlib/conversation-detail/message/bubble-message/bubble-message.component';
import { ConversationContentComponent } from '../chatlib/conversation-detail/conversation-content/conversation-content.component';
import { IonListConversationsComponent } from '../chatlib/list-conversations-component/ion-list-conversations/ion-list-conversations.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AvatarProfileComponent } from 'src/app/components/utils/avatar-profile/avatar-profile.component';
import { HeaderConversationsList } from 'src/app/components/conversations-list/header-conversations-list/header-conversations-list.component';
import { HeaderConversationsListArchived } from 'src/app/components/conversations-list/header-conversations-list-archived/header-conversations-list-archived.component';

import { UserPresenceComponent } from 'src/app/components/utils/user-presence/user-presence.component';
import { UserTypingComponent } from 'src/chat21-core/utils/user-typing/user-typing.component';
import { ListConversationsComponent } from '../chatlib/list-conversations-component/list-conversations/list-conversations.component';
import { MomentModule } from 'ngx-moment';
import { AvatarComponent } from 'src/app/chatlib/conversation-detail/message/avatar/avatar.component';
import { MarkedPipe } from 'src/app/directives/marked.pipe';
import { AutofocusDirective } from 'src/app/directives/autofocus.directive';
import { HtmlEntitiesEncodePipe } from 'src/app/directives/html-entities-encode.pipe';
import { IonConversationDetailComponent } from 'src/app/chatlib/conversation-detail/ion-conversation-detail/ion-conversation-detail.component';
import { InfoContentComponent } from 'src/app/components/conversation-info/info-content/info-content.component';
import { InfoSupportGroupComponent } from 'src/app/components/conversation-info/info-support-group/info-support-group.component';
import { InfoDirectComponent } from 'src/app/components/conversation-info/info-direct/info-direct.component';
import { AdvancedInfoAccordionComponent } from 'src/app/components/conversation-info/advanced-info-accordion/advanced-info-accordion.component';
import { InfoGroupComponent } from 'src/app/components/conversation-info/info-group/info-group.component';
import { MessageAttachmentComponent } from 'src/app/chatlib/conversation-detail/message/message-attachment/message-attachment.component';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { SidebarUserDetailsComponent } from 'src/app/components/sidebar-user-details/sidebar-user-details.component';
import { ProjectItemComponent } from 'src/app/components/project-item/project-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SafeHtmlPipe } from '../directives/safe-html.pipe';
import { AudioComponent } from '../chatlib/conversation-detail/message/audio/audio.component';

// import { MessageTextAreaComponent } from '../components/conversation-detail/message-text-area/message-text-area.component'; // MessageTextAreaComponent is part of the declarations ConversationDetailPageModule

@NgModule({
  declarations: [
     //CONVERSATION_LIST
    //  ListConversationsComponent,
    //  IonListConversationsComponent,
    //  HeaderConversationsList,
    //  HeaderConversationsListArchived,
    //  HeaderConversationsListUnassigned,
    //  ProjectItemComponent,
     //CONVERSATION_DETAIL
    //  IonConversationDetailComponent,
    //  ConversationContentComponent,
    //  UserTypingComponent,
    //  MessageAttachmentComponent,
    //  TextButtonComponent,
    //  LinkButtonComponent,
    //  ActionButtonComponent,
    //  InfoMessageComponent,
    //  AvatarComponent,
    //  BubbleMessageComponent,
    //  FrameComponent,
    //  ImageComponent,
    //  AudioComponent,
    //  ReturnReceiptComponent,
    //  TextComponent,
    //  OptionsComponent,
    //  HtmlComponent,

     //CONVERSATION_DETAIL_INFO
    //  InfoContentComponent,
    //  InfoSupportGroupComponent,
    //  InfoDirectComponent,
    //  InfoGroupComponent,
    //  AdvancedInfoAccordionComponent,
 
     //NAVBAR - SIDEBAR
     NavbarComponent,
     SidebarComponent,
     SidebarUserDetailsComponent,
    
     //DIRECTIVES
     AutofocusDirective,
     TooltipDirective,
     MarkedPipe,
     HtmlEntitiesEncodePipe,
     SafeHtmlPipe,
 


     AvatarProfileComponent,
     UserPresenceComponent,
     ImageViewerComponent,
     NetworkOfflineComponent
  ],
  exports: [
    //CONVERSATION_LIST
    // ListConversationsComponent,
    // IonListConversationsComponent,
    // HeaderConversationsList,
    // HeaderConversationsListArchived,
    // HeaderConversationsListUnassigned,
    // ProjectItemComponent,
    //CONVERSATION_DETAIL
    // IonConversationDetailComponent,
    // ConversationContentComponent,
    // UserTypingComponent,
    // TextButtonComponent,
    // LinkButtonComponent,
    // ActionButtonComponent,
    // InfoMessageComponent,
    // AvatarComponent,
    // BubbleMessageComponent,
    // MessageAttachmentComponent,
    // FrameComponent,
    // ImageComponent,
    // AudioComponent,
    // ReturnReceiptComponent,
    // TextComponent,
    // OptionsComponent,
    //CONVERSATION_DETAIL_INFO
    // InfoContentComponent,
    // InfoSupportGroupComponent,
    // InfoDirectComponent,
    // InfoGroupComponent,
    
    //NAVBAR - SIDEBAR
    NavbarComponent,
    SidebarComponent,
    SidebarUserDetailsComponent,
    

   //DIRECTIVES
    AutofocusDirective,
    TooltipDirective,
    MarkedPipe,
    HtmlEntitiesEncodePipe,
    SafeHtmlPipe,

    //COMMON COMPONENTS
    AvatarProfileComponent,
    UserPresenceComponent,
    ImageViewerComponent,
    NetworkOfflineComponent

  ],
  imports: [
    MatTooltipModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    CommonModule,
    IonicModule,
    MomentModule,
    NgSelectModule,
    FormsModule,

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
