import { Injectable } from '@nestjs/common';
import { db } from '../common/database';
import { Track } from './interfaces/track.interface';
import { TrackResponseDto } from './dto/track-response.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { generateId } from '../common/uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class TrackService {
  findAll(): TrackResponseDto[] {
    return db.tracks;
  }

  findOne(id: string): TrackResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const track = db.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(`Track with id: ${id} not found!`);
    }

    return track;
  }

  create(dto: CreateTrackDto): TrackResponseDto {
    const newTrack: Track = {
      id: generateId(),
      name: dto.name,
      artistId: dto.artistId,
      albumId: dto.albumId,
      duration: dto.duration,
    };

    db.tracks.push(newTrack);

    return newTrack;
  }

  update(id: string, updatedTrackDto: Partial<Track>): TrackResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const track = db.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(`Track with id: ${id} not found!`);
    }

    Object.assign(track, updatedTrackDto);

    return {
      id: track.id,
      name: track.name,
      artistId: track.artistId,
      albumId: track.albumId,
      duration: track.duration,
    };
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const track = db.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(`Track with id: ${id} not found!`);
    }

    db.favorites.tracks = db.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );

    db.tracks = db.tracks.filter((track) => track.id !== id);
  }
}
