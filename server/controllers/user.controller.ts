import { NextFunction, Router, Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { plainToClass } from "class-transformer";

export default class UserController {
  public router = Router();
  repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
    this.router.get("/", this.allUsers);
    this.router.get("/:uuid", this.getUserById);
    this.router.delete("/:uuid", this.deleteUser);
    this.router.post("/", this.addUser);
  }

  // Get all users and return to endpoint
  allUsers = async (req: Request, res: Response, next: NextFunction) => {
    res.send(await this.repository.find());
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    res.send(await this.repository.findOne({ uuid: req.params.uuid }));
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    res.send(await this.repository.delete({ uuid: req.params.uuid }));
  };

  addUser = async (req: Request, res: Response, next: NextFunction) => {
    const toAddUser: User = plainToClass(User, req.body);
    res.send(await this.repository.insert(toAddUser));
  };
}
