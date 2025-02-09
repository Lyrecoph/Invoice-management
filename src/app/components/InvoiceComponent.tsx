import React from 'react';
import { Invoice } from '../../../type';
import Link from 'next/link';
import { CheckCircle, Clock, FileText, SquareArrowOutUpRight, XCircle } from 'lucide-react';

type InvoiceComponentProps = {
  invoice: Invoice; // Facture à afficher
  index: number;    // Index de la facture dans la liste (actuellement non utilisé pour l'affichage)
};

// Fonction renvoyant un badge stylisé en fonction du statut de la facture.
const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return (
        <div className='badge badge-lg flex items-center gap-2'>
          <FileText className='w-4' />
          Brouillon
        </div>
      );
    case 2:
      return (
        <div className='badge badge-lg badge-warning flex items-center gap-2'>
          <Clock className='w-4' />
          En attente
        </div>
      );
    case 3:
      return (
        <div className='badge badge-lg badge-success flex items-center gap-2'>
          <CheckCircle className='w-4' />
          Payée
        </div>
      );
    case 4:
      return (
        <div className='badge badge-lg badge-info flex items-center gap-2'>
          <XCircle className='w-4' />
          Annulée
        </div>
      );
    case 5:
      return (
        <div className='badge badge-lg badge-error flex items-center gap-2'>
          <XCircle className='w-4' />
          Impayée
        </div>
      );
    default:
      return (
        <div className='badge badge-lg badge-error flex items-center gap-2'>
          <XCircle className='w-4' />
          Indéfinie
        </div>
      );
  }
};

const InvoiceComponent: React.FC<InvoiceComponentProps> = ({ invoice }) => {
  
  // Calcule le total de la facture en ajoutant la TVA au montant HT.
  const calculateTotal = () => {
    const totalHT = invoice?.lines?.reduce((acc, line) => {
      const quantity = line.quantity ?? 0;
      const unitPrice = line.unitPrice ?? 0;
      return acc + quantity * unitPrice;
    }, 0);
    const totalVAT = totalHT * (invoice.vatRate / 100);
    return totalHT + totalVAT;
  };

  return (
    <div className='bg-base-200/90 p-5 rounded-xl space-y-2 shadow'>
      {/* En-tête : Affiche le badge de statut et un bouton de navigation vers la page détail */}
      <div className='flex justify-between items-center w-full'>
        <div>{getStatusBadge(invoice.status)}</div>
        <Link 
          className='btn btn-accent btn-sm'
          href={`/invoice/${invoice.id}`}
        >
          Plus <SquareArrowOutUpRight className='w-4' />
        </Link>
      </div>

      {/* Corps de la carte : Affiche l'identifiant, le montant total et le nom de la facture */}
      <div className='w-full'>
        <div>
          <div className='stat-title'>
            <div className='uppercase text-sm'>FACT-{invoice.id}</div>
          </div>
          <div>
            <div className='stat-value'>
              {calculateTotal().toFixed(2)} £
            </div>
          </div>
          <div className='stat-desc'>
            {invoice.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceComponent;
