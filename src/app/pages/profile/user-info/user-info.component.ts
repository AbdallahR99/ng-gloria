import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { FacadeService } from '@app/core/services/facade-service.service';
import { environment } from '@environments/environment';
import { User } from '@app/core/models/user.model';
import { parseFilesToBase64 } from '@app/core/utils/image-base64-parser';
import { OrderStatus } from '@app/core/constants/order-status.enum';
import { firstValueFrom } from 'rxjs';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface OrderStats {
  total: number;
  completed: number;
  pending: number;
}

interface FavoriteStats {
  total: number;
}

@Component({
  selector: 'app-user-info',
  imports: [SHARED_MODULES],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
  facadeService = inject(FacadeService);
  imagePath = environment.supabaseImages;

  isEditMode = signal(false);
  isLoading = signal(false);
  isAvatarUploading = signal(false);

  // Form data signal
  formData = signal<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Original data for cancel functionality
  private originalData = signal<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  get user() {
    return this.facadeService.usersService.user;
  }

  // Order statistics
  orderStats = rxResource({
    stream: () => {
      return this.facadeService.ordersService.list({
        page: 1,
        pageSize: 1000, // Get all orders for stats
      });
    },
  });

  // Favorites statistics
  favoriteStats = rxResource({
    stream: () => {
      return this.facadeService.favoritesService.get();
    },
  });

  // Computed stats
  orderStatsComputed = computed(() => {
    const orders = this.orderStats.value();
    if (!orders?.items) return { total: 0, completed: 0, pending: 0 };

    const total = orders.items.length;
    const completed = orders.items.filter(
      (order) => order.status === OrderStatus.Delivered
    ).length;
    const pending = orders.items.filter(
      (order) =>
        order.status === OrderStatus.Pending ||
        order.status === OrderStatus.Processing ||
        order.status === OrderStatus.Confirmed ||
        order.status === OrderStatus.Shipped
    ).length;

    return { total, completed, pending };
  });

  favoriteStatsComputed = computed(() => {
    const favorites = this.favoriteStats.value();
    return { total: favorites?.length || 0 };
  });

  // Initialize form data when user changes
  private initFormData = effect(() => {
    const currentUser = this.user();
    if (currentUser) {
      const userData: UserFormData = {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      };
      this.formData.set(userData);
      this.originalData.set({ ...userData });
    }
  });

  toggleEditMode() {
    if (this.isEditMode()) {
      // If currently in edit mode, this is a save action
      this.saveUserInfo();
    } else {
      // Entering edit mode
      this.isEditMode.set(true);
    }
  }

  async saveUserInfo(form?: NgForm) {
    if (form && !form.valid) {
      return;
    }

    this.isLoading.set(true);
    const currentUser = this.user();

    try {
      const updateData: Partial<User> & { userId?: string } = {
        userId: currentUser?.id,
        firstName: this.formData().firstName,
        lastName: this.formData().lastName,
        phone: this.formData().phone,
      };

      await this.facadeService.usersService.update(updateData).toPromise();

      // Update the user signal with new data
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          firstName: this.formData().firstName,
          lastName: this.formData().lastName,
          phone: this.formData().phone,
        };
        this.facadeService.usersService.user.set(updatedUser);

        // Update localStorage cache
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Update original data
      this.originalData.set({ ...this.formData() });
      this.isEditMode.set(false);
    } catch (error) {
      console.error('Failed to update user info:', error);
      // Could add toast notification here
    } finally {
      this.isLoading.set(false);
    }
  }

  cancelEdit() {
    this.formData.set({ ...this.originalData() });
    this.isEditMode.set(false);
  }

  updateFormData(field: keyof UserFormData, value: string) {
    this.formData.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async onAvatarSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    this.isAvatarUploading.set(true);

    try {
      const [parsedFile] = await parseFilesToBase64(file);

      await firstValueFrom(
        this.facadeService.usersService.updateAvatar(parsedFile.base64)
      );

      // Update user signal with new avatar
      const currentUser = this.user();
      if (currentUser) {
        // The avatar path should come from the API response
        // For now, we'll trigger a user data refresh
        await this.facadeService.usersService.setUser();
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      this.isAvatarUploading.set(false);
      // Clear the input
      input.value = '';
    }
  }

  async removeAvatar() {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    this.isAvatarUploading.set(true);

    try {
      await this.facadeService.usersService.updateAvatar('').toPromise();

      // Update user signal to remove avatar
      const currentUser = this.user();
      if (currentUser) {
        const updatedUser: User = { ...currentUser, avatar: undefined };
        this.facadeService.usersService.user.set(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to remove avatar:', error);
      alert('Failed to remove avatar. Please try again.');
    } finally {
      this.isAvatarUploading.set(false);
    }
  }
}
