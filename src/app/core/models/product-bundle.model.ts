import { Product } from './product.model';

export interface ProductBundle {
  productId: number; // ID of the product in the bundle
  bundleId: number; // ID of the bundle
  product?: Product; // Relationship to the product
}

export interface Bundle {
  id: number;
  productId: number; // The main product ID
  bundle: ProductBundle[]; // Array of bundle items
  oldPrice: number; // Old price of the bundle
  price: number; // Current price of the bundle
  isActive: boolean; // Whether the bundle is active
}
