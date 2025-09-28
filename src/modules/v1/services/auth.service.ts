import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model';
import { Op } from 'sequelize';
import { AUTH_MESSAGES } from '../../../constants/messages';
import { HTTP_STATUS } from '../../../constants/status-codes';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
export class AuthService {
static async register({ username, email, password }: any) {
    try {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: AUTH_MESSAGES.USER_EXISTS };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return { status: HTTP_STATUS.CREATED, user };
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: AUTH_MESSAGES.EMAIL_USERNAME_UNIQUE };
      }
      if (error.name === "SequelizeValidationError") {
        throw {
          status: HTTP_STATUS.BAD_REQUEST,
          message: error.errors.map((e: any) => e.message).join(", "),
        };
      }

      if (error.status) {
        throw error;
      }

      console.error("Register error:", error);
      throw { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: AUTH_MESSAGES.INTERNAL_ERROR };
    }
  }

    static async login(email: string, password: string) {
      console.log("Attempting login for email:", email);
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const token = jwt.sign(
      { id: user.id, email: user.email, subscription: user.subscription },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { token, user };
  }

  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }

}