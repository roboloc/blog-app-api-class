import { Router } from "express";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserController } from "./user.controller";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET } from "../../config/env";

export class UserRouter {
  router: Router;
  userController: UserController;
  uploaderMiddleware: UploaderMiddleware;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    //pada constructor ekseskusi codenya beurutan dari paling atas
    this.router = Router();
    this.userController = new UserController();
    this.uploaderMiddleware = new UploaderMiddleware();
    this.jwtMiddleware = new JwtMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(
      "/",
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      this.jwtMiddleware.verifyRole(["ADMIN"]),
      this.userController.getUsers
    );
    this.router.get("/:id", this.userController.getUser);
    this.router.post(
      "/",
      this.uploaderMiddleware
        .upload()
        .fields([{ name: "profilePic", maxCount: 1 }]),
      this.uploaderMiddleware.fileFilter([
        "image/jpeg",
        "image/png",
        "image/avif",
        "image/heic",
      ]), // cara menenntukan datanya tinggal control + spasi
      validateBody(CreateUserDTO), // bisa menggunakan multiple middleware dan
      //  dijalankan per line ini yang dinamakaan soc
      this.userController.createUser
    );
  };

  public getRouter = () => {
    return this.router;
  };
}
