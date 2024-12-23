import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeaderConversationsListUnassigned } from './header-conversations-list-unassigned.component';

describe('HeaderConversationsListUnassignedComponent', () => {
  let component: HeaderConversationsListUnassigned;
  let fixture: ComponentFixture<HeaderConversationsListUnassigned>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderConversationsListUnassigned ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderConversationsListUnassigned);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
