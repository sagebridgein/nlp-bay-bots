import { ElementRef, Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';

describe('TooltipNewDirective', () => {
  let el: ElementRef;
  let renderer: Renderer2;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [ElementRef, Renderer2]
    }).compileComponents();

  }));
  
  it('should create an instance', () => {
    const directive = new TooltipDirective(el, renderer);
    expect(directive).toBeTruthy();
  });
});
