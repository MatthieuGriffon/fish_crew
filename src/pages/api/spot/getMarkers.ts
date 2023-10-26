import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// API pour récupérer les marqueurs de l'utilisateur connecté
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userId = req.query.userId?.toString(); // Récupérer l'ID de l'utilisateur depuis la requête
      const markers = await prisma.spot.findMany({
        where: {
          userId: {
            equals: userId, // Filtrer les marqueurs par l'ID de l'utilisateur
          },
        },
      });
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
