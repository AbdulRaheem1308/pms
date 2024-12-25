import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[alertVisibility]',
})
export class AlertVisibilityDirective {
  @Input() set alertVisibility(visible: boolean) {
    if (visible) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
