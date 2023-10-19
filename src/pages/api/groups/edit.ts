import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  const { id, name, description, isPublic } = req.body;

  // Validation des données entrantes
  if (!id || !name || !description) {
    return res.status(400).json({ error: 'Id, name, and description are required.' });
  }

  try {
    // Mise à jour du groupe
    const updatedGroup = await prisma.group.update({
      where: {
        id: id
      },
      data: {
        name,
        description,
        isPublic
      }
    });

    if (!updatedGroup) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    return res.status(200).json(updatedGroup);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the group.' });
  }
}
