import { Injectable } from '@nestjs/common';
import { db } from '../common/database';
import { Album } from './interfaces/album.interface';
import { AlbumResponseDto } from './dto/album-response.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { generateId } from '../common/uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class AlbumService {
  findAll(): AlbumResponseDto[] {
    return db.albums;
  }

  findOne(id: string): AlbumResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const album = db.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album with id: ${id} not found!`);
    }

    return album;
  }

  create(dto: CreateAlbumDto): AlbumResponseDto {
    if (!dto.name || typeof dto.year !== 'number') {
      throw new BadRequestException();
    }

    const newAlbum: Album = {
      id: generateId(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId,
    };

    db.albums.push(newAlbum);

    return newAlbum;
  }

  update(id: string, updatedAlbumDto: Partial<Album>): AlbumResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const album = db.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album with id: ${id} not found!`);
    }

    Object.assign(album, updatedAlbumDto);

    return {
      id: album.id,
      name: album.name,
      year: album.year,
      artistId: album.artistId,
    };
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const album = db.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album with id: ${id} not found!`);
    }

    db.favorites.albums = db.favorites.albums.filter(
      (albumId) => albumId !== id,
    );

    db.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    db.albums = db.albums.filter((album) => album.id !== id);
  }
}
