import { inject, Injectable, signal } from '@angular/core';
import { SupabaseFunctionsService } from './supabase-functions.service';
import { User } from '@app/core/models/user.model';
import { firstValueFrom } from 'rxjs';
import { LocalStorageKeys } from '@app/core/constants/local_storage';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly fn = inject(SupabaseFunctionsService);
  private readonly endpoint = 'users';
  user = signal<User | null>(null);

  async setUser() {
    const cachedUser = localStorage.getItem(LocalStorageKeys.USER);
    if (cachedUser) {
      this.user.set(JSON.parse(cachedUser));
    } else {
      const user = await firstValueFrom(this.getCurrent());
      this.user.set(user);
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(user));
    }
  }

  clearCachedUser() {
    localStorage.removeItem(LocalStorageKeys.USER);
    this.user.set(null);
  }

  get() {
    return this.fn.callFunction<User[]>(`${this.endpoint}`, {
      method: 'GET',
    });
  }
  getById(userId: string) {
    return this.fn.callFunction<User>(`${this.endpoint}`, {
      method: 'GET',
      queryParams: { userId },
    });
  }
  getCurrent() {
    return this.fn.callFunction<User>(`${this.endpoint}/current`, {
      method: 'GET',
    });
  }

  update(user: Partial<User> & { userId?: string }) {
    return this.fn.callFunction(`${this.endpoint}`, {
      method: 'PUT',
      body: user,
    });
  }

  bulkUpdate(users: Partial<User>[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'PUT',
      body: users,
    });
  }
}
