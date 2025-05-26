import { Component } from '@angular/core';
import {
  RouterOutlet,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { LayoutComponent } from './core/shared/components/layout/layout.component';
import { LoadingService } from './core/services/loading.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'h-full',
  },
})
export class AppComponent {
  title = 'ng-gloria';

  constructor(private router: Router, private loadingService: LoadingService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.startLoading();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.stopLoading();
      }
    });
  }
}
