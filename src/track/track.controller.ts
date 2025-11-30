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
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackResponseDto } from './dto/track-response.dto';
import { TrackService } from './track.service';
import { UpdateTrackDto } from './dto/upate-track.dto';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  async findAll(): Promise<TrackResponseDto[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TrackResponseDto> {
    return this.trackService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() createTrackDto: CreateTrackDto,
  ): Promise<TrackResponseDto> {
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedTrackDto: UpdateTrackDto,
  ): Promise<TrackResponseDto> {
    return this.trackService.update(id, updatedTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    this.trackService.delete(id);
  }
}
