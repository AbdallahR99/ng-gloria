import { Injectable } from '@angular/core';
import { IconService } from './utils/icon.service';
import { TranslatorService } from './translate/translator.service';
import { AuthService } from './repository/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  constructor(
    private iconService: IconService,
    private translatorService: TranslatorService,
    private authService: AuthService
  ) {}

  initialize(): void {
    this.iconService.registerIcons();
    this.translatorService.setCurrentLang();
    this.authService.init();
  }
}