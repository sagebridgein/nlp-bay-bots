import { LoggerInstance } from './../../../chat21-core/providers/logger/loggerInstance';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { NetworkService } from './../../services/network-service/network.service';
import { Component, OnInit } from '@angular/core';
import { CustomTranslateService } from 'src/chat21-core/providers/custom-translate.service';

@Component({
  selector: 'app-network-offline',
  templateUrl: './network-offline.component.html',
  styleUrls: ['./network-offline.component.scss'],
})
export class NetworkOfflineComponent implements OnInit {

  public isOnline: boolean = true;
  public translationsMap: Map<string, string>;

  private logger: LoggerService = LoggerInstance.getInstance();

  constructor(
    private networkService: NetworkService,
    public translateService: CustomTranslateService,
  ) { }

  ngOnInit() {
    
    this.watchToConnectionStatus();
  }

  watchToConnectionStatus(){
    this.networkService.checkInternetFunc().subscribe((isOnline) => {
      // this.checkInternet = isOnline
      this.setTranlastions();
      this.logger.log('[NETWORK_CONN-COMP] - watchToConnectionStatus - isOnline', isOnline)
      this.isOnline = isOnline
    })
  }

  setTranlastions(){
    let keys= ['ALERT_NO_CONNECTION']
    this.translationsMap =this.translateService.translateLanguage(keys)
  }

}
