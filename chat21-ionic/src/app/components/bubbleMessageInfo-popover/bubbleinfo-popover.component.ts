import { LogLevel } from './../../../chat21-core/utils/constants';
import { PopoverController } from '@ionic/angular';
import { LoggerInstance } from './../../../chat21-core/providers/logger/loggerInstance';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { MessageModel } from './../../../chat21-core/models/message';
import { Component, Input, OnInit } from '@angular/core';
import { CustomTranslateService } from 'src/chat21-core/providers/custom-translate.service';

@Component({
  selector: 'ion-bubbleinfo-popover',
  templateUrl: './bubbleinfo-popover.component.html',
  styleUrls: ['./bubbleinfo-popover.component.scss'],
})
export class BubbleInfoPopoverComponent implements OnInit {

  @Input() message: MessageModel
  @Input() logLevel: number;

  LogLevel = LogLevel
  
  public translationsMap: Map<string, string>;
  private logger: LoggerService = LoggerInstance.getInstance()
  
  constructor(
    private ctr: PopoverController,
    private customTranslateService: CustomTranslateService,
  ) { }

  ngOnInit() {
    this.logger.debug('[BUBBLE-INFO-POPOVER] ngOnInit message data:', this.message)
    this.initTranslations()
  }

  onClose(){
    this.ctr.dismiss()
  }

  initTranslations(){
    let keys= [
      "AddAsCannedResponse",
      "COPY",
      "JSON_RESPONSE"
    ]
    this.translationsMap = this.customTranslateService.translateLanguage(keys)
  
  }

  onClickOption(option: 'copy' | 'addCanned' | 'jsonInfo'){
    this.logger.debug('[BUBBLE-INFO-POPOVER] clicked option:', option)
    this.ctr.dismiss({option: option})
  }

}
