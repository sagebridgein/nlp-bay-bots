import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendEmailModal } from './send-email.page';

describe('SendEmailPage', () => {
  let component: SendEmailModal;
  let fixture: ComponentFixture<SendEmailModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmailModal ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendEmailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
