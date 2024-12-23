import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeaderConversationsListArchived } from './header-conversations-list-archived.component';

describe('OptionHeaderComponent', () => {
  let component: HeaderConversationsListArchived;
  let fixture: ComponentFixture<HeaderConversationsListArchived>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderConversationsListArchived ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderConversationsListArchived);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
