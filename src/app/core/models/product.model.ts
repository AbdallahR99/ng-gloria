import { Category } from './category.model';

export interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  stars: number;
  reviews: number;
  price: number;
  image: string;
  categoryId: number;
  category: Category;
}
