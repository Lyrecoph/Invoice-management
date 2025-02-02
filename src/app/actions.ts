'use server';

import { randomBytes } from "crypto";
import prisma from "../../lib/prisma"; // Client Prisma pour interagir avec la BDD
import { Invoice } from "../../type";

/**
 * Vérifie si un utilisateur existe par son email.
 * Si l'utilisateur n'existe pas et qu'un nom est fourni, il est ajouté à la base de données.
 * @param {string} email - Email de l'utilisateur.
 * @param {string} name - Nom de l'utilisateur.
 */
export async function checkAndAddUser(email: string, name: string) {
  if (!email) return; // Ne rien faire si l'email est vide

  try {
    // Recherche de l'utilisateur par email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    // Création de l'utilisateur s'il n'existe pas déjà
    if (!existingUser && name) {
      await prisma.user.create({
        data: { email, name }
      });
    }
  } catch (error) {
    console.log("Erreur lors de l'ajout de l'utilisateur:", error);
  }
}

/**
 * Génère un identifiant unique pour une facture en vérifiant qu'il n'est pas déjà utilisé.
 * @returns {Promise<string>} - Un identifiant unique en hexadécimal.
 */
const generateUniqueId = async (): Promise<string> => {
  let uniqueId: string = "";
  let isUnique = false;

  while (!isUnique) {
    uniqueId = randomBytes(3).toString('hex'); // Génère un ID hexadécimal aléatoire
    // Vérifie si l'ID existe déjà dans la BDD
    const existingInvoiceId = await prisma.invoice.findUnique({
      where: { id: uniqueId }
    });

    if (!existingInvoiceId) {
      isUnique = true;
    }
  }
  return uniqueId;
};

/**
 * Crée une facture vide pour un utilisateur donné.
 * @param {string} email - Email de l'utilisateur.
 * @param {string} name - Nom associé à la facture.
 */
export async function createEmptyInvoice(email: string, name: string) {
  if (!email) return; // Vérifie que l'email est fourni
  
  try {
    // Recherche de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    const invoiceId = await generateUniqueId(); // Génère un identifiant unique

    if (user) {
      // Création d'une nouvelle facture associée à l'utilisateur
      await prisma.invoice.create({
        data: {
          id: invoiceId,
          name,
          userId: user.id,
          issuerAddress: '',
          issuerName: '',
          clientAddress: '',
          clientName: '',
          invoiceDate: '',
          dueDate: '',
          vatActive: false,
          vatRate: 20 // Taux de TVA par défaut
        }
      });
    }
  } catch (error) {
    console.log("Erreur lors de la création de la facture:", error);
  }
}

/**
 * Récupère les factures associées à un utilisateur via son email.
 * Met également à jour le statut des factures expirées.
 * @param {string} email - Email de l'utilisateur.
 * @returns {Promise<any[]>} - Liste des factures mises à jour.
 */
export async function getInvoiceByEmail(email: string) {
  try {
    // Recherche de l'utilisateur et inclusion de ses factures et lignes
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        invoices: {
          include: { lines: true }
        }
      }
    });

    // Si l'utilisateur est trouvé, on vérifie la date d'échéance des factures
    if (user) {
      const today = new Date();
      const updatedInvoices = await Promise.all(
        user.invoices.map(async (invoice) => {
          const dueDate = new Date(invoice.dueDate);
          // Si la facture est en attente et expirée, on la marque comme "Impayée" (statut 5)
          if (dueDate < today && invoice.status === 2) {
            const updatedInvoice = await prisma.invoice.update({
              where: { id: invoice.id },
              data: { status: 5 },
              include: { lines: true }
            });
            return updatedInvoice;
          }
          return invoice;
        })
      );
      return updatedInvoices;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération des factures:", error);
  }
}

/**
 * Récupère une facture par son identifiant.
 * @param {string} invoiceId - Identifiant de la facture.
 * @returns {Promise<Invoice>} - La facture trouvée.
 */
export async function getInvoiceById(invoiceId: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { lines: true }
    });
    if (!invoice) {
      throw new Error("Facture non trouvée.");
    }
    return invoice;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Met à jour une facture et ses lignes associées.
 * Compare les lignes existantes et celles reçues pour mettre à jour, supprimer ou ajouter.
 * @param {Invoice} invoice - La facture à mettre à jour.
 */
export async function updateInvoice(invoice: Invoice) {
  try {
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: invoice.id },
      include: { lines: true }
    });

    if (!existingInvoice) {
      throw new Error(`Facture avec l'ID ${invoice.id} introuvable.`);
    }

    // Mise à jour des informations principales de la facture
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        issuerName: invoice.issuerName,
        issuerAddress: invoice.issuerAddress,
        clientName: invoice.clientName,
        clientAddress: invoice.clientAddress,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        vatActive: invoice.vatActive,
        vatRate: invoice.vatRate,
        status: invoice.status,
      },
    });

    const existingLines = existingInvoice.lines;
    const receivedLines = invoice.lines;

    // Identification des lignes à supprimer
    const linesToDelete = existingLines.filter(
      (existingLine) => !receivedLines.some((line) => line.id === existingLine.id)
    );

    if (linesToDelete.length > 0) {
      await prisma.invoiceLine.deleteMany({
        where: {
          id: { in: linesToDelete.map((line) => line.id) }
        }
      });
    }

    // Mise à jour ou création des lignes existantes/nouvelles
    for (const line of receivedLines) {
      const existingLine = existingLines.find((l) => l.id == line.id);
      if (existingLine) {
        const hasChanged =
          line.description !== existingLine.description ||
          line.quantity !== existingLine.quantity ||
          line.unitPrice !== existingLine.unitPrice;

        if (hasChanged) {
          await prisma.invoiceLine.update({
            where: { id: line.id },
            data: {
              description: line.description,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
            }
          });
        }
      } else {
        // Création d'une nouvelle ligne
        await prisma.invoiceLine.create({
          data: {
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            invoiceId: invoice.id
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Supprime une facture par son identifiant.
 * @param {string} invoiceId - Identifiant de la facture à supprimer.
 */
export async function deleteInvoice(invoiceId: string) {
  try {
    const deleteInvoice = await prisma.invoice.delete({
      where: { id: invoiceId }
    });
    if (!deleteInvoice) {
      throw new Error("Erreur lors de la suppression de la facture");
    }
  } catch (error) {
    console.error(error);
  }
}
