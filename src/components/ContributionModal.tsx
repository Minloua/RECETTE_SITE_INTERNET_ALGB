import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  HeartHandshake,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Building2,
  Lock,
  AlertCircle,
} from 'lucide-react';

export const ContributionModal: React.FC = () => {
  const { contributionModalProject, setContributionModalProject, makeContribution, currentUser } = useApp();

  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [method, setMethod] = useState<'ORANGE_MONEY' | 'MTN_MOMO' | 'MOOV_MONEY' | 'CARTE_BANCAIRE' | 'VIREMENT'>('ORANGE_MONEY');
  const [contributorName, setContributorName] = useState(
    currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''
  );
  const [promotionYear, setPromotionYear] = useState<number | undefined>(currentUser?.promotionYear || 2002);
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '+225 07 ');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'FORM' | 'CONFIRM_OTP'>('FORM');
  const [otpCode, setOtpCode] = useState('7492');

  if (!contributionModalProject) return null;

  const presetAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  const handleSelectAmount = (val: number) => {
    setIsCustom(false);
    setAmount(val);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    const raw = e.target.value.replace(/\D/g, '');
    setCustomAmount(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'ORANGE_MONEY' || method === 'MTN_MOMO' || method === 'MOOV_MONEY') {
      setStep('CONFIRM_OTP');
    } else {
      executeContribution();
    }
  };

  const executeContribution = () => {
    setIsProcessing(true);
    setTimeout(() => {
      makeContribution(contributionModalProject.id, {
        contributorName: isAnonymous ? 'Ancien Élève Anonyme' : contributorName || 'Ancien Élève du LGB',
        promotionYear: isAnonymous ? undefined : promotionYear,
        amount: amount,
        currency: 'FCFA',
        method: method,
        isAnonymous: isAnonymous,
        message: message.trim() || undefined,
      });
      setIsProcessing(false);
      setContributionModalProject(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-zinc-950 px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-500/15 border border-[#E5B824] flex items-center justify-center text-[#B8860B] dark:text-[#E5B824]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white font-heading">
                Soutenir ce projet
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 truncate max-w-md">
                {contributionModalProject.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => setContributionModalProject(null)}
            className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'FORM' ? (
            <form onSubmit={handleProceedToOtp} className="space-y-5">
              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Montant de la contribution (FCFA)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectAmount(preset)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        !isCustom && amount === preset
                          ? 'bg-[#E5B824] text-black border-[#E5B824] shadow-xs'
                          : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 hover:border-gray-400 dark:hover:border-zinc-600'
                      }`}
                    >
                      {preset.toLocaleString('fr-FR')} FCFA
                    </button>
                  ))}
                </div>

                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Ou saisissez un montant libre..."
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-900 rounded-lg px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Mode de règlement sécurisé
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setMethod('ORANGE_MONEY')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'ORANGE_MONEY'
                        ? 'border-[#ff7900] bg-orange-50 dark:bg-orange-500/15 text-black dark:text-white'
                        : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#ff7900] shrink-0" />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">Orange Money</div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400">Côte d’Ivoire</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('MTN_MOMO')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'MTN_MOMO'
                        ? 'border-[#E5B824] bg-yellow-50 dark:bg-yellow-500/15 text-black dark:text-white'
                        : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#E5B824] shrink-0" />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">MTN MoMo</div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400">Côte d’Ivoire</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('MOOV_MONEY')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'MOOV_MONEY'
                        ? 'border-[#0082c3] bg-blue-50 dark:bg-blue-500/15 text-black dark:text-white'
                        : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#0082c3] shrink-0" />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">Moov Money</div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400">Côte d’Ivoire</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('CARTE_BANCAIRE')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'CARTE_BANCAIRE'
                        ? 'border-[#E5B824] bg-yellow-50 dark:bg-yellow-500/15 text-black dark:text-white'
                        : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0" />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">Carte Bancaire</div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400">Visa / Mastercard</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('VIREMENT')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      method === 'VIREMENT'
                        ? 'border-[#E5B824] bg-yellow-50 dark:bg-yellow-500/15 text-black dark:text-white'
                        : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0" />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">Virement</div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400">RIB SGBCI / Ecobank</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Contributor Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    Nom & Prénom(s)
                  </label>
                  <input
                    type="text"
                    required={!isAnonymous}
                    value={contributorName}
                    disabled={isAnonymous}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="Ex: Jean Kouassi"
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-900 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    Promotion / Année de sortie
                  </label>
                  <input
                    type="number"
                    min="1950"
                    max="2026"
                    value={promotionYear || ''}
                    disabled={isAnonymous}
                    onChange={(e) => setPromotionYear(parseInt(e.target.value) || undefined)}
                    placeholder="Ex: 2002"
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-900 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Mobile Phone for Mobile Money */}
              {(method === 'ORANGE_MONEY' || method === 'MTN_MOMO' || method === 'MOOV_MONEY') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    Numéro Mobile Money débité
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+225 07 XX XX XX XX"
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-900 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none font-mono"
                  />
                </div>
              )}

              {/* Message of support */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  Message fraternel d’encouragement (optionnel)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Un mot pour la postérité, les élèves ou vos camarades de promotion..."
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-900 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                />
              </div>

              {/* Anonymity Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 dark:border-zinc-600 text-[#E5B824] focus:ring-0"
                />
                <span>Contribuer anonymement (seul le montant apparaîtra publiquement)</span>
              </label>

              {/* Notice Requirement */}
              <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3 text-[11px] text-gray-800 dark:text-zinc-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-black dark:text-white">
                    Environnement de Démonstration ALGB Conforme
                  </span>
                  <span>
                    Conformément au cahier des charges, aucun prélèvement bancaire réel n'est effectué avant le raccordement final à la passerelle de paiement de l’opérateur agréé. La transaction est enregistrée fidèlement dans le tableau de bord de l'Amicale et délivre une attestation officielle.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-black bg-[#E5B824] hover:bg-[#dcae1f] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  Valider ma contribution de {amount.toLocaleString('fr-FR')} FCFA
                </span>
              </button>
            </form>
          ) : (
            /* OTP Confirmation Step */
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-500/15 border border-[#E5B824] flex items-center justify-center text-[#B8860B] dark:text-[#E5B824] mx-auto">
                <Smartphone className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-black dark:text-white font-heading">
                  Autorisation de prélèvement Mobile Money
                </h4>
                <p className="text-xs text-gray-600 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                  Une notification de validation de {amount.toLocaleString('fr-FR')} FCFA a été envoyée vers le{' '}
                  <span className="font-mono font-bold text-black dark:text-white">{phoneNumber}</span> ({method.replace('_', ' ')}).
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">
                <label className="block text-[11px] font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Code de sécurité / PIN Démo
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-xl font-mono tracking-widest bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg py-2 text-black dark:text-white font-bold focus:border-[#E5B824] focus:outline-none"
                />
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 block mt-1">Code simulateur pré-rempli pour test</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="w-1/2 py-2.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={executeContribution}
                  disabled={isProcessing}
                  className="w-1/2 py-2.5 text-xs font-bold rounded-lg bg-[#E5B824] text-black hover:bg-[#dcae1f] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Traitement...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmer le débit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
