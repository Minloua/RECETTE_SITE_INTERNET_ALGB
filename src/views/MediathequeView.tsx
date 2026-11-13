import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryPhoto, YouTubeVideo } from '../data/mockData';
import {
  Play,
  Video,
  Image as ImageIcon,
  Camera,
  Maximize2,
  X,
  PlusCircle,
  Download,
  Share2,
  ExternalLink,
  Bell,
  Clock,
  Sparkles,
  Search,
  Film,
} from 'lucide-react';

export const MediathequeView: React.FC = () => {
  const { photos, videos, addPhoto, addYouTubeVideo, currentRole, addToast } = useApp();

  const [activeMediaTab, setActiveMediaTab] = useState<'VIDEOS' | 'PHOTOS'>('VIDEOS');
  const [photoCategory, setPhotoCategory] = useState<string>('ALL');
  const [videoCategory, setVideoCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [photoUploadModalOpen, setPhotoUploadModalOpen] = useState(false);
  const [videoUploadModalOpen, setVideoUploadModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);

  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoYear, setNewPhotoYear] = useState('Archives 1980');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'HISTOIRE' | 'PROMOTIONS' | 'RETROUVAILLES' | 'ACTIONS' | 'CEREMONIES'>('HISTOIRE');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoId, setNewVideoId] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState<'DOCUMENTAIRE' | 'RETROUVAILLES' | 'PROJETS' | 'TEMOIGNAGES' | 'EXCELLENCE'>('DOCUMENTAIRE');
  const [newVideoDuration, setNewVideoDuration] = useState('15:20');
  const [newVideoDescription, setNewVideoDescription] = useState('');

  const canManageMedia =
    currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN' || currentRole === 'RESPONSABLE_COMM';

  const filteredPhotos = photos.filter((p) => {
    const matchesCat = photoCategory === 'ALL' || p.category === photoCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredVideos = videos.filter((v) => {
    const matchesCat = videoCategory === 'ALL' || v.category === videoCategory;
    const matchesSearch =
      searchQuery === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredVideo = videos.find((v) => v.isFeatured) || videos[0];

  const handleSubscribeToggle = () => {
    if (!isSubscribed) {
      setIsSubscribed(true);
      addToast(
        'success',
        'Abonnement à ALGB TV confirmé !',
        'Merci de soutenir la chaîne officielle de l’Amicale des Anciens du Lycée de Garçons de Bingerville.'
      );
    } else {
      setIsSubscribed(false);
      addToast('info', 'Abonnement résilié', 'Vous ne recevrez plus les notifications de nouveaux reportages.');
    }
  };

  const handleNotificationToggle = () => {
    setNotificationsActive(!notificationsActive);
    addToast(
      'info',
      notificationsActive ? 'Notifications désactivées' : 'Cloche de notification activée',
      notificationsActive
        ? 'Vous recevrez uniquement les e-mails périodiques.'
        : 'Vous serez alerté dès la publication d’un nouveau documentaire ou grand reportage.'
    );
  };

  const handlePhotoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle) return;

    addPhoto({
      title: newPhotoTitle,
      category: newPhotoCategory,
      year: newPhotoYear,
      imageUrl: '/assets/images/bingerville_historic_heritage_1794382830908.jpg',
      caption: newPhotoCaption || 'Photographie d’archives transmise par un ancien élève de l’Amicale.',
    });

    setPhotoUploadModalOpen(false);
    setNewPhotoTitle('');
    setNewPhotoCaption('');
  };

  const handleVideoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle) return;

    let cleanId = newVideoId.trim();
    if (cleanId.includes('v=')) {
      cleanId = cleanId.split('v=')[1]?.split('&')[0] || '2b9x_bC8oQE';
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1]?.split('?')[0] || '2b9x_bC8oQE';
    } else if (!cleanId) {
      cleanId = '2b9x_bC8oQE';
    }

    addYouTubeVideo({
      youtubeId: cleanId,
      title: newVideoTitle,
      category: newVideoCategory,
      duration: newVideoDuration || '12:30',
      viewsCount: '1,2 k vues',
      publishedDate: 'Récemment',
      thumbnailUrl: '/assets/images/algb_youtube_doc_cover_1794388504553.jpg',
      description: newVideoDescription || 'Reportage institutionnel de l’Amicale des Anciens Élèves du LGB.',
    });

    setVideoUploadModalOpen(false);
    setNewVideoTitle('');
    setNewVideoId('');
    setNewVideoDescription('');
  };

  const inputClass =
    'w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950 rounded-lg p-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none';

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Editorial Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>Médiathèque Officielle ALGB</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-black dark:text-white mt-1">
              Médiathèque & Chaîne ALGB TV
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic max-w-2xl mt-1">
              « Documentaires historiques, reportages des grandes retrouvailles et archives photographiques centenaires du Lycée de Garçons de Bingerville. »
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {canManageMedia && (
              <button
                onClick={() => setVideoUploadModalOpen(true)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
                <span>Ajouter une vidéo YouTube</span>
              </button>
            )}

            <button
              onClick={() => setPhotoUploadModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#E5B824] text-black hover:bg-[#dcae1f] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Proposer une photo d'époque</span>
            </button>
          </div>
        </div>

        {/* Main Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 sm:p-3 rounded-2xl">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveMediaTab('VIDEOS')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeMediaTab === 'VIDEOS'
                  ? 'bg-[#FF0000] text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-zinc-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Chaîne YouTube ALGB ({videos.length})</span>
            </button>

            <button
              onClick={() => setActiveMediaTab('PHOTOS')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeMediaTab === 'PHOTOS'
                  ? 'bg-[#E5B824] text-black shadow-sm'
                  : 'bg-white dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-zinc-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Galerie Photos & Archives ({photos.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeMediaTab === 'VIDEOS' ? 'Rechercher une vidéo...' : 'Rechercher une photo...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl pl-8 pr-3 py-2 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 1 : VIDEOS & COMPTE YOUTUBE OFFICIEL */}
        {activeMediaTab === 'VIDEOS' && (
          <div className="space-y-10">
            {/* Official YouTube Channel Card */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="relative h-36 sm:h-52 bg-gray-900 overflow-hidden border-b border-gray-200 dark:border-zinc-800">
                <img
                  src="/assets/images/bingerville_lycee_campus_1794382827777.jpg"
                  alt="Bannière Chaîne YouTube ALGB"
                  className="w-full h-full object-cover opacity-55"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>

                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/80 rounded-full text-[11px] text-white">
                  <span className="font-semibold">YouTube Officiel</span>
                  <span className="text-gray-400">|</span>
                  <span className="font-mono text-[#E5B824]">@ALGB_Officiel</span>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-12 sm:-mt-16">
                  <div className="flex items-end gap-4 sm:gap-6">
                    <div className="relative">
                      <img
                        src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                        alt="Logo Officiel de l'Amicale ALGB"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-contain bg-white border-2 border-[#E5B824] shadow-md p-1.5 shrink-0"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[#FF0000] text-white p-1 rounded-full shadow-md" title="Chaîne YouTube Vérifiée">
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                    </div>

                    <div className="space-y-1 pt-12 md:pt-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-2xl font-bold font-heading text-black dark:text-white leading-tight">
                          Amicale LGB · Chaîne Officielle
                        </h2>
                        <span className="w-4 h-4 rounded-full bg-black dark:bg-[#E5B824] text-[#E5B824] dark:text-black flex items-center justify-center text-[10px] font-bold" title="Chaîne Officielle Vérifiée">
                          ✓
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-600 dark:text-zinc-400 font-mono">
                        <span className="text-black dark:text-white font-semibold">@ALGB_Officiel</span>
                        <span>·</span>
                        <span className="text-[#B8860B] dark:text-[#E5B824] font-semibold">3,85 k abonnés</span>
                        <span>·</span>
                        <span>24 vidéos</span>
                        <span>·</span>
                        <span>148 k vues</span>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-zinc-400 max-w-2xl font-editorial italic pt-1 hidden sm:block">
                        « Documentaires historiques, assemblées générales, galas annuels, chantiers de rénovation et portraits de nos illustres anciens du Lycée de Garçons de Bingerville. »
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <button
                      onClick={handleSubscribeToggle}
                      className={`flex-1 md:flex-initial px-5 py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        isSubscribed
                          ? 'bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-700'
                          : 'bg-[#FF0000] hover:bg-[#d90000] text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSubscribed ? 'Abonné ✓' : 'S’abonner (3,85 k)'}</span>
                    </button>

                    <button
                      onClick={handleNotificationToggle}
                      title="Activer la cloche de notification"
                      className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                        notificationsActive
                          ? 'bg-[#E5B824] text-black border-[#E5B824]'
                          : 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      <Bell className={`w-4 h-4 ${notificationsActive ? 'fill-current' : ''}`} />
                    </button>

                    <a
                      href="https://www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all"
                      title="Ouvrir la chaîne sur YouTube"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Video Player */}
            {featuredVideo && (
              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
                  <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Grand Documentaire à la Une · Recommandé</span>
                  </span>
                  <span className="text-xs font-mono text-gray-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-500" />
                    <span>Durée : {featuredVideo.duration}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div
                    onClick={() => setSelectedVideo(featuredVideo)}
                    className="lg:col-span-7 group relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-gray-300 dark:border-zinc-700 hover:border-[#E5B824] transition-all shadow-md bg-black"
                  >
                    <img
                      src={featuredVideo.thumbnailUrl}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/85 text-white text-xs font-mono font-semibold rounded-md">
                      {featuredVideo.duration}
                    </div>

                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 text-[#E5B824] text-[10px] font-mono font-bold tracking-wider uppercase rounded">
                      {featuredVideo.category}
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-zinc-400">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{featuredVideo.viewsCount}</span>
                      <span>·</span>
                      <span>{featuredVideo.publishedDate}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedVideo(featuredVideo)}
                      className="text-xl sm:text-2xl font-bold font-heading text-black dark:text-white hover:text-[#B8860B] dark:hover:text-[#E5B824] cursor-pointer transition-colors leading-snug"
                    >
                      {featuredVideo.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 font-editorial italic leading-relaxed">
                      {featuredVideo.description}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedVideo(featuredVideo)}
                        className="px-5 py-2.5 bg-[#E5B824] text-black font-semibold text-xs rounded-xl hover:bg-[#dcae1f] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Visionner le Documentaire</span>
                      </button>

                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: featuredVideo.title, text: featuredVideo.description, url: window.location.href });
                          } else {
                            addToast('info', 'Lien copié', 'Le lien du documentaire a été copié dans le presse-papier.');
                          }
                        }}
                        className="p-2.5 bg-white dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-800 text-black dark:text-white rounded-xl border border-gray-300 dark:border-zinc-700 transition-colors cursor-pointer"
                        title="Partager cette vidéo"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Video Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-zinc-800 text-xs">
              {[
                { id: 'ALL', label: 'Toutes les vidéos' },
                { id: 'DOCUMENTAIRE', label: 'Documentaires & Histoire' },
                { id: 'RETROUVAILLES', label: 'Retrouvailles & Galas' },
                { id: 'PROJETS', label: 'Chantiers & Réalisations' },
                { id: 'TEMOIGNAGES', label: 'Mémoire & Témoignages' },
                { id: 'EXCELLENCE', label: 'Excellence & Mentorat' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setVideoCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    videoCategory === tab.id
                      ? 'bg-[#E5B824] text-black shadow-xs'
                      : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* YouTube Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-black">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-12 h-12 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 text-white text-[11px] font-mono font-semibold rounded">
                        {video.duration}
                      </div>

                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/80 text-[#E5B824] text-[9px] font-mono font-bold uppercase rounded">
                        {video.category}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold font-heading text-black dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-[#E5B824] transition-colors line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-zinc-400 font-editorial italic line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 dark:bg-zinc-950 flex items-center justify-between text-[11px] font-mono text-gray-500 dark:text-zinc-400 border-t border-gray-200 dark:border-zinc-800">
                    <span className="text-gray-700 dark:text-zinc-300 font-semibold">{video.viewsCount}</span>
                    <span>{video.publishedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2 : GALERIE PHOTOS & ARCHIVES */}
        {activeMediaTab === 'PHOTOS' && (
          <div className="space-y-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-zinc-800 text-xs">
              {[
                { id: 'ALL', label: 'Toutes les archives photographiques' },
                { id: 'HISTOIRE', label: 'Histoire & Patrimoine Colonial' },
                { id: 'RETROUVAILLES', label: 'Retrouvailles & Galas' },
                { id: 'ACTIONS', label: 'Chantiers & Réalisations' },
                { id: 'CEREMONIES', label: 'Cérémonies Solennelles' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPhotoCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    photoCategory === tab.id
                      ? 'bg-[#E5B824] text-black shadow-xs'
                      : 'bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-zinc-700 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="aspect-[16/11] overflow-hidden relative bg-gray-100 dark:bg-zinc-800">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-2.5 rounded-full bg-white dark:bg-zinc-900 text-black dark:text-white shadow-md">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-1.5 bg-white dark:bg-zinc-900">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
                      <span className="text-[#B8860B] dark:text-[#E5B824] font-bold">{photo.category}</span>
                      <span className="font-mono text-gray-600 dark:text-zinc-400">{photo.year}</span>
                    </div>
                    <h3 className="text-base font-bold font-heading text-black dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-[#E5B824] transition-colors leading-snug">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 font-editorial italic line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL 1: LECTEUR VIDEO YOUTUBE INTERACTIF */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-6">
              <div className="flex items-center justify-between p-4 px-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000]"></span>
                  <span className="text-black dark:text-white font-bold">ALGB TV · Lecteur Officiel</span>
                  <span className="text-gray-400 dark:text-zinc-600">·</span>
                  <span className="text-[#B8860B] dark:text-[#E5B824] font-mono">{selectedVideo.category}</span>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>

              <div className="p-6 sm:p-8 space-y-5 bg-white dark:bg-zinc-900">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-xs font-mono text-gray-500 dark:text-zinc-400">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{selectedVideo.viewsCount}</span>
                    <span>Mise en ligne : {selectedVideo.publishedDate}</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold font-heading text-black dark:text-white">
                    {selectedVideo.title}
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                      alt="Logo ALGB"
                      className="w-11 h-11 rounded-xl object-contain bg-white border border-[#E5B824] p-0.5 shrink-0 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-black dark:text-white text-sm">
                        <span>ALGB Officiel</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-black dark:bg-[#E5B824] text-[#E5B824] dark:text-black flex items-center justify-center text-[8px]">✓</span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400 font-mono">3,85 k abonnés</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSubscribeToggle}
                      className={`px-4 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSubscribed
                          ? 'bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-zinc-700'
                          : 'bg-[#FF0000] text-white hover:bg-[#d90000]'
                      }`}
                    >
                      <span>{isSubscribed ? 'Abonné ✓' : 'S’abonner'}</span>
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-white border border-gray-300 dark:border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Regarder sur YouTube</span>
                    </a>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                    Description du reportage
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 font-editorial italic leading-relaxed whitespace-pre-line">
                    {selectedVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: LIGHTBOX PHOTO PLEIN ÉCRAN */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-6">
              <div className="flex items-center justify-between p-4 px-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                <span className="text-xs font-bold text-[#B8860B] dark:text-[#E5B824] uppercase tracking-wider font-mono">
                  {selectedPhoto.category} · {selectedPhoto.year}
                </span>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3 bg-white dark:bg-zinc-900">
                <h3 className="text-lg sm:text-2xl font-bold font-heading text-black dark:text-white">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 font-editorial italic leading-relaxed">
                  {selectedPhoto.caption}
                </p>
                <div className="pt-3 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 border-t border-gray-200 dark:border-zinc-800">
                  <span>Archives Officielles ALGB · Lycée de Garçons de Bingerville</span>
                  <button
                    onClick={() => {
                      addToast('info', 'Téléchargement', 'L’image haute résolution a été préparée.');
                    }}
                    className="text-[#B8860B] dark:text-[#E5B824] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger l'archive</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: PROPOSER UNE PHOTO D'ARCHIVE */}
        {photoUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="text-base font-bold font-heading text-black dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824]" />
                  <span>Contribuer aux Archives Photographiques</span>
                </h3>
                <button
                  onClick={() => setPhotoUploadModalOpen(false)}
                  className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePhotoUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Titre de la photographie</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Promotion 1985 devant le réfectoire historique"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Catégorie</label>
                    <select
                      value={newPhotoCategory}
                      onChange={(e) => setNewPhotoCategory(e.target.value as any)}
                      className={inputClass}
                    >
                      <option value="HISTOIRE">Histoire & Patrimoine</option>
                      <option value="PROMOTIONS">Promotions de classe</option>
                      <option value="RETROUVAILLES">Retrouvailles</option>
                      <option value="ACTIONS">Chantiers & Actions</option>
                      <option value="CEREMONIES">Cérémonies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Année / Époque</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 1988 ou Années 70"
                      value={newPhotoYear}
                      onChange={(e) => setNewPhotoYear(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Légende & Contexte historique</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Racontez l'histoire de ce cliché : camarades présents, lieu précis, anecdotes de l'époque..."
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className={`${inputClass} font-editorial`}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPhotoUploadModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#E5B824] text-black font-semibold rounded-xl hover:bg-[#dcae1f] cursor-pointer"
                  >
                    Transmettre aux Archives
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: AJOUTER UNE VIDÉO YOUTUBE */}
        {videoUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="text-base font-bold font-heading text-black dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#FF0000]" />
                  <span>Publier une Vidéo sur la Chaîne ALGB TV</span>
                </h3>
                <button
                  onClick={() => setVideoUploadModalOpen(false)}
                  className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleVideoUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Titre de la vidéo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Discours officiel du Président pour le Centenaire"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Catégorie</label>
                    <select
                      value={newVideoCategory}
                      onChange={(e) => setNewVideoCategory(e.target.value as any)}
                      className={inputClass}
                    >
                      <option value="DOCUMENTAIRE">Documentaire & Histoire</option>
                      <option value="RETROUVAILLES">Retrouvailles & Galas</option>
                      <option value="PROJETS">Chantiers & Projets</option>
                      <option value="TEMOIGNAGES">Mémoire & Témoignages</option>
                      <option value="EXCELLENCE">Excellence & Mentorat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Durée (ex: 18:40)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 14:25"
                      value={newVideoDuration}
                      onChange={(e) => setNewVideoDuration(e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                    Lien ou Identifiant YouTube
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: https://www.youtube.com/watch?v=2b9x_bC8oQE ou 2b9x_bC8oQE"
                    value={newVideoId}
                    onChange={(e) => setNewVideoId(e.target.value)}
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Description & Résumé de la vidéo</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Présentation du reportage, intervenants et moments clés..."
                    value={newVideoDescription}
                    onChange={(e) => setNewVideoDescription(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setVideoUploadModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF0000] text-white font-semibold rounded-xl hover:bg-[#d90000] cursor-pointer"
                  >
                    Publier sur ALGB TV
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
