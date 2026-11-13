import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFILE_ACCESS_MATRIX } from '../utils/accessMatrix';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  ShieldCheck,
  UserPlus,
  ChevronDown,
} from 'lucide-react';

export const AuthLoginModal: React.FC = () => {
  const {
    authModalOpen,
    authRedirectTab,
    closeAuthModal,
    loginWithCredential,
    accessCredentials,
    setActiveTab,
  } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSeededDefaults, setShowSeededDefaults] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      setErrorMsg(null);
      setSecretCode('');
      setShowSecret(false);
    }
  }, [authModalOpen]);

  const seededDefaults = useMemo(
    () => accessCredentials.filter((c) => c.isSeededDefault && c.isActive),
    [accessCredentials]
  );

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginWithCredential(identifier, secretCode);
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
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/65 dark:bg-black/80 backdrop-blur-sm overflow-y-auto no-print"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-gray-900 dark:text-zinc-100">
        {/* Header */}
        <div className="bg-black dark:bg-zinc-950 px-6 py-4 flex items-center justify-between text-white border-b-2 border-[#E5B824]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5B824] text-black flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 id="algb-auth-modal-title" className="text-sm sm:text-base font-heading font-bold text-white">
                Connexion par Credential ALGB
              </h2>
              <p className="text-[11px] text-gray-300">
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
            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">
            La consultation des rubriques publiques reste libre sans credential. Saisissez les accès créés depuis l’Administration pour ouvrir votre espace dédié.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-800 dark:text-zinc-200 mb-1.5">
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
                placeholder="ex: amadou.toure@algb-alumni.ci ou admin@algb.ci"
                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl px-3.5 py-2.5 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-800 dark:text-zinc-200 mb-1.5">
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
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-mono text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((prev) => !prev)}
                  aria-label={showSecret ? 'Masquer le code' : 'Afficher le code'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
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
              className="w-full py-2.5 px-4 rounded-xl bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Valider & Ouvrir ma session</span>
            </button>
          </form>

          {/* Initial seeded accounts helper (disappears for modified/custom credentials) */}
          {seededDefaults.length > 0 && (
            <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => setShowSeededDefaults((prev) => !prev)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
                  <span>Comptes initiaux de configuration (à modifier en Admin)</span>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showSeededDefaults ? 'rotate-180' : ''}`}
                />
              </button>

              {showSeededDefaults && (
                <div className="mt-2.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {seededDefaults.map((cred) => (
                    <button
                      key={cred.id}
                      type="button"
                      onClick={() => {
                        setIdentifier(cred.identifier);
                        setSecretCode(cred.secretCode);
                        setErrorMsg(null);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-950 hover:bg-yellow-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 hover:border-[#E5B824] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-black dark:text-white truncate">
                          {PROFILE_ACCESS_MATRIX[cred.role].label}
                        </span>
                        <span className="text-[10px] font-mono text-[#B8860B] dark:text-[#E5B824] shrink-0">
                          {cred.secretCode}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono truncate mt-0.5">
                        {cred.identifier}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-600 dark:text-zinc-400">
            <span>Pas encore enregistré ?</span>
            <button
              type="button"
              onClick={handleGoAdhesion}
              className="inline-flex items-center gap-1 font-bold text-[#B8860B] dark:text-[#E5B824] hover:underline cursor-pointer"
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
