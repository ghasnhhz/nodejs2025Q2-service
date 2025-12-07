import { IsString, IsNumber, IsUUID, Min, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  artistId: string | null; // refers to Artist

  @IsOptional()
  @IsUUID()
  albumId: string | null; // refers to Album

  @IsNumber()
  @Min(1)
  duration: number; // integer number
}
