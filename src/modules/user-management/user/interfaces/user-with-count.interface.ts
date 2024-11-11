import { User } from '../schemas/user.schema';

export interface UserWithCount {
  totalCount: number; // Total number of users
  items: User[]; // Array of user items
}
