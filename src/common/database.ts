import { User } from '../user/interfaces/user.interface';

export const db = {
  users: [] as User[],
  artists: [],
  albums: [],
  tracks: [],
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};
