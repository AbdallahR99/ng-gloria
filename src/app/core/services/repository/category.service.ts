import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { CATEGORIES_DATA } from '../../data/cateogries.data';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  getCategories(
    page?: number,
    pageSize?: number
  ): Observable<{ items: Category[]; total: number }> {
    if (!page || !pageSize) {
      return of({ items: CATEGORIES_DATA, total: CATEGORIES_DATA.length }).pipe(
        delay(300)
      );
    }
    const start = (page - 1) * pageSize;
    const items = CATEGORIES_DATA.slice(start, start + pageSize);
    return of({ items, total: CATEGORIES_DATA.length }).pipe(delay(300));
  }

  getCategoryById(id: number): Observable<Category | undefined> {
    return of(CATEGORIES_DATA.find((c) => c.id === id)).pipe(delay(200));
  }
}
