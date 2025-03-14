import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-trailer',
  templateUrl: './modal-trailer.component.html',
})
export class ModalTrailerComponent {
  @Input() trailerUrl: string = '';
  @Output() close = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.trailerUrl);
  }
}
