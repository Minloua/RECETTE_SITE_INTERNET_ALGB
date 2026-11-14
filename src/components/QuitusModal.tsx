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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1c] text-[#141413] rounded-xl shadow-2xl overflow-hidden my-8 border-2 border-[#F2B705]">
        {/* Top Action Bar (Hidden during print) */}
        <div className="no-print bg-[#141413] px-6 py-3 border-b border-[#F2B705]/40 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705]">
            <Award className="w-4 h-4" />
            <span>Attestation de Quitus Financier & Statutaire ALGB</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2B705] text-[#141413] rounded-lg text-xs font-bold hover:bg-[#dfa704] transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le Quitus</span>
            </button>
            <button
              onClick={() => setViewingQuitusMember(null)}
              className="p-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Quitus Certificate */}
        <div className="p-8 sm:p-10 bg-[#F8F8F6] dark:bg-[#141413] relative text-[#141413]">
          <div className="border-4 border-double border-[#F2B705] p-6 sm:p-8 rounded-xl bg-white shadow-sm space-y-6">
            {/* Header: Institution & Logo */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[#141413]/10 gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo ALGB"
                  className="w-20 h-20 object-contain rounded-lg border border-[#141413]/10 shadow-sm bg-white shrink-0"
                />
                <div>
                  <h1 className="font-heading font-bold text-base sm:text-lg text-[#141413] uppercase">
                    Amicale des Anciens Élèves
                  </h1>
                  <h2 className="text-xs uppercase tracking-widest font-semibold text-[#16324F]">
                    Lycée de Garçons de Bingerville
                  </h2>
                  <p className="text-[10px] text-[#4A4A48] font-editorial italic mt-0.5">
                    « Une histoire, des générations, un même engagement. »
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-mono text-[#4A4A48] block">Réf. Quitus</span>
                <span className="font-mono text-sm font-bold text-[#16324F]">
                  QUITUS-2026-{member.promotionYear}-{member.id.replace('mem-', '')}
                </span>
                <span className="text-[10px] text-[#4A4A48] block mt-0.5 font-mono">
                  Session Ordinaire 2026
                </span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-2 space-y-1">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#4A4A48] block">
                RÉPUBLIQUE DE CÔTE D'IVOIRE · UNION - DISCIPLINE - TRAVAIL
              </span>
              <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#141413] uppercase">
                Attestation de Quitus Financier & de Régularité Statutaire
              </h3>
              <div className="w-24 h-0.5 bg-[#F2B705] mx-auto mt-2"></div>
            </div>

            {/* Content text */}
            <div className="space-y-4 text-xs sm:text-sm text-[#4A4A48] leading-relaxed font-editorial">
              <p>
                Le Bureau Exécutif et la Trésorerie Générale de l’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (ALGB) certifient par la présente que :
              </p>

              <div className="p-4 rounded-xl bg-[#FEF8E6] border border-[#F2B705]/40 text-[#141413] my-3 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#4A4A48] text-[10px] uppercase block">Nom & Prénom(s) de l'Adhérent</span>
                    <span className="text-sm font-bold text-[#141413] font-heading">
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#4A4A48] text-[10px] uppercase block">Matricule Officiel</span>
                    <span className="text-xs font-bold font-mono text-[#16324F]">
                      {member.membershipCardId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#4A4A48] text-[10px] uppercase block">Promotion & Filière</span>
                    <span className="text-xs text-[#141413]">
                      Promotion {member.promotionYear} ({member.bacSeries})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#4A4A48] text-[10px] uppercase block">Total Cotisations & Dons Versés</span>
                    <span className="text-xs font-mono font-bold text-[#134E4A] tabular-nums">
                      {summary.totalPaid.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <p>
                Est à jour de l’intégralité de ses obligations financières statutaires envers l’Amicale pour l’exercice en cours, notamment :
              </p>

              <ul className="space-y-1.5 list-disc list-inside text-xs text-[#4A4A48] pl-2 font-sans">
                <li>
                  <strong className="text-[#141413]">Droits d’Adhésion Initiale :</strong> Acquittés et validés
                </li>
                <li>
                  <strong className="text-[#141413]">Cotisations Mensuelles :</strong> {summary.paidMonths.length} mois enregistrés au titre de l'exercice 2026
                </li>
                <li>
                  <strong className="text-[#141413]">Statut Électoral :</strong> Voix délibérative pleine et entière accordée pour l’Assemblée Générale
                </li>
              </ul>

              <p className="text-xs text-[#4A4A48] italic">
                En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit auprès des instances officielles de l’Amicale.
              </p>
            </div>

            {/* Signature & Seal */}
            <div className="pt-6 border-t border-[#141413]/10 flex items-end justify-between text-xs">
              <div>
                <div className="w-12 h-12 bg-[#141413] text-white flex flex-col items-center justify-center p-1 rounded text-[7px] font-mono text-center mb-1">
                  <span className="text-[#F2B705] font-bold">ALGB</span>
                  <span>QUITUS</span>
                  <span className="text-[5px] text-zinc-400">CERT-2026</span>
                </div>
                <span className="text-[9px] text-[#4A4A48]">Cachet officiel de conformité</span>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#4A4A48] mb-4">
                  Pour le Bureau Exécutif ALGB
                </div>
                <div className="text-xs font-bold text-[#141413] font-heading">
                  {settings.treasurerName}
                </div>
                <div className="text-[10px] text-[#4A4A48] italic">
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
