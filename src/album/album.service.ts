import { Injectable } from '@nestjs/common';
import { prisma } from '../common/database';
import { Album } from './interfaces/album.interface';
import { AlbumResponseDto } from './dto/album-response.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class AlbumService {
  async findAll(): Promise<AlbumResponseDto[]> {
    const albums = await prisma.album.findMany();

    return albums;
  }

  async findOne(id: string): Promise<AlbumResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const album = await prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Artist was not found.');
    }

    return album;
  }

  async create(dto: CreateAlbumDto): Promise<AlbumResponseDto> {
    if (!dto.name || typeof dto.year !== 'number') {
      throw new BadRequestException();
    }

    const newAlbum = await prisma.album.create({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId,
      },
    });

    return newAlbum;
  }

  async update(
    id: string,
    updatedAlbumDto: Partial<Album>,
  ): Promise<AlbumResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const album = await prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album was not found.');
    }

    const updatedAlbum = await prisma.album.update({
      where: { id },
      data: updatedAlbumDto,
    });

    return updatedAlbum;
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const album = await prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album was not found.`);
    }

    const favorites = await prisma.favorites.findFirst();

    if (favorites) {
      await prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: favorites.albums.filter((albumId) => albumId !== id),
        },
      });
    }

    await prisma.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });

    await prisma.album.delete({
      where: { id },
    });
  }
}
