export interface LoginRequest {
  email: string; // User's email address
  password: string; // User's password
}

export interface LoginResponse {
  token: string; // Access token for the session
  user: {
    id: string; // User's unique identifier
    email: string; // User's email address
    [key: string]: any; // Additional user properties
  };
}
