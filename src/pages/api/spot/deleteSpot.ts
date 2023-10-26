// Import des dépendances nécessaires
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Initialisation du client Prisma
const prisma = new PrismaClient();

// Endpoint pour la suppression d'un marqueur
export default async function handleDeleteSpot(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const spotId = req.query.spotId as string; // Récupération de l'ID du marqueur depuis la requête

    try {
      // Suppression du marqueur avec l'ID spécifié
      const deletedSpot = await prisma.spot.delete({
        where: {
          id: spotId,
        },
      });

      // Réponse indiquant que la suppression a réussi
      res.status(200).json({ message: `Spot with ID ${spotId} successfully deleted.` });
    } catch (error) {
      // Gestion des erreurs
      console.error('Error deleting spot:', error);
      res.status(500).json({ error: 'Failed to delete spot.' });
    } finally {
      // Fermeture de l'instance Prisma
      await prisma.$disconnect();
    }
  } else {
    // Gestion de la méthode non autorisée
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
