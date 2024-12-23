import { MessageModel } from './../../../chat21-core/models/message';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-json-message',
  templateUrl: './json-message.page.html',
  styleUrls: ['./json-message.page.scss'],
})
export class JsonMessagePage implements OnInit {

  @Input() message: MessageModel
  @Input() translationsMap: Map<string, string>;

  
  constructor(
    public viewCtrl: ModalController,
    public el: ElementRef
  ) { }

  ngOnInit() {
    var str = JSON.stringify(this.message, undefined, 4);
    this.el.nativeElement.querySelector('#json').innerHTML = this.syntaxHighlight(str)
  }

  closeModal(){
    this.viewCtrl.dismiss()
  }


  syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

}
