import { inject, Injectable, Injector } from '@angular/core';
import { TranslatorService } from './translate/translator.service';
import { CategoriesService } from './repository/categories.service';
import { CartService } from './repository/cart.service';
import { UsersService } from './repository/users.service';
import { SupabaseFunctionsService } from './repository/supabase-functions.service';
import { StatesService } from './repository/states.service';
import { ReviewsService } from './repository/reviews.service';
import { ProductsService } from './repository/products.service';
import { OrdersService } from './repository/orders.service';
import { FavoritesService } from './repository/favorites.service';
import { BundlesService } from './repository/bundles.service';
import { AuthService } from './repository/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FacadeService {
  public inject = inject(Injector);

  private _translateService?: TranslatorService;
  private _categoryService?: CategoriesService;
  private _cartService?: CartService;
  private _usersService?: UsersService;
  private _supabaseFunctionsService?: SupabaseFunctionsService;
  private _statesService?: StatesService;
  private _reviewsService?: ReviewsService;
  private _productsService?: ProductsService;
  private _ordersService?: OrdersService;
  private _favoritesService?: FavoritesService;
  private _bundlesService?: BundlesService;
  private _authService?: AuthService;

  get translateService() {
    if (!this._translateService) {
      this._translateService = this.inject.get(TranslatorService);
    }
    return this._translateService;
  }
  get categoryService() {
    if (!this._categoryService) {
      this._categoryService = this.inject.get(CategoriesService);
    }
    return this._categoryService;
  }

  get cartService() {
    if (!this._cartService) {
      this._cartService = this.inject.get(CartService);
    }
    return this._cartService;
  }
  get usersService() {
    if (!this._usersService) {
      this._usersService = this.inject.get(UsersService);
    }
    return this._usersService;
  }

  get supabaseFunctionsService() {
    if (!this._supabaseFunctionsService) {
      this._supabaseFunctionsService = this.inject.get(
        SupabaseFunctionsService
      );
    }
    return this._supabaseFunctionsService;
  }

  get statesService() {
    if (!this._statesService) {
      this._statesService = this.inject.get(StatesService);
    }
    return this._statesService;
  }

  get reviewsService() {
    if (!this._reviewsService) {
      this._reviewsService = this.inject.get(ReviewsService);
    }
    return this._reviewsService;
  }

  get productsService() {
    if (!this._productsService) {
      this._productsService = this.inject.get(ProductsService);
    }
    return this._productsService;
  }

  get ordersService() {
    if (!this._ordersService) {
      this._ordersService = this.inject.get(OrdersService);
    }
    return this._ordersService;
  }

  get favoritesService() {
    if (!this._favoritesService) {
      this._favoritesService = this.inject.get(FavoritesService);
    }
    return this._favoritesService;
  }

  get bundlesService() {
    if (!this._bundlesService) {
      this._bundlesService = this.inject.get(BundlesService);
    }
    return this._bundlesService;
  }

  get authService() {
    if (!this._authService) {
      this._authService = this.inject.get(AuthService);
    }
    return this._authService;
  }
}
