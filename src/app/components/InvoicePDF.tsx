import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { ArrowDownFromLine, Layers } from 'lucide-react';
import React, { useRef } from 'react';
import { Invoice, Totals } from '../../../type';

type FacturePDFProps = {
  invoice: Invoice;  // Facture à transformer en PDF
  totals: Totals;    // Totaux calculés (HT, TVA, TTC) à afficher dans le PDF
};

// Fonction utilitaire pour formater une date en format "jour mois année"
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

const InvoicePDF: React.FC<FacturePDFProps> = ({ invoice, totals }) => {
  // Référence à l'élément contenant le contenu de la facture à capturer
  const factureRef = useRef<HTMLDivElement>(null);

  // Fonction pour générer et télécharger le PDF
  const handleDownloadPdf = async () => {
    const element = factureRef.current;
    if (element) {
      try {
        // Capture de l'élément sous forme de canvas
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        // Création du PDF avec jsPDF
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "A4"
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'png', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`facture-${invoice.name}.pdf`);

        // Affichage d'un effet de confettis après le téléchargement
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999
        });
      } catch (error) {
        console.error('Erreur lors de la génération du PDF :', error);
      }
    }
  };

  return (
    <div className='mt-4'>
      <div className='border border-base-300 border-dashed rounded-xl p-5'>
        {/* Bouton déclenchant la génération du PDF */}
        <button
          onClick={handleDownloadPdf}
          className='btn btn-sm btn-accent mb-4'
        >
          Facture PDF
          <ArrowDownFromLine className="w-4 ml-2" />
        </button>

        {/* Zone contenant le contenu de la facture à capturer */}
        <div className='p-4 md:p-8' ref={factureRef}>
          <div className='flex flex-col md:flex-row justify-between items-center text-sm'>
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <div className='bg-accent-content text-accent rounded-full p-2'>
                  <Layers className='h-6 w-6' />
                </div>
                <span className='ml-3 font-bold text-2xl italic'>
                  In<span className='text-accent'>Voice</span>
                </span>
              </div>
              <h1 className='text-5xl md:text-7xl font-bold uppercase mt-2'>Facture</h1>
            </div>
            <div className='text-right uppercase mt-4 md:mt-0'>
              <p className='badge badge-ghost'>Facture ° {invoice.id}</p>
              <p className='my-2'>
                <strong>Date : </strong>
                {formatDate(invoice.invoiceDate)}
              </p>
              <p>
                <strong>Date d&apos;échéance : </strong>
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          <div className='my-6 flex flex-col md:flex-row justify-between'>
            <div className='mb-4 md:mb-0'>
              <p className='badge badge-ghost mb-2'>Émetteur</p>
              <p className='text-sm font-bold italic'>{invoice.issuerName}</p>
              <p className='text-sm text-gray-500 w-full md:w-52 break-words'>{invoice.issuerAddress}</p>
            </div>
            <div className='text-right'>
              <p className='badge badge-ghost mb-2'>Client</p>
              <p className='text-sm font-bold italic'>{invoice.clientName}</p>
              <p className='text-sm text-gray-500 w-full md:w-52 break-words'>{invoice.clientAddress}</p>
            </div>
          </div>

          {/* Tableau des lignes de la facture */}
          <div className='overflow-x-auto'>
            <table className='table table-zebra w-full'>
              <thead>
                <tr>
                  <th></th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((ligne, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ligne.description}</td>
                    <td>{ligne.quantity}</td>
                    <td>{ligne.unitPrice.toFixed(2)} €</td>
                    <td>{(ligne.quantity * ligne.unitPrice).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Affichage des totaux (HT, TVA et TTC) */}
          <div className='mt-6 space-y-2 text-md'>
            <div className='flex justify-between'>
              <div className='font-bold'>
                Total Hors Taxes
              </div>
              <div>
                {totals.totalHT.toFixed(2)} €
              </div>
            </div>

            {invoice.vatActive && (
              <div className='flex justify-between'>
                <div className='font-bold'>
                  TVA {invoice.vatRate} %
                </div>
                <div>
                  {totals.totalVAT.toFixed(2)} €
                </div>
              </div>
            )}

            <div className='flex justify-between'>
              <div className='font-bold'>
                Total Toutes Taxes Comprises
              </div>
              <div className='badge badge-accent'>
                {totals.totalTTC.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;
