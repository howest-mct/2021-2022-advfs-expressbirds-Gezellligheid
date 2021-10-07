import { plainToClass } from "class-transformer";
import { Connection, getRepository } from "typeorm";
import { Bird } from "../entities/Bird";
import { Config } from "../entities/config";
import { User } from "../entities/User";
import birds from "./birds.json";
import users from "./users.json";

const seedDatabase = async (connection: Connection) => {
  const seeded = await getRepository("config").findOne({ key: "seeded" });
  if (seeded === undefined) {
    const birdsOrm = plainToClass(Bird, birds);
    const userOrm = plainToClass(User, users);
    await connection.manager.save<Bird>(birdsOrm);
    await connection.manager.save<User>(userOrm);

    const isSeeded = new Config();
    isSeeded.key = "seeded";
    isSeeded.value = "true";
    await connection.manager.save(isSeeded);
    console.log("✅ Seeding has been done");
  } else {
    console.log("👍 Database is already seeded");
  }
};

export default seedDatabase;
