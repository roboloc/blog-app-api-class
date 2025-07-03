import cors from "cors";
import express, { Express } from "express";
import "reflect-metadata";
import { errorMiddleware } from "./middlewares/error.middleware";
import { PORT } from "./config/env";
import { SampleRouter } from "./modules/sample/sample.router";
import { UserRouter } from "./modules/user/user.router";
import { AuthRouter } from "./modules/auth/auth.router";

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  //fungsi dalam sebuah class disebut method;
  //private hanya bisa di access untuk App
  private configure() {
    this.app.use(cors());
    this.app.use(express.json()); // untuk menerima request body
  }

  //dua method akan dijalankan ketika class dipanggil
  private routes() {
    const sampleRouter = new SampleRouter();
    const userRouter = new UserRouter();
    const authRouter = new AuthRouter();

    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/users", userRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
  }

  private handleError() {
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`Server running on Port : ${PORT}`);
    });
  }
}
