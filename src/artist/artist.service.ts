import { Injectable } from '@nestjs/common';
import { prisma } from '../common/database';
import { Artist } from './interfaces/artist.interface';
import { ArtistResponseDto } from './dto/artist-response.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ArtistService {
  async findAll(): Promise<ArtistResponseDto[]> {
    const artists = await prisma.artist.findMany();

    return artists;
  }

  async findOne(id: string): Promise<ArtistResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    const artist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist was not found.');
    }

    return artist;
  }

  async create(dto: CreateArtistDto): Promise<ArtistResponseDto> {
    if (!dto.name || dto.grammy === undefined) {
      throw new BadRequestException('Please provide all required fields!');
    }

    const newArtist = await prisma.artist.create({
      data: {
        name: dto.name,
        grammy: dto.grammy,
      },
    });

    return newArtist;
  }

  async update(
    id: string,
    updatedArtistDto: Partial<Artist>,
  ): Promise<ArtistResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    const artist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id: ${id} not found!`);
    }

    const updatedArtist = await prisma.artist.update({
      where: { id },
      data: updatedArtistDto,
    });

    return updatedArtist;
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    const artist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist was not found.`);
    }

    const favorites = await prisma.favorites.findFirst();

    if (favorites) {
      await prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: favorites.artists.filter((artistId) => artistId !== id),
        },
      });
    }

    await prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await prisma.artist.delete({
      where: { id },
    });
  }
}
