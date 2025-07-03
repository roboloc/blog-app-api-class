import { User } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { PasswordService } from "../auth/password.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";

export class UserService {
  private prisma: PrismaService;
  private cloudinaryService: CloudinaryService;
  private mailService: MailService;
  private passwordService: PasswordService;

  constructor() {
    this.prisma = new PrismaService();
    this.cloudinaryService = new CloudinaryService();
    this.mailService = new MailService();
    this.passwordService = new PasswordService();
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

  createUser = async (body: User, image?: Express.Multer.File) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (user) {
      throw new ApiError("email already in use!", 400);
    }

    if (image) {
      const { secure_url } = await this.cloudinaryService.upload(image);
      body.profilePic = secure_url;
    }

    const hashedPassword = await this.passwordService.hashPassword(
      body.password
    );

    const newUser = await this.prisma.user.create({
      // jika ada spread data dan ada , bagian kedua maka
      // akan mereplace property yang sama dalam body
      data: { ...body, password: hashedPassword },
      omit: { password: true },
    });

    //to dan subject, lalu isinya
    await this.mailService.sendEmail(body.email, "Selamat Datang!", "welcome", {
      name: newUser.name,
    });

    return newUser;
  };
}
