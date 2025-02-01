import React from 'react';
import { Invoice } from '../../../type';

type InvoiceInfoProps = {
    invoice: Invoice;
    setInvoice: (invoice: Invoice) => void
}

const VATControl: React.FC<InvoiceInfoProps> = ({invoice, setInvoice}) =>  {
    const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInvoice({
            ...invoice, 
            vatActive: e.target.checked,
             // Si la TVA est activée et que le taux actuel est 0, utiliser 20 par défaut.
            vatRate: e.target.checked ? (invoice.vatRate === 0 ? 20 : invoice.vatRate) : 0
        })
    }

    const handleVatRate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInvoice({
            ...invoice, 
            vatRate: parseFloat(e.target.value)
        })
    }

  return (
    <div className='flex items-center'>
      <label className='block text-sm font-bold'>TVA (%)</label>
      <input
        type='checkbox'
        className='toggle toggle-sm ml-2'
        onChange={handleVatChange}
        checked={invoice.vatActive}
      />
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
}

export default VATControl;
