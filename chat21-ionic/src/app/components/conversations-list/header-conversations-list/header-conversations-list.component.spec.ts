import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeaderConversationsList } from './header-conversations-list.component';

describe('ConversationsListHeader', () => {
  let component: HeaderConversationsList;
  let fixture: ComponentFixture<HeaderConversationsList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderConversationsList ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderConversationsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
