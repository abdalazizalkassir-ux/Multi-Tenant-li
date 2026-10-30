import {Column , CreateDateColumn,Entity,PrimaryGeneratedColumn,} from 'typeorm';

@Entity('tenants')
export class Tenant{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @CreateDateColumn({name:'created_at'})
    createdAt! : Date;

    @Column({name:'deleted_at',type:'datetime',nullable:true})
    deletedAt!:Date | null;

}