import { Router } from "express";
import { UserController } from "./user.controller";

export class UserRouter {
  router: Router;
  userController: UserController;

  constructor() {
    //pada constructor ekseskusi codenya beurutan dari paling atas
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.userController.getUsers);
    this.router.get("/:id", this.userController.getUser);
  };

  public getRouter = () => {
    return this.router;
  };
}
