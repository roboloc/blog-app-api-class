import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getUsers();
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await this.userService.getUser(id);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const image = files.profilePic?.[0];
      const result = await this.userService.createUser(req.body, image);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
