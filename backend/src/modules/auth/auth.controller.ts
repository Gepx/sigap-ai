import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.service.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.service.login(email, password);

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: user
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  logout = (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}
