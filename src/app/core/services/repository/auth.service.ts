import { inject, Injectable } from '@angular/core';
import { SupabaseFunctionsService } from './supabase-functions.service';
import { LoginRequest, LoginResponse } from '@app/core/models/login.model';
import {
  RegisterRequest,
  RegisterResponse,
} from '@app/core/models/register.model';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly fn = inject(SupabaseFunctionsService);
  private readonly endpoint = 'auth';

  login(body: LoginRequest) {
    return this.fn.callFunction<LoginResponse>(`${this.endpoint}/login`, {
      method: 'POST',
      body,
    });
  }

  registerThenLogin(body: RegisterRequest): Observable<LoginResponse> {
    return this.fn
      .callFunction<RegisterResponse>(`${this.endpoint}/register`, {
        method: 'POST',
        body,
      })
      .pipe(
        switchMap((response) => {
          if (response.message) {
            // If registration is successful, log in the user
            return this.fn.callFunction<LoginResponse>(
              `${this.endpoint}/login`,
              {
                method: 'POST',
                body: {
                  email: body.email,
                  password: body.password,
                },
              }
            );
          } else {
            throw new Error('Registration failed');
          }
        })
      );
  }

  register(body: RegisterRequest) {
    return this.fn.callFunction<RegisterResponse>(`${this.endpoint}/register`, {
      method: 'POST',
      body,
    });
  }
}
