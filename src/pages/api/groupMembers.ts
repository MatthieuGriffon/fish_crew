// api/groupMembers.ts

import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { groupId } = req.query;

  try {
    // Utilisez Prisma pour récupérer les membres du groupe en fonction de l'ID du groupe
    const groupMembers = await prisma.groupMember.findMany({
      where: {
        groupId: groupId as string, // Utilisez "as string" pour indiquer que groupId est une chaîne
      },
      include: {
        user: true, // Inclure les détails de l'utilisateur associé au membre du groupe
      },
    });

    if (!groupMembers) {
      res.status(404).json({ message: 'Aucun membre trouvé pour ce groupe.' });
    } else {
      res.status(200).json(groupMembers);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des membres du groupe:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des membres du groupe.' });
  } finally {
    await prisma.$disconnect(); // Assurez-vous de vous déconnecter de la base de données lorsque vous avez terminé
  }
}
