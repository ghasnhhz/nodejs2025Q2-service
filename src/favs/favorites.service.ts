import { Injectable } from '@nestjs/common';
import { prisma } from '../common/database';
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { FavoritesResponse } from './dto/favorites-response.dto';

@Injectable()
export class FavoritesService {
  async findAll(): Promise<FavoritesResponse> {
    const favorites = await prisma.favorites.findFirst();

    if (!favorites) {
      return {
        artists: [],
        albums: [],
        tracks: [],
      };
    }

    const artists = await prisma.artist.findMany({
      where: {
        id: { in: favorites.artists },
      },
    });

    const albums = await prisma.album.findMany({
      where: {
        id: { in: favorites.albums },
      },
    });

    const tracks = await prisma.track.findMany({
      where: {
        id: { in: favorites.tracks },
      },
    });

    return {
      artists: artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        grammy: artist.grammy,
      })),
      albums: albums.map((album) => ({
        id: album.id,
        name: album.name,
        year: album.year,
        artistId: album.artistId,
      })),
      tracks: tracks.map((track) => ({
        id: track.id,
        name: track.name,
        duration: track.duration,
        artistId: track.artistId,
        albumId: track.albumId,
      })),
    };
  }

  async createTrack(id: string): Promise<object> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const track = await prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new UnprocessableEntityException("Track with id doesn't exist.");
    }

    let favorites = await prisma.favorites.findFirst();

    if (!favorites) {
      favorites = await prisma.favorites.create({
        data: {
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }

    await prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        tracks: [...favorites.tracks, id],
      },
    });

    return {
      id: track.id,
      name: track.name,
      duration: track.duration,
      artistId: track.artistId,
      albumId: track.albumId,
    };
  }

  async deleteTrack(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid trackId format!');
    }

    const favorites = await prisma.favorites.findFirst();

    if (!favorites) {
      throw new NotFoundException('Favorites not found.');
    }

    const track = favorites.tracks.find((trackId) => trackId === id);

    if (!track) {
      throw new NotFoundException('Track was not found.');
    }

    await prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        tracks: favorites.tracks.filter((trackId) => trackId !== id),
      },
    });

    return;
  }

  async createAlbum(id: string): Promise<object> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const album = await prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new UnprocessableEntityException(
        `There is not an album with id: ${id}`,
      );
    }

    let favorites = await prisma.favorites.findFirst();

    if (!favorites) {
      favorites = await prisma.favorites.create({
        data: {
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }

    await prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        albums: [...favorites.albums, id],
      },
    });

    return {
      message: `Album ${album.name} was added to favorite albums successfully`,
    };
  }

  async deleteAlbum(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid albumId format!');
    }

    const favorites = await prisma.favorites.findFirst();

    if (!favorites) {
      throw new NotFoundException('Favorites not found.');
    }

    const album = favorites.albums.find((albumId) => albumId === id);

    if (!album) {
      throw new NotFoundException('Album was not found.');
    }

    await prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        albums: favorites.albums.filter((albumId) => albumId !== id),
      },
    });
  }

  async createArtist(id: string): Promise<object> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    const artist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new UnprocessableEntityException(
        `There is not an artist with id: ${id}`,
      );
    }

    let favorites = await prisma.favorites.findFirst();

    if (!favorites) {
      favorites = await prisma.favorites.create({
        data: {
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }

    await prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: [...favorites.artists, id],
      },
    });

    return {
      message: `Artist ${artist.name} was added to favorite artists successfully`,
    };
  }

  async deleteArtist(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artistId format!');
    }

    const favorites = await prisma.favorites.findFirst();

    if (!favorites) {
      throw new NotFoundException('Favorites not found.');
    }

    const artist = favorites.artists.find((artistId) => artistId === id);

    if (!artist) {
      throw new NotFoundException('Artist was not found.');
    }

    await prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: favorites.artists.filter((artistId) => artistId !== id),
      },
    });
  }
}
