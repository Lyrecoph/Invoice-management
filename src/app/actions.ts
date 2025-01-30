'use server';

import { randomBytes } from "crypto";
import prisma from "../../lib/prisma"; // Importation du client Prisma pour interagir avec la base de données

/**
 * Vérifie si un utilisateur existe par son email. 
 * Si l'utilisateur n'existe pas et qu'un nom est fourni, il est ajouté à la base de données.
 * @param {string} email - Email de l'utilisateur.
 * @param {string} name - Nom de l'utilisateur.
 */
export async function checkAndAddUser(email: string, name: string) {
    if (!email) return; // Empêche l'exécution si l'email est vide

    try {
        // Recherche de l'utilisateur par email
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        // Si l'utilisateur n'existe pas et que le nom est fourni, création d'un nouvel utilisateur
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
 * @returns {Promise<string>} - Un identifiant unique sous forme hexadécimale.
 */
const generateUniqueId = async (): Promise<string> => {
    let uniqueId: string = "";
    let isUnique = false;

    while (!isUnique) {
        uniqueId = randomBytes(3).toString('hex'); // Génère un identifiant hexadécimal aléatoire
        
        // Vérifie si l'identifiant existe déjà dans la base de données
        const existingInvoiceId = await prisma.invoice.findUnique({
            where: { id: uniqueId }
        });

        if (!existingInvoiceId) {
            isUnique = true; // Si l'ID n'existe pas, il est considéré comme unique
        }
    }
    return uniqueId;
};

/**
 * Crée une facture vide pour un utilisateur donné par son email.
 * @param {string} email - Email de l'utilisateur.
 * @param {string} name - Nom associé à la facture.
 */
export async function createEmptyInvoice(email: string, name: string) {
    if (!email) return; // Vérifie que l'email est fourni
    
    try {
        // Recherche l'utilisateur correspondant à l'email
        const user = await prisma.user.findUnique({
            where: { email }
        });
        
        const invoiceId = await generateUniqueId(); // Génère un identifiant unique pour la facture

        if (user) {
            // Crée une nouvelle facture associée à l'utilisateur
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
                    vatRate: 20 // TVA par défaut de 20%
                }
            });
        }
    } catch (error) {
        console.log("Erreur lors de la création de la facture:", error);
    }
}

/**
 * Récupère les factures associées à un utilisateur en fonction de son email.
 * Met également à jour le statut des factures expirées.
 * @param {string} email - Email de l'utilisateur.
 * @returns {Promise<any[]>} - Liste des factures mises à jour.
 */
export async function getInvoiceByEmail(email: string) {
    try {
        // Recherche l'utilisateur et ses factures associées
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                invoices: {
                    include: { lines: true } // Inclut les lignes de facturation
                }
            }
        });

        // Statuts possibles des factures
        // 1: Brouillon
        // 2: En attente
        // 3: Payée 
        // 4: Annulée
        // 5: Impayée
        if (user) {
            const today = new Date();
            
            // Vérifie et met à jour les factures en retard
            const updatedInvoices = await Promise.all(
                user.invoices.map(async (invoice) => {
                    const dueDate = new Date(invoice.dueDate);
                    
                    // Si la facture est en attente et que la date d'échéance est dépassée, on la marque comme impayée
                    if (dueDate < today && invoice.status === 2) {
                        const updatedInvoice = await prisma.invoice.update({
                            where: { id: invoice.id },
                            data: { status: 5 }, // Statut: Impayé
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
