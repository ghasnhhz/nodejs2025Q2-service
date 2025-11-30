import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
