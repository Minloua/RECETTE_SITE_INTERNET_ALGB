import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, CheckCircle, Shield, Award, QrCode } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { viewingReceipt, setViewingReceipt } = useApp();

  if (!viewingReceipt) return null;

  const { project, contribution } = viewingReceipt;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 text-gray-900 rounded-2xl shadow-2xl overflow-hidden my-8 border border-gray-200 dark:border-zinc-800">
        {/* Top Action Bar (hidden in print) */}
        <div className="no-print bg-gray-50 dark:bg-zinc-950 px-6 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between text-gray-900 dark:text-zinc-100">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B] dark:text-[#E5B824]">
            <CheckCircle className="w-4 h-4" />
            <span>Reçu de Contribution Officiel Généré</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E5B824] text-black rounded-lg text-xs font-bold hover:bg-[#dcae1f] transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / Exporter PDF</span>
            </button>
            <button
              onClick={() => setViewingReceipt(null)}
              className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div className="p-8 sm:p-10 bg-gray-50 dark:bg-zinc-950 relative overflow-hidden text-black">
          {/* Subtle Decorative Border */}
          <div className="border-4 border-double border-[#E5B824] p-6 sm:p-8 rounded-xl bg-white relative shadow-sm">
            {/* Header: Logo & Institution Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-200 gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo ALGB"
                  className="w-20 h-20 object-contain rounded-lg border border-gray-200 shadow-sm bg-white"
                />
                <div>
                  <h1 className="font-heading font-bold text-lg text-black tracking-tight uppercase">
                    Amicale des Anciens Élèves
                  </h1>
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-[#B8860B]">
                    Lycée de Garçons de Bingerville (ALGB)
                  </h2>
                  <p className="text-[11px] text-gray-500 italic mt-0.5 font-editorial">
                    « Une histoire, des générations, un même engagement. »
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right shrink-0">
                <div className="text-[10px] uppercase font-mono text-gray-500">N° d'Attestation</div>
                <div className="font-mono text-sm font-bold text-[#B8860B]">{contribution.id}</div>
                <div className="text-[11px] text-gray-500 mt-1">{contribution.date}</div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-6">
              <span className="text-[11px] tracking-widest uppercase font-semibold text-gray-500 block">
                RÉPUBLIQUE DE CÔTE D'IVOIRE
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-black uppercase tracking-wide mt-1">
                Attestation de Contribution Solidaire
              </h3>
              <div className="w-24 h-0.5 bg-[#E5B824] mx-auto mt-2"></div>
            </div>

            {/* Body Details */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p>
                Le Trésorier Général et le Bureau Exécutif de l’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville certifient avoir reçu avec gratitude la contribution solidaire de :
              </p>

              <div className="bg-yellow-50/70 border border-yellow-200 rounded-xl p-4 my-3 text-black">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Donateur / Contributeur</span>
                    <span className="font-bold text-sm text-black font-heading">
                      {contribution.contributorName}
                    </span>
                    {contribution.promotionYear && (
                      <span className="text-gray-600 text-xs block">
                        Promotion {contribution.promotionYear}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Montant de la Contribution</span>
                    <span className="font-bold text-base text-emerald-700 font-mono tabular-nums">
                      {contribution.amount.toLocaleString('fr-FR')} {contribution.currency}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Projet d’Affectation</span>
                    <span className="font-medium text-gray-900">{project.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Mode de Règlement</span>
                    <span className="font-mono text-gray-900 uppercase">
                      {contribution.method.replace('_', ' ')} (VALIDÉ)
                    </span>
                  </div>
                </div>
              </div>

              {contribution.message && (
                <div className="italic text-xs text-gray-600 border-l-2 border-[#E5B824] pl-3 py-1 bg-yellow-50/50 rounded-r">
                  « {contribution.message} »
                </div>
              )}

              <p className="text-xs text-gray-600">
                Cette somme est intégralement allouée à la réalisation du projet ci-dessus désigné au bénéfice des élèves et de l’infrastructure du Lycée de Garçons de Bingerville.
              </p>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-8 mt-6 border-t border-gray-200 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-gray-300 rounded bg-white">
                  {/* Simulated QR Code for verification */}
                  <div className="w-14 h-14 bg-black text-white flex flex-col items-center justify-center p-1 rounded text-[8px] font-mono text-center">
                    <span className="text-[#E5B824] font-bold">ALGB</span>
                    <span>VERIF-SEC</span>
                    <span className="text-[6px] text-gray-400">{contribution.id}</span>
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 leading-tight">
                  <span className="font-semibold block text-gray-700">Vérification Numérique</span>
                  <span>Document certifié par le registre dématérialisé ALGB.</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-600 mb-6">
                  Pour le Bureau Exécutif ALGB
                </div>
                <div className="text-xs font-bold text-black font-heading">
                  Idriss Coulibaly
                </div>
                <div className="text-[10px] text-gray-500 italic">
                  Trésorier Général & DAF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
