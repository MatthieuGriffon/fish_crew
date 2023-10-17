import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = req.query.userId as string;
    console.log ('userId de la requete group.ts', userId)
    if (!userId) {
      res.status(400).json({ error: 'Missing userId parameter' });
      return;
    }

    try {
      const userGroups = await prisma.groupMember.findMany({
        where: {
          userId: userId,
        },
        include: {
          group: true,
        },
      });

      const allGroupMembers: { [key: string]: Array<any> } = {};

      for (let groupItem of userGroups) {
        const groupId = groupItem.group.id;
        const groupMembers = await prisma.groupMember.findMany({
          where: {
            groupId: groupId,
          },
          select: {
            user: true,
            joinedAt: true,
          },
          orderBy: {
            joinedAt: 'asc',
          },
        });

        allGroupMembers[groupId] = groupMembers;
      }

      console.log ('userGroups de la requete group.ts', userGroups);
      console.log('allGroupMembers de la requete group.ts', allGroupMembers);

      // Combinez les données ou ajustez selon les besoins avant d'envoyer la réponse
      res.status(200).json({
        userGroups,
        allGroupMembers,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end();
  }
}
