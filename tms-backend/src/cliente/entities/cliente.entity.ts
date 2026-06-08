import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { User } from 'src/user/entities/user.entity';
import { Carga } from 'src/carga/entities/carga.entity';
// import type para evitar problemas de runtime por ciclos
import { Solicitud } from 'src/solicitudes/solicitudes.entity';

@Entity('cliente')
export class Client extends BasicEntity {
  @OneToOne(() => User, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  contact_name?: string;

  @Column({ nullable: true })
  contact_phone?: string;

  @Column({ nullable: true })
  tax_id?: string; // DNI / RUC etc.

  // datos que quieras cachear (opcional)
  @Column({ nullable: true })
  address?: string;

  // Nuevo campo modalidad
  @Column({ nullable: true })
  modalidad?: string;

  // Relación: un cliente tiene muchas cargas
  @OneToMany(() => Carga, (c) => c.cliente)
  cargas?: Carga[];

  /**
   * Relación: un cliente puede tener muchas solicitudes de alquiler.
   * Agregada para evitar el error "'solicitudes' no existe en Client".
   */
  @OneToMany(() => Solicitud, (s) => s.cliente, { nullable: true })
  solicitudes?: Solicitud[];
}
