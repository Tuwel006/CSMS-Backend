// src/entity/Score.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
} from "typeorm";
import { AppDataSource } from "../../../../config/db";

@Entity("scores")
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: number;

  @Column()
  innings_no: number;

  // make it nullable to avoid immediate DB rejection while hook runs,
  // but provide default for safety. Use DECIMAL(5,1).
  @Column("decimal", { precision: 5, scale: 1, nullable: true, default: 0.0 })
  ball: number | null;

  @BeforeInsert()
  async setBall() {
    console.log("[Score.beforeInsert] match:", this.match_id, "inn:", this.innings_no);
      console.log("[Score.beforeInsert] current ball:", this.ball);
    // Get repository
    const repo = AppDataSource.getRepository(Score);

    const last = await repo
      .createQueryBuilder("s")
      .where("s.match_id = :matchId AND s.innings_no = :inningsNo", {
        matchId: this.match_id,
        inningsNo: this.innings_no,
      })
      .orderBy("s.id", "DESC")
      .getOne();

    if (!last) {
      this.ball = 0.1;
      return;
    }

    // Use toFixed to avoid float precision problems, then Number() to store numeric
    const decBall = Number(last.ball)*10;
    let frac = decBall%10;
    let real = Math.floor(decBall/10);
    if(frac>=5) {
      real++;
      frac=0;
    }
    else{
      frac++;
    }
    const newBall = (real*10+frac)/10;
    console.log(decBall,"->Real.Frac>>>>",real,".",frac," == ",newBall);
    
    this.ball = newBall;    
  }
}
