import { Bundle } from '../models/product-bundle.model';
import { PRODUCTS_DATA } from './products.data';

export const PRODUCT_BUNDLES_DATA: Bundle[] = [
  {
    id: 1,
    productId: 1,
    bundle: [
      {
        productId: 2,
        bundleId: 1,
        product: PRODUCTS_DATA.find((p) => p.id === 2)!,
      },
      {
        productId: 3,
        bundleId: 1,
        product: PRODUCTS_DATA.find((p) => p.id === 3)!,
      },
      {
        productId: 4,
        bundleId: 1,
        product: PRODUCTS_DATA.find((p) => p.id === 4)!,
      },
    ],
    oldPrice: 300,
    price: 250,
    isActive: true,
  },
  {
    id: 2,
    productId: 5,
    bundle: [
      {
        productId: 6,
        bundleId: 2,
        product: PRODUCTS_DATA.find((p) => p.id === 6)!,
      },
      {
        productId: 7,
        bundleId: 2,
        product: PRODUCTS_DATA.find((p) => p.id === 7)!,
      },
      {
        productId: 8,
        bundleId: 2,
        product: PRODUCTS_DATA.find((p) => p.id === 8)!,
      },
    ],
    oldPrice: 400,
    price: 350,
    isActive: true,
  },
  {
    id: 3,
    productId: 9,
    bundle: [
      {
        productId: 1,
        bundleId: 3,
        product: PRODUCTS_DATA.find((p) => p.id === 1)!,
      },
      {
        productId: 2,
        bundleId: 3,
        product: PRODUCTS_DATA.find((p) => p.id === 2)!,
      },
      {
        productId: 3,
        bundleId: 3,
        product: PRODUCTS_DATA.find((p) => p.id === 3)!,
      },
    ],
    oldPrice: 500,
    price: 450,
    isActive: true,
  },
  {
    id: 4,
    productId: 4,
    bundle: [
      {
        productId: 5,
        bundleId: 4,
        product: PRODUCTS_DATA.find((p) => p.id === 5)!,
      },
      {
        productId: 6,
        bundleId: 4,
        product: PRODUCTS_DATA.find((p) => p.id === 6)!,
      },
      {
        productId: 7,
        bundleId: 4,
        product: PRODUCTS_DATA.find((p) => p.id === 7)!,
      },
    ],
    oldPrice: 600,
    price: 550,
    isActive: true,
  },
  {
    id: 5,
    productId: 8,
    bundle: [
      {
        productId: 9,
        bundleId: 5,
        product: PRODUCTS_DATA.find((p) => p.id === 9)!,
      },
      {
        productId: 1,
        bundleId: 5,
        product: PRODUCTS_DATA.find((p) => p.id === 1)!,
      },
      {
        productId: 2,
        bundleId: 5,
        product: PRODUCTS_DATA.find((p) => p.id === 2)!,
      },
    ],
    oldPrice: 700,
    price: 650,
    isActive: true,
  },
];
