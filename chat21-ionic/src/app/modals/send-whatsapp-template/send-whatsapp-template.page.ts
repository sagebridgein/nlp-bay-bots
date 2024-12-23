import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { TemplatesService } from 'src/app/services/templates/templates.service';
import { UploadModel } from 'src/chat21-core/models/upload';
import { UserModel } from 'src/chat21-core/models/user';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { UploadService } from 'src/chat21-core/providers/abstract/upload.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';
import { MapsPage } from '../maps/maps.page';
import { isObjectEmpty } from 'src/chat21-core/utils/utils';

@Component({
  selector: 'send-whatsapp-template-modal',
  templateUrl: './send-whatsapp-template.page.html',
  styleUrls: ['./send-whatsapp-template.page.scss'],
})
export class SendWhatsappTemplateModal implements OnInit {

  @Input() loggedUser: UserModel;
  @Input() enableBackdropDismiss: any;
  @Input() conversationWith: string;
  @Input() projectId: string;
  @Input() stylesMap: Map<string, string>;
  @Input() translationMap: Map<string, string>;
  @Output() onSubmitForm = new EventEmitter<{}>();

  selectionView: Boolean = true;
  editTemplateView: Boolean = false;
  displayError: Boolean = false;
  labelError: string;
  templates = [];

  selected_template: any;
  header_component: any;
  body_component: any;
  footer_component: any;
  buttons_component: any;
  url_button_component: any;
  url_button_component_temp: any;
  header_component_temp: any;
  body_component_temp: any;
  body_params = [];
  header_params = [];
  url_button_params = [];


  previsioning_url: string;
  sanitizedUrl: any;

  sendButtonDisabled: Boolean = true;
  display_loader: Boolean = true;
  invalidUrl: Boolean = false;
  fileUploadAccept: string = "image/*";

  displayFileUploaded: Boolean = false;
  fileUploadedName: string;
  src: any;
  displayMapModal: Boolean = true;

  private logger: LoggerService = LoggerInstance.getInstance()

  constructor(
    private templatesService: TemplatesService,
    public viewCtrl: ModalController,
    public sanitizer: DomSanitizer,
    private uploadService: UploadService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.logger.log('[SEND-TEMPLATE-MODAL] Hello!')
    this.getTemplates();
  }

  getTemplates() {
    this.templatesService.getTemplatesList(this.projectId).subscribe((res: Array<[]>) => {
      this.logger.debug('[SEND-TEMPLATE-MODAL] subscribe to getTemplates API response -->', res)
      //this.selectionView = true;
      this.templates = res;
    }, (error) => {
      this.logger.error('[SEND-TEMPLATE-MODAL] subscribe to getTemplates API  - ERROR  ', error)
      this.displayError = true;
      this.display_loader = false;
      if (error.error && error.error.code === '01') {
        this.labelError = this.translationMap.get('WHATSAPP.ERROR_WHATSAPP_NOT_INSTALLED')
      } else {
        this.labelError = this.translationMap.get('WHATSAPP.ERROR_WHATSAPP_GENERIC_ERROR')
      }
    }, () => {
      this.display_loader = false;
      this.logger.log('[SEND-TEMPLATE-MODAL] subscribe to getTemplates API CALL /* COMPLETE */')
    })
  }

  selectTemplate(template_id) {
    this.selected_template = this.templates.find(t => t.id == template_id);
    this.logger.debug('[SEND-TEMPLATE-MODAL] Selected template -->', this.selected_template);
    this.selectionView = false;
    this.editTemplateView = true;

    this.header_component = this.selected_template.components.find(c => c.type === 'HEADER');
    this.body_component = this.selected_template.components.find(c => c.type === 'BODY');
    this.footer_component = this.selected_template.components.find(c => c.type === 'FOOTER');
    this.buttons_component = this.selected_template.components.find(c => c.type === 'BUTTONS');
    if (this.buttons_component) {
      this.url_button_component = this.buttons_component.buttons.find(c => c.type === 'URL')
    }

    if (this.header_component) {
      this.header_component_temp = JSON.parse(JSON.stringify(this.header_component));
      if (this.header_component.example) {

        if (this.header_component.example.header_text) {
          this.header_component.example.header_text.forEach((p, i) => {
            this.header_params.push({ index: i + 1, type: "text", text: null })
          })
        }

        if (this.header_component.example.header_handle) {
          if (this.header_component.format === 'IMAGE') {
            this.header_component.example.header_handle.forEach((p, i) => {
              this.header_params.push({ index: i + 1, type: this.header_component.format, image: { link: null } })
            })
          }
          if (this.header_component.format === 'DOCUMENT') {
            this.fileUploadAccept = ".pdf"
            this.src = this.header_component.example.header_handle[0];
            this.sanitizeUrl(this.header_component.example.header_handle[0]);
            this.header_component.example.header_handle.forEach((p, i) => {
              this.header_params.push({ index: i + 1, type: this.header_component.format, document: { link: null } })
            })
          }
        }

      } else {

        if (this.header_component.format === 'LOCATION') {
          this.header_params.push({ index: 1, type: this.header_component.format, location: { latitude: null, longitude: null, name: null, address: null } })
        }
        else {
          this.logger.log("[SEND-TEMPLATE-MODAL] Check unrecognized Header: ", this.header_component)
          //this.sendButtonDisabled = false;
        }

      }
    }

    if (this.body_component) {
      this.body_component_temp = JSON.parse(JSON.stringify(this.body_component));
      if (this.body_component.example) {
        this.body_component.example.body_text[0].forEach((p, i) => {
          this.body_params.push({ index: i + 1, type: "text", text: null })
        })
      }
      // else {
      //   //this.sendButtonDisabled = false;
      // }
    }

    if (this.url_button_component) {
      this.url_button_component_temp = JSON.parse(JSON.stringify(this.url_button_component));
      if (this.url_button_component.example) {
        this.url_button_component.example.forEach((p, i) => {
          this.url_button_params.push({ index: i + 1, type: "text", text: null })
          this.previsioning_url = this.url_button_component.url;
        })
      }
      // else {
      //   this.sendButtonDisabled = false;
      // }
    }

    this.checkParameters();

  }

  sanitizeUrl(url) {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onParamBodyChange(event, param_num) {
    this.body_component = JSON.parse(JSON.stringify(this.body_component_temp));
    this.body_params[param_num - 1].text = event;
    this.body_params.forEach((param, i) => {
      let index = i + 1;
      let regex = '{{' + index + '}}';
      if (param.text) {
        this.body_component.text = this.body_component.text.replace(regex, param.text);
      }
    })
    this.checkParameters();
  }

  onParamHeaderChange(event, param_num) {
    this.header_component = JSON.parse(JSON.stringify(this.header_component_temp));
    if (this.header_params[param_num - 1].type === 'TEXT') {
      this.header_params[param_num - 1].text = event;
    }
    if (this.header_params[param_num - 1].type === 'IMAGE') {
      this.header_params[param_num - 1].image.link = event;
      this.invalidUrl = false;
    }
    if (this.header_params[param_num - 1].type === 'DOCUMENT') {
      this.header_params[param_num - 1].document.link = event;
      this.sanitizeUrl(event);
      this.invalidUrl = false;
    }

    this.header_params.forEach((param, i) => {
      let index = i + 1;
      let regex = '{{' + index + '}}';
      if (param.text) {
        this.header_component.text = this.header_component.text.replace(regex, param.text);
      }
    })
    this.checkParameters();
  }

  onParamButtonChange(event, param_num) {
    this.url_button_component = JSON.parse(JSON.stringify(this.url_button_component_temp));
    this.url_button_params[param_num - 1].text = event;
    this.url_button_params.forEach((param, i) => {
      let index = i + 1;
      let regex = '{{' + index + '}}';
      if (param.text) {
        this.url_button_component.url = this.url_button_component.url.replace(regex, param.text);
      }
      let button_index = this.buttons_component.buttons.findIndex(b => b.type === 'URL');
      this.buttons_component.buttons[button_index] = this.url_button_component;
      this.previsioning_url = this.url_button_component.url;
    })
  }

  backToSelection() {
    this.selectionView = true;
    this.editTemplateView = false;
    this.body_params = [];
    this.header_params = [];
    this.url_button_params = [];
    this.header_component = null;
    this.body_component = null;
    this.footer_component = null;
    this.buttons_component = null;
    this.header_component_temp = null;
    this.body_component_temp = null;
    this.url_button_component = null;
    this.url_button_component_temp = null;
  }

  sendTemplate() {
    const new_header_params = this.header_params.map(({ index, ...keepAttrs }) => keepAttrs)
    const new_body_params = this.body_params.map(({ index, ...keepAttrs }) => keepAttrs)
    const new_buttons_param = this.url_button_params.map(({ index, ...keepAttrs }) => keepAttrs)
    let attachment = {
      type: "wa_template",
      template: {
        name: this.selected_template.name,
        language: this.selected_template.language,
        params: {
          header: new_header_params,
          body: new_body_params,
          buttons: new_buttons_param
        }
      }
    }

    /** REMOVE EMPTY PROPERTY BEFORE SEND */
    if(new_header_params.length === 0){
      delete attachment.template.params.header
    }
    if(new_body_params.length === 0){
      delete attachment.template.params.body
    }
    if(new_buttons_param.length === 0){
      delete attachment.template.params.buttons
    }
    if(isObjectEmpty(attachment.template.params)){
      delete attachment.template.params
    }
    

    let data = {
      attachment: attachment,
      text: this.body_component.text
    }
    this.logger.log('[SEND-TEMPLATE-MODAL] Send message with following attachment -->', data)
    this.viewCtrl.dismiss(data);
  }

  onHeaderImageError(event) {
    this.invalidUrl = true;
    this.sendButtonDisabled = true;
    event.target.src = this.header_component.example.header_handle[0];
  }

  onHeaderDocumentError(event) {
    this.logger.log("ERROR EVENT CATCHED - onHeaderDocumentError");
  }

  // evaluate async
  onFileSelected(e: any) {
    this.displayFileUploaded = true;
    this.fileUploadedName = e.target.files.item(0).name;
    this.logger.log('[SEND-TEMPLATE-MODAL] on file selected -->', e)

    this.uploadFile(e).then((file_url) => {
      if (this.header_params[0].image) {
        this.header_params[0].image.link = file_url;
      }
      if (this.header_params[0].document) {
        this.header_params[0].document.link = file_url;
        this.sanitizeUrl(file_url);
      }
      this.invalidUrl = false;
    }).catch((err) => {
      this.logger.log('[SEND-TEMPLATE-MODAL] unable to upload file -->', err)
      this.displayFileUploaded = false;
    })

  }

  private async uploadFile(e: any) {

    return new Promise((resolve, reject) => {
      // evaluate drop and paste cases other than change
      let file = e.target.files.item(0);
      const currentUpload = new UploadModel(file);
      this.logger.log('[SEND-TEMPLATE-MODAL] currentUpload -->', currentUpload);
      this.uploadService.upload(this.loggedUser.uid, currentUpload).then((data) => {
        this.logger.log('[SEND-TEMPLATE-MODAL] downloadURL -->', data);
        resolve(data.downloadURL);
      }).catch((err) => {
        this.logger.log('[SEND-TEMPLATE-MODAL] uploading error ', err);
        reject(err);
      })
    })
  }

  removeHeaderFile() {
    this.displayFileUploaded = false;
    this.fileUploadedName = "";
    this.header_params[0].url = "";
    this.checkParameters();
  }

  checkParameters() {
    this.sendButtonDisabled = true;
    let text_header_result = this.header_params.find(p => !p.text || p.text == '');
    let media_header_result = this.header_params.find(p => (p.image && (!p.image.link || p.image.link == '')) || (p.document && (!p.document.link || p.document.link == '')) || (p.location && (!p.location.name || !p.location.address || !p.location.latitude || !p.location.longitude)));
    let body_result = this.body_params.find(p => !p.text || p.text == '');

    if ((!text_header_result || !media_header_result) && !body_result) {
      if (this.invalidUrl === false) {
        this.sendButtonDisabled = false;
      }
    }
  }

  async onClose() {
    this.viewCtrl.dismiss()
  }


  // MAPS - START

  displayMap() {
    this.displayMapModal = true;
    this.prensentTemplateModal();
  }

  private async prensentTemplateModal(): Promise<any> {
    this.logger.log('[SEND-TEMPLATE-MODAL] openTemplateModal');
    const attributes = {};
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: MapsPage,
        componentProps: attributes,
        swipeToClose: false,
        backdropDismiss: true
      })
    modal.onDidDismiss().then((maps_detail: any) => {
      this.logger.log('[SEND-TEMPLATE-MODAL] open map returned ', maps_detail);
      this.header_params[0].location = maps_detail.data;
      this.checkParameters();
    });
    return await modal.present();
  }

  // MAPS - END

}
