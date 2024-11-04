import express, { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      user: {
        uid: string;
        email: string;
        name: string;
      }
    }
  }
}

export const verifyToken: express.RequestHandler<{}, any, any, any, { user: { uid: string; email: string; name: string } }> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) throw new Error('No token provided');
    
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      name: decodedToken.name || decodedToken.email || 'Unknown'
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}; 