import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-g-services',
  imports: [SHARED_MODULES],
  templateUrl: './g-services.component.html',
  styleUrl: './g-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GServicesComponent implements OnInit, OnDestroy {
  // Email notification signup
  email = signal('');
  subscriptionStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Progress tracking
  developmentProgress = signal(75);

  // Launch countdown (estimated launch date)
  launchDate = signal(new Date('2025-08-15')); // Example launch date
  timeLeft = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Features to be launched
  upcomingFeatures = signal([
    {
      id: 'custom-blending',
      title: 'Custom Blending',
      description:
        'Personalized fragrance creation tailored to your preferences',
      icon: 'sparkles',
      color: 'accent',
    },
    {
      id: 'express-delivery',
      title: 'Express Delivery',
      description: 'Fast and secure delivery to your doorstep',
      icon: 'clock',
      color: 'secondary',
    },
    {
      id: 'quality-guarantee',
      title: 'Quality Guarantee',
      description: '100% authentic products with satisfaction guarantee',
      icon: 'check-circle',
      color: 'success',
    },
  ]);

  // Computed properties
  progressPercentage = computed(() => `${this.developmentProgress()}%`);
  isValidEmail = computed(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(this.email());
  });

  isSubscribeButtonDisabled = computed(
    () =>
      !this.email() ||
      !this.isValidEmail() ||
      this.subscriptionStatus() === 'loading'
  );

  subscribeButtonText = computed(() => {
    switch (this.subscriptionStatus()) {
      case 'loading':
        return 'Subscribing...';
      case 'success':
        return 'Subscribed!';
      default:
        return 'Notify Me';
    }
  });

  private countdownInterval?: number;

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown() {
    this.updateCountdown();
    this.countdownInterval = window.setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const launch = this.launchDate().getTime();
    const distance = launch - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.timeLeft.set({ days, hours, minutes, seconds });
    } else {
      this.timeLeft.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
    }
  }

  // Methods
  updateEmail(event: Event) {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
  }

  subscribeToUpdates() {
    if (!this.isValidEmail()) {
      this.subscriptionStatus.set('error');
      setTimeout(() => this.subscriptionStatus.set('idle'), 3000);
      return;
    }

    this.subscriptionStatus.set('loading');

    // Simulate API call
    setTimeout(() => {
      // Here you would typically call a service to save the email
      console.log('Subscribing email:', this.email());

      this.subscriptionStatus.set('success');

      // Reset form after 2 seconds
      setTimeout(() => {
        this.email.set('');
        this.subscriptionStatus.set('idle');
      }, 2000);
    }, 1500);
  }

  openSocialLink(platform: string) {
    // Handle social media links
    const socialUrls = {
      twitter: 'https://twitter.com/glorianatural',
      facebook: 'https://facebook.com/glorianatural',
      instagram: 'https://instagram.com/glorianatural',
    };

    const url = socialUrls[platform as keyof typeof socialUrls];
    if (url) {
      window.open(url, '_blank');
    }
  }
}
