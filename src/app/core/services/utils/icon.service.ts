import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private iconRegistry = inject<MatIconRegistry>(MatIconRegistry);
  private sanitizer = inject<DomSanitizer>(DomSanitizer);

  registerIcons(): void {
    const icons = [
      'cart',
      'cross',
      'fb',
      'insta',
      'linkedin',
      'menu',
      'whatsapp',
    ];

    icons.forEach((icon) => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`icons/${icon}.svg`)
      );
    });
  }
}
