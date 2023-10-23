import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { groupId, userId } = req.body;

  // Validation des données entrantes
  if (!groupId || !userId) {
    return res.status(400).json({ error: 'GroupId and userId are required.' });
  }

  try {
    // Trouver le bon rôle en fonction du nom du rôle
    const userRole = await prisma.role.findFirst({ where: { name: 'Member' } }); // Remplacez 'Member' par le rôle approprié

    if (!userRole) {
      // Gérer l'erreur si le rôle n'existe pas
      return res.status(404).json({ error: 'Role not found.' });
    }

    // Ajout de l'utilisateur au groupe avec le rôle approprié
    await prisma.groupMember.create({
      data: {
        groupId,
        userId,
        roleId: userRole.id, // Utiliser le roleId trouvé ici
      },
    });

    return res.status(200).json({ message: 'Utilisateur ajouté avec succès au groupe' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout de l\'utilisateur au groupe.' });
  }
}
