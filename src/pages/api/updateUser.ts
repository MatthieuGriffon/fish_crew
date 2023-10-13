import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      res.status(401).json({ error: 'No authorization header' });
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    if (token) {
      try {
        if (!process.env.JWT_SECRET) {
          res.status(500).json({ error: 'JWT_SECRET environment variable is not set' });
          return;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { userId: string; email: string };
        const user = await prisma.user.findUnique({
          where: { id: decodedToken.userId },
        });

        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        const updatedUserData = req.body;
        const updatedUser = await prisma.user.update({
          where: { id: decodedToken.userId },
          data: updatedUserData,
        });

        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
      }
    } else {
      res.status(401).json({ error: 'No token provided' });
    }
  } else {
    res.status(405).end();
  }
}
