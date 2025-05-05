import { PlatformService } from './../platform/platform.service';
import { DOCUMENT } from '@angular/common';
import {
  EventEmitter,
  inject,
  Inject,
  Injectable,
  InjectionToken,
} from '@angular/core';
import { APP_SETTINGS } from '@app/core/constants/app-settings.constants';
import { LocalStorageKeys } from '@app/core/constants/local_storage';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
// import { HOST_LANGAUGE } from 'hosts';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  PlatformService = inject(PlatformService);
  private translate = inject<TranslateService>(TranslateService);
  private document = inject<Document>(DOCUMENT);

  onLangChange(): EventEmitter<LangChangeEvent> {
    return this.translate.onLangChange;
  }
  langOb = this.translate.onLangChange.asObservable();
  getCurrentLang(): string | null {
    const isServer = this.PlatformService.isServer;

    // const isServer = isPlatformServer(this.platformId);
    if (isServer || !localStorage) {
      return APP_SETTINGS.defaultLanguage;
    }
    // this.activatedRoute.snapshot.queryParamMap?.get(GlobalNames.langaugeParam)
    // if (!localStorage) return 'ar';
    return localStorage.getItem(LocalStorageKeys.LANG);
    // return 'ar';
  }

  setCurrentLang(val: string): void {
    if (!val) {
      val = 'ar';
    }

    this.translate.use(val);
    this.translate.setDefaultLang(val);
    this.translate.currentLang = val;
    if (localStorage) localStorage.setItem('Lang', val);
    if (val === 'ar') {
      // this.setLangagueQueryParam('ar');
      this.document.documentElement.setAttribute('dir', 'rtl');
      this.document.documentElement.lang = 'ar';
      this.document
        .getElementsByTagName('html')[0]
        ?.setAttribute(LocalStorageKeys.LANG, 'ar');
      this.document.getElementsByTagName('html')[0]?.setAttribute('dir', 'rtl');
      this.document.getElementsByTagName('body')[0]?.setAttribute('dir', 'rtl');
      this.document
        .getElementsByTagName('body')[0]
        ?.setAttribute('class', 'rtl');
    }
    if (val === 'en') {
      // this.setLangagueQueryParam('en');
      this.document.documentElement.setAttribute('dir', 'ltr');
      this.document.documentElement.lang = 'en';
      this.document
        .getElementsByTagName('html')[0]
        ?.setAttribute(LocalStorageKeys.LANG, 'en');
      this.document.getElementsByTagName('html')[0]?.removeAttribute('dir');
      this.document.getElementsByTagName('body')[0]?.removeAttribute('dir');
      this.document.getElementsByTagName('body')[0]?.removeAttribute('class');
      this.document.getElementsByTagName('html')[0]?.setAttribute('dir', 'ltr');
      this.document.getElementsByTagName('body')[0]?.setAttribute('dir', 'ltr');
      this.document
        .getElementsByTagName('body')[0]
        ?.setAttribute('class', 'ltr');
    }
    // if (localStorage) localStorage.setItem(LocalStorageKeys.LANG, val);
  }

  // setLangagueQueryParam(value: 'ar' | 'en'): void {
  //   if (value != 'ar' && value != 'en') return;
  //   this.router.navigate([], {
  //     // relativeTo: this.activatedRoute,
  //     queryParams: {
  //       [GlobalNames.langaugeParam]: value == 'en' ? 'en' : null,
  //     },
  //     queryParamsHandling: 'merge',
  //   });
  //   // console.log('i18n', this.activatedRoute.snapshot);

  //   // console.log(this.activatedRoute.snapshot.queryParamMap);
  // }

  translateWord(val: string): string {
    return this.translate?.instant(val || '  ');
  }

  isEn(): boolean {
    return this.getCurrentLang() === 'en';
  }
}
