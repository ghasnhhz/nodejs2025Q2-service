import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  artistId: string | null; // refers to Artist

  @IsOptional()
  @IsString()
  albumId: string | null; // refers to Album

  @IsNumber()
  @Min(1)
  duration: number; // integer number
}
