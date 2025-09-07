import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model';
import { Op } from 'sequelize';

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
        throw { status: 400, message: "User with this email or username already exists" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return { status: 201, user };
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw { status: 400, message: "Email or Username must be unique" };
      }
      if (error.name === "SequelizeValidationError") {
        throw {
          status: 400,
          message: error.errors.map((e: any) => e.message).join(", "),
        };
      }

      if (error.status) {
        throw error;
      }

      console.error("Register error:", error);
      throw { status: 500, message: "Internal server error" };
    }
  }

    static async login(email: string, password: string) {
      console.log("Attempting login for email:", email);
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid credentials");

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