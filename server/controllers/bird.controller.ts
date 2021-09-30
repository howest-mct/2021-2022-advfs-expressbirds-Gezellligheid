import { plainToClass } from "class-transformer";
import { NextFunction, Router, Response, Request } from "express";
import { getRepository, Repository } from "typeorm";
import { Bird } from "../entities/Bird";

export default class BirdController {
  public router = Router();
  repository: Repository<Bird>;

  constructor() {
    this.repository = getRepository(Bird);
    this.router.get("/all", this.all);
    this.router.get("/:id", this.findBird);
    // this.router.post("/", this.add);
    // this.router.delete("/:id", this.remove);
  }

  findBird = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const bird = await this.repository.findOne({ id: id });
    res.send(bird);
  };

  all = async (req: Request, res: Response, next: NextFunction) => {
    const birds = await this.repository.find();

    res.send(birds);
  };

  // add = (req: Request, res: Response, next: NextFunction) => {
  //   birds.push(req.body);
  //   res.json(req.body);
  // };

  // remove = (req: Request, res: Response, next: NextFunction) => {
  //   let birdToDelete = this.birds.filter((item, index) => {
  //     return item.id == req.params.id;
  //   })[0];
  //   let indexOfBird = this.birds.indexOf(birdToDelete);
  //   this.birds.splice(indexOfBird, 1);
  //   res.json(this.birds);
  // };
}
