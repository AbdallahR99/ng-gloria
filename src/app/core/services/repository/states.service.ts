import { inject, Injectable } from '@angular/core';
import { SupabaseFunctionsService } from './supabase-functions.service';
import { State } from '@app/core/models/state.model';

@Injectable({ providedIn: 'root' })
export class StatesService {
  private readonly fn = inject(SupabaseFunctionsService);
  private readonly endpoint = 'states';

  get(countryCode?: string) {
    return this.fn.callFunction<State[]>(`${this.endpoint}`, {
      method: 'GET',
      queryParams: countryCode ? { country_code: countryCode } : undefined,
    });
  }

  create(state: Partial<State>) {
    return this.fn.callFunction<State>(`${this.endpoint}/create`, {
      method: 'POST',
      body: state,
    });
  }

  update(state: Partial<State>) {
    return this.fn.callFunction<State>(`${this.endpoint}/update`, {
      method: 'PUT',
      body: state,
    });
  }

  delete(id: string) {
    return this.fn.callFunction(`${this.endpoint}/delete`, {
      method: 'DELETE',
      body: { id },
    });
  }

  bulkCreate(states: Partial<State>[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'POST',
      body: states,
    });
  }

  bulkDelete(ids: string[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'DELETE',
      body: ids,
    });
  }
}
