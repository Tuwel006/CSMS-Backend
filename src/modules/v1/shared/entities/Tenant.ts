import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Plan } from './Plan';
// import { Plan } from './Plan';
// import { Match } from './Match';
// import { Tournament } from './Tournament';
// import { Subscription } from './Subscription';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Owner of the tenant (the user who subscribed)
  @Column()
  owner_user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_user_id' })
  owner: User;

  // Current active plan
  @Column({ nullable: true })
  plan_id: number;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

//   @OneToMany(() => Match, (match) => match.tenant)
//   matches: Match[];

//   @OneToMany(() => Tournament, (tournament) => tournament.tenant)
//   tournaments: Tournament[];

//   @OneToMany(() => Subscription, (subscription) => subscription.tenant)
//   subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
