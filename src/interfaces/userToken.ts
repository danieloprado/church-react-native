export interface IUserToken {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  roles: string[];
  church?: {
    id: number;
    name: string;
    slug: string;
  };

  canAccess(...roles: string[]): boolean;
}