import { Request } from 'express';
import { UserRole } from '../../database/models/user.model';

export interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: UserRole;
  };
}