import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { Plan } from './Plan';
import { Permission } from './Permission';

@Entity('plan_permissions')
export class PlanPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @Column({ nullable: true })
  limit_value: number; // For quantifiable permissions (e.g., max matches)

  @Column({ default: true })
  is_allowed: boolean; // For boolean permissions (e.g., analytics access)

  @CreateDateColumn()
  createdAt: Date;
}