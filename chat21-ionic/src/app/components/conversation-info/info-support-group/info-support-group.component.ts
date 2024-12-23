import { Component, OnInit, Input } from '@angular/core';
import { EventsService } from 'src/app/services/events-service';
import { AppStorageService } from 'src/chat21-core/providers/abstract/app-storage.service';

// Logger
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';
@Component({
  selector: 'app-info-support-group',
  templateUrl: './info-support-group.component.html',
  styleUrls: ['./info-support-group.component.scss'],
})
export class InfoSupportGroupComponent implements OnInit {

  @Input() urlConversationSupportGroup: any;

  private logger: LoggerService = LoggerInstance.getInstance();
  constructor(
    private events : EventsService
  ) { }

  ngOnInit() {
    this.logger.log('[InfoSupportGroupComponent] - urlConversationSupportGroup: ', this.urlConversationSupportGroup);
    this.events.subscribe('style', (data)=>this.loadStyle(data))
  }

  ngOnDestroy() {
    // this.logger.log('ngOnDestroy ConversationDetailPage: ');
    this.logger.log('[InfoSupportGroupComponent] - ngOnDestroy ');

  }

  onLoad(iframe){
    let styleData = localStorage.getItem('custom_style')
    this.logger.log('[InfoSupportGroupComponent] onLoad style', styleData)
    if(styleData && styleData !== 'undefined'){
      this.loadStyle(JSON.parse(styleData))
    }
  }
  async loadStyle(data){
    var iframeWin = <HTMLIFrameElement>document.getElementById("iframeConsole")
    if(!data || !data.parameter){
      let className = iframeWin.contentDocument.body.className.replace(new RegExp(/style-\S*/gm), '')
      iframeWin.contentDocument.body.className = className
      iframeWin.contentWindow.document.body.classList.remove('light')
      iframeWin.contentWindow.document.body.classList.remove('dark')
      iframeWin.contentWindow.document.body.classList.remove('custom')
      let link = iframeWin.contentWindow.document.getElementById('themeCustom');
      if(link){
        link.remove();
      }
      return;
    } 

    // Create link
    let link = iframeWin.contentWindow.document.createElement('link');
    link.id= 'themeCustom'
    link.href = data.parameter;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media='all';
    
    this.logger.log('[InfoSupportGroupComponent] loadStyle element', link, iframeWin.contentWindow.document)
    let head = iframeWin.contentWindow.document.getElementsByTagName('head')[0];
    head.appendChild(link);
    iframeWin.contentWindow.document.body.classList.add(data.type) //ADD class to body element as theme type ('light', 'dark', 'custom')
    return;
  }

}
