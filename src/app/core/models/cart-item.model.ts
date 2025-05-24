import { Product } from './product.model';

export interface CartItem {
  userId?: string; // UUID of the user
  productId: string; // UUID of the product
  quantity: number; // Quantity of the product
  size?: string; // Size of the product (optional)
  color?: string; // Color of the product (optional)
  status?: 'added' | 'updated'; // Status of the cart operation
  product?: Product; // Detailed product information
  createdAt?: string; // Timestamp of creation
  updatedAt?: string; // Timestamp of last update
  createdBy?: string; // UUID of the user who created the cart entry
  updatedBy?: string; // UUID of the user who last updated the cart entry
}
