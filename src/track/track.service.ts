import { Injectable } from '@nestjs/common';
import { prisma } from '../common/database';
import { Track } from './interfaces/track.interface';
import { TrackResponseDto } from './dto/track-response.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class TrackService {
  async findAll(): Promise<TrackResponseDto[]> {
    const tracks = await prisma.track.findMany();

    return tracks;
  }

  async findOne(id: string): Promise<TrackResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const track = await prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException(`Track was not found.`);
    }

    return track;
  }

  async create(dto: CreateTrackDto): Promise<TrackResponseDto> {
    const newTrack = await prisma.track.create({
      data: {
        name: dto.name,
        artistId: dto.artistId,
        albumId: dto.albumId,
        duration: dto.duration,
      },
    });

    return newTrack;
  }

  async update(
    id: string,
    updatedTrackDto: Partial<Track>,
  ): Promise<TrackResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const track = await prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track was not found.');
    }

    const updatedTrack = await prisma.track.update({
      where: { id },
      data: updatedTrackDto,
    });

    return updatedTrack;
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const track = await prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException(`Track was not found.`);
    }

    const favorites = await prisma.favorites.findFirst();

    if (favorites) {
      await prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: favorites.tracks.filter((trackId) => trackId !== id),
        },
      });
    }

    await prisma.track.delete({
      where: { id },
    });
  }
}
