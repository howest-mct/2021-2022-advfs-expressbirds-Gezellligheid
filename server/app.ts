// app.ts
import express, { Request, Response, Router } from "express";
import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { middelwareDemo } from "./middleware/demo";
import { Bird } from "./entities/Bird";
import BirdController from "./controllers/bird.controller";
import seedDatabase from "./seeders/seeder";
import cors from "cors";
import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from "typeorm";
import { createDatabase } from "typeorm-extension";
import UserController from "./controllers/user.controller";

// Await is now possible
(async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions(); // This line will get the connection options from the typeorm
  // Connecting database
  createDatabase({ ifNotExist: true }, connectionOptions)
    .then(() => {
      console.log("Database created");
    })
    .then(createConnection)
    .then(async (connection: Connection) => {
      // Seed database
      await seedDatabase(connection);

      const app = express(),
        port = process.env.PORT || 3000;
      // MIDDLEWARE
      app.use(cors());
      app.use(express.json()); // for parsing application/json

      // CONTROLLERS
      app.use("/bird", new BirdController().router);
      app.use("/user", new UserController().router);

      // APP START
      app.listen(port, () => {
        console.info(`\nServer 👾 \nListening on http://localhost:${port}/`);
      });
    })
    .catch((error) => {
      console.log(`An error occured: ${error}`);
    });
})();

// APP SETUP
