import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }

  const { groupId } = req.body;
  const userId = req.body.userId;  // ou obtenir l'ID de l'utilisateur via un token ou une session

  if (!groupId || !userId) {
    return res.status(400).json({ error: 'GroupId and userId are required.' });
  }

  try {
    // Récupérer le premier membre du groupe (basé sur la date d'inscription la plus ancienne)
    const earliestGroupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: groupId
      },
      orderBy: {
        joinedAt: 'asc'
      }
    });

    // Si l'utilisateur actuel n'est pas le premier membre (créateur) du groupe, refuser la suppression
    if (!earliestGroupMember || earliestGroupMember.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this group.' });
    }

    // Supprimez tous les chats liés au groupe
    await prisma.chat.deleteMany({
      where: { groupId: groupId }
    });

    // Supprimez toutes les prises associées aux événements du groupe
    const eventsForGroup = await prisma.event.findMany({
      where: { groupId: groupId },
      select: { id: true }
    });

    const eventIds = eventsForGroup.map(e => e.id);

    await prisma.catch.deleteMany({
      where: { eventId: { in: eventIds } }
    });

    // Supprimez tous les événements du groupe
    await prisma.event.deleteMany({
      where: { groupId: groupId }
    });

    // Supprimez tous les spots liés au groupe
    await prisma.spot.deleteMany({
      where: { groupId: groupId }
    });

    // Supprimez tous les membres du groupe
    await prisma.groupMember.deleteMany({
      where: { groupId: groupId }
    });

    // Supprime le groupe lui-même
    await prisma.group.delete({
      where: { id: groupId }
    });

    return res.status(204).end();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while deleting the group.' });
  }
}
