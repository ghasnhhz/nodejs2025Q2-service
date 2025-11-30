import { Injectable } from '@nestjs/common';
import { db } from '../common/database';
import { Artist } from './interfaces/artist.interface';
import { ArtistResponseDto } from './dto/artist-response.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { generateId } from '../common/uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ArtistService {
  findAll(): ArtistResponseDto[] {
    return db.artists;
  }

  findOne(id: string): ArtistResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    const artist = db.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`Artist with id: ${id} not found!`);
    }

    return artist;
  }

  create(dto: CreateArtistDto): ArtistResponseDto {
    if (!dto.name || dto.grammy === undefined) {
      throw new BadRequestException('Please provide all required fields!');
    }

    const newArtist: Artist = {
      id: generateId(),
      name: dto.name,
      grammy: dto.grammy,
    };

    db.artists.push(newArtist);

    return newArtist;
  }

  update(id: string, updatedArtistDto: Partial<Artist>): ArtistResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    if (
      updatedArtistDto.name !== undefined &&
      typeof updatedArtistDto.name !== 'string'
    ) {
      throw new BadRequestException('Invalid name value');
    }

    if (
      updatedArtistDto.grammy !== undefined &&
      typeof updatedArtistDto.grammy !== 'boolean'
    ) {
      throw new BadRequestException('Invalid grammy value');
    }

    const artist = db.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`Artist with id: ${id} not found!`);
    }

    Object.assign(artist, updatedArtistDto);

    return {
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    };
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    const artist = db.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`Artist with id: ${id} not found!`);
    }

    db.favorites.artists = db.favorites.artists.filter(
      (artistId) => artistId !== id,
    );

    db.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    db.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    db.artists = db.artists.filter((artist) => artist.id !== id);
  }
}
