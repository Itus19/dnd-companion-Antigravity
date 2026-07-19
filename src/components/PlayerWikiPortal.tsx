'use client';
import React, { useState, useEffect } from 'react';
import { Search, Eye, BookOpen, Compass, MapPin, User, Users, Sparkles, Layout, Settings2 } from 'lucide-react';
import { WikiPage, CustomCategory } from '../types';
import RelationsPanel from './RelationsPanel';

interface PlayerWikiPortalProps {
  pages: WikiPage[];
  customCategories: CustomCategory[];
  isGmMode: boolean;
  onNavigateToArticle: (pageId: string) => void;
}

const CAT_COLORS: Record<string, string> = {
  lieu:       'hsl(150, 60%, 45%)',
  personnage: 'hsl(40, 90%, 60%)',
  faction:    'hsl(200, 70%, 55%)',
  intrigue:   'hsl(280, 60%, 60%)',
  regle:      'hsl(0, 65%, 60%)',
  autre:      'hsl(220, 20%, 55%)',
};

const CAT_ICONS: Record<string, React.ReactNode> = {
  lieu: <MapPin className="w-4 h-4 text-emerald-400" />,
  personnage: <User className="w-4 h-4 text-amber-400" />,
  faction: <Users className="w-4 h-4 text-cyan-400" />,
  intrigue: <Compass className="w-4 h-4 text-purple-400" />,
  regle: <BookOpen className="w-4 h-4 text-red-400" />,
  autre: <BookOpen className="w-4 h-4 text-slate-400" />,
};

export default function PlayerWikiPortal({
  pages, customCategories, isGmMode
}: PlayerWikiPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  
  // Custom Welcome Settings (stored in localStorage)
  const [welcomeTitle, setWelcomeTitle] = useState("Les Chroniques Oubliées");
  const [welcomeText, setWelcomeText] = useState("Explorez l'encyclopédie publique du Royaume d'Eldoria. Rumeurs, géographie, secrets et légendes connus des aventuriers.");
  const [welcomeBanner, setWelcomeBanner] = useState("https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80");
  const [showConfig, setShowConfig] = useState(false);

  // Load welcome config
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('dnd_wiki_welcome_title');
      const tx = localStorage.getItem('dnd_wiki_welcome_text');
      const b = localStorage.getItem('dnd_wiki_welcome_banner');
      if (t) setWelcomeTitle(t);
      if (tx) setWelcomeText(tx);
      if (b) setWelcomeBanner(b);
    }
  }, []);

  const saveWelcome = (key: string, val: string, setter: (v: string) => void) => {
    setter(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, val);
    }
  };

  // Only display public pages (isSecret === false)
  const publicPages = pages.filter(p => !p.isSecret);

  const filtered = publicPages.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || (p.aliases || []).some(a => a.includes(q)) || p.tags.some(t => t.toLowerCase().includes(q));
  });

  const activeArticle = pages.find(p => p.id === activeArticleId);

  // Categories helper
  const getCatLabel = (cat: string) => {
    if (cat === 'lieu') return 'Lieu';
    if (cat === 'personnage') return 'Personnage';
    if (cat === 'faction') return 'Faction';
    if (cat === 'intrigue') return 'Intrigue';
    if (cat === 'regle') return 'Règles';
    if (cat === 'autre') return 'Autre';
    const c = customCategories.find(cc => cc.id === cat);
    return c ? c.label : 'Codex';
  };

  const getCatColor = (cat: string) => {
    if (CAT_COLORS[cat]) return CAT_COLORS[cat];
    const c = customCategories.find(cc => cc.id === cat);
    return c ? c.color : 'hsl(220, 20%, 50%)';
  };

  const getCatIcon = (cat: string) => {
    if (CAT_ICONS[cat]) return CAT_ICONS[cat];
    return <Sparkles className="w-4 h-4" style={{ color: getCatColor(cat) }} />;
  };

  return (
    <div className="flex-1 h-full flex overflow-hidden bg-[#07080c]/60 select-text">
      
      {/* Main screen area */}
      <div className="flex-1 flex flex-col overflow-y-auto px-6 py-6 space-y-6">
        
        {/* Welcome Header */}
        {!activeArticle && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-900 shadow-xl bg-black/40">
            <div className="absolute inset-0 z-0">
              <img src={welcomeBanner} alt="Welcome banner" className="w-full h-full object-cover opacity-25 filter blur-[1px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/80 to-transparent" />
            </div>
            
            <div className="relative z-10 p-8 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-500">Portail des Joueurs</span>
              <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">{welcomeTitle}</h1>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">{welcomeText}</p>
            </div>
          </div>
        )}

        {/* Content View */}
        {activeArticle ? (
          /* Reader Mode */
          <div className="max-w-3xl mx-auto w-full bg-black/30 border border-slate-900 rounded-2xl p-6 md:p-8 space-y-6">
            <button
              onClick={() => setActiveArticleId(null)}
              className="text-xs text-slate-500 hover:text-slate-300 font-semibold flex items-center gap-1.5 cursor-pointer pb-2 border-b border-slate-900"
            >
              ← Retour au portail public
            </button>

            {/* Title & Banner */}
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: getCatColor(activeArticle.category) }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{getCatLabel(activeArticle.category)}</span>
                </div>
                <h1 className="text-2xl font-black text-white font-display leading-tight">{activeArticle.title}</h1>
              </div>
              {activeArticle.bannerImage && (
                <img src={activeArticle.bannerImage} alt="Blason" className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
              )}
            </div>

            {/* Relations */}
            {activeArticle.relations && activeArticle.relations.length > 0 && (
              <div className="py-2.5 border-y border-slate-900/60 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Relations :</span>
                {activeArticle.relations.map(rel => {
                  const target = pages.find(p => p.id === rel.targetPageId);
                  if (!target || target.isSecret) return null;
                  return (
                    <button
                      key={rel.id}
                      onClick={() => setActiveArticleId(target.id)}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-850 hover:border-gold-500/30 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <span className="w-1 h-1 rounded-full" style={{ background: getCatColor(target.category) }} />
                      <span className="font-semibold text-slate-500">{rel.type}:</span> {target.title}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Blocks renderer (Read only) */}
            <div className="space-y-4 prose text-slate-350 leading-relaxed text-xs">
              {activeArticle.blocks.map(block => {
                if (block.isSecret) return null; // do not show secrets
                
                if (block.type === 'text') {
                  // Render highlight rules dynamically
                  return (
                    <div
                      key={block.id}
                      className="rich-text-editor player-mode-view"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        const pageId = target.getAttribute('data-wiki-ref');
                        if (pageId) {
                          const linked = pages.find(p => p.id === pageId);
                          if (linked && !linked.isSecret) setActiveArticleId(linked.id);
                        }
                      }}
                    />
                  );
                }
                
                if (block.type === 'image' && block.content) {
                  return (
                    <img key={block.id} src={block.content} alt={block.title || "Image"} className="w-full max-h-96 object-cover rounded-xl border border-slate-900" />
                  );
                }

                // fallback
                return null;
              })}
            </div>
          </div>
        ) : (
          /* Portal Homepage */
          <div className="space-y-6">
            
            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un document public..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-900/35 border border-slate-900 focus:border-slate-800 text-slate-300 placeholder-slate-650 rounded-xl text-xs transition outline-none"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Category Filter Blocks */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map(page => (
                <div
                  key={page.id}
                  onClick={() => setActiveArticleId(page.id)}
                  className="p-4 bg-dark-900/40 border border-slate-900 hover:border-slate-800 rounded-2xl cursor-pointer hover:bg-white/[0.015] transition flex flex-col gap-2 min-h-[100px]"
                >
                  <div className="flex items-center gap-1.5">
                    {getCatIcon(page.category)}
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">{getCatLabel(page.category)}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 mt-1 truncate">{page.title}</h3>
                  <div className="text-[10px] text-slate-600 mt-auto flex items-center gap-1">
                    <span>Voir l'article</span>
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-xs text-slate-700 italic py-8 text-center">Aucun document public disponible.</div>
            )}

          </div>
        )}

      </div>

      {/* GM layout configurator (Right side sidebar) */}
      {isGmMode && (
        <div className="w-80 border-l border-slate-900 bg-black/45 backdrop-blur-xl p-6 flex flex-col gap-6 shrink-0">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
            <Layout className="w-4 h-4 text-gold-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Mise en Page Joueur</h3>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Titre du portail</label>
              <input
                value={welcomeTitle}
                onChange={e => saveWelcome('dnd_wiki_welcome_title', e.target.value, setWelcomeTitle)}
                className="w-full bg-dark-950 border border-slate-900 text-slate-300 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Image de bannière d'accueil</label>
              <input
                value={welcomeBanner}
                onChange={e => saveWelcome('dnd_wiki_welcome_banner', e.target.value, setWelcomeBanner)}
                placeholder="https://..."
                className="w-full bg-dark-950 border border-slate-900 text-slate-300 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Texte de bienvenue</label>
              <textarea
                value={welcomeText}
                onChange={e => saveWelcome('dnd_wiki_welcome_text', e.target.value, setWelcomeText)}
                rows={4}
                className="w-full bg-dark-950 border border-slate-900 text-slate-350 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-gold-500/50 resize-none leading-relaxed"
              />
            </div>

            <div className="p-3 bg-purple-950/20 border border-purple-900/30 rounded-xl space-y-1 text-[10px] leading-relaxed text-purple-400">
              <div className="font-bold uppercase tracking-wider flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5" /> Aide MJ
              </div>
              <p>Ce volet n'est visible que pour vous (MJ). Les joueurs arrivant sur l'application verront directement le portail ci-contre en lecture seule avec vos modifications.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
