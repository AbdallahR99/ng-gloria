import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { CATEGORIES_DATA } from './cateogries.data';

export const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    nameEn: `Amber and Musk's Mist, For her/him`,
    nameAr: `ضباب العنبر والمسك، لها/له`,
    stars: 4,
    reviews: 82,
    price: 70,
    image: 'images/perfume1.png',
    categoryId: 3, // Hair Mist
    category: CATEGORIES_DATA.find((c) => c.id === 3) as Category,
  },
  {
    id: 2,
    nameEn: `Amber and Musk's Mist, For her/him`,
    nameAr: `ضباب العنبر والمسك، لها/له`,
    stars: 5,
    reviews: 120,
    price: 75,
    image: 'images/perfume2.png',
    categoryId: 4, // Hair Mist
    category: CATEGORIES_DATA.find((c) => c.id === 4) as Category,
  },
  {
    id: 3,
    nameEn: `Amber and Musk's Mist, For her/him`,
    nameAr: `ضباب العنبر والمسك، لها/له`,
    stars: 4,
    reviews: 65,
    price: 68,
    image: 'images/perfume3.png',
    categoryId: 3, // Hair Mist
    category: CATEGORIES_DATA.find((c) => c.id === 3) as Category,
  },
  {
    id: 4,
    nameEn: `Amber and Musk's Mist, For her/him`,
    nameAr: `ضباب العنبر والمسك، لها/له`,
    stars: 5,
    reviews: 110,
    price: 75,
    image: 'images/perfume4.png',
    categoryId: 4, // Hair Mist
    category: CATEGORIES_DATA.find((c) => c.id === 4) as Category,
  },
  {
    id: 5,
    nameEn: `Amber and Musk's Mist, For her/him`,
    nameAr: `ضباب العنبر والمسك، لها/له`,
    stars: 4,
    reviews: 95,
    price: 76,
    image: 'images/perfume1.png',
    categoryId: 3, // Hair Mist
    category: CATEGORIES_DATA.find((c) => c.id === 3) as Category,
  },
  // Example Bukhoor product
  {
    id: 6,
    nameEn: `Classic Bukhoor`,
    nameAr: `بخور كلاسيكي`,
    stars: 5,
    reviews: 60,
    price: 90,
    image: 'images/perfume2.png',
    categoryId: 1, // Bukhoor
    category: CATEGORIES_DATA.find((c) => c.id === 1) as Category,
  },
  {
    id: 7,
    nameEn: `Royal Bukhoor`,
    nameAr: `بخور ملكي`,
    stars: 4,
    reviews: 45,
    price: 110,
    image: 'images/perfume1.png',
    categoryId: 2, // Bukhoor
    category: CATEGORIES_DATA.find((c) => c.id === 2) as Category,
  },
];
