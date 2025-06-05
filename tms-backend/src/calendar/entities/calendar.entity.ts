import { Entity, Column } from 'typeorm';
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

  @Column()
  user: string;

  @Column()
  state: CalendarStateEnum;
}
