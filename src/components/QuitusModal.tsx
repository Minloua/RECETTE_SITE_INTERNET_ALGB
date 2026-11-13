import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

export const QuitusModal: React.FC = () => {
  const { viewingQuitusMember, setViewingQuitusMember, getMemberFinancialSummary, settings } = useApp();

  if (!viewingQuitusMember) return null;

  const member = viewingQuitusMember;
  const summary = getMemberFinancialSummary(member.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 text-gray-900 rounded-2xl shadow-2xl overflow-hidden my-8 border-2 border-[#E5B824]">
        {/* Top Action Bar (Hidden during print) */}
        <div className="no-print bg-gray-50 dark:bg-zinc-950 px-6 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between text-gray-900 dark:text-zinc-100">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B] dark:text-[#E5B824]">
            <Award className="w-4 h-4" />
            <span>Attestation de Quitus Financier & Statutaire ALGB</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E5B824] text-black rounded-lg text-xs font-bold hover:bg-[#dcae1f] transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le Quitus</span>
            </button>
            <button
              onClick={() => setViewingQuitusMember(null)}
              className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Quitus Certificate */}
        <div className="p-8 sm:p-10 bg-gray-50 dark:bg-zinc-950 relative text-black">
          <div className="border-4 border-double border-[#E5B824] p-6 sm:p-8 rounded-xl bg-white shadow-sm space-y-6">
            {/* Header: Institution & Logo */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-gray-200 gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo ALGB"
                  className="w-20 h-20 object-contain rounded-lg border border-gray-200 shadow-sm bg-white shrink-0"
                />
                <div>
                  <h1 className="font-heading font-bold text-base sm:text-lg text-black uppercase">
                    Amicale des Anciens Élèves
                  </h1>
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-[#B8860B]">
                    Lycée de Garçons de Bingerville
                  </h2>
                  <p className="text-[10px] text-gray-500 font-editorial italic mt-0.5">
                    « Une histoire, des générations, un même engagement. »
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-mono text-gray-500 block">Réf. Quitus</span>
                <span className="font-mono text-sm font-bold text-[#B8860B]">
                  QUITUS-2026-{member.promotionYear}-{member.id.replace('mem-', '')}
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5 font-mono">
                  Session Ordinaire 2026
                </span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-2 space-y-1">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-gray-500 block">
                RÉPUBLIQUE DE CÔTE D'IVOIRE · UNION - DISCIPLINE - TRAVAIL
              </span>
              <h3 className="font-heading text-lg sm:text-2xl font-bold text-black uppercase">
                Attestation de Quitus Financier & de Régularité Statutaire
              </h3>
              <div className="w-24 h-0.5 bg-[#E5B824] mx-auto mt-2"></div>
            </div>

            {/* Content text */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-editorial">
              <p>
                Le Bureau Exécutif et la Trésorerie Générale de l’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (ALGB) certifient par la présente que :
              </p>

              <div className="p-4 rounded-xl bg-yellow-50/70 border border-yellow-200 text-black my-3 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Nom & Prénom(s) de l'Adhérent</span>
                    <span className="text-sm font-bold text-black font-heading">
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Matricule Officiel</span>
                    <span className="text-xs font-bold font-mono text-[#B8860B]">
                      {member.membershipCardId}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Promotion & Filière</span>
                    <span className="text-xs text-gray-800">
                      Promotion {member.promotionYear} ({member.bacSeries})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Total Cotisations & Dons Versés</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                      {summary.totalPaid.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <p>
                Est à jour de l’intégralité de ses obligations financières statutaires envers l’Amicale pour l’exercice en cours, notamment :
              </p>

              <ul className="space-y-1.5 list-disc list-inside text-xs text-gray-800 pl-2 font-sans">
                <li>
                  <strong className="text-black">Droits d’Adhésion Initiale :</strong> Acquittés et validés
                </li>
                <li>
                  <strong className="text-black">Cotisations Mensuelles :</strong> {summary.paidMonths.length} mois enregistrés au titre de l'exercice 2026
                </li>
                <li>
                  <strong className="text-black">Statut Électoral :</strong> Voix délibérative pleine et entière accordée pour l’Assemblée Générale
                </li>
              </ul>

              <p className="text-xs text-gray-600 italic">
                En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit auprès des instances officielles de l’Amicale.
              </p>
            </div>

            {/* Signature & Seal */}
            <div className="pt-6 border-t border-gray-200 flex items-end justify-between text-xs">
              <div>
                <div className="w-12 h-12 bg-black text-white flex flex-col items-center justify-center p-1 rounded text-[7px] font-mono text-center mb-1">
                  <span className="text-[#E5B824] font-bold">ALGB</span>
                  <span>QUITUS</span>
                  <span className="text-[5px] text-gray-400">CERT-2026</span>
                </div>
                <span className="text-[9px] text-gray-500">Cachet officiel de conformité</span>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-4">
                  Pour le Bureau Exécutif ALGB
                </div>
                <div className="text-xs font-bold text-black font-heading">
                  {settings.treasurerName}
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
