import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageKeys } from '@app/core/constants/local_storage';
import { toSnakeCase, toCamelCase } from '@app/core/utils/case-converter';
import { environment } from '@environments/environment';
import { firstValueFrom, map, Observable } from 'rxjs';
import { PlatformService } from '../platform/platform.service';

@Injectable({ providedIn: 'root' })
export class SupabaseFunctionsService {
  private readonly http = inject(HttpClient);
  private readonly platformService = inject(PlatformService);
  private readonly baseUrl = environment.supabaseFunctions;

  callFunction<T>(
    path: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: Record<string, any>;
      queryParams?: Record<string, string | number | boolean>;
    } = {}
  ): Observable<T> {
    const { method = 'POST', body, queryParams } = options;
    const authToken = this.getToken();
    const headers = this.buildHeaders(authToken);
    const url = this.buildUrl(path, queryParams);

    let response$;
    const payload = toSnakeCase(body ?? {});

    switch (method) {
      case 'GET':
        response$ = this.http.get(url, { headers });
        break;
      case 'POST':
        response$ = this.http.post(url, payload, { headers });
        break;
      case 'PUT':
        response$ = this.http.put(url, payload, { headers });
        break;
      case 'PATCH':
        response$ = this.http.patch(url, payload, { headers });
        break;
      case 'DELETE':
        response$ = this.http.request('DELETE', url, {
          headers,
          body: payload,
        });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response$.pipe(map(toCamelCase));
    // return toCamelCase(response);
  }

  private buildHeaders(token?: string): HttpHeaders {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return new HttpHeaders(headers);
  }

  private buildUrl(
    path: string,
    queryParams?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (queryParams) {
      Object.entries(toSnakeCase(queryParams)).forEach(([key, value]) =>
        url.searchParams.append(key, String(value))
      );
    }
    return url.toString();
  }

  private getToken(): string | undefined {
    if (this.platformService.isServer) {
      // If running on the server, return undefined (no token available)
      return undefined;
    }
    // Retrieve the token from local storage
    const token = localStorage.getItem(LocalStorageKeys.TOKEN);
    if (!token) return undefined;
    return token;
  }
}
