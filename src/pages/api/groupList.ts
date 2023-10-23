import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { groupId } = req.query; 

    try {
      if (groupId) {
        const groupMembers = await prisma.groupMember.findMany({
          where: {
            groupId: groupId.toString(),
          },
          include: {
            user: true,
          },
        });

        res.status(200).json({ groupMembers });
      } else {
        const groups = await prisma.group.findMany({
          include: {
            groupMembers: {
              include: {
                user: true
              }
            }
          }
        });

        res.status(200).json({ groups });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).end();
  }
}
