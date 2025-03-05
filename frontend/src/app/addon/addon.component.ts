import { AfterViewInit, Component, computed, ElementRef, Input, viewChild } from '@angular/core';
import { AddonInfo } from '../../types';
@Component({
  selector: 'app-addon',
  imports: [],
  templateUrl: './addon.component.html',
  styleUrl: './addon.component.css'
})
export class AddonComponent implements AfterViewInit {
  @Input() addon: AddonInfo = {} as AddonInfo;
  @Input() right: boolean = false;
  @Input() description = "";
  constructor(private el: ElementRef) {
  }
  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      },
    );
    observer.observe(this.el.nativeElement);
  }
}
