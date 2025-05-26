import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { FacadeService } from '@app/core/services/facade-service.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@environments/environment';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { CartButtonComponent } from '@app/core/shared/components/cart-button/cart-button.component';
import { Product } from '@app/core/models/product.model';

@Component({
  selector: 'app-favorites',
  imports: [SHARED_MODULES, CartButtonComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  facadeService = inject(FacadeService);
  imagePath = environment.supabaseImages;
  routes = APP_ROUTES;
  isRemoving = signal<string>('');

  get isEn() {
    return this.facadeService.translatorService.isEn;
  }

  favorites = rxResource({
    loader: () => this.facadeService.favoritesService.get(),
  });

  removeFavorite(product: Product) {
    this.isRemoving.set(product.id);
    this.facadeService.favoritesService.toggle(product.id).subscribe({
      next: () => {
        this.isRemoving.set('');
        this.favorites.reload();
      },
      error: () => {
        this.isRemoving.set('');
      },
    });
  }
}
