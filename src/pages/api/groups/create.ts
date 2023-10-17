import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, description, isPublic } = req.body;
  const userId = req.body.userId;  // ou obtenir l'ID de l'utilisateur via un token ou une session

  if (!name || !description || !userId) {
    return res.status(400).json({ error: 'Name, description, and userId are required.' });
  }

  try {
    // Recherchez l'ID du rôle GroupAdmin:
    const groupAdminRole = await prisma.role.findFirst({
      where: {
        name: RoleName.GroupAdmin
      }
    });

    if (!groupAdminRole) {
      return res.status(400).json({ error: 'GroupAdmin role not found.' });
    }

    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
        isPublic,
        groupMembers: {
          create: {
            userId,
            roleId: groupAdminRole.id  // Utilisez l'ID du rôle trouvé
          }
        }
      }
    });

    return res.status(201).json(newGroup);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while creating the group.' });
  }
}
