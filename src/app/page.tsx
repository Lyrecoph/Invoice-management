'use client';

import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Layers } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import confetti from "canvas-confetti";
import Wrapper from "./components/Wrapper";
import { createEmptyInvoice, getInvoiceByEmail } from "./actions";
import { Invoice } from "../../type";
import InvoiceComponent from "./components/InvoiceComponent";

export default function Home() {
  // Récupération de l'identifiant utilisateur et des informations utilisateur
  const { userId } = useAuth();
  const user = useUser();
  
  // États pour gérer le nom de la facture et la validation de la longueur du nom
  const [invoiceName, setInvoiceName] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState("");

  // Récupération de l'email principal de l'utilisateur connecté
  const email = user.user?.primaryEmailAddress?.emailAddress ?? "";

  // Fonction pour récupérer les factures associées à l'email de l'utilisateur
  const fetchInvoices = useCallback(async () =>  {
    try {
      const data = await getInvoiceByEmail(email);
      if(data) setInvoices(data);
    } catch (error) {
      console.error("Erreur du chargement lors de la facture", error);
    }
  }, [email]);

  // Chargement des factures à chaque changement d'email
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Vérification et mise à jour de la validation du nom de la facture
  useEffect(() => {
    setIsNameValid(invoiceName.length <= 30);
  }, [invoiceName]);

  // Affichage d'un écran de chargement tant que les informations utilisateur ne sont pas chargées
  if (!user.isLoaded) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="flex items-center space-x-2">
          <span className="loading loading-dots loading-xs text-accent"></span>
          <span className="loading loading-dots loading-sm text-accent"></span>
          <span className="loading loading-dots loading-md text-accent"></span>
          <span className="loading loading-dots loading-lg text-accent"></span>
        </div>
      </div>
    );
  }
  
  // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
  if (!userId) {
    redirect("/sign-in");
  }

  // Fonction pour créer une nouvelle facture
  const handleCreateInvoice = async () => {
    try {
      if (email) {
        await createEmptyInvoice(email, invoiceName);
      }
      fetchInvoices(); // Rafraîchir la liste des factures après création
      setInvoiceName(""); // Réinitialiser le champ de saisie
      
      // Fermer la modal de création de facture
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
      if (modal) {
        modal.close();
      }

      // Effet de confettis pour indiquer la création réussie de la facture
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999
      });
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
    }
  };

  // Filtrer les factures en fonction du nom saisi dans le champ de recherche
  const filteredInvoices = invoices.filter((invoice) =>
    invoice.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Wrapper>
      <div className="flex flex-col space-y-4">
        <h1 className="text-lg font-bold">Mes factures</h1>
        
        {/* Champ de recherche */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Rechercher une facture en utilisant son nom"
            className="input input-bordered w-full max-w-md mr-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grille contenant les factures et le bouton de création */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Bouton pour ouvrir la modal de création de facture */}
          <div
            className="cursor-pointer border border-accent rounded-xl flex items-center justify-center"
            onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
          >
            <div className="font-bold text-accent m-2">Créer une facture</div>
            <div className='bg-accent-content text-accent rounded-full p-2 m-2'>
              <Layers className='h-6 w-6'/>
            </div>
          </div>
          
          {/* Affichage des factures filtrées */}
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice, index) => (
              <div key={index}>
                <InvoiceComponent index={index} invoice={invoice} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Aucune facture trouvée pour &quot;{searchQuery}&quot;
            </p>
          )}
        </div>

        {/* Modal pour créer une nouvelle facture */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Nouvelle Facture</h3>
            
            {/* Champ de saisie du nom de la facture */}
            <input
              type="text"
              placeholder="Nom de la facture (max 30 caractères)"
              className="input input-bordered w-full my-4"
              value={invoiceName}
              onChange={(e) => setInvoiceName(e.target.value)}
            />
            {!isNameValid && <p className="mb-4 text-sm text-red-600">Le nom de la facture ne doit pas dépasser 30 caractères</p>}
            
            {/* Bouton pour créer la facture */}
            <button
              className="btn btn-accent"
              disabled={!isNameValid || invoiceName.length === 0}
              onClick={handleCreateInvoice}
            >
              Créer
            </button>
          </div>
        </dialog>
      </div>
    </Wrapper>
  );
}
