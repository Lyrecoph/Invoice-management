import React from 'react';
import { Invoice } from '../../../type';
import { Plus, Trash } from 'lucide-react';
import { InvoiceLine } from '@prisma/client';

type InvoiceInfoProps = {
  invoice: Invoice; // Facture contenant les lignes actuelles
  setInvoice: (invoice: Invoice) => void; // Fonction pour mettre à jour la facture dans l'état parent
};

const InvoiceLines: React.FC<InvoiceInfoProps> = ({ invoice, setInvoice })  => {

  // Ajoute une nouvelle ligne vide à la facture
  const handleAddLine = () => {
    const newLine: InvoiceLine = {
      id: `${Date.now()}`, // Identifiant généré à partir du timestamp
      description: '',
      quantity: 1,
      unitPrice: 0,
      invoiceId: invoice.id
    };
    setInvoice({
      ...invoice,
      lines: [...invoice.lines, newLine]
    });
  };

  // Met à jour la quantité d'une ligne donnée
  const handleQuantityChange = (index: number, value: string) => {
    const updatedLine = {
      ...invoice.lines[index],
      quantity: value === "" ? 0 : parseInt(value),
    };
    const updatedLines = invoice.lines.map((line, i) => (i === index ? updatedLine : line));
    setInvoice({ ...invoice, lines: updatedLines });
  };

  // Met à jour la description d'une ligne donnée
  const handleDescriptionChange = (index: number, value: string) => {
    const updatedLine = { ...invoice.lines[index], description: value };
    const updatedLines = invoice.lines.map((line, i) => (i === index ? updatedLine : line));
    setInvoice({ ...invoice, lines: updatedLines });
  };

  // Met à jour le prix unitaire d'une ligne donnée
  const handleUnitPriceChange = (index: number, value: string) => {
    const updatedLine = {
      ...invoice.lines[index],
      unitPrice: value === "" ? 0 : parseFloat(value),
    };
    const updatedLines = invoice.lines.map((line, i) => (i === index ? updatedLine : line));
    setInvoice({ ...invoice, lines: updatedLines });
  };

  // Supprime une ligne à l'index spécifié
  const handleRemoveLines = (index: number) => {
    const updatedLines = invoice.lines.filter((_ , i) => i !== index);
    setInvoice({ ...invoice, lines: updatedLines });
  };

  return (
    <div className='h-fit bg-base-200 p-5 rounded-xl w-full'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='badge badge-accent'>Produits / Services</h2>
        <button
          className='btn btn-sm btn-accent'
          onClick={handleAddLine}
        >
          <Plus className='w-4' />
        </button>
      </div>

      {/* Tableau affichant les lignes de facture */}
      <div className='scrollable'>
        <table className='table w-full'>
          <thead className='uppercase'>
            <tr>
              <th>Quantité</th>
              <th>Description</th>
              <th>Prix Unitaire (HT)</th>
              <th>Montant (HT)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line, index) => (
              <tr key={line.id}>
                <td>
                  <input
                    type="number"
                    value={line.quantity}
                    className='input input-sm input-bordered w-full'
                    min={0}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={line.description}
                    className='input input-sm input-bordered w-full'
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={line.unitPrice}
                    className='input input-sm input-bordered w-full'
                    min={0}
                    step={0.01}
                    onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                  />
                </td>
                <td className='font-bold'>
                  {(line.quantity * line.unitPrice).toFixed(2)} €
                </td>
                <td>
                  <button
                    onClick={() => handleRemoveLines(index)}
                    className='btn btn-sm btn-circle btn-accent'
                  >
                    <Trash className="w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceLines;
