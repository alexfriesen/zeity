declare module '#auth-utils' {
  interface User {
    id: string;
    name: string;
    email: string;
    verified: boolean;
  }
}
export {};
