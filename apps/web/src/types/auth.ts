export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export type User = {
  id: string;
  uuid: string;
  email: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  profileImage: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type Address = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  postalCode: string | null;
  addressLine1: string;
  addressLine2: string | null;
  isDefault: boolean;
  createdAt: string;
};
