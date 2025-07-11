import { JWT_SECRET } from "../../config/env";
import { User } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;
  private tokenService: TokenService;

  constructor() {
    this.prisma = new PrismaService();
    this.passwordService = new PasswordService();
    this.tokenService = new TokenService();
  }

  login = async (body: Pick<User, "email" | "password">) => {
    // cek dulu emailnya ada ga di database
    // kalau ga ada throw error
    // kalau ada cek passwordnya valid atau tidak
    // kalau tidak valid throw error
    // kalau valid generate access token menggunakan jwt
    // return data user beserta tokennya

    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (!user) {
      throw new ApiError("email not found", 404);
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      body.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError("invalid password", 404);
    }

    const accessToken = this.tokenService.generateToken(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET!
    );

    const { password, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, accessToken };
  };
}
