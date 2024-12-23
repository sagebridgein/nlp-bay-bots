import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JsonMessagePage } from './json-message.page';

describe('JsonMessagePage', () => {
  let component: JsonMessagePage;
  let fixture: ComponentFixture<JsonMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JsonMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
