import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  ShieldCheck,
  UserPlus,
  Loader2,
} from 'lucide-react';

export const AuthLoginModal: React.FC = () => {
  const {
    authModalOpen,
    authRedirectTab,
    closeAuthModal,
    loginWithCredential,
    setActiveTab,
  } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authModalOpen) {
      setErrorMsg(null);
      setSecretCode('');
      setShowSecret(false);
      setIsSubmitting(false);
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await loginWithCredential(identifier, secretCode);
    setIsSubmitting(false);
    if (!res.allowed) {
      setErrorMsg(res.reason || 'Identifiant ou code d’accès invalide.');
      return;
    }
    setErrorMsg(null);
    setIdentifier('');
    setSecretCode('');
  };

  const handleGoAdhesion = () => {
    closeAuthModal();
    setActiveTab('adhesion');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="algb-auth-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#141413]/70 backdrop-blur-sm overflow-y-auto no-print"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-xl shadow-2xl overflow-hidden my-8 text-[#141413] dark:text-zinc-100">
        {/* Header */}
        <div className="bg-[#141413] px-6 py-4 flex items-center justify-between text-white border-b-2 border-[#F2B705]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F2B705] text-[#141413] flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 id="algb-auth-modal-title" className="text-sm sm:text-base font-heading font-bold text-white">
                Connexion par Credential ALGB
              </h2>
              <p className="text-[11px] text-zinc-300">
                {authRedirectTab === 'admin'
                  ? 'Accès protégé : Console d’Administration'
                  : authRedirectTab === 'espace-membre'
                  ? 'Accès protégé : Espace Membre & Paiements'
                  : 'Authentifiez votre profil avec vos accès délivrés'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Fermer la fenêtre de connexion"
            className="p-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <p className="text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
            La consultation des rubriques publiques reste libre. Saisissez vos accès personnels (vérifiés par session sécurisée chiffrée HttpOnly &amp; hachage scrypt) pour ouvrir votre espace dédié.
          </p>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#141413] dark:text-zinc-200 mb-1.5">
                Identifiant (e-mail, matricule ou login fonction)
              </label>
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="ex: amadou.toure@algb-alumni.ci"
                className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg px-3.5 py-2.5 text-xs text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#141413] dark:text-zinc-200 mb-1.5">
                Code d’accès / Credential secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  required
                  value={secretCode}
                  onChange={(e) => {
                    setSecretCode(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Saisissez votre code d’accès..."
                  className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg pl-3.5 pr-10 py-2.5 text-xs font-mono text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((prev) => !prev)}
                  aria-label={showSecret ? 'Masquer le code' : 'Afficher le code'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white cursor-pointer"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>{isSubmitting ? 'Vérification sécurisée...' : 'Valider & Ouvrir ma session'}</span>
            </button>
          </form>

          <div className="p-3 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 flex items-start gap-2 text-[11px] text-[#4A4A48] dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#134E4A] dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Aucun mot de passe en clair n’est stocké dans le navigateur. En cas d’oubli, contactez le Secrétariat Général ou votre Administrateur ALGB pour réinitialiser votre accès.
            </span>
          </div>

          <div className="border-t border-[#141413]/10 dark:border-white/10 pt-3 flex items-center justify-between text-[11px] text-[#4A4A48] dark:text-zinc-400">
            <span>Pas encore enregistré ?</span>
            <button
              type="button"
              onClick={handleGoAdhesion}
              className="inline-flex items-center gap-1 font-bold text-[#141413] dark:text-[#F2B705] hover:underline cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Rejoindre l’ALGB</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

