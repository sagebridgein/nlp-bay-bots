import { ScriptService } from './services/scripts/script.service';
import { ConvertRequestToConversation } from './../chat21-core/utils/convertRequestToConversation';
import { LogLevel, PUSH_ENGINE_FIREBASE, PUSH_ENGINE_MQTT } from './../chat21-core/utils/constants';
import { CustomLogger } from 'src/chat21-core/providers/logger/customLogger';
import { NgModule, ErrorHandler, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';


//NATIVE
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from "ngx-logger";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

// COMPONENTS
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// CONFIG
import { environment } from '../environments/environment';
import { CHAT_ENGINE_MQTT, CHAT_ENGINE_FIREBASE, UPLOAD_ENGINE_NATIVE } from '../chat21-core/utils/constants';

// SERVICES
import { AppConfigProvider } from './services/app-config';
import { EventsService } from './services/events-service';
import { WebsocketService } from './services/websocket/websocket.service';

// ABSTRACT SERVICES
import { MessagingAuthService } from 'src/chat21-core/providers/abstract/messagingAuth.service';
import { ConversationHandlerBuilderService } from 'src/chat21-core/providers/abstract/conversation-handler-builder.service';
import { ConversationsHandlerService } from 'src/chat21-core/providers/abstract/conversations-handler.service';
import { ArchivedConversationsHandlerService } from 'src/chat21-core/providers/abstract/archivedconversations-handler.service';
import { ConversationHandlerService } from 'src/chat21-core/providers/abstract/conversation-handler.service';
import { TypingService } from 'src/chat21-core/providers/abstract/typing.service';
import { PresenceService } from 'src/chat21-core/providers/abstract/presence.service';
import { ImageRepoService } from 'src/chat21-core/providers/abstract/image-repo.service';
import { UploadService } from 'src/chat21-core/providers/abstract/upload.service';
import { GroupsHandlerService } from 'src/chat21-core/providers/abstract/groups-handler.service';
import { NotificationsService } from 'src/chat21-core/providers/abstract/notifications.service';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';

// FIREBASE
import { FirebaseInitService } from 'src/chat21-core/providers/firebase/firebase-init-service';
import { FirebaseAuthService } from 'src/chat21-core/providers/firebase/firebase-auth-service';
import { FirebaseConversationHandlerBuilderService } from 'src/chat21-core/providers/firebase/firebase-conversation-handler-builder.service';
import { FirebaseConversationsHandler } from 'src/chat21-core/providers/firebase/firebase-conversations-handler';
import { FirebaseArchivedConversationsHandler } from 'src/chat21-core/providers/firebase/firebase-archivedconversations-handler';
import { FirebaseConversationHandler } from 'src/chat21-core/providers/firebase/firebase-conversation-handler';
import { FirebaseTypingService } from 'src/chat21-core/providers/firebase/firebase-typing.service';
import { FirebasePresenceService } from 'src/chat21-core/providers/firebase/firebase-presence.service';
import { FirebaseImageRepoService } from 'src/chat21-core/providers/firebase/firebase-image-repo';
import { FirebaseUploadService } from 'src/chat21-core/providers/firebase/firebase-upload.service';
import { FirebaseGroupsHandler } from 'src/chat21-core/providers/firebase/firebase-groups-handler';
import { FirebaseNotifications } from 'src/chat21-core/providers/firebase/firebase-notifications';

// MQTT
import { Chat21Service } from 'src/chat21-core/providers/mqtt/chat-service';
import { MQTTAuthService } from 'src/chat21-core/providers/mqtt/mqtt-auth-service';
import { MQTTConversationHandlerBuilderService } from 'src/chat21-core/providers/mqtt/mqtt-conversation-handler-builder.service';
import { MQTTArchivedConversationsHandler } from 'src/chat21-core/providers/mqtt/mqtt-archivedconversations-handler';
import { MQTTConversationsHandler } from 'src/chat21-core/providers/mqtt/mqtt-conversations-handler';
import { MQTTConversationHandler } from 'src/chat21-core/providers/mqtt/mqtt-conversation-handler';
import { MQTTTypingService } from 'src/chat21-core/providers/mqtt/mqtt-typing.service';
import { MQTTPresenceService } from 'src/chat21-core/providers/mqtt/mqtt-presence.service';
import { MQTTGroupsHandler } from '../chat21-core/providers/mqtt/mqtt-groups-handler';
import { MQTTNotifications } from 'src/chat21-core/providers/mqtt/mqtt-notifications';

//NATIVE 
import { NativeUploadService } from 'src/chat21-core/providers/native/native-upload-service';
import { NativeImageRepoService } from './../chat21-core/providers/native/native-image-repo';

//LOGGER SERVICES
import { LocalSessionStorage } from 'src/chat21-core/providers/localSessionStorage';
//APP_STORAGE
import { AppStorageService } from 'src/chat21-core/providers/abstract/app-storage.service';

// PAGES
import { ConversationListPageModule } from './pages/conversations-list/conversations-list.module';
import { ConversationDetailPageModule } from './pages/conversation-detail/conversation-detail.module';
import { LoginPageModule } from './pages/authentication/login/login.module';
import { CreateRequesterPageModule } from './pages/create-requester/create-requester.module';
// MODALS
import { LoaderPreviewPageModule } from './modals/loader-preview/loader-preview.module';
import { CreateTicketPageModule } from './modals/create-ticket/create-ticket.module';
import { CreateCannedResponsePageModule } from './modals/create-canned-response/create-canned-response.module';
import { SendEmailModalModule } from './modals/send-email/send-email.module';
import { SendWhatsappTemplateModalModule } from './modals/send-whatsapp-template/send-whatsapp-template.module';
import { JsonMessagePageModule } from './modals/json-message/json-message.module';
// UTILS
import { ScrollbarThemeModule } from './utils/scrollbar-theme.directive';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConversationInfoModule } from 'src/app/components/conversation-info/conversation-info.module';


// Directives
// import { HtmlEntitiesEncodePipe } from './directives/html-entities-encode.pipe';
// import { MarkedPipe } from './directives/marked.pipe';

import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';
import { Network } from '@ionic-native/network/ngx';
import { WebSocketJs } from './services/websocket/websocket-js';
import { UnassignedConversationsPageModule } from './pages/unassigned-conversations/unassigned-conversations.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapsPageModule } from './modals/maps/maps.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { TriggerEvents } from './services/triggerEvents/triggerEvents';
import { Globals } from './utils/globals';
import { GlobalSettingsService } from './services/global-settings/global-settings.service';
import { BrandService } from './services/brand/brand.service';

// FACTORIES
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');

}

export function authenticationFactory(http: HttpClient, appConfig: AppConfigProvider, chat21Service: Chat21Service, appSorage: AppStorageService) {
  const config = appConfig.getConfig()
  if (config.chatEngine === CHAT_ENGINE_MQTT) {

    chat21Service.config = config.chat21Config;
    chat21Service.initChat();

    const auth = new MQTTAuthService(http, chat21Service, appSorage);

    auth.setBaseUrl(appConfig.getConfig().apiUrl);

    if (config.pushEngine === PUSH_ENGINE_MQTT) {
      // FOR PUSH NOTIFICATIONS INIT FIREBASE APP
      FirebaseInitService.initFirebase(config.firebaseConfig);
    }

    return auth
  } else {

    FirebaseInitService.initFirebase(config.firebaseConfig)
    // console.log('[APP-MOD] FirebaseInitService config ', config)
    const auth = new FirebaseAuthService(http);
    auth.setBaseUrl(config.apiUrl)

    return auth
  }
}

export function conversationsHandlerFactory(chat21Service: Chat21Service, httpClient: HttpClient, appConfig: AppConfigProvider) {

  const config = appConfig.getConfig()
  if (config.chatEngine === CHAT_ENGINE_MQTT) {
    return new MQTTConversationsHandler(chat21Service);
  } else {
    return new FirebaseConversationsHandler(httpClient, appConfig);
  }
}

export function archivedConversationsHandlerFactory(chat21Service: Chat21Service, appConfig: AppConfigProvider) {
  const config = appConfig.getConfig()
  if (config.chatEngine === CHAT_ENGINE_MQTT) {
    return new MQTTArchivedConversationsHandler(chat21Service);
  } else {
    return new FirebaseArchivedConversationsHandler();
  }
}

export function conversationHandlerBuilderFactory(chat21Service: Chat21Service, appConfig: AppConfigProvider) {
  const config = appConfig.getConfig()
  if (config.chatEngine === CHAT_ENGINE_MQTT) {
    return new MQTTConversationHandlerBuilderService(chat21Service);
  } else {
    return new FirebaseConversationHandlerBuilderService();
  }
}

export function conversationHandlerFactory(chat21Service: Chat21Service, appConfig: AppConfigProvider) {
  const config = appConfig.getConfig()
  if (config.chatEngine === CHAT_ENGINE_MQTT) {
    return new MQTTConversationHandler(chat21Service, false);
  } else {
    return new FirebaseConversationHandler(false);
  }
}

export function groupsHandlerFactory(http: HttpClient, chat21Service: Chat21Service, appConfig: AppConfigProvider) {
  const config = appConfig.getConfig()
  if (config.chatEngine === CHAT_ENGINE_MQTT) {
    return new MQTTGroupsHandler(chat21Service)
  } else {
    return new FirebaseGroupsHandler(http, appConfig);
  }
}

export function typingFactory(appConfig: AppConfigProvider) {
  const config = appConfig.getConfig()
  if (config.chatEngine === CHAT_ENGINE_MQTT) {
    return new MQTTTypingService();
  } else {
    return new FirebaseTypingService();
  }
}

export function presenceFactory(chat21Service: Chat21Service, appConfig: AppConfigProvider, webSockerService: WebsocketService) {
  const config = appConfig.getConfig()
  if (config.chatEngine === CHAT_ENGINE_MQTT) {
    return new MQTTPresenceService(chat21Service, webSockerService)
  } else {
    return new FirebasePresenceService();
  }
}

export function imageRepoFactory(appConfig: AppConfigProvider, http: HttpClient) {

  const config = appConfig.getConfig()
  if (config.uploadEngine === UPLOAD_ENGINE_NATIVE) {
    const imageService = new NativeImageRepoService(http)
    imageService.setImageBaseUrl(config.baseImageUrl)
    return imageService
  } else {
    const imageService = new FirebaseImageRepoService(http);
    FirebaseInitService.initFirebase(config.firebaseConfig)
    imageService.setImageBaseUrl(config.baseImageUrl)
    return imageService
  }
}

export function uploadFactory(http: HttpClient, appConfig: AppConfigProvider, appStorage: AppStorageService) {

  const config = appConfig.getConfig()
  if (config.uploadEngine === UPLOAD_ENGINE_NATIVE) {
    const nativeUploadService = new NativeUploadService(http, appStorage)
    nativeUploadService.setBaseUrl(config.baseImageUrl)
    return nativeUploadService
  } else {
    return new FirebaseUploadService();
  }
}

export function notificationsServiceFactory(appConfig: AppConfigProvider, chat21Service: Chat21Service, fcm: FCM) {
  const config = appConfig.getConfig()
  if (config.pushEngine === PUSH_ENGINE_FIREBASE) {
    return new FirebaseNotifications(fcm);
  } else if (config.pushEngine === PUSH_ENGINE_MQTT) {
    return new MQTTNotifications(chat21Service, fcm);
  } else {
    return;
  }
}

const appInitializerFn = (appConfig: AppConfigProvider, brandService: BrandService, logger: NGXLogger) => {
  return async() => {
    let customLogger = new CustomLogger(logger)
    LoggerInstance.setInstance(customLogger)
    if (environment.remoteConfig) {
      await appConfig.loadAppConfig();
    }
    await brandService.loadBrand();
  };
};

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ConversationListPageModule,
    ConversationDetailPageModule,
    UnassignedConversationsPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      // serverLogLevel: NgxLoggerLevel.ERROR,
      timestampFormat: 'HH:mm:ss.SSS',
      enableSourceMaps: false,
      disableFileDetails: true,
      colorScheme: ['purple', 'yellow', 'gray', 'gray', 'red', 'red', 'red'],
      // serverLoggingUrl: 'https://tiledesk-server-pre.herokuapp.com/logs'
    }),
    ScrollbarThemeModule,
    SharedModule,
    
    //LAXY LOADED
    // CreateTicketPageModule,
    // CreateRequesterPageModule,
    // LoaderPreviewPageModule,
    // ConversationInfoModule,
    LoginPageModule,
    // CreateCannedResponsePageModule,
    // SendEmailModalModule,
    // SendWhatsappTemplateModalModule,
    // MapsPageModule,
    // JsonMessagePageModule,
    // GoogleMapsModule
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AppConfigProvider, // https://juristr.com/blog/2018/01/ng-app-runtime-config/
    Globals,
    GlobalSettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigProvider, BrandService, NGXLogger]
    },
    {
      provide: MessagingAuthService,
      useFactory: authenticationFactory,
      deps: [HttpClient, AppConfigProvider, Chat21Service, AppStorageService]
    },
    {
      provide: PresenceService,
      useFactory: presenceFactory,
      deps: [Chat21Service, AppConfigProvider, WebsocketService]
    },
    {
      provide: TypingService,
      useFactory: typingFactory,
      deps: [AppConfigProvider]
    },
    {
      provide: UploadService,
      useFactory: uploadFactory,
      deps: [HttpClient, AppConfigProvider, AppStorageService]
    },
    {
      provide: ConversationsHandlerService,
      useFactory: conversationsHandlerFactory,
      deps: [Chat21Service, HttpClient, AppConfigProvider]
    },
    {
      provide: ArchivedConversationsHandlerService,
      useFactory: archivedConversationsHandlerFactory,
      deps: [Chat21Service, AppConfigProvider]
    },
    {
      provide: ConversationHandlerService,
      useFactory: conversationHandlerFactory,
      deps: [Chat21Service, AppConfigProvider]
    },
    {
      provide: GroupsHandlerService,
      useFactory: groupsHandlerFactory,
      deps: [HttpClient, Chat21Service, AppConfigProvider]
    },

    {
      provide: ImageRepoService,
      useFactory: imageRepoFactory,
      deps: [AppConfigProvider, HttpClient]
    },
    {
      provide: ConversationHandlerBuilderService,
      useFactory: conversationHandlerBuilderFactory,
      deps: [Chat21Service, AppConfigProvider]
    },
    {
      provide: NotificationsService,
      useFactory: notificationsServiceFactory,
      deps: [AppConfigProvider, Chat21Service, FCM]
    },
    {
      provide: AppStorageService,
      useClass: LocalSessionStorage
    },
    StatusBar,
    SplashScreen,
    Keyboard,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EventsService,
    Chooser,
    Chat21Service,
    WebSocketJs,
    ConvertRequestToConversation,
    ScriptService,
    FCM,
    InAppBrowser,
    Deeplinks,
    TriggerEvents
  ]
})
export class AppModule { }

