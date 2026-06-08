// src/settings/settings.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateOrUpdateSettingDto } from './dto/create-update-setting.dto';
import { JwtGuard } from 'src/auth/guard';
import { Setting } from './entities/settings.entity';

@Controller('settings')
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}

  @Get(':key')
  async getByKey(@Param('key') key: string) {
    return { data: await this.svc.getByKey(key) };
  }

  // Nuevo: GET /settings/:key/render -> HTML sanitizado (si aplica)
  @Get(':key/render')
  async renderByKey(@Param('key') key: string) {
    const rendered = await this.svc.renderSettingToHtml(key);
    if (!rendered) return { data: null };
    return { data: rendered }; // { html, type }
  }

  @Get()
  async list(@Query('prefix') prefix?: string) {
    if (prefix) {
      const list = await this.svc.list(prefix);
      return { data: list };
    }
    const all = await this.svc.findAll();
    return { data: all };
  }

  @UseGuards(JwtGuard)
  @Post()
  async createOrUpdate(@Body() dto: CreateOrUpdateSettingDto) {
    console.log('CreateOrUpdateSettingDto', dto);
    const saved = await this.svc.createOrUpdate(dto as any);
    return { data: saved };
  }

  /**
   * Nuevo: actualizar/reemplazar por key
   * Ej: PUT /v1/settings/my_key  { value, type }
   */
  @UseGuards(JwtGuard)
  @Put(':key')
  async updateByKey(
    @Param('key') key: string,
    @Body() dto: CreateOrUpdateSettingDto,
  ) {
    const saved = await this.svc.createOrUpdate({ key, ...dto } as any);
    return { data: saved };
  }

  /**
   * Nuevo: parchear JSON (merge) por key
   * Ej: PATCH /v1/settings/my_json_key  { "subkey": "new" }
   * Esto usará updateJsonKey que ya tienes implementado.
   */
  @UseGuards(JwtGuard)
  @Patch(':key')
  async patchByKey(
    @Param('key') key: string,
    @Body() patch: Record<string, any>,
  ) {
    const updated = await this.svc.updateJsonKey(key, patch);
    return { data: updated };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
