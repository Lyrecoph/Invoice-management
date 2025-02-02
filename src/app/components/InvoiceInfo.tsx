import React from 'react';
import { Invoice } from '../../../type';

type InvoiceInfoProps = {
  invoice: Invoice; // Objet facture contenant les informations à afficher et modifier
  setInvoice: (invoice: Invoice) => void; // Fonction pour mettre à jour la facture dans l'état parent
};

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({ invoice, setInvoice }) => {
  
  // Fonction générique pour gérer les changements sur les inputs et textareas.
  // Elle met à jour le champ spécifié dans l'objet invoice.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setInvoice({ ...invoice, [field]: e.target.value });
  };

  return (
    <div className='flex flex-col h-fit bg-base-200 p-5 rounded-xl mb-4 md:mb-0'>
      <div className='space-y-4'>
        {/* Section pour l'émetteur */}
        <h2 className='badge badge-accent'>Emetteur</h2>
        <input 
          type='text'
          value={invoice?.issuerName}
          placeholder="Nom de l'entreprise émettrice ou de l'émetteur"
          className='input input-bordered w-full resize-none'
          onChange={(e) => handleInputChange(e, 'issuerName')}
          required
        />
        <textarea
          value={invoice?.issuerAddress}
          placeholder="Adresse de l'entreprise émettrice ou de l'émetteur"
          className='textarea textarea-bordered w-full resize-none h-40'
          onChange={(e) => handleInputChange(e, 'issuerAddress')}
          required
        />

        {/* Section pour le client */}
        <h2 className='badge badge-accent'>Client</h2>
        <input 
          type='text'
          value={invoice?.clientName}
          placeholder="Nom de l'entreprise cliente ou du client"
          className='input input-bordered w-full resize-none'
          onChange={(e) => handleInputChange(e, 'clientName')}
          required
        />
        <textarea
          value={invoice?.clientAddress}
          placeholder="Adresse de l'entreprise cliente ou du client"
          className='textarea textarea-bordered w-full resize-none h-40'
          onChange={(e) => handleInputChange(e, 'clientAddress')}
          required
        />

        {/* Section pour la date de la facture */}
        <h2 className='badge badge-accent'>Date de la Facture</h2>
        <input 
          type='date'
          value={invoice?.invoiceDate}
          className='input input-bordered w-full resize-none'
          onChange={(e) => handleInputChange(e, 'invoiceDate')}
          required
        />

        {/* Section pour la date d'échéance */}
        <h2 className='badge badge-accent'>Date d&apos;écheance</h2>
        <input 
          type='date'
          value={invoice?.dueDate}
          className='input input-bordered w-full resize-none'
          onChange={(e) => handleInputChange(e, 'dueDate')}
          required
        />
      </div>
    </div>
  );
};

export default InvoiceInfo;
