import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ArtistResponseDto } from './dto/artist-response.dto';
import { ArtistService } from './artist.service';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  async findAll(): Promise<ArtistResponseDto[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ArtistResponseDto> {
    return this.artistService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() createArtistDto: CreateArtistDto,
  ): Promise<ArtistResponseDto> {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedArtistDto: UpdateArtistDto,
  ): Promise<ArtistResponseDto> {
    return this.artistService.update(id, updatedArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    this.artistService.delete(id);
  }
}
