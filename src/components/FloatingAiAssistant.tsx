import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp, AiKnowledgeCategory, NavigationTab } from '../context/AppContext';
import {
  MessageSquareText,
  X,
  Send,
  RotateCcw,
  BookOpen,
  UserCheck,
  PlusCircle,
  Trash2,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'Comment adhérer à l’ALGB et quel est le montant des cotisations ?',
  'Quels sont les prochains événements à venir ?',
  'Quelles sont les missions et projets en cours de l’Amicale ?',
  'Comment obtenir ma carte d’adhérent et utiliser le QR Code ?',
];

const CATEGORY_LABELS: Record<AiKnowledgeCategory, string> = {
  ADHESION: 'Adhésion & Cotisations',
  EVENEMENTS: 'Événements & Agenda',
  AMICALE: 'Vie de l’Amicale',
  PROFIL_OFFICIEL: 'Profil Référent',
};

function formatInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function getQuickLinksForReply(replyText: string): { label: string; tab: NavigationTab }[] {
  const lower = replyText.toLowerCase();
  const links: { label: string; tab: NavigationTab }[] = [];

  if (lower.includes('adhésion') || lower.includes('adherer') || lower.includes('enrôl')) {
    links.push({ label: 'Page Adhésion', tab: 'adhesion' });
  }
  if (lower.includes('événement') || lower.includes('agenda') || lower.includes('retrouvailles') || lower.includes('actualité')) {
    links.push({ label: 'Actualités & Agenda', tab: 'actualites' });
  }
  if (lower.includes('projet') || lower.includes('don') || lower.includes('bibliothèque')) {
    links.push({ label: 'Voir les Projets', tab: 'projets' });
  }
  if (lower.includes('cotisation') || lower.includes('espace membre') || lower.includes('qr') || lower.includes('carte')) {
    links.push({ label: 'Espace Membre', tab: 'espace-membre' });
  }
  if (lower.includes('annuaire') || lower.includes('promotion') || lower.includes('bdr')) {
    links.push({ label: 'Annuaire & Promotions', tab: 'anciens' });
  }

  return links.slice(0, 2);
}

export const FloatingAiAssistant: React.FC = () => {
  const {
    aiChatOpen,
    setAiChatOpen,
    aiKnowledgeEntries,
    canEnrichAi,
    addAiKnowledgeEntry,
    toggleAiKnowledgeEntry,
    deleteAiKnowledgeEntry,
    enrichAiFromCurrentProfile,
    settings,
    events,
    news,
    projects,
    members,
    promotions,
    currentRole,
    currentUser,
    setActiveTab,
    addToast,
  } = useApp();

  const [modalTab, setModalTab] = useState<'CHAT' | 'ENRICH'>('CHAT');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: "Bonjour ! Je suis l'assistant de l'ALGB (Lycée de Garçons de Bingerville). Posez-moi vos questions sur l'Amicale, les procédures d'adhésion, les cotisations ou les événements à venir.",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  // Enrichment form states
  const [profileNote, setProfileNote] = useState('');
  const [kbTitle, setKbTitle] = useState('');
  const [kbCategory, setKbCategory] = useState<AiKnowledgeCategory>('AMICALE');
  const [kbContent, setKbContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canEnrichAi && modalTab === 'ENRICH') {
      setModalTab('CHAT');
    }
  }, [canEnrichAi, modalTab]);

  useEffect(() => {
    if (aiChatOpen && modalTab === 'CHAT') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, aiChatOpen, modalTab, isSending]);

  const activeKnowledgeCount = useMemo(
    () => aiKnowledgeEntries.filter((e) => e.isActive).length,
    [aiKnowledgeEntries]
  );

  const roleDisplayLabel =
    currentRole === 'RESPONSABLE_COMM'
      ? 'Responsable Communication'
      : currentRole === 'SUPER_ADMIN'
      ? 'Super Administrateur'
      : currentRole === 'ADMIN'
      ? 'Administrateur ALGB'
      : currentRole;

  const buildContextSnapshot = () => ({
    settings: {
      associationName: settings.associationName,
      associationSignature: settings.associationSignature,
      associationMessage: settings.associationMessage,
      presidentName: settings.presidentName,
      secretaryGeneralName: settings.secretaryGeneralName,
      treasurerName: settings.treasurerName,
      headquartersAddress: settings.headquartersAddress,
      officialEmail: settings.officialEmail,
      officialPhone: settings.officialPhone,
      droitAdhesionAmount: settings.droitAdhesionAmount,
      cotisationMensuelleAmount: settings.cotisationMensuelleAmount,
      currency: settings.currency,
      fiscalYear: settings.fiscalYear,
      orangeMoneyMerchantNumber: settings.orangeMoneyMerchantNumber,
      mtnMoMoMerchantNumber: settings.mtnMoMoMerchantNumber,
      moovMoneyMerchantNumber: settings.moovMoneyMerchantNumber,
      bankName: settings.bankName,
    },
    events: events.map((ev) => ({
      title: ev.title,
      type: ev.type,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      city: ev.city,
      summary: ev.summary,
      attendeesCount: ev.attendeesCount,
    })),
    news: news.slice(0, 6).map((n) => ({
      title: n.title,
      category: n.category,
      date: n.date,
      summary: n.summary,
    })),
    projects: projects.map((p) => ({
      title: p.title,
      category: p.category,
      status: p.status,
      budgetGoal: p.budgetGoal,
      budgetRaised: p.budgetRaised,
      summary: p.summary,
    })),
    stats: {
      membersCount: members.length,
      promotionsCount: promotions.length,
    },
    currentRole,
    currentUserLabel: currentUser
      ? `${currentUser.firstName} ${currentUser.lastName} (Promo ${currentUser.promotionYear})`
      : undefined,
  });

  const buildClientFallbackReply = (query: string): string => {
    const q = query.toLowerCase();
    const adhesion = settings.droitAdhesionAmount.toLocaleString('fr-FR');
    const mensuel = settings.cotisationMensuelleAmount.toLocaleString('fr-FR');
    if (q.includes('adh') || q.includes('cotis') || q.includes('inscr') || q.includes('paiement')) {
      return `Pour adhérer à l'ALGB et régler vos cotisations :\n• Droit d'adhésion : ${adhesion} ${settings.currency}\n• Cotisation mensuelle : ${mensuel} ${settings.currency} / mois (Exercice ${settings.fiscalYear})\n• Rendez-vous dans la rubrique "Adhésion" pour soumettre votre dossier ou dans votre "Espace Membre" pour régler via Orange Money, MTN MoMo, Moov Money, Carte Bancaire ou Virement.`;
    }
    if (q.includes('évén') || q.includes('even') || q.includes('agenda') || q.includes('gala')) {
      const evLines = events
        .slice(0, 3)
        .map((ev) => `• ${ev.title} — le ${ev.date} à ${ev.time} (${ev.location}, ${ev.city})`)
        .join('\n');
      return evLines
        ? `Prochains rendez-vous de l'ALGB :\n${evLines}`
        : `Retrouvez le calendrier complet dans la rubrique "Actualités & Agenda".`;
    }
    if (q.includes('projet') || q.includes('don') || q.includes('mécénat') || q.includes('mecenat')) {
      const pLines = projects
        .slice(0, 3)
        .map(
          (p) =>
            `• ${p.title} : ${p.budgetRaised.toLocaleString('fr-FR')} / ${p.budgetGoal.toLocaleString('fr-FR')} ${settings.currency}`
        )
        .join('\n');
      return pLines
        ? `Projets prioritaires soutenus par l'ALGB :\n${pLines}`
        : `Découvrez les initiatives solidaires dans la rubrique "Projets".`;
    }
    return `Merci pour votre message. Vous pouvez consulter les rubriques "Adhésion" (${adhesion} ${settings.currency}), "Actualités" (${events.length} événements), "Projets" (${projects.length} projets) ou joindre le secrétariat officiel à ${settings.officialEmail} (${settings.officialPhone}).`;
  };

  const handleSendMessage = async (overrideText?: string) => {
    const query = (overrideText ?? inputText).trim();
    if (!query || isSending) return;

    setErrorMsg(null);
    setWarningMsg(null);
    const nowTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: nowTime,
    };

    // Ne conserver que les paires complètes user -> model valides pour Gemini
    const rawHistory = messages
      .filter((m) => m.id !== 'welcome-1')
      .map((m) => ({ role: m.role, text: m.text }));
    const historyForApi: { role: 'user' | 'model'; text: string }[] = [];
    for (const turn of rawHistory) {
      if (historyForApi.length === 0 && turn.role !== 'user') continue;
      const last = historyForApi[historyForApi.length - 1];
      if (last && last.role === turn.role) {
        last.text = turn.text;
      } else {
        historyForApi.push({ ...turn });
      }
    }
    if (historyForApi.length > 0 && historyForApi[historyForApi.length - 1].role === 'user') {
      historyForApi.pop();
    }

    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyForApi,
          contextSnapshot: buildContextSnapshot(),
          aiKnowledgeBase: aiKnowledgeEntries,
        }),
      });

      const rawText = await res.text();
      let data: { reply?: string; error?: string; warning?: string } = {};
      try {
        data = rawText ? (JSON.parse(rawText) as typeof data) : {};
      } catch {
        data = {};
      }

      if (!res.ok || !data.reply) {
        const reason =
          data?.error ||
          `Service distant temporairement indisponible (HTTP ${res.status}).`;
        setWarningMsg(reason);
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            text: buildClientFallbackReply(query),
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }

      if (data.warning) {
        setWarningMsg(data.warning);
      }

      const replyMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch {
      setWarningMsg(
        "Connexion au serveur IA interrompue : réponse générée localement à partir des données du portail."
      );
      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: buildClientFallbackReply(query),
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      addToast(
        'info',
        'Assistant en mode local',
        'Réponse générée depuis les données officielles de l’ALGB.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleResetChat = () => {
    setErrorMsg(null);
    setWarningMsg(null);
    setMessages([
      {
        id: 'welcome-1',
        role: 'model',
        text: "Conversation réinitialisée. Comment puis-je vous renseigner sur l'ALGB, l'adhésion ou les prochains événements ?",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSyncProfile = () => {
    enrichAiFromCurrentProfile(profileNote);
    setProfileNote('');
  };

  const handleAddKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbTitle.trim() || !kbContent.trim()) return;
    const added = addAiKnowledgeEntry({
      title: kbTitle,
      category: kbCategory,
      content: kbContent,
    });
    if (added) {
      setKbTitle('');
      setKbContent('');
    }
  };

  const handleNavigateFromChat = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Chat Launcher in Bottom-Right Corner (stacked cleanly above RoleSwitcherBar) */}
      {!aiChatOpen && (
        <div className="fixed bottom-16 right-4 z-40 no-print">
          <button
            type="button"
            onClick={() => setAiChatOpen(true)}
            aria-label="Ouvrir l’assistant IA de l’ALGB"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#141413] hover:bg-[#1e1e1c] text-white border border-[#F2B705] shadow-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F2B705]"
          >
            <span className="w-8 h-8 rounded-lg bg-[#F2B705] text-[#141413] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <MessageSquareText className="w-4 h-4" />
            </span>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-none text-white">Assistant ALGB</div>
              <div className="text-[10px] text-[#F2B705] mt-0.5">
                Amicale, adhésion & agenda
              </div>
            </div>
          </button>
        </div>
      )}

      {/* AI Assistant Modal Window */}
      {aiChatOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="algb-ai-modal-title"
          className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-16 sm:right-4 z-[60] sm:w-[460px] h-[min(640px,84vh)] bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-xl shadow-2xl flex flex-col overflow-hidden no-print"
        >
          {/* Modal Header */}
          <div className="bg-[#141413] text-white px-4 sm:px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#F2B705] text-[#141413] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2
                  id="algb-ai-modal-title"
                  className="text-sm font-bold font-heading text-white truncate"
                >
                  Assistant IA · ALGB Bingerville
                </h2>
                <p className="text-[11px] text-zinc-300 truncate">
                  Amicale, procédures d’adhésion & agenda ({activeKnowledgeCount} note
                  {activeKnowledgeCount > 1 ? 's' : ''} active{activeKnowledgeCount > 1 ? 's' : ''})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {modalTab === 'CHAT' && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Nouvelle conversation"
                  aria-label="Réinitialiser la conversation"
                  className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setAiChatOpen(false)}
                aria-label="Fermer l’assistant IA"
                className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-navigation for Admin / Communication */}
          {canEnrichAi && (
            <div className="px-4 py-2 bg-[#F8F8F6] dark:bg-[#141413] border-b border-[#141413]/10 dark:border-white/10 flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setModalTab('CHAT')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  modalTab === 'CHAT'
                    ? 'bg-white dark:bg-[#1e1e1c] text-[#141413] dark:text-white shadow-xs border border-[#141413]/15 dark:border-white/15'
                    : 'text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white'
                }`}
              >
                Discussion
              </button>
              <button
                type="button"
                onClick={() => setModalTab('ENRICH')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  modalTab === 'ENRICH'
                    ? 'bg-[#F2B705] text-[#141413] shadow-xs'
                    : 'text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Enrichir l’IA ({aiKnowledgeEntries.length})</span>
              </button>
            </div>
          )}

          {/* TAB 1: CHAT */}
          {modalTab === 'CHAT' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#1e1e1c]">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const quickLinks =
                    !isUser && msg.id !== 'welcome-1' ? getQuickLinksForReply(msg.text) : [];

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                          isUser
                            ? 'bg-[#F2B705] text-[#141413] font-medium rounded-br-sm'
                            : 'bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 text-[#141413] dark:text-zinc-100 rounded-bl-sm'
                        }`}
                      >
                        {formatInlineMarkdown(msg.text)}

                        {quickLinks.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-[#141413]/10 dark:border-white/10 flex flex-wrap gap-2">
                            {quickLinks.map((lnk) => (
                              <button
                                key={lnk.tab}
                                type="button"
                                onClick={() => handleNavigateFromChat(lnk.tab)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 hover:border-[#F2B705] text-[11px] font-semibold text-[#141413] dark:text-white cursor-pointer transition-colors"
                              >
                                <span>{lnk.label}</span>
                                <ArrowRight className="w-3 h-3 text-[#141413] dark:text-[#F2B705]" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-[#4A4A48] dark:text-zinc-400 mt-1 px-1 tabular-nums">
                        {isUser ? 'Vous' : 'Assistant ALGB'} · {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isSending && (
                  <div className="flex items-start">
                    <div className="bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 rounded-xl rounded-bl-sm px-4 py-3 text-xs text-[#4A4A48] dark:text-zinc-400">
                      Consultation des informations de l’Amicale...
                    </div>
                  </div>
                )}

                {warningMsg && (
                  <div className="p-2.5 rounded-xl bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 text-[11px] text-[#141413] dark:text-[#FEF8E6] flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#141413] dark:text-[#F2B705]" />
                      <span>{warningMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWarningMsg(null)}
                      aria-label="Masquer l'information"
                      className="text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white cursor-pointer shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                    <div>
                      <div className="font-semibold">Réponse indisponible</div>
                      <p className="text-[11px] mt-0.5">{errorMsg}</p>
                    </div>
                  </div>
                )}

                {messages.length <= 2 && !isSending && (
                  <div className="pt-2 space-y-2">
                    <div className="text-[11px] font-semibold text-[#4A4A48] dark:text-zinc-400">
                      Questions fréquentes :
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleSendMessage(q)}
                          className="text-left px-3 py-2 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#FEF8E6] dark:hover:bg-[#2a2719] border border-[#141413]/10 dark:border-white/10 hover:border-[#F2B705] text-xs text-[#141413] dark:text-zinc-200 transition-colors cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-[#F8F8F6] dark:bg-[#141413] border-t border-[#141413]/10 dark:border-white/10 flex items-end gap-2 shrink-0"
              >
                <textarea
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Posez votre question sur l’ALGB, l’adhésion ou l’agenda..."
                  aria-label="Votre question à l’assistant IA"
                  className="flex-1 resize-none bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg px-3.5 py-2.5 text-xs text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none max-h-24"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  aria-label="Envoyer le message"
                  className="px-3.5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] disabled:opacity-40 text-[#141413] font-bold transition-colors cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: ENRICH AI (ADMIN / SUPER_ADMIN / RESPONSABLE_COMM) */}
          {modalTab === 'ENRICH' && canEnrichAi && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white dark:bg-[#1e1e1c]">
              {/* Profile Enrichment Card */}
              <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#141413] dark:text-[#F2B705] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#F2B705]" />
                      <span>Importer depuis votre profil</span>
                    </div>
                    <h3 className="text-xs font-bold text-[#141413] dark:text-white mt-1">
                      {currentUser
                        ? `${currentUser.firstName} ${currentUser.lastName} · Promo ${currentUser.promotionYear}`
                        : roleDisplayLabel}
                    </h3>
                    <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400 mt-0.5">
                      Rôle actif : <strong className="text-[#141413] dark:text-white">{roleDisplayLabel}</strong>
                      {currentUser
                        ? ` · ${currentUser.currentRole} (${currentUser.company})`
                        : ''}
                    </p>
                  </div>
                </div>

                {currentUser && (
                  <p className="text-[11px] text-[#4A4A48] dark:text-zinc-300 leading-relaxed bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-lg p-2.5">
                    Données extraites : identité, promotion ({currentUser.promotionName}), secteur ({currentUser.sector}), localisation ({currentUser.city}, {currentUser.country}), expertises BDR ({(currentUser.skills || []).slice(0, 3).join(', ') || 'générales'}) et présentation.
                  </p>
                )}

                <textarea
                  rows={2}
                  value={profileNote}
                  onChange={(e) => setProfileNote(e.target.value)}
                  placeholder="Précision facultative à joindre depuis votre profil (ex: disponibilités, message d’accueil)..."
                  className="w-full bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg px-3 py-2 text-xs text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleSyncProfile}
                  className="w-full py-2 px-3 rounded-lg bg-[#141413] dark:bg-white/10 hover:bg-[#141413]/90 dark:hover:bg-white/15 text-[#F2B705] border border-[#141413] dark:border-[#F2B705]/40 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Enrichir l’IA avec les données de mon profil</span>
                </button>
              </div>

              {/* Manual Knowledge Entry Form */}
              <form
                onSubmit={handleAddKnowledge}
                className="p-4 rounded-xl bg-white dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-3"
              >
                <div className="text-xs font-bold text-[#141413] dark:text-white flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-[#F2B705]" />
                  <span>Ajouter une directive ou FAQ officielle</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={kbTitle}
                    onChange={(e) => setKbTitle(e.target.value)}
                    placeholder="Titre court (ex: Pièces à fournir)"
                    className="w-full bg-[#F8F8F6] dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg px-3 py-2 text-xs text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none"
                  />
                  <select
                    value={kbCategory}
                    onChange={(e) => setKbCategory(e.target.value as AiKnowledgeCategory)}
                    className="w-full bg-[#F8F8F6] dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg px-3 py-2 text-xs text-[#141413] dark:text-white focus:outline-none"
                  >
                    <option value="AMICALE">Vie de l’Amicale</option>
                    <option value="ADHESION">Adhésion & Cotisations</option>
                    <option value="EVENEMENTS">Événements & Agenda</option>
                    <option value="PROFIL_OFFICIEL">Profil Référent</option>
                  </select>
                </div>

                <textarea
                  rows={3}
                  required
                  value={kbContent}
                  onChange={(e) => setKbContent(e.target.value)}
                  placeholder="Rédigez l’information exacte que l’assistant IA doit communiquer aux membres..."
                  className="w-full bg-[#F8F8F6] dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg px-3 py-2 text-xs text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-bold transition-colors cursor-pointer"
                >
                  Enregistrer dans la base de connaissances IA
                </button>
              </form>

              {/* Existing Entries List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#141413] dark:text-white">
                  <span>Informations transmises à l’IA ({aiKnowledgeEntries.length})</span>
                  <span className="text-[11px] font-normal text-[#4A4A48] dark:text-zinc-400 tabular-nums">
                    {activeKnowledgeCount} active{activeKnowledgeCount > 1 ? 's' : ''}
                  </span>
                </div>

                {aiKnowledgeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      entry.isActive
                        ? 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10'
                        : 'bg-[#F8F8F6]/60 dark:bg-[#141413]/50 border-[#141413]/10 dark:border-white/10 opacity-65'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] text-[#4A4A48] dark:text-zinc-400 flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-[#141413] dark:text-[#F2B705] uppercase">
                            {entry.source === 'PROFIL' ? 'Profil' : 'Note'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{CATEGORY_LABELS[entry.category]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{entry.updatedAt}</span>
                        </div>
                        <h4 className="font-bold text-[#141413] dark:text-white mt-0.5">{entry.title}</h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleAiKnowledgeEntry(entry.id)}
                          title={entry.isActive ? 'Désactiver pour l’IA' : 'Réactiver pour l’IA'}
                          className="p-1.5 rounded-lg border border-[#141413]/15 dark:border-white/15 hover:border-[#141413] dark:hover:border-white text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white cursor-pointer"
                        >
                          {entry.isActive ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAiKnowledgeEntry(entry.id)}
                          title="Supprimer"
                          className="p-1.5 rounded-lg border border-[#141413]/15 dark:border-white/15 hover:border-red-500 text-red-600 dark:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#4A4A48] dark:text-zinc-300 leading-relaxed">{entry.content}</p>
                    <div className="text-[10px] text-[#4A4A48] dark:text-zinc-400">
                      Ajouté par : {entry.authorName} ({entry.authorRole})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
