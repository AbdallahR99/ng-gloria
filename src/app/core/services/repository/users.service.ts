import { inject, Injectable } from '@angular/core';
import { SupabaseFunctionsService } from './supabase-functions.service';
import { User } from '@app/core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly fn = inject(SupabaseFunctionsService);
  private readonly endpoint = 'users';

  get(userId?: string) {
    return this.fn.callFunction<User | User[]>(`${this.endpoint}/get`, {
      method: 'GET',
      queryParams: userId ? { user_id: userId } : undefined,
    });
  }

  update(user: Partial<User> & { userId?: string }) {
    return this.fn.callFunction(`${this.endpoint}/update`, {
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
