import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BasicEntity } from 'src/common/base/entities/basic.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken extends BasicEntity {
  @Column({ unique: true })
  token: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  email: string;
}
