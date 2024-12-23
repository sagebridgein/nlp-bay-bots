import { PopoverController } from '@ionic/angular';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BubbleInfoPopoverComponent } from 'src/app/components/bubbleMessageInfo-popover/bubbleinfo-popover.component';
import { MessageModel } from 'src/chat21-core/models/message';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';

@Component({
  selector: 'chat-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {

  @Input() message: MessageModel;
  @Input() logLevel: number;
  @Output() onOptionsMessage = new EventEmitter<{option: string, message: MessageModel}>();

  private logger: LoggerService = LoggerInstance.getInstance()
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  onClickOptionsMessage(event, message){
      this.logger.log('[BUBBLE-MESSAGE] - onClickOptionsMessage', message);
      this.presentPopover(event, message)
  }
  
  
  async presentPopover(ev: any, message: MessageModel) {
    const attributes = {
      message: message,
      logLevel: this.logLevel,
      conversationWith: message.recipient
    }
    const popover = await this.popoverController.create({
      component: BubbleInfoPopoverComponent,
      cssClass: 'info-popover',
      componentProps: attributes,
      event: ev,
      translucent: true,
      keyboardClose: true,
      showBackdrop: false
    });
    popover.onDidDismiss().then((dataReturned: any) => {
      this.logger.log('[BUBBLE-MESSAGE] presentPopover dismissed. Returned value::', dataReturned.data)
      if(dataReturned.data){
        this.onOptionsMessage.emit({option: dataReturned.data.option, message: message})
      }
    })

    return await popover.present();
  }

}
