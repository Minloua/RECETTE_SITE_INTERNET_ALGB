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
    <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-gray-900 dark:text-zinc-100">
        {/* Editorial Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
              Liaison & Partenariats
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-black dark:text-white mt-1">
              Contact & Siège de l’Amicale
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic max-w-2xl mt-1">
              « Entrez en relation avec le Bureau Exécutif, proposez un partenariat ou sollicitez un renseignement. »
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Official Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
                <img
                  src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                  alt="Logo ALGB"
                  className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-gray-200 dark:border-zinc-700 shadow-sm shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold font-heading text-black dark:text-white">
                    Secrétariat Permanent ALGB
                  </h3>
                  <span className="text-xs text-[#B8860B] dark:text-[#E5B824] uppercase font-bold">
                    Lycée de Garçons de Bingerville
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-gray-700 dark:text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black dark:text-white block font-bold">Adresse du Siège :</strong>
                    <span>Lycée de Garçons de Bingerville, Boulevard Principal, BP 24 Bingerville, District Autonome d’Abidjan, Côte d’Ivoire.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824] shrink-0" />
                  <div>
                    <strong className="text-black dark:text-white block font-bold">Courrier Électronique :</strong>
                    <span className="font-mono text-gray-600 dark:text-zinc-400">contact@algb-bingerville.ci</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824] shrink-0" />
                  <div>
                    <strong className="text-black dark:text-white block font-bold">Lignes Téléphoniques :</strong>
                    <span className="font-mono text-gray-600 dark:text-zinc-400">+225 27 22 40 12 00 / 07 08 09 10 11</span>
                  </div>
                </div>
              </div>

              {/* Geographical Context */}
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 space-y-2 text-xs shadow-xs">
                <span className="font-bold text-black dark:text-white block">Accès au Campus</span>
                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">
                  Le lycée est situé sur les hauteurs de Bingerville, à 15 minutes d'Abidjan Cocody. Accès par la voie lagunaire ou le boulevard François Mitterrand.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Formulaire de Correspondance & Partenariat
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-semibold mb-1">Votre Nom & Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kouamé Sylvain"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950 rounded-lg p-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-semibold mb-1">Adresse E-mail *</label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@exemple.ci"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950 rounded-lg p-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-semibold mb-1">Téléphone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+225 07 XX XX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950 rounded-lg p-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none font-mono transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-zinc-300 font-semibold mb-1">Objet de votre message *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950 rounded-lg p-2.5 text-gray-900 dark:text-white focus:outline-none transition-colors"
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
                  <label className="block text-gray-700 dark:text-zinc-300 font-semibold mb-1">Votre message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Détaillez votre demande ou proposition..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950 rounded-lg p-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none font-editorial transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E5B824] text-black font-bold rounded-xl hover:bg-[#dcae1f] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
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
