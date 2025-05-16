import { inject, Injectable, Injector } from '@angular/core';
import 'reflect-metadata';
import { TranslatorService } from './translate/translator.service';
import { CategoryService } from './repository/category.service';
import { ProductService } from './repository/product.service';
import { CartService } from './repository/cart.service';
import { PaymentService } from './repository/payment.service';

@Injectable({
  providedIn: 'root',
})
export class FacadeService {
  public inject = inject(Injector);

  private _translateService?: TranslatorService;
  private _categoryService?: CategoryService;
  private _productService?: ProductService;
  private _cartService?: CartService;
  private _paymentService?: PaymentService;

  get translateService() {
    if (!this._translateService) {
      this._translateService = this.inject.get(TranslatorService);
    }
    return this._translateService;
  }
  get categoryService() {
    if (!this._categoryService) {
      this._categoryService = this.inject.get(CategoryService);
    }
    return this._categoryService;
  }
  get productService() {
    if (!this._productService) {
      this._productService = this.inject.get(ProductService);
    }
    return this._productService;
  }
  get cartService() {
    if (!this._cartService) {
      this._cartService = this.inject.get(CartService);
    }
    return this._cartService;
  }
  get paymentService() {
    if (!this._paymentService) {
      this._paymentService = this.inject.get(PaymentService);
    }
    return this._paymentService;
  }
}
