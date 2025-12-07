import { Controller, Param, Get, Post, Delete, HttpCode } from '@nestjs/common';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<FavoritesResponse> {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  async createTrack(@Param('id') id: string): Promise<object> {
    return this.favoritesService.createTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteTrack(@Param('id') id: string) {
    await this.favoritesService.deleteTrack(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  async createAlbum(@Param('id') id: string): Promise<object> {
    return this.favoritesService.createAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbum(@Param('id') id: string) {
    await this.favoritesService.deleteAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async createArtist(@Param('id') id: string): Promise<object> {
    return this.favoritesService.createArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtist(@Param('id') id: string) {
    await this.favoritesService.deleteArtist(id);
  }
}
