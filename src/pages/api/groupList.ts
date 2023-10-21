import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { AuthContext } from '@/contexts/AuthContext';

const prisma = new PrismaClient();
console.log('AuthContext du groupList', AuthContext);



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.userId as string;
    console.log('userId du GroupList', userId);
  if (req.method === 'GET') {
    try {
      const groups = await prisma.group.findMany();
      console.log('groups', groups);
      res.status(200).json({ groups });
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes :', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end();
  }
}