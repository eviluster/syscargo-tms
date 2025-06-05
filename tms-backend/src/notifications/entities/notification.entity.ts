import { User } from "src/user/entities/user.entity";
import { BasicEntity } from "../../common/base/entities";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { notifyEnum } from "src/common/enum/notify.enum";
import { DestinationType } from "src/common/base/types/destination.type";

@Entity('notifications')
export class Notification extends BasicEntity {


    @ManyToOne(() => User, { eager: false })
    userOrigin: User;

    @Column({
        enum:notifyEnum,
        default: notifyEnum.USERS
    })
    destinyType: notifyEnum

    @Column(
        'json'
    )
    destinyUser: DestinationType[]
    
    @Column({
        type: "varchar"
    })
    message: string
}
