export interface Review {
  productId: string; // UUID of the product being reviewed
  rating: number; // Rating given to the product
  comment?: string | null; // Optional comment for the review
  images?: string[] | null; // Optional array of uploaded image filenames
  userId?: string | null; // UUID of the user who created the review
  id?: string | null; // UUID of the created review
  createdAt?: string | null; // Timestamp of creation
  updatedAt?: string | null; // Timestamp of last update
  createdBy?: string | null; // UUID of the user who created the review
  updatedBy?: string | null; // UUID of the user who last updated the review
  isDeleted?: boolean | null; // Whether the review is deleted
  userName?: string | null; // Name of the user who created the review
  userAvatar?: string | null; // Avatar of the user who created the review
  email?: string | null; // Email of the user who created the review
  firstName?: string | null; // First name of the user who created the review
  lastName?: string | null; // Last name of the user who created the review
}

export interface RatingDistribution {
  rating: number; // The rating value (e.g., 1, 2, 3, 4, 5)
  count: number; // Number of reviews with this rating
}
