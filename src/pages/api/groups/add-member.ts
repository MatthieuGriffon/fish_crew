import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { groupId, email } = req.body;

  if (!groupId || !email) {
    return res.status(400).json({ error: 'GroupId and email are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isAlreadyMember = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: user.id } }
    });

    if (isAlreadyMember) {
      return res.status(400).json({ error: 'User is already a member.' });
    }

    // Add user to group with default role
    const memberRole = await prisma.role.findFirst({ where: { name: RoleName.Member } });
    if (!memberRole) {
      return res.status(400).json({ error: 'Member role not found.' });
    }

    const newGroupMember = await prisma.groupMember.create({
      data: {
        groupId,
        userId: user.id,
        roleId: memberRole.id
      }
    });

    return res.status(201).json(newGroupMember);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while adding the member to the group.' });
  }
}