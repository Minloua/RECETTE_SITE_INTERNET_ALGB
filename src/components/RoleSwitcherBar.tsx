import React, { useState } from 'react';
import { useApp, UserRole } from '../context/AppContext';
import { Shield, User, Users, Megaphone, RotateCcw, Check, Sparkles, ChevronDown, Banknote } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole, currentUser, members, setCurrentUser, addToast, resetAllData } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'VISITEUR',
      label: 'Visiteur public',
      icon: <User className="w-3.5 h-3.5" />,
      desc: 'Accès public : navigation, histoire, présentation, formulaire d’adhésion.',
    },
    {
      role: 'MEMBRE',
      label: 'Membre Adhérent',
      icon: <Check className="w-3.5 h-3.5" />,
      desc: 'Espace membre complet, carte d’adhérent, réseau pro, cotisations.',
    },
    {
      role: 'DELEGUE',
      label: 'Délégué de Promotion',
      icon: <Users className="w-3.5 h-3.5" />,
      desc: 'Gestion de sa promotion, annonces promo, organisation des retrouvailles.',
    },
    {
      role: 'RESPONSABLE_COMM',
      label: 'Resp. Communication',
      icon: <Megaphone className="w-3.5 h-3.5" />,
      desc: 'Publication des communiqués officiels, actualités et événements.',
    },
    {
      role: 'RESPONSABLE_FINANCE',
      label: 'Responsable Finance / Trésorier',
      icon: <Banknote className="w-3.5 h-3.5" />,
      desc: 'Gestion exclusive de la trésorerie back-office, pointage des encaissements, quitus et paramétrage financier.',
    },
    {
      role: 'ADMIN',
      label: 'Administrateur ALGB',
      icon: <Shield className="w-3.5 h-3.5" />,
      desc: 'Droit d’exercice total : membres, finances, projets, promotions et communication.',
    },
    {
      role: 'SUPER_ADMIN',
      label: 'Super Administrateur',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      desc: 'Autorité suprême : contrôle complet de toutes les fonctionnalités, données et exports.',
    },
  ];

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'VISITEUR') {
      setCurrentUser(null);
    } else {
      if (!currentUser && members.length > 0) {
        setCurrentUser(members[0]);
      }
    }
    addToast('info', `Mode activé : ${roles.find((r) => r.role === role)?.label}`, 'L’interface adapte immédiatement vos droits d’accès.');
    setIsOpen(false);
  };

  const currentRoleObj = roles.find((r) => r.role === currentRole) || roles[1];

  return (
    <div className="fixed bottom-4 right-4 z-50 no-print">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl p-3 text-gray-800 dark:text-zinc-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-zinc-800 text-xs font-bold text-gray-900 dark:text-white">
              <span className="flex items-center gap-1.5 text-[#B8860B] dark:text-[#E5B824]">
                <Shield className="w-3.5 h-3.5" />
                <span>Simulateur de Rôles ALGB</span>
              </span>
              <button
                onClick={resetAllData}
                title="Réinitialiser les données de démonstration"
                className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset data</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-600 dark:text-zinc-400 my-2 leading-tight">
              Changez de profil pour tester les parcours autorisés (adhésion, tableau de bord, validation administrative).
            </p>

            <div className="space-y-1 mt-1 max-h-72 overflow-y-auto">
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => handleRoleChange(r.role)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                    currentRole === r.role
                      ? 'bg-yellow-50 dark:bg-yellow-500/15 border border-[#E5B824] text-black dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-transparent'
                  }`}
                >
                  <span className="mt-0.5 shrink-0 text-[#B8860B] dark:text-[#E5B824]">{r.icon}</span>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{r.label}</div>
                    <div className="text-[10px] text-gray-500 dark:text-zinc-400 leading-tight mt-0.5">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-zinc-900 border border-gray-800 dark:border-zinc-700 hover:border-[#E5B824] text-white rounded-full shadow-lg transition-all cursor-pointer text-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#E5B824]"></span>
          <span className="font-semibold">Rôle : {currentRoleObj.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
