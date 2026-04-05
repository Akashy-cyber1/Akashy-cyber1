export type BusinessPayload = {
  id: number;
  name: string;
  business_type: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
};

export type UserPayload = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "owner" | "staff";
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: UserPayload;
  business: BusinessPayload | null;
};

export type RegisterResponse = {
  message: string;
  user: UserPayload;
  business: BusinessPayload;
  tokens: AuthTokens;
};

export type CurrentUserResponse = {
  user: UserPayload;
  business: BusinessPayload | null;
};
