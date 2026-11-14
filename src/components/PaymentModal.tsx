import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentType, PaymentMethod, MONTHS_2026 } from '../data/mockData';
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  CheckCircle2,
  Banknote,
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { paymentModalConfig, closePaymentModal, processPayment, currentUser, getMemberFinancialSummary, settings } = useApp();

  const [paymentType, setPaymentType] = useState<PaymentType>('COTISATION_MENSUELLE');
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['2026-11']);
  const [customAmount, setCustomAmount] = useState<number>(settings.cotisationMensuelleAmount);
  const [method, setMethod] = useState<PaymentMethod>('ORANGE_MONEY');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '+225 07 ');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otpCode, setOtpCode] = useState('8520');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync when config opens
  useEffect(() => {
    if (paymentModalConfig) {
      setPaymentType(paymentModalConfig.type);
      if (paymentModalConfig.type === 'COTISATION_MENSUELLE') {
        const summary = currentUser ? getMemberFinancialSummary(currentUser.id) : null;
        if (paymentModalConfig.selectedMonths && paymentModalConfig.selectedMonths.length > 0) {
          setSelectedMonths(paymentModalConfig.selectedMonths);
          setCustomAmount(paymentModalConfig.selectedMonths.length * settings.cotisationMensuelleAmount);
        } else if (summary && summary.overdueMonths.length > 0) {
          setSelectedMonths(summary.overdueMonths);
          setCustomAmount(summary.overdueMonths.length * settings.cotisationMensuelleAmount);
        } else {
          setSelectedMonths(['2026-11']);
          setCustomAmount(settings.cotisationMensuelleAmount);
        }
      } else if (paymentModalConfig.type === 'DROIT_ADHESION') {
        setCustomAmount(paymentModalConfig.defaultAmount || settings.droitAdhesionAmount);
      } else {
        setCustomAmount(paymentModalConfig.defaultAmount || 25000);
      }
      setStep('FORM');
    }
  }, [paymentModalConfig, settings]);

  if (!paymentModalConfig || !paymentModalConfig.isOpen) return null;

  const toggleMonth = (mKey: string) => {
    let next: string[];
    if (selectedMonths.includes(mKey)) {
      next = selectedMonths.filter((m) => m !== mKey);
    } else {
      next = [...selectedMonths, mKey].sort();
    }
    setSelectedMonths(next);
    setCustomAmount(next.length * settings.cotisationMensuelleAmount);
  };

  const selectQuarter = (quarter: 1 | 2 | 3 | 4) => {
    const qMonths = {
      1: ['2026-01', '2026-02', '2026-03'],
      2: ['2026-04', '2026-05', '2026-06'],
      3: ['2026-07', '2026-08', '2026-09'],
      4: ['2026-10', '2026-11', '2026-12'],
    }[quarter];
    setSelectedMonths(qMonths);
    setCustomAmount(qMonths.length * settings.cotisationMensuelleAmount);
  };

  const selectAllYear = () => {
    const all = MONTHS_2026.map((m) => m.key);
    setSelectedMonths(all);
    setCustomAmount(all.length * settings.cotisationMensuelleAmount);
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'ORANGE_MONEY' || method === 'MTN_MOMO' || method === 'MOOV_MONEY') {
      setStep('OTP');
    } else {
      executePayment();
    }
  };

  const executePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let title = '';
      let description = '';

      if (paymentType === 'DROIT_ADHESION') {
        title = 'Droits d’Adhésion Initiale Statutaire ALGB';
        description = 'Règlement des droits d’adhésion pour validation de la carte d’adhérent.';
      } else if (paymentType === 'COTISATION_MENSUELLE') {
        const monthNames = selectedMonths
          .map((k) => MONTHS_2026.find((m) => m.key === k)?.short || k)
          .join(', ');
        title = `Cotisations Mensuelles (${selectedMonths.length} mois : ${monthNames})`;
        description = `Paiement des cotisations pour ${selectedMonths.length} mois au tarif statutaire de 5 000 FCFA / mois.`;
      } else if (paymentType === 'DON_PROJET') {
        title = paymentModalConfig.title || 'Don Solidaire aux Chantiers du Lycée';
        description = paymentModalConfig.description || 'Contribution volontaire pour les projets de rénovation du LGB.';
      } else {
        title = paymentModalConfig.title || 'Contribution & Souscription Spéciale';
        description = paymentModalConfig.description || 'Participation aux activités associatives et fraternelles.';
      }

      processPayment({
        type: paymentType,
        amount: customAmount,
        method: method,
        monthYears: paymentType === 'COTISATION_MENSUELLE' ? selectedMonths : undefined,
        title: title,
        description: description,
        notes: notes.trim() || undefined,
        memberId: currentUser?.id,
        status: method === 'VIREMENT' ? 'EN_ATTENTE' : 'PAYE',
      });

      setIsProcessing(false);
      closePaymentModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-xl shadow-2xl overflow-hidden my-8 text-[#141413] dark:text-zinc-100">
        {/* Header */}
        <div className="bg-[#141413] px-6 py-4 border-b-2 border-[#F2B705] flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F2B705] text-[#141413] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">
                {paymentType === 'DROIT_ADHESION' && 'Règlement des Droits d’Adhésion'}
                {paymentType === 'COTISATION_MENSUELLE' && 'Règlement des Cotisations Mensuelles'}
                {paymentType === 'DON_PROJET' && 'Souscription & Don Projet'}
                {paymentType === 'AUTRE' && 'Contribution & Frais Divers'}
              </h3>
              <p className="text-xs text-zinc-300">
                {currentUser?.firstName} {currentUser?.lastName} · Promotion {currentUser?.promotionYear}
              </p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'FORM' ? (
            <form onSubmit={handleProceed} className="space-y-5 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block text-[#4A4A48] dark:text-zinc-300 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  Nature du versement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#F8F8F6] dark:bg-[#141413] rounded-lg border border-[#141413]/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('COTISATION_MENSUELLE');
                      setCustomAmount(selectedMonths.length * settings.cotisationMensuelleAmount);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer text-center ${
                      paymentType === 'COTISATION_MENSUELLE'
                        ? 'bg-[#F2B705] text-[#141413] shadow-xs'
                        : 'text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white'
                    }`}
                  >
                    Cotisations
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('DROIT_ADHESION');
                      setCustomAmount(settings.droitAdhesionAmount);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer text-center ${
                      paymentType === 'DROIT_ADHESION'
                        ? 'bg-[#F2B705] text-[#141413] shadow-xs'
                        : 'text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white'
                    }`}
                  >
                    Droit d’adhésion
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('DON_PROJET');
                      setCustomAmount(50000);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer text-center ${
                      paymentType === 'DON_PROJET'
                        ? 'bg-[#F2B705] text-[#141413] shadow-xs'
                        : 'text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white'
                    }`}
                  >
                    Don Projet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('AUTRE');
                      setCustomAmount(20000);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold transition-colors cursor-pointer text-center ${
                      paymentType === 'AUTRE'
                        ? 'bg-[#F2B705] text-[#141413] shadow-xs'
                        : 'text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white'
                    }`}
                  >
                    Autre
                  </button>
                </div>
              </div>

              {/* Monthly Dues Matrix */}
              {paymentType === 'COTISATION_MENSUELLE' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[#4A4A48] dark:text-zinc-300 font-bold uppercase tracking-wider text-[10px]">
                      Sélectionnez les mois à acquitter ({settings.cotisationMensuelleAmount.toLocaleString('fr-FR')} {settings.currency} / mois)
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => selectQuarter(4)}
                        className="text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white font-medium cursor-pointer"
                      >
                        T4 {settings.fiscalYear}
                      </button>
                      <span className="text-[#141413]/25 dark:text-white/25">·</span>
                      <button
                        type="button"
                        onClick={selectAllYear}
                        className="text-[#16324F] dark:text-[#F2B705] hover:underline font-bold cursor-pointer"
                      >
                        Toute l'année ({(12 * settings.cotisationMensuelleAmount).toLocaleString('fr-FR')} {settings.currency})
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {MONTHS_2026.map((m) => {
                      const isSelected = selectedMonths.includes(m.key);
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => toggleMonth(m.key)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705] text-[#141413] dark:text-[#F2B705] font-bold'
                              : 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10 text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                          }`}
                        >
                          <span className="truncate">{m.short}</span>
                          <span className="text-[10px] font-mono text-[#4A4A48] dark:text-zinc-400">
                            {isSelected ? '✓' : '+'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400 flex items-center justify-between pt-1">
                    <span>Mois sélectionnés : {selectedMonths.length} mois</span>
                    <span className="font-mono font-bold text-[#141413] dark:text-[#F2B705]">
                      Total : {(selectedMonths.length * settings.cotisationMensuelleAmount).toLocaleString('fr-FR')} {settings.currency}
                    </span>
                  </div>
                </div>
              )}

              {/* Amount Display & Custom input */}
              {paymentType !== 'COTISATION_MENSUELLE' && (
                <div>
                  <label className="block text-[#141413] dark:text-zinc-300 font-bold mb-1">
                    Montant du versement (FCFA)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={customAmount}
                    onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] focus:bg-white dark:focus:bg-[#1e1e1c] rounded-lg p-2.5 text-[#141413] dark:text-white font-mono font-bold text-sm focus:outline-none"
                  />
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[#4A4A48] dark:text-zinc-300 font-bold uppercase tracking-wider text-[10px] mb-2">
                  Mode de règlement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('ORANGE_MONEY')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'ORANGE_MONEY'
                        ? 'border-[#ff7900] bg-orange-50 dark:bg-orange-500/15 text-[#141413] dark:text-white'
                        : 'border-[#141413]/10 dark:border-white/10 bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#ff7900] shrink-0" />
                    <div>
                      <div className="font-bold text-[#141413] dark:text-white">Orange Money</div>
                      <div className="text-[10px] text-[#4A4A48] dark:text-zinc-400">Instantané</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('MTN_MOMO')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'MTN_MOMO'
                        ? 'border-[#F2B705] bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-white'
                        : 'border-[#141413]/10 dark:border-white/10 bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#F2B705] shrink-0" />
                    <div>
                      <div className="font-bold text-[#141413] dark:text-white">MTN MoMo</div>
                      <div className="text-[10px] text-[#4A4A48] dark:text-zinc-400">Instantané</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('MOOV_MONEY')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'MOOV_MONEY'
                        ? 'border-[#0082c3] bg-blue-50 dark:bg-blue-500/15 text-[#141413] dark:text-white'
                        : 'border-[#141413]/10 dark:border-white/10 bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#0082c3] shrink-0" />
                    <div>
                      <div className="font-bold text-[#141413] dark:text-white">Moov Money</div>
                      <div className="text-[10px] text-[#4A4A48] dark:text-zinc-400">Instantané</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('CARTE_BANCAIRE')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'CARTE_BANCAIRE'
                        ? 'border-[#F2B705] bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-white'
                        : 'border-[#141413]/10 dark:border-white/10 bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0" />
                    <div>
                      <div className="font-bold text-[#141413] dark:text-white">Carte Bancaire</div>
                      <div className="text-[10px] text-[#4A4A48] dark:text-zinc-400">Visa / Mastercard</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('VIREMENT')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'VIREMENT'
                        ? 'border-[#F2B705] bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-white'
                        : 'border-[#141413]/10 dark:border-white/10 bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0" />
                    <div>
                      <div className="font-bold text-[#141413] dark:text-white">Virement Bancaire</div>
                      <div className="text-[10px] text-[#4A4A48] dark:text-zinc-400">SGBCI / Ecobank</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('ESPECES')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'ESPECES'
                        ? 'border-[#134E4A] bg-[#F0FDF9] dark:bg-[#0f2422] text-[#141413] dark:text-white'
                        : 'border-[#141413]/10 dark:border-white/10 bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#134E4A] dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-[#141413] dark:text-white">Espèces / Guichet</div>
                      <div className="text-[10px] text-[#4A4A48] dark:text-zinc-400">Au Trésorier</div>
                    </div>
                  </button>
                </div>

                {/* Method instructions */}
                <div className="p-3 bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 rounded-xl text-[11px] space-y-1 mt-2.5">
                  {method === 'ORANGE_MONEY' && (
                    <div className="flex items-center justify-between text-[#141413] dark:text-zinc-300">
                      <span className="text-[#4A4A48] dark:text-zinc-400">Compte Marchand Officiel ALGB :</span>
                      <span className="font-mono font-bold text-[#ff7900]">{settings.orangeMoneyMerchantNumber}</span>
                    </div>
                  )}
                  {method === 'MTN_MOMO' && (
                    <div className="flex items-center justify-between text-[#141413] dark:text-zinc-300">
                      <span className="text-[#4A4A48] dark:text-zinc-400">Compte Marchand Officiel ALGB :</span>
                      <span className="font-mono font-bold text-[#141413] dark:text-[#F2B705]">{settings.mtnMoMoMerchantNumber}</span>
                    </div>
                  )}
                  {method === 'MOOV_MONEY' && (
                    <div className="flex items-center justify-between text-[#141413] dark:text-zinc-300">
                      <span className="text-[#4A4A48] dark:text-zinc-400">Compte Marchand Officiel ALGB :</span>
                      <span className="font-mono font-bold text-[#0082c3] dark:text-sky-400">{settings.moovMoneyMerchantNumber}</span>
                    </div>
                  )}
                  {method === 'VIREMENT' && (
                    <div className="space-y-1 text-[#141413] dark:text-zinc-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[#4A4A48] dark:text-zinc-400">Établissement Bancaire :</span>
                        <span className="font-semibold text-[#141413] dark:text-white">{settings.bankName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#4A4A48] dark:text-zinc-400">RIB ALGB :</span>
                        <span className="font-mono font-bold text-[#16324F] dark:text-[#F2B705]">{settings.bankRib}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#4A4A48] dark:text-zinc-500">IBAN :</span>
                        <span className="font-mono text-[#141413] dark:text-zinc-300">{settings.bankIban}</span>
                      </div>
                    </div>
                  )}
                  {method === 'ESPECES' && (
                    <div className="text-[#4A4A48] dark:text-zinc-300">
                      Règlement direct au guichet auprès du Trésorier Général <strong className="text-[#141413] dark:text-white">{settings.treasurerName}</strong>. Délivrance de reçu avec cachet officiel.
                    </div>
                  )}
                  {method === 'CARTE_BANCAIRE' && (
                    <div className="text-[#4A4A48] dark:text-zinc-300">
                      Paiement sécurisé par passerelle bancaire cryptée SSL / 3D-Secure certifiée.
                    </div>
                  )}
                </div>
              </div>

              {/* Phone number */}
              {(method === 'ORANGE_MONEY' || method === 'MTN_MOMO' || method === 'MOOV_MONEY') && (
                <div>
                  <label className="block text-[#141413] dark:text-zinc-300 font-bold mb-1">
                    Numéro de téléphone débité
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+225 07 XX XX XX XX"
                    className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] focus:bg-white dark:focus:bg-[#1e1e1c] rounded-lg p-2.5 text-[#141413] dark:text-white font-mono focus:outline-none"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-[#141413] dark:text-zinc-300 font-semibold mb-1">
                  Référence / Note explicative (optionnel)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Virement SGBCI n° 45892 ou remise d'espèces"
                  className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] focus:bg-white dark:focus:bg-[#1e1e1c] rounded-lg p-2 text-[#141413] dark:text-white focus:outline-none text-xs"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={customAmount <= 0}
                className="w-full py-3 bg-[#F2B705] text-[#141413] font-bold rounded-lg hover:bg-[#dfa704] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  Confirmer le règlement de {customAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </button>
            </form>
          ) : (
            /* OTP step */
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705] flex items-center justify-center text-[#141413] dark:text-[#F2B705] mx-auto">
                <Smartphone className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#141413] dark:text-white font-heading">
                  Confirmation Mobile Money
                </h4>
                <p className="text-xs text-[#4A4A48] dark:text-zinc-400 max-w-sm mx-auto mt-1">
                  Une demande d'autorisation de {customAmount.toLocaleString('fr-FR')} FCFA a été envoyée au{' '}
                  <span className="font-mono font-bold text-[#141413] dark:text-white">{phoneNumber}</span>.
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4">
                <label className="block text-[11px] font-bold text-[#4A4A48] dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Code PIN Démo
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-xl font-mono tracking-widest bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-lg py-2 text-[#141413] dark:text-white font-bold focus:border-[#F2B705] focus:outline-none"
                />
                <span className="text-[10px] text-[#4A4A48] dark:text-zinc-400 block mt-1">Code simulateur test</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="w-1/2 py-2.5 text-xs font-semibold rounded-lg border border-[#141413]/15 dark:border-white/15 text-[#141413] dark:text-zinc-300 hover:bg-[#F8F8F6] dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={executePayment}
                  disabled={isProcessing}
                  className="w-1/2 py-2.5 text-xs font-bold rounded-lg bg-[#F2B705] text-[#141413] hover:bg-[#dfa704] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? 'Validation...' : 'Valider & Émettre Reçu'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
