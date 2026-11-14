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
import { MentoratView } from './views/MentoratView';
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
      <main className="min-h-screen bg-[#F8F8F6] dark:bg-[#141413] transition-colors">
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#141413] text-[#F2B705] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-[#141413] dark:text-white">
            Accès protégé par Credential ALGB
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
            Cette rubrique nécessite une connexion par credential attribué par l’Administration. Les
            menus publics définis pour les visiteurs restent accessibles librement sans credential.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal(activeTab)}
              className="px-5 py-2.5 bg-[#F2B705] text-[#141413] font-semibold text-xs rounded-lg hover:bg-[#dfa704] flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Se connecter avec mes accès</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('accueil')}
              className="px-5 py-2.5 bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[#141413] dark:text-zinc-200 font-semibold text-xs rounded-lg hover:bg-[#F8F8F6] dark:hover:bg-white/10 cursor-pointer transition-colors"
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
      {activeTab === 'mentorat' && <MentoratView />}
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
      <div className="min-h-screen flex flex-col bg-[#F8F8F6] dark:bg-[#141413] text-[#141413] dark:text-[#F8F8F6] font-sans antialiased selection:bg-[#F2B705] selection:text-[#141413] transition-colors duration-150">
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
