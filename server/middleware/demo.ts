import { Request, Response, NextFunction, response } from "express";
export const middelwareDemo = (
  next: NextFunction,
  req: Request,
  res: Response
) => {
  response.set("Grapje", ":_)");
  next();
};
