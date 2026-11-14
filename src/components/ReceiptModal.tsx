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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1c] text-[#141413] rounded-xl shadow-2xl overflow-hidden my-8 border border-[#141413]/15 dark:border-white/15">
        {/* Top Action Bar (hidden in print) */}
        <div className="no-print bg-[#134E4A] px-6 py-3 border-b border-[#F2B705]/40 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705]">
            <CheckCircle className="w-4 h-4" />
            <span>Reçu de Contribution Officiel Généré</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2B705] text-[#141413] rounded-lg text-xs font-bold hover:bg-[#dfa704] transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / Exporter PDF</span>
            </button>
            <button
              onClick={() => setViewingReceipt(null)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div className="p-8 sm:p-10 bg-[#F8F8F6] dark:bg-[#141413] relative overflow-hidden text-[#141413]">
          {/* Subtle Decorative Border */}
          <div className="border-4 border-double border-[#F2B705] p-6 sm:p-8 rounded-xl bg-white relative shadow-sm">
            {/* Header: Logo & Institution Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[#141413]/10 gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo ALGB"
                  className="w-20 h-20 object-contain rounded-lg border border-[#141413]/10 shadow-sm bg-white"
                />
                <div>
                  <h1 className="font-heading font-bold text-lg text-[#141413] tracking-tight uppercase">
                    Amicale des Anciens Élèves
                  </h1>
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-[#134E4A]">
                    Lycée de Garçons de Bingerville (ALGB)
                  </h2>
                  <p className="text-[11px] text-[#4A4A48] italic mt-0.5 font-editorial">
                    « Une histoire, des générations, un même engagement. »
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right shrink-0">
                <div className="text-[10px] uppercase font-mono text-[#4A4A48]">N° d'Attestation</div>
                <div className="font-mono text-sm font-bold text-[#134E4A]">{contribution.id}</div>
                <div className="text-[11px] text-[#4A4A48] mt-1">{contribution.date}</div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-6">
              <span className="text-[11px] tracking-widest uppercase font-semibold text-[#4A4A48] block">
                RÉPUBLIQUE DE CÔTE D'IVOIRE
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#141413] uppercase tracking-wide mt-1">
                Attestation de Contribution Solidaire
              </h3>
              <div className="w-24 h-0.5 bg-[#F2B705] mx-auto mt-2"></div>
            </div>

            {/* Body Details */}
            <div className="space-y-4 text-xs sm:text-sm text-[#4A4A48] leading-relaxed">
              <p>
                Le Trésorier Général et le Bureau Exécutif de l’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville certifient avoir reçu avec gratitude la contribution solidaire de :
              </p>

              <div className="bg-[#FEF8E6] border border-[#F2B705]/40 rounded-xl p-4 my-3 text-[#141413]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#4A4A48] block text-[10px] uppercase tracking-wider">Donateur / Contributeur</span>
                    <span className="font-bold text-sm text-[#141413] font-heading">
                      {contribution.contributorName}
                    </span>
                    {contribution.promotionYear && (
                      <span className="text-[#4A4A48] text-xs block">
                        Promotion {contribution.promotionYear}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[#4A4A48] block text-[10px] uppercase tracking-wider">Montant de la Contribution</span>
                    <span className="font-bold text-base text-[#134E4A] font-mono tabular-nums">
                      {contribution.amount.toLocaleString('fr-FR')} {contribution.currency}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#4A4A48] block text-[10px] uppercase tracking-wider">Projet d’Affectation</span>
                    <span className="font-medium text-[#141413]">{project.title}</span>
                  </div>
                  <div>
                    <span className="text-[#4A4A48] block text-[10px] uppercase tracking-wider">Mode de Règlement</span>
                    <span className="font-mono text-[#141413] uppercase">
                      {contribution.method.replace('_', ' ')} (VALIDÉ)
                    </span>
                  </div>
                </div>
              </div>

              {contribution.message && (
                <div className="italic text-xs text-[#4A4A48] border-l-2 border-[#F2B705] pl-3 py-1 bg-[#FEF8E6]/60 rounded-r">
                  « {contribution.message} »
                </div>
              )}

              <p className="text-xs text-[#4A4A48]">
                Cette somme est intégralement allouée à la réalisation du projet ci-dessus désigné au bénéfice des élèves et de l’infrastructure du Lycée de Garçons de Bingerville.
              </p>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-8 mt-6 border-t border-[#141413]/10 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-[#141413]/15 rounded-lg bg-white">
                  {/* Simulated QR Code for verification */}
                  <div className="w-14 h-14 bg-[#141413] text-white flex flex-col items-center justify-center p-1 rounded text-[8px] font-mono text-center">
                    <span className="text-[#F2B705] font-bold">ALGB</span>
                    <span>VERIF-SEC</span>
                    <span className="text-[6px] text-zinc-400">{contribution.id}</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#4A4A48] leading-tight">
                  <span className="font-semibold block text-[#141413]">Vérification Numérique</span>
                  <span>Document certifié par le registre dématérialisé ALGB.</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#4A4A48] mb-6">
                  Pour le Bureau Exécutif ALGB
                </div>
                <div className="text-xs font-bold text-[#141413] font-heading">
                  Idriss Coulibaly
                </div>
                <div className="text-[10px] text-[#4A4A48] italic">
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
