import { BasicEntity } from 'src/common/base/entities';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, OneToMany } from 'typeorm';

/*
tabla roles
name unico
*/
@Entity('roles')
export class Role extends BasicEntity {
  @Column({nullable: true})
  name: string
  @Column({nullable: true})
  description: string
@OneToMany(() => User, (user) => user.role)
users: User[];

}
