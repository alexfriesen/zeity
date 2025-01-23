export interface User {
  id?: string;
  name: string;
  email: string;
  emailVerified: string | Date | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
