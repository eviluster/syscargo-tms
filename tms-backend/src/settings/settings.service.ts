// src/settings/settings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/settings.entity';
import * as sanitizeHtml from 'sanitize-html';
import * as MarkdownIt from 'markdown-it';
import { SettingType } from './entities/settings.entity';

@Injectable()
export class SettingsService {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  private CACHE_TTL_MS = 10 * 1000; // 10s, ajusta según necesites
  private md: any;

  constructor(
    @InjectRepository(Setting)
    private readonly repo: Repository<Setting>,
  ) {
    this.md = new (MarkdownIt as any)();
  }

  sanitizeIfNeeded(value: string, type: string) {
    if (type === 'html') {
      return sanitizeHtml(value, {
        allowedTags: [
          'b',
          'i',
          'em',
          'strong',
          'a',
          'p',
          'ul',
          'li',
          'ol',
          'br',
          'span',
        ],
        allowedAttributes: {
          a: ['href', 'name', 'target'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
      });
    }
    return value;
  }

  async getByKey(key: string) {
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.value;

    const s = await this.repo.findOne({ where: { key } });
    if (!s) return null;

    let parsed: any = s.value;

    if (s.type === 'json' && s.value) {
      parsed = JSON.parse(s.value);
    } else if (s.type === 'markdown') {
      const raw = s.value || '';
      const html = this.md.render(raw);
      const safe = this.sanitizeIfNeeded(html, 'html');
      parsed = { raw, html: safe };
    }

    const result = {
      value: parsed,
      type: s.type,
      key: s.key,
    };

    this.cache.set(key, {
      value: result,
      expiresAt: Date.now() + this.CACHE_TTL_MS,
    });

    return result;
  }

  async findAll(): Promise<Setting[]> {
    return this.repo.find();
  }

  async list(prefix?: string) {
    if (prefix) {
      return this.repo
        .createQueryBuilder('s')
        .where('s.key LIKE :prefix', { prefix: `${prefix}%` })
        .orderBy('s.key')
        .getMany();
    }
    return this.repo.find({ order: { key: 'ASC' } });
  }

  async createOrUpdate(dto: { key: string; value?: string; type?: string }) {
    const { key, value = null, type = 'string' } = dto;
    const sanitized = this.sanitizeIfNeeded(value, type);
    let s = await this.repo.findOne({ where: { key } });
    if (!s) {
      s = this.repo.create({
        key,
        value: sanitized,
        type: type as SettingType,
      });
    } else {
      s.value = sanitized;
      s.type = type as SettingType;
    }
    const saved = await this.repo.save(s);

    // invalidar cache para esta key
    this.cache.delete(key);
    return saved;
  }

  // Alias conveniente para "update por key" (opcional)
  async update(key: string, dto: { value?: string; type?: string }) {
    return this.createOrUpdate({ key, ...dto });
  }

  async remove(id: string) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Setting not found');
    await this.repo.remove(s);
    this.cache.delete(s.key);
    return { ok: true };
  }

  // helper: upsert json object (merges)
  async updateJsonKey(key: string, patch: Record<string, any>) {
    const s = await this.repo.findOne({ where: { key } });
    const existing =
      s && s.type === 'json' && s.value ? JSON.parse(s.value) : {};
    const merged = { ...existing, ...patch };
    const sanitized = JSON.stringify(merged);
    const updated = await this.createOrUpdate({
      key,
      value: sanitized,
      type: 'json',
    });
    return updated;
  }

  /**
   * Devuelve la representación HTML (sanitizada) del valor de la key.
   * Si la key no existe retorna null.
   */
  async renderSettingToHtml(
    key: string,
  ): Promise<{ html: string; type: string } | null> {
    const s = await this.repo.findOne({ where: { key } });
    if (!s) return null;

    let rawValue = s.value ?? '';

    // si es JSON queremos stringificarlo antes de mostrar (opcional)
    if (s.type === 'json') {
      try {
        rawValue = JSON.stringify(JSON.parse(s.value || '{}'), null, 2);
      } catch {
        rawValue = String(s.value ?? '');
      }
    }

    if (s.type === 'markdown') {
      const html = this.md.render(rawValue);
      const safe = this.sanitizeIfNeeded(html, 'html');
      return { html: safe, type: s.type };
    }

    if (s.type === 'html') {
      // ya es html, solo sanitizamos
      const safe = this.sanitizeIfNeeded(rawValue, 'html');
      return { html: safe, type: s.type };
    }

    // string u otros -> escapar & envolver en <pre> o <p>
    const escaped = this.sanitizeIfNeeded(`<p>${String(rawValue)}</p>`, 'html');
    return { html: escaped, type: s.type || 'string' };
  }
}
