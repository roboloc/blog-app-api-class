import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";

export class UserService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  getUsers = async () => {
    return await this.prisma.user.findMany({
      omit: { password: true },
    });
  };
  getUser = async (id: number) => {
    const user = await this.prisma.user.findFirst({
      where: { id: id },
    });
    if (!user) {
      throw new ApiError("user not found", 400);
    }
    return user;
  };
}
