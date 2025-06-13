import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '@environments/environment';

@Pipe({
  name: 'supabaseImage',
})
export class SupabaseImagePipe implements PipeTransform {
 imagePath = environment.supabaseImages;
  transform(path?: string, folder?: 'categories' | 'inspired-products' | 'products'): unknown {
    if (!path) {
      return '';
    }
    if (path.startsWith('http')) {
      return path; // If the path is already a full URL, return it as is
    }
    if (folder) {
      path = `${this.imagePath}${folder}/${path}`;
    }
    return `${this.imagePath}${path}`;
  }

}
