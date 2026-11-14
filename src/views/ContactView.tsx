import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Mail,
  Phone,
  Send,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Demande de renseignement général',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      'success',
      'Message transmis au Secrétariat Général',
      'Votre correspondance a été enregistrée. Le Bureau Exécutif vous répondra dans les meilleurs délais.'
    );
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Demande de renseignement général',
      message: '',
    });
  };

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen text-[#141413] dark:text-[#F8F8F6] transition-colors">
      {/* Carbon Black Header Band */}
      <section className="bg-[#141413] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705]">
            Liaison & Partenariats
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white mt-1">
            Contact & Siège de l’Amicale
          </h1>
          <p className="text-sm text-zinc-300 font-editorial italic max-w-2xl mt-2">
            « Entrez en relation avec le Bureau Exécutif, proposez un partenariat ou sollicitez un renseignement. »
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Official Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-editorial">
              <div className="flex items-center gap-4 pb-4 border-b border-[#141413]/10 dark:border-white/10">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo ALGB"
                  className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-[#F2B705]/60 shadow-xs shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold font-heading text-[#141413] dark:text-white">
                    Secrétariat Permanent ALGB
                  </h3>
                  <span className="text-xs text-[#4A4A48] dark:text-[#F2B705] uppercase font-semibold tracking-wider">
                    Lycée de Garçons de Bingerville
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#4A4A48] dark:text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#141413] dark:text-[#F2B705] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#141413] dark:text-white block font-semibold">Adresse du Siège :</strong>
                    <span>Lycée de Garçons de Bingerville, Boulevard Principal, BP 24 Bingerville, District Autonome d’Abidjan, Côte d’Ivoire.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#141413] dark:text-[#F2B705] shrink-0" />
                  <div>
                    <strong className="text-[#141413] dark:text-white block font-semibold">Courrier Électronique :</strong>
                    <span className="font-mono text-[#4A4A48] dark:text-zinc-400">contact@algb-bingerville.ci</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#141413] dark:text-[#F2B705] shrink-0" />
                  <div>
                    <strong className="text-[#141413] dark:text-white block font-semibold">Lignes Téléphoniques :</strong>
                    <span className="font-mono text-[#4A4A48] dark:text-zinc-400">+225 27 22 40 12 00 / 07 08 09 10 11</span>
                  </div>
                </div>
              </div>

              {/* Geographical Context */}
              <div className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-2 text-xs">
                <span className="font-semibold text-[#141413] dark:text-white block">Accès au Campus</span>
                <p className="text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                  Le lycée est situé sur les hauteurs de Bingerville, à 15 minutes d’Abidjan Cocody. Accès par la voie lagunaire ou le boulevard François Mitterrand.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-editorial">
              <h3 className="text-lg font-bold font-heading text-[#141413] dark:text-white">
                Formulaire de Correspondance & Partenariat
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1.5">
                      Votre Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kouamé Sylvain"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg p-2.5 text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1.5">
                      Adresse E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@exemple.ci"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg p-2.5 text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1.5">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+225 07 XX XX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg p-2.5 text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none font-mono transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1.5">
                      Objet de votre message *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg p-2.5 text-[#141413] dark:text-white focus:outline-none transition-colors"
                    >
                      <option value="Demande de renseignement général">Demande de renseignement général</option>
                      <option value="Proposition de partenariat institutionnel">Proposition de partenariat institutionnel</option>
                      <option value="Mécénat / Don pour un projet du lycée">Mécénat / Don pour un projet du lycée</option>
                      <option value="Signalement / Mise à jour d’une promotion">Signalement / Mise à jour d’une promotion</option>
                      <option value="Contact Presse / Média">Contact Presse / Média</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1.5">
                    Votre message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Détaillez votre demande ou proposition..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#F2B705] rounded-lg p-2.5 text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none font-editorial transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#F2B705] text-[#141413] font-semibold rounded-lg hover:bg-[#dfa704] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4 text-[#141413]" />
                  <span>Envoyer ma correspondance</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
