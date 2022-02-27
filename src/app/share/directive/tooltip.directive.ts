import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[showTooltip]'
})
export class TooltipDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      element.style.overflow = 'hidden';
      element.style.whiteSpace = 'nowrap';
      element.style.textOverflow = 'ellipsis';
      element.style.display = 'block';
      if (element.offsetWidth < element.scrollWidth) {
        element.title = element.innerHTML;
      }
    }, 500);
  }
}
