import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;

  @Column()
  name?: string;

  @Column()
  locationOfResidence?: string;

  @Column()
  age?: number;

  @Column()
  gender?: string;

  @Column({ type: "date" })
  registrationDate?: string;
}
