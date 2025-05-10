export interface User {
  readonly id?: string;
  name: string;
  email: string;
  emailVerified: string | Date | null | boolean;
  image?: string | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
