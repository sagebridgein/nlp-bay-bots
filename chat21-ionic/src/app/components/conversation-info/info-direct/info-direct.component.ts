import { Component, OnInit, AfterViewInit, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ImageRepoService } from 'src/chat21-core/providers/abstract/image-repo.service';

// Logger
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';

@Component({
  selector: 'app-info-direct',
  templateUrl: './info-direct.component.html',
  styleUrls: ['./info-direct.component.scss'],
})
export class InfoDirectComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() member: any;
  @Input() translationMap: Map<string, string>;
  @Input() conversationWith: string;

  advancedAttributes: Array<any> = [];
  private logger: LoggerService = LoggerInstance.getInstance();

  constructor(
    public imageRepoService: ImageRepoService
  ) {
    this.logger.log('InfoDirectComponent - constructor');
   }

  ngOnInit() {
    this.logger.log('InfoDirectComponent - ngOnInit');
  }

  ngAfterViewInit() {
    this.logger.log('InfoDirectComponent - ngAfterViewInit');
    this.logger.log('InfoDirectComponent - member', this.member);
    this.logger.log('InfoDirectComponent - conversationWith', this.conversationWith);
  }

  ngOnDestroy() {
    // this.logger.log('ngOnDestroy ConversationDetailPage: ');
    this.logger.log('InfoDirectComponent - ngOnDestroy ' );
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }

  ngOnChanges(){
    if(this.member){
      this.initialize();
      this.member.imageurl = this.imageRepoService.getImagePhotoUrl(this.conversationWith)
    }
  }

  /** */
  initialize() {
    this.logger.log('InfoDirectComponent - initialize');
    if(this.advancedAttributes.filter(el => el.value === this.conversationWith).length > 0){
      return;
    }
    this.advancedAttributes.push({key: "USER_ID", value: this.conversationWith, icon: 'code'})
    this.logger.log('InfoDirectComponent - advancedAttributes' , this.advancedAttributes);
  }

  openInfoAdvancedPage() {
    // openInfoAdvancedPage
  }

}
