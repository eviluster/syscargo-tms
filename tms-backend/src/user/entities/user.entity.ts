import { Notification } from 'src/notifications/entities/notification.entity';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { Role } from 'src/roles/entities/role.entity';

export enum TipoCarga {
  SECO = 'Seco',
  REFRIGERADO = 'Refrigerado',
  CARGA_GENERAL = 'Carga general',
}

export enum Contenedor {
  C20 = '20',
  C40 = '40',
}

/**
 * Estructuras simples para tipado local.
 * Si prefieres importarlas desde DTOs o desde un fichero shared, podemos moverlas.
 */
export type TransporteStructure = {
  nombreChofer?: string;
  chapa?: string;
  tipoTransporte?: string;
};

export type LicenciaStructure = {
  numero?: string;
  categoria?: string;
  vence?: string; // ISO string YYYY-MM-DD
};

export type AyudanteStructure = {
  nombre?: string;
  apellidos?: string;
  ci?: string;
};

@Entity('users')
export class User extends BasicEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  hash: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Notification, (notification) => notification.userOrigin, {
    cascade: false,
  })
  notifyOrigin: Notification[];

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role' })
  role: Role;

  @Column({ nullable: true, default: false })
  isLogged: boolean;

  @Column({ nullable: true })
  comercial_code: number;
}
