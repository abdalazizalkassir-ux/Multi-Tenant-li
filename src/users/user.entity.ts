import{
Column,
CreateDateColumn,
Entity,
PrimaryGeneratedColumn,
JoinColumn,
ManyToOne,
} from 'typeorm';

import { Tenant } from 'src/tenants/tenants.entity';
import { UserRole } from './user-role.enum';


    @Entity('users')
    export class User{
        @PrimaryGeneratedColumn()
        id!: number;
        @Column({ unique: true })
        email!: string;
        @Column({ name: 'password_hash'})
        passwordHash!: string;
        
        @Column({
            type:'enum',
            enum: UserRole,
            default:UserRole.VIEWER
      })
      role!: UserRole;

        @Column({ name:'tenant_id' })
        tenantId!: number;

        @ManyToOne(()=>Tenant)
        @JoinColumn({ name:'tenant_id' })
        tenant!: Tenant;

        @CreateDateColumn({ name: 'created_at'} )
        createAt!: Date;


        @Column({
            name: 'deleted_at',
            type: 'datetime',
            nullable: true,
        })
        deletedAt!: Date | null;    


        @Column({
            name:'refresh_token_hash',
            type:'varchar',
            nullable:true,
        })
        refreshTokenHash!: string | null;


        @Column({
            name: 'refresh_token_expires_at',
            type:'datetime',
            nullable:true,
        })
        refreshTokenExpiresAt!: Date | null;
    
    
        
        @Column({
            name: 'refresh_token_id',
            type: 'varchar',
            nullable:true,
            unique:true,
        })
    refreshTokenId!: string;
    
    }