import { Category } from './category.model';

export interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  stars: number;
  reviews: number;
  price: number;
  oldPrice?: number;
  image: string;
  categoryId: number;
  category: Category;
  quantity: number;
}
