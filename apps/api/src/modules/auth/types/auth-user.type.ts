import { Role, UserStatus } from '@prisma/client';

export type AuthUser = {
  id: string;
  uuid: string;
  email: string;
  role: Role;
  status: UserStatus;
};
