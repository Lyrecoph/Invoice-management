'use client';

import { deleteInvoice, getInvoiceById, updateInvoice } from '@/app/actions';
import React, { useEffect, useState, useCallback } from 'react';
import { Invoice, Totals } from '../../../../type';
import Wrapper from '@/app/components/Wrapper';
import { Save, Trash } from 'lucide-react';
import InvoiceInfo from '@/app/components/InvoiceInfo';
import VATControl from '@/app/components/VATControl';
import InvoiceLines from '@/app/components/InvoiceLines';
import isEqual from 'lodash.isequal';
import { useRouter } from 'next/navigation';
import InvoicePDF from '@/app/components/InvoicePDF';

const Page = ({ params }: { params: Promise<{ invoiceId: string }> }) => {
    const router = useRouter();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [initialInvoice, setInitialInvoice] = useState<Invoice | null>(null);
    const [totals, setTotals] = useState<Totals | null>(null);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    

    const fetchInvoice = useCallback(async () => {
        try {
            const { invoiceId } = await params;
            const fetchedInvoice = await getInvoiceById(invoiceId);
            if (fetchedInvoice) {
                setInvoice(fetchedInvoice);
                setInitialInvoice(fetchedInvoice);
            }
        } catch (error) {
            console.error(error);
        }
    }, [params]);

    useEffect(() => {
        fetchInvoice();
    }, [fetchInvoice]);

    useEffect(() => {
        if (!invoice) return;
        const ht = invoice.lines.reduce((acc, { quantity, unitPrice }) => acc + quantity * unitPrice, 0);
        const vat = invoice.vatActive ? ht * (invoice.vatRate / 100) : 0;
        setTotals({ totalHT: ht, totalVAT: vat, totalTTC: ht + vat });
    }, [invoice]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = parseInt(e.target.value);
        if (invoice) {
            const updatedInvoice = { ...invoice, status: newStatus };
            setInvoice(updatedInvoice);
        }
    };

    // Utilisation de lodash.isequal pour comparer les objets en profondeur
    useEffect(() => {
        setIsSaveDisabled(isEqual(invoice, initialInvoice));
    }, [invoice, initialInvoice]);

    const handleSaveInvoice = async () => {
        if (!invoice) return;
        setIsLoading(true);
        try {
            await updateInvoice(invoice);
            const updatedInvoice = await getInvoiceById(invoice.id);
            if (updatedInvoice) {
                setInvoice(updatedInvoice);
                setInitialInvoice(updatedInvoice);
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la facture", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Nouveau gestionnaire pour confirmer la suppression via la modale
    const confirmDeleteInvoice = async () => {
        try {
            await deleteInvoice(invoice?.id as string);
            router.push('/');
        } catch (error) {
            console.error("Erreur lors de la suppression de la facture", error);
        }
    };

    // Affichage conditionnel si la facture ou les totaux ne sont pas encore chargés
    if (!invoice || !totals)
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <span className="font-bold">Facture Non Trouvée</span>
            </div>
        );

    return (
        <Wrapper>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <p className="badge badge-ghost badge-lg uppercase">
                    <span>Facture-</span>
                    {invoice?.id}
                </p>
                <div className="flex md:mt-0 mt-4">
                    <select className="select select-sm select-bordered w-full" value={invoice?.status} onChange={handleStatusChange}>
                        <option value={1}>Brouillon</option>
                        <option value={2}>En attente</option>
                        <option value={3}>Payée</option>
                        <option value={4}>Annulée</option>
                        <option value={5}>Impayée</option>
                    </select>
                    <button className="btn btn-sm btn-accent ml-4" disabled={isSaveDisabled || isLoading} onClick={handleSaveInvoice}>
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>
                            Sauvegarder <Save className="w-4 ml-2" />
                        </>}
                    </button>
                    <button 
                        onClick={() => setShowDeleteConfirmation(true)}
                        className="btn btn-sm btn-accent ml-4"
                    >
                        <Trash className="w-4" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row w-full">
                <div className="flex w-full md:w-1/3 flex-col">
                    <div className="mb-4 bg-base-200 rounded-xl p-5">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <div className="badge badge-accent">Résumé des Totaux</div>
                        <VATControl invoice={invoice} setInvoice={setInvoice} />
                    </div>

                        <div className="flex justify-between">
                            <span>Total Hors Taxes</span>
                            <span>{totals.totalHT.toFixed(2)} £</span>
                        </div>
                        <div className="flex justify-between">
                            <span>TVA ({invoice?.vatActive ? `${invoice?.vatRate}` : 0} %)</span>
                            <span>{totals.totalVAT.toFixed(2)} £</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total TTC</span>
                            <span>{totals.totalTTC.toFixed(2)} £</span>
                        </div>
                    </div>
                    <InvoiceInfo invoice={invoice} setInvoice={setInvoice} />
                </div>
                <div className="flex w-full md:w-2/3 flex-col md:ml-4">
                    <InvoiceLines invoice={invoice} setInvoice={setInvoice} />
                    <InvoicePDF invoice={invoice} totals={totals} />
                </div>
            </div>

            {/* Modale de confirmation pour la suppression de la facture (Daisy UI) */}
            {showDeleteConfirmation && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirmer la suppression</h3>
                        <p>Êtes-vous sûr de vouloir supprimer cette facture ?</p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowDeleteConfirmation(false)}>Annuler</button>
                            <button className="btn btn-error" onClick={confirmDeleteInvoice}>Supprimer</button>
                        </div>
                    </div>
                </dialog>
            )}
        </Wrapper>
    );
};

export default Page;
