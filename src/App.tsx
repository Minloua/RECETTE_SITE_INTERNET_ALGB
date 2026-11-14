/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PageBackBar } from './components/PageBackBar';
import { RightActionSidebar } from './components/RightActionSidebar';
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
import { OfflineIndicator } from './components/OfflineIndicator';
import { Lock, KeyRound } from 'lucide-react';

// Code-split Views via React.lazy
const HomeView = lazy(() => import('./views/HomeView').then((m) => ({ default: m.HomeView })));
const AmicaleView = lazy(() => import('./views/AmicaleView').then((m) => ({ default: m.AmicaleView })));
const HistoireView = lazy(() => import('./views/HistoireView').then((m) => ({ default: m.HistoireView })));
const PromotionsView = lazy(() => import('./views/PromotionsView').then((m) => ({ default: m.PromotionsView })));
const ReseauView = lazy(() => import('./views/ReseauView').then((m) => ({ default: m.ReseauView })));
const MentoratView = lazy(() => import('./views/MentoratView').then((m) => ({ default: m.MentoratView })));
const ProjetsView = lazy(() => import('./views/ProjetsView').then((m) => ({ default: m.ProjetsView })));
const ActualitesView = lazy(() => import('./views/ActualitesView').then((m) => ({ default: m.ActualitesView })));
const GalerieView = lazy(() => import('./views/GalerieView').then((m) => ({ default: m.GalerieView })));
const AdhesionView = lazy(() => import('./views/AdhesionView').then((m) => ({ default: m.AdhesionView })));
const EspaceMembreView = lazy(() => import('./views/EspaceMembreView').then((m) => ({ default: m.EspaceMembreView })));
const AdminView = lazy(() => import('./views/AdminView').then((m) => ({ default: m.AdminView })));
const ContactView = lazy(() => import('./views/ContactView').then((m) => ({ default: m.ContactView })));
const LegalView = lazy(() => import('./views/LegalView').then((m) => ({ default: m.LegalView })));

const ViewFallback: React.FC = () => (
  <div className="min-h-[60vh] bg-[#F8F8F6] dark:bg-[#141413] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-10 h-10 rounded-full border-2 border-[#F2B705] border-t-transparent animate-spin" />
    <span className="text-xs font-medium text-[#4A4A48] dark:text-zinc-400 tracking-wider uppercase">
      Chargement du portail ALGB...
    </span>
  </div>
);

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
      <Suspense fallback={<ViewFallback />}>
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
        {(activeTab === 'mentions-legales' ||
          activeTab === 'confidentialite' ||
          activeTab === 'cgu') && <LegalView />}
      </Suspense>
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F8F6] dark:bg-[#141413] text-[#141413] dark:text-[#F8F8F6] font-sans antialiased selection:bg-[#F2B705] selection:text-[#141413] transition-colors duration-150">
        <Header />
        <div className="flex-1 flex items-stretch">
          <div className="flex-1 min-w-0 flex flex-col">
            <PageBackBar />
            <MainContent />
          </div>
          <RightActionSidebar />
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
        <OfflineIndicator />
      </div>
    </AppProvider>
  );
}
