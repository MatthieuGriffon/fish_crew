import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;
  
  if (req.method === 'GET') {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
      }

      const token = authorizationHeader.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET environment variable is not set' });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { userId: string; email: string };

      if (decodedToken.userId !== userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const groups = await prisma.group.findMany();
      res.status(200).json({ groups });
    } catch (error) {
      console.error('Error fetching groups:', error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).end();
  }
}
