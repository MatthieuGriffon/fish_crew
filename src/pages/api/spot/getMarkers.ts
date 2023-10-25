import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const markers = await prisma.spot.findMany();
      res.status(200).json(markers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not retrieve markers' });
    } finally {
      await prisma.$disconnect(); // Fermeture de l'instance Prisma
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
