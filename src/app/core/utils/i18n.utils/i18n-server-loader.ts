// shared/loaders/translate-server.loader.ts
import { join } from 'path';
import { Observable } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import { inject, makeStateKey, StateKey, TransferState } from '@angular/core';
import * as fs from 'fs';
import { HttpClient } from '@angular/common/http';
import { PlatformService } from '@core/services/platform/platform.service';
import { pathLocator } from './i18-path-locator';

export class TranslateServerLoader implements TranslateLoader {
  // transferState = inject(TransferState);
  constructor(
    // private httpClient: HttpClient,
    private transferState: TransferState,
    private platformService: PlatformService,
    private prefix: string = 'i18n',
    private suffix: string = '.json',
  ) {}

  public getTranslation(lang: string): Observable<any> {
    return new Observable((observer) => {
      if (this.platformService.isBrowser) return;
      const filePath = pathLocator(lang, this.prefix, this.suffix);
      // const filePath = join(
      //   process.cwd(),
      //   'public',
      //   this.prefix,

      //   `${lang}${this.suffix}`,
      // );

      // const assets_folder = join(
      //   process.cwd(),
      //   'public',
      //   // 'ssr', // Your project name here
      //   // 'i18n',
      //   // 'assets',
      //   this.prefix,
      //   `${lang}${this.suffix}`,
      // );
      // const jsonData = JSON.parse(
      //   fs.readFileSync(`./${lang}${this.suffix}`, 'utf8')
      // );
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Here we save the translations in the transfer-state
      const key: StateKey<number> = makeStateKey<number>(
        'transfer-translate-' + lang,
      );
      // console.log(this.idk);
      this.transferState.set(key, jsonData);

      observer.next(jsonData);
      observer.complete();
    });
  }
}

// export function translateServerLoaderFactory(transferState: TransferState) {
//   transferState = inject(TransferState);

//   return new TranslateServerLoader(transferState);
// }
