import { plainToClass } from "class-transformer";
import { Connection, getRepository } from "typeorm";
import { Bird } from "../entities/Bird";
import { Config } from "../entities/config";
import birds from "./birds.json";

const seedDatabase = async (connection: Connection) => {
  const seeded = await getRepository("config").findOne({ key: "seeded" });
  if (seeded === undefined) {
    const birdsOrm = plainToClass(Bird, birds);
    await connection.manager.save<Bird>(birdsOrm);

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
