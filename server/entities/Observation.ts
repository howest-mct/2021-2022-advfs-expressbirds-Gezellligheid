import { Entity } from "typeorm";
import { User } from "./User";

@Entity("observation")
export class Observation {
  uuid?: string;
  location?: string;
  date?: Date;
  user?: User;
}
