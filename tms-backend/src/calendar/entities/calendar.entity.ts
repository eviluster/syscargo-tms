import { Entity, Column, OneToMany } from 'typeorm';
import { BasicInformationEntity } from 'src/common/base/entities';
import { CalendarStateEnum } from '../enum/calendar-day.enum';

@Entity('calendar')
export class Calendar extends BasicInformationEntity {
  @Column()
  fecha: Date;

  @Column()
  inicio: number;

  @Column({ nullable: true })
  fin: number;

  @Column()
  fullDay: boolean;

  @Column({ nullable: true })
  user: string;

  @Column()
  state: CalendarStateEnum;

  @Column({ nullable: true })
  isService: boolean;
}
