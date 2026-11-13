import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, CheckCircle2, AlertCircle, Shield, FileText } from 'lucide-react';

export const TransactionReceiptModal: React.FC = () => {
  const { viewingTransactionReceipt, setViewingTransactionReceipt, settings } = useApp();

  if (!viewingTransactionReceipt) return null;

  const tx = viewingTransactionReceipt;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 text-gray-900 rounded-2xl shadow-2xl overflow-hidden my-8 border border-gray-200 dark:border-zinc-800">
        {/* Top Action Bar (Hidden during print) */}
        <div className="no-print bg-gray-50 dark:bg-zinc-950 px-6 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between text-gray-900 dark:text-zinc-100">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B] dark:text-[#E5B824]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Quittance Officielle de Paiement ALGB</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E5B824] text-black rounded-lg text-xs font-bold hover:bg-[#dcae1f] transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={() => setViewingTransactionReceipt(null)}
              className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Certificate */}
        <div className="p-8 sm:p-10 bg-gray-50 dark:bg-zinc-950 relative text-black">
          <div className="border-4 border-double border-[#E5B824] p-6 sm:p-8 rounded-xl bg-white shadow-sm space-y-6">
            {/* Header: Institution & Logo */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-200 gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo ALGB"
                  className="w-18 h-18 object-contain rounded-lg border border-gray-200 shadow-sm bg-white shrink-0"
                />
                <div>
                  <h1 className="font-heading font-bold text-base sm:text-lg text-black uppercase">
                    Amicale des Anciens Élèves
                  </h1>
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-[#B8860B]">
                    Lycée de Garçons de Bingerville (ALGB)
                  </h2>
                  <p className="text-[10px] text-gray-500 font-editorial italic mt-0.5">
                    « Une histoire, des générations, un même engagement. »
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase font-mono text-gray-500">Quittance / Reçu N°</div>
                <div className="font-mono text-sm font-bold text-[#B8860B]">{tx.receiptNumber}</div>
                <div className="text-[11px] text-gray-500 mt-0.5 font-mono">Date : {tx.date}</div>
              </div>
            </div>

            {/* Document Title & Status */}
            <div className="text-center py-2">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-gray-500 block">
                TRÉSORERIE GÉNÉRALE & GESTION FINANCIÈRE
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-black uppercase mt-0.5">
                Reçu de Règlement Statutaire
              </h3>
              <div className="inline-block mt-2">
                <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wider ${
                  tx.status === 'PAYE'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-yellow-50 text-[#B8860B] border border-yellow-200'
                }`}>
                  {tx.status === 'PAYE' ? 'RÈGLEMENT PAYÉ & VALIDÉ' : 'EN ATTENTE DE POINTAGE BANCAIRE'}
                </span>
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="bg-yellow-50/70 border border-yellow-200 rounded-xl p-4 text-black">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Membre / Débiteur</span>
                    <span className="font-bold text-black font-heading text-sm block">
                      {tx.memberName}
                    </span>
                    <span className="text-gray-600 text-xs">
                      Promotion {tx.promotionYear}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Montant Encaissé</span>
                    <span className="font-bold text-lg text-emerald-700 font-mono tabular-nums">
                      {tx.amount.toLocaleString('fr-FR')} {tx.currency}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Objet du Paiement</span>
                    <span className="font-semibold text-gray-900 block text-xs sm:text-sm">{tx.title}</span>
                    {tx.description && (
                      <span className="text-gray-600 text-[11px] mt-0.5 block">{tx.description}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Mode de Paiement</span>
                    <span className="font-mono text-gray-900 font-medium">
                      {tx.method.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Référence Transaction</span>
                    <span className="font-mono text-gray-900 font-medium">{tx.reference}</span>
                  </div>
                </div>
              </div>

              {tx.monthYears && tx.monthYears.length > 0 && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                  <span className="font-semibold text-gray-700 block text-[11px] uppercase mb-1">
                    Mois de Cotisations Mensuelles Couverts :
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-gray-900 font-mono text-[11px]">
                    {tx.monthYears.map((m) => (
                      <span key={m} className="px-2 py-0.5 bg-white border border-gray-200 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tx.notes && (
                <div className="text-xs text-gray-600 italic bg-yellow-50/50 p-2.5 rounded border border-yellow-200">
                  Note : {tx.notes}
                </div>
              )}
            </div>

            {/* Signature & Seal */}
            <div className="pt-6 border-t border-gray-200 flex items-end justify-between text-xs">
              <div>
                <div className="w-12 h-12 bg-black text-white flex flex-col items-center justify-center p-1 rounded text-[7px] font-mono text-center mb-1">
                  <span className="text-[#E5B824] font-bold">ALGB</span>
                  <span>QUIT-SEC</span>
                  <span className="text-[5px] text-gray-400">{tx.id}</span>
                </div>
                <span className="text-[9px] text-gray-500">Document authentifié numériquement</span>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-4">
                  Pour la Trésorerie Générale ALGB
                </div>
                <div className="text-xs font-bold text-black font-heading">
                  {tx.validatedBy || settings.treasurerName}
                </div>
                <div className="text-[10px] text-gray-500 italic">
                  Trésorier Général ALGB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
