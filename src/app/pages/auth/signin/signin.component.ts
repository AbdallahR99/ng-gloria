import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { LoginRequest } from '@app/core/models/login.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-signin',
  imports: [SHARED_MODULES],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  routes = APP_ROUTES;
  facadeService = inject(FacadeService);
  router = inject(Router);
  redirectUrl = input<string>('');
  errorMsg = signal<string>('');
  isLoading = signal<boolean>(false);
  get isEn() {
    return this.facadeService.translatorService.isEn;
  }

  onSubmit(form: NgForm) {
    form.form.markAllAsTouched(); // Mark all fields as touched to show validation errors

    if (form.valid) {
      this.isLoading.set(true);
      this.errorMsg.set(''); // Reset error message
      console.log('Form submitted', form.value);
      const loginForm: LoginRequest = {
        identifier: form.value.emailOrPhone,
        password: form.value.password,
      };
      this.facadeService.authService.login(loginForm).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log('Login successful', response);
          // Handle successful login, e.g., redirect to dashboard
          if (this.redirectUrl()) {
            this.router.navigate([this.redirectUrl()]);
          } else {
            this.router.navigate([this.routes.HOME]);
          }
        },
        error: (error) => {
          this.isLoading.set(false);

          this.errorMsg.set('Login failed. Please check your credentials.');
          console.error('Login failed', error);
          // Handle login error, e.g., show an error message
        },
      });
    } else {
      this.errorMsg.set('Please fill in all required fields correctly.');

      console.error('Form is invalid');
    }
  }
}
