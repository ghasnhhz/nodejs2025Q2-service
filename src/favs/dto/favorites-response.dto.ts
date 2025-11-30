import { Artist } from 'src/artist/interfaces/artist.interface';
import { Album } from 'src/album/interfaces/album.interface';
import { Track } from 'src/track/interfaces/track.interface';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
