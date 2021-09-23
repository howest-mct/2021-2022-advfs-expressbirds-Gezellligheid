// app.ts
import express, { Request, Response } from "express";
import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { middelwareDemo } from "./middleware/demo";
import { Bird } from "./entities/Bird";

// Loading bird data
import birds from "./birds.json";
const allBirds = plainToClass(Bird, birds);

// APP SETUP
const app = express(),
  port = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json()); // for parsing application/json
// app.use(middelwareDemo);

// ROUTES

// const bird = new Bird();
// bird.name = "Marco";
// bird.sayHello();

// Delivering bird data to the main route
app.get("/birds", (request: Request, response: Response) => {
  response.json({ data: birds });
});

// Get a bird by ID
app.get("/bird/:id", (request: Request, response: Response) => {
  const id: string = request.params.id;
  response.json({
    data: allBirds.filter((item, index) => {
      return item.id == id;
    }),
  });
});

// APP START
app.listen(port);
console.info(`\nServer 👾 \nListening on http://localhost:${port}/`);
