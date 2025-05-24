export interface CartSummary {
  subtotal: number; // Total price of items in the cart before discounts and delivery fees
  discount: number; // Total discount applied to the cart
  deliveryFee: number; // Delivery fee for the cart
  total: number; // Final total price of the cart
}
