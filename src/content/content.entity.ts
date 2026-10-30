import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Tenant } from 'src/tenants/tenants.entity';
import { ContentType } from 'src/content-types/content-type.entity';

@Entity('content_records')
export class ContentRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'tenant_id' })
  tenantId!: number;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @Column({ name: 'content_type_id' })
  contentTypeId!: number;

  @ManyToOne(() => ContentType)
  @JoinColumn({ name: 'content_type_id' })
  contentType!: ContentType;

  @Column({ type: 'json' })
  data!: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
  })
  deletedAt!: Date | null;
}