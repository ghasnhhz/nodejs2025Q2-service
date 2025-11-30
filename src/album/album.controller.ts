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
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumResponseDto } from './dto/album-response.dto';
import { AlbumService } from './album.service';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async findAll(): Promise<AlbumResponseDto[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AlbumResponseDto> {
    return this.albumService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() createAlbumDto: CreateAlbumDto,
  ): Promise<AlbumResponseDto> {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumResponseDto> {
    return this.albumService.update(id, updatedAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    this.albumService.delete(id);
  }
}
