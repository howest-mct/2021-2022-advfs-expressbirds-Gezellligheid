// app.ts
import express, { Request, Response } from "express";

// Loading bird data
const birds = require("./birds.json");

// APP SETUP
const app = express(),
  port = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json()); // for parsing application/json

// ROUTES

// Delivering bird data to the main route
app.get("/", (request: Request, response: Response) => {
  response.json({ data: birds });
});

// APP START
app.listen(port);
console.info(`\nServer 👾 \nListening on http://localhost:${port}/`);
