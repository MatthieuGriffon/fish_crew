import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const role = await prisma.role.findFirst({
      where: { name: 'Member' },
    });

    if (!role) {
      res.status(400).json({ error: 'Role not found' });
      return;
    }

    try {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          username,
          roleId: role.id,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      const e = error as Error;
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(405).end();
  }
}
