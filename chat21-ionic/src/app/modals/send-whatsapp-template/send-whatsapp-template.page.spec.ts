import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendWhatsappTemplateModal } from './send-whatsapp-template.page';

describe('SendWhatsappTemplatePage', () => {
  let component: SendWhatsappTemplateModal;
  let fixture: ComponentFixture<SendWhatsappTemplateModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendWhatsappTemplateModal ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendWhatsappTemplateModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
