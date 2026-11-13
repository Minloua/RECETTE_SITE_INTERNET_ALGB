/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { ContributionModal } from './components/ContributionModal';
import { ReceiptModal } from './components/ReceiptModal';
import { MembershipCardModal } from './components/MembershipCardModal';
import { PaymentModal } from './components/PaymentModal';
import { TransactionReceiptModal } from './components/TransactionReceiptModal';
import { QuitusModal } from './components/QuitusModal';
import { EnrollmentModal } from './components/EnrollmentModal';
import { QrPaymentSyncModal } from './components/QrPaymentSyncModal';
import { AuthLoginModal } from './components/AuthLoginModal';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { ToastContainer } from './components/ToastContainer';
import { Lock, KeyRound } from 'lucide-react';

// Views
import { HomeView } from './views/HomeView';
import { AmicaleView } from './views/AmicaleView';
import { HistoireView } from './views/HistoireView';
import { PromotionsView } from './views/PromotionsView';
import { ReseauView } from './views/ReseauView';
import { ProjetsView } from './views/ProjetsView';
import { ActualitesView } from './views/ActualitesView';
import { GalerieView } from './views/GalerieView';
import { AdhesionView } from './views/AdhesionView';
import { EspaceMembreView } from './views/EspaceMembreView';
import { AdminView } from './views/AdminView';
import { ContactView } from './views/ContactView';

const MainContent: React.FC = () => {
  const { activeTab, canAccessTab, openAuthModal, setActiveTab } = useApp();

  if (!canAccessTab(activeTab)) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-[#B8860B] dark:text-[#E5B824] mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-black dark:text-white">
            Accès protégé par Credential ALGB
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
            Cette rubrique nécessite une connexion par credential attribué par l’Administration. Les menus publics définis pour les visiteurs restent accessibles librement sans credential.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal(activeTab)}
              className="px-5 py-2.5 bg-[#E5B824] text-black font-bold text-xs rounded-xl hover:bg-[#dcae1f] flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Se connecter avec mes accès</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('accueil')}
              className="px-5 py-2.5 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 font-semibold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Retour à l’Accueil public
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {activeTab === 'accueil' && <HomeView />}
      {activeTab === 'amicale' && <AmicaleView />}
      {activeTab === 'histoire' && <HistoireView />}
      {activeTab === 'anciens' && <PromotionsView />}
      {activeTab === 'reseau' && <ReseauView />}
      {activeTab === 'projets' && <ProjetsView />}
      {activeTab === 'actualites' && <ActualitesView />}
      {(activeTab === 'galerie' || activeTab === 'mediatheque') && <GalerieView />}
      {activeTab === 'adhesion' && <AdhesionView />}
      {activeTab === 'espace-membre' && <EspaceMembreView />}
      {activeTab === 'admin' && <AdminView />}
      {activeTab === 'contact' && <ContactView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans antialiased selection:bg-[#E5B824] selection:text-black transition-colors duration-150">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />

        {/* Global Modals & Controls */}
        <ContributionModal />
        <ReceiptModal />
        <MembershipCardModal />
        <PaymentModal />
        <TransactionReceiptModal />
        <QuitusModal />
        <EnrollmentModal />
        <QrPaymentSyncModal />
        <AuthLoginModal />
        <FloatingAiAssistant />
        <RoleSwitcherBar />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
