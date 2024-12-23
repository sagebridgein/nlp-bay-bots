import { TestBed } from '@angular/core/testing';
import { TriggerEvents } from './triggerEvents';

describe('TriggerEvents', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TriggerEvents = TestBed.get(TriggerEvents);
    expect(service).toBeTruthy();
  });
});