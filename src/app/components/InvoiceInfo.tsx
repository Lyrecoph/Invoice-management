import React from 'react';
import { Invoice } from '../../../type';

type InvoiceInfoProps = {
    invoice: Invoice;
    setInvoice: (invoice: Invoice) => void
}

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({invoice, setInvoice}) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | 
    HTMLTextAreaElement>, field: string) => {
        setInvoice({ ...invoice, [field]: e.target.value });
  } 
  return (
    <div className='flex flex-col h-fit bg-base-200 p-5 rounded-xl mb-4 md:mb-0'>
      <div className='space-y-4'>
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
        >
        </textarea>

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
        >
        </textarea>

        <h2 className='badge badge-accent'>Date de la Facture</h2>
        <input 
            type='date'
            value={invoice?.invoiceDate}
            className='input input-bordered w-full resize-none'
            onChange={(e) => handleInputChange(e, 'invoiceDate')}
            required
        />

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
}

export default InvoiceInfo;
