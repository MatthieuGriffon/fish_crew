import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = req.query.userId as string;
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
      console.log('userGroups', userGroups);
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
