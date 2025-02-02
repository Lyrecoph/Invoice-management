import React from 'react';
import { Invoice } from '../../../type';

type InvoiceInfoProps = {
  invoice: Invoice; // Facture contenant l'information sur la TVA
  setInvoice: (invoice: Invoice) => void; // Fonction pour mettre à jour la facture dans l'état parent
};

const VATControl: React.FC<InvoiceInfoProps> = ({ invoice, setInvoice }) => {
  // Gère le changement de l'activation de la TVA (checkbox)
  const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({
      ...invoice,
      vatActive: e.target.checked,
      // Si la TVA est activée et que le taux actuel est 0, on utilise 20 par défaut.
      vatRate: e.target.checked ? (invoice.vatRate === 0 ? 20 : invoice.vatRate) : 0
    });
  };

  // Gère la modification du taux de TVA
  const handleVatRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({
      ...invoice,
      vatRate: parseFloat(e.target.value)
    });
  };

  return (
    <div className='flex items-center'>
      <label className='block text-sm font-bold'>TVA (%)</label>
      {/* Checkbox pour activer/désactiver la TVA */}
      <input
        type='checkbox'
        className='toggle toggle-sm ml-2'
        onChange={handleVatChange}
        checked={invoice.vatActive}
      />
      {/* Input pour saisir le taux de TVA (affiché uniquement si la TVA est activée) */}
      {invoice.vatActive && (
        <input 
          type='number'
          value={invoice.vatRate}
          onChange={handleVatRate}
          className='input input-sm input-bordered w-16 ml-2'
          min={0}
        />
      )}
    </div>
  );
};

export default VATControl;
