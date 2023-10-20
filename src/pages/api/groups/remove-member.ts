import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        res.status(405).end();
        return;
    }

    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        res.status(400).json({ error: 'GroupId and userId are required.' });
        return;
    }

    try {
        // Vérification de l'existence de l'utilisateur dans le groupe
        const groupMember = await prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } }
        });

        if (!groupMember) {
            res.status(404).json({ error: 'User is not a member of the group.' });
            return;
        }

        // Suppression de l'utilisateur du groupe
        await prisma.groupMember.delete({
            where: { groupId_userId: { groupId, userId } }
        });

        res.status(204).end(); // 204 No Content pour une suppression réussie

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the member from the group.' });
    }
}
