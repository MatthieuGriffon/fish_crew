import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import mailjetLib  from 'node-mailjet';

if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
    throw new Error("Mailjet API Key or Secret is not defined");
}

const mailjet = (mailjetLib as any).apiConnect(process.env.MAILJET_API_KEY!, process.env.MAILJET_API_SECRET!);


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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà enregistré' });
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
      // Envoyer un e-mail de bienvenue après avoir créé l'utilisateur
      mailjet.post("send", {'version': 'v3.1'}).request({
        "Messages": [{
            "From": {
                "Email": "contact@matthieu-griffon.fr",
                "Name": "L'équipe FishCrew"
            },
            "To": [{
                "Email": email,
                "Name": username
            }],
            "Subject": "Bienvenue chez FishCrew!",
            "TextPart": `Bonjour ${username},
    
    Merci de vous être inscrit chez FishCrew! 
    
    FishCrew est une plateforme dédiée aux passionnés de pêche. Que vous soyez un pêcheur débutant ou expérimenté, nous vous offrons un espace pour partager vos expériences, apprendre de nouveaux trucs et astuces, et rejoindre une communauté de personnes qui partagent votre passion.
    
    N'hésitez pas à explorer le site, participer aux discussions et partager vos propres expériences.
    
    Si vous avez des questions, nous sommes là pour vous aider.
    
    À bientôt sur FishCrew!
    
    Cordialement,
    L'équipe FishCrew`,
            "HTMLPart": `<h3>Salut ${username}, bienvenue chez FishCrew!</h3>
    <p>FishCrew est une plateforme dédiée aux passionnés de pêche. Que vous soyez un pêcheur débutant ou expérimenté, nous vous offrons un espace pour partager vos expériences, apprendre de nouveaux trucs et astuces, et rejoindre une communauté de personnes qui partagent votre passion.</p>
    <p>N'hésitez pas à explorer le site, participer aux discussions et partager vos propres expériences.</p>
    <p>Si vous avez des questions, nous sommes là pour vous aider.</p>
    <p>À bientôt sur FishCrew!</p>
    <p>Cordialement,<br>L'équipe FishCrew</p>`
        }]
    });
    

      res.status(201).json(user);
    } catch (error) {
      const e = error as Error;
      return res.status(500).json({ error: e.message });
    }
    finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).end();
  }
}
