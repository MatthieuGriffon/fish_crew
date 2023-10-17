import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = req.query.userId as string; // Récupérez l'ID de l'utilisateur depuis les paramètres de requête
    console.log ('userId de la requete group.ts', userId)
    if (!userId) {
      res.status(400).json({ error: 'Missing userId parameter' });
      return;
    }

    try {
      // Utilisez l'ID de l'utilisateur pour récupérer les groupes auxquels il appartient
      const userGroups = await prisma.groupMember.findMany({
        where: {
          userId: userId,
        },
        include: {
          group: true,
        },
      });
      console.log ('userGroups de la requete group.ts', userGroups)
      // Vous avez maintenant les groupes auxquels l'utilisateur appartient dans userGroups
      res.status(200).json(userGroups);
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end();
  }
}
