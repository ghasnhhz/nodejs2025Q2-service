import { Injectable } from '@nestjs/common';
import { db } from '../common/database';
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { FavoritesResponse } from './dto/favorites-response.dto';

@Injectable()
export class FavoritesService {
  findAll(): FavoritesResponse {
    return {
      artists: db.favorites.artists
        .map((id) => db.artists.find((artist) => artist.id === id))
        .filter(Boolean),
      albums: db.favorites.albums
        .map((id) => db.albums.find((album) => album.id === id))
        .filter(Boolean),
      tracks: db.favorites.tracks
        .map((id) => db.tracks.find((track) => track.id === id))
        .filter(Boolean),
    };
  }

  createTrack(id: string): object {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const track = db.tracks.find((track) => track.id === id);

    if (!track) {
      throw new UnprocessableEntityException(
        `There is not a track with id: ${id}`,
      );
    }

    if (db.favorites.tracks.includes(id)) {
      return { message: `Track '${track.name}' is already in favorites` };
    }

    db.favorites.tracks.push(id);
    return {
      message: `Track ${track.name} was added to favorite tracks successfully`,
    };
  }

  deleteTrack(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    if (!db.favorites.tracks.includes(id)) {
      throw new NotFoundException('Track not found in favorites');
    }

    db.favorites.tracks = db.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  createAlbum(id: string): object {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const album = db.albums.find((album) => album.id === id);

    if (!album) {
      throw new UnprocessableEntityException(
        `There is not an album with id: ${id}`,
      );
    }

    if (db.favorites.albums.includes(id)) {
      return { message: `Album '${album.name}' is already in favorites` };
    }

    db.favorites.albums.push(id);
    return {
      message: `Album ${album.name} was added to favorite albums successfully`,
    };
  }

  deleteAlbum(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    if (!db.favorites.albums.includes(id)) {
      throw new NotFoundException('Album not found in favorites');
    }

    db.favorites.albums = db.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
  }

  createArtist(id: string): object {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    const artist = db.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new UnprocessableEntityException(
        `There is not an artist with id: ${id}`,
      );
    }

    if (db.favorites.artists.includes(id)) {
      return { message: `Artist '${artist.name}' is already in favorites` };
    }

    db.favorites.artists.push(id);
    return {
      message: `Artist ${artist.name} was added to favorite artists successfully`,
    };
  }

  deleteArtist(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    if (!db.favorites.artists.includes(id)) {
      throw new NotFoundException('Artist not found in favorites');
    }

    db.favorites.artists = db.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }
}
