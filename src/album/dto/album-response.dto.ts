export interface AlbumResponseDto {
  id: string;
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
