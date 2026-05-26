import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository.js';

export class AuthService {
  private repository = new AuthRepository();

  async register(userData: any) {
    const existingUser = await this.repository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = await this.repository.createUser({
      ...userData,
      password: hashedPassword,
      // Fallback to role_id 2 if not provided (assuming 2 is a default user role)
      role_id: userData.role_id || 2 
    });

    return newUser;
  }

  async login(email: string, password: string) {
    const user = await this.repository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const payload = {
      userId: user.id,
      uuid: user.uuid,
      roleId: user.role_id
    };

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
