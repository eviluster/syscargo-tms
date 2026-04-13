import { Column } from 'typeorm';
import { BasicEntity } from './basic.entity';

export abstract class BasicInformationEntity
  extends BasicEntity
{
  @Column( { nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

}
