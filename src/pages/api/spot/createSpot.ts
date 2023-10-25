import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, groupId, name, description, latitude, longitude } = req.body;
      const createdSpot = await prisma.spot.create({
        data: {
          userId,
          groupId,
          name,
          description,
          latitude,
          longitude,
        },
      });
      res.status(200).json({ message: 'Spot created successfully', data: createdSpot });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not create spot' });
    } finally {
      await prisma.$disconnect(); // Fermeture de l'instance Prisma
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
