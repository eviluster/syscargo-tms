// src/settings/entities/setting.entity.ts
import { Entity, Column, Index } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';

export type SettingType = 'string' | 'html' | 'markdown' | 'json';

@Entity('setting')
export class Setting extends BasicEntity {
  @Index({ unique: true })
  @Column({ length: 200 })
  key: string;

  // guardamos el contenido tal cual (html/json/text)
  @Column({ type: 'text', nullable: true })
  value: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  type?: SettingType;
}
