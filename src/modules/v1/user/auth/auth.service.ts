import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../../../../config/db';
import { User } from '../../shared/entities/User';
import { Match } from '../../shared/entities/Match';
import { AUTH_MESSAGES } from '../../../../constants/messages';
import { HTTP_STATUS } from '../../../../constants/status-codes';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
  static async register({ username, email, password }: any) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({
        where: [
          { email },
          { username }
        ]
      });

      if (existingUser) {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: AUTH_MESSAGES.USER_EXISTS };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        username,
        email,
        password: hashedPassword,
      });
      
      await userRepository.save(user);

      return { status: HTTP_STATUS.CREATED, user };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: HTTP_STATUS.BAD_REQUEST, message: AUTH_MESSAGES.EMAIL_USERNAME_UNIQUE };
      }

      if (error.status) {
        throw error;
      }

      console.error("Register error:", error);
      throw { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: AUTH_MESSAGES.INTERNAL_ERROR };
    }
  }

  static async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const matchRepository = AppDataSource.getRepository(Match);
    
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        isGlobalAdmin: user.is_global_admin, 
        tenantId: user.tenant_id,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    let activeMatchId = null;
    if (user.tenant_id) {
      const activeMatch = await matchRepository.findOne({
        where: { 
          tenant_id: user.tenant_id, 
          is_active: true 
        },
        select: ['id']
      });
      activeMatchId = activeMatch?.id || null;
    }
    return { token, user, activeMatchId };
  }

  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
}