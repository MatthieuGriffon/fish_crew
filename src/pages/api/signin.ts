import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    const isPasswordValid =
      user && bcrypt.compareSync(password, user.passwordHash);

    if (isPasswordValid) {
      if (!process.env.JWT_SECRET) {
        res
          .status(500)
          .json({ error: 'JWT_SECRET environment variable is not set' });
        return;
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );
      res.setHeader(
        'Set-Cookie',
        `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`
      );
      res.status(200).json({ token, message: 'Connexion réussie' });
    } else {
      res
        .status(401)
        .json({ error: "Informations d'identification incorrectes" });
    }
  } else {
    res.status(405).end();
  }
}


