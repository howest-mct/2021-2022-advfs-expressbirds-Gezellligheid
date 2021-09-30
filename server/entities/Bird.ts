import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("birds")
export class Bird {
  @PrimaryGeneratedColumn("uuid")
  uuid?: string;

  @Column({ unique: true })
  id?: string;

  @Column({ length: 100 })
  name?: string;

  @Column("text")
  short?: string;

  @Column()
  image?: string;

  @Column("simple-array")
  recon?: string[];

  @Column("simple-json")
  food?: Record<string, string>;

  @Column("text")
  see?: string;

  sayHello = () => {
    console.log(`Hello, I am ${this.name}`);
  };
}
