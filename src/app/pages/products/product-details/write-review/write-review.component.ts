import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  signal,
  computed,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@app/core/models/product.model';
import { Review } from '@app/core/models/review.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import {
  parseFilesToBase64,
  ParsedBase64File,
} from '@app/core/utils/image-base64-parser';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-write-review',
  imports: [SHARED_MODULES],
  templateUrl: './write-review.component.html',
  styleUrl: './write-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WriteReviewComponent {
  product = input.required<Product>();
  facadeService = inject(FacadeService);
  router = inject(Router);
  imagePath = environment.supabaseImages;
  // Form data using model signals
  rating = signal<number>(0);
  comment = model<string>('');
  selectedImages = signal<ParsedBase64File[]>([]);

  // Form state
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  // Computed validations
  isFormValid = computed(() => {
    return this.rating() > 0; // Rating is required, comment is optional
  });

  canSubmit = computed(() => {
    return this.isFormValid() && !this.isSubmitting();
  });

  // Star rating helpers
  starArray = [1, 2, 3, 4, 5];

  constructor() {
    // Reset error when form changes
    effect(() => {
      this.rating();
      this.comment();
      this.selectedImages();
      this.submitError.set(null);
    });
  }

  setRating(rating: number) {
    this.rating.set(rating);
  }

  onCommentInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.comment.set(target?.value || '');
  }

  async onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      try {
        const parsedFiles = await parseFilesToBase64(input.files);
        // Limit to 5 images maximum
        const currentImages = this.selectedImages();
        const newImages = [...currentImages, ...parsedFiles].slice(0, 5);
        this.selectedImages.set(newImages);
      } catch (error) {
        console.error('Error parsing images:', error);
        this.submitError.set('Failed to process images. Please try again.');
      }
    }
  }

  removeImage(index: number) {
    const currentImages = this.selectedImages();
    const updatedImages = currentImages.filter((_, i) => i !== index);
    this.selectedImages.set(updatedImages);
  }

  async onSubmit() {
    if (!this.canSubmit()) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    // Prepare review data
    const reviewData: Partial<Review> = {
      productId: this.product().id,
      rating: this.rating(),
      comment: this.comment().trim() || null,
      images:
        this.selectedImages().length > 0
          ? this.selectedImages().map((img) => img.base64)
          : null,
    };

    this.facadeService.reviewsService.create(reviewData).subscribe({
      next: () => {
        // Navigate back to product details on success
        this.router.navigate([APP_ROUTES.PRODUCT_DETAILS, this.product().slug]);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error submitting review:', error);

        this.submitError.set(
          error?.message || 'Failed to submit review. Please try again.'
        );
        this.submitError.set('Failed to submit review. Please try again.');
        this.isSubmitting.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate([APP_ROUTES.PRODUCT_DETAILS, this.product().slug]);
  }
}
