export interface Address {
  userId?: string; // UUID of the user
  label: string; // Label for the address (e.g., Home, Work)
  firstName: string; // First name of the user
  lastName: string; // Last name of the user
  phone: string; // Phone number
  city: string; // City name
  state?: string; // State name (optional)
  area?: string; // Area name (optional)
  street?: string; // Street name (optional)
  building?: string; // Building name or number (optional)
  apartment?: string; // Apartment name or number (optional)
  notes?: string; // Additional notes (optional)
  isDefault?: boolean; // Whether this is the default address
  createdAt?: string; // Timestamp of creation
  updatedAt?: string; // Timestamp of last update
  createdBy?: string; // UUID of the user who created the address
  updatedBy?: string; // UUID of the user who last updated the address
}
