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
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { ToastContainer } from './components/ToastContainer';

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
  const { activeTab } = useApp();

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
        <FloatingAiAssistant />
        <RoleSwitcherBar />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
