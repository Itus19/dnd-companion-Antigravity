"use client";

import React, { useState, useEffect } from 'react';
import { useWiki } from '../hooks/useWiki';
import Sidebar from '../components/Sidebar';
import WikiView from '../components/WikiView';
import { 
  Sparkles, Eye, EyeOff, Shield, ShieldAlert, Clock,
  FileText, MapPin, User, Users, Compass, BookOpen, Calendar, HelpCircle
} from 'lucide-react';
import { WikiPage, WikiCategory, WikiBlock, BlockType } from '../types';

export default function Home() {
  const { 
    pages, isLoaded, addPage, updatePage, deletePage,
    addBlock, updateBlock, deleteBlock, moveBlock, createPageFromSelection
  } = useWiki();

  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isGmMode, setIsGmMode] = useState<boolean>(true); // Mode MJ par défaut
  const [currentTime, setCurrentTime] = useState<string>('');

  // Gérer l'horloge en haut à droite (VVD style)
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sélectionner la page "Eldoria" par défaut si dispo
  useEffect(() => {
    if (isLoaded && pages.length > 0 && activePageId === null) {
      const eldoria = pages.find(p => p.title === 'Eldoria');
      if (eldoria) {
        setActivePageId(eldoria.id);
      } else {
        setActivePageId(pages[0].id);
      }
    }
  }, [isLoaded, pages, activePageId]);

  const activePage = pages.find(p => p.id === activePageId) || null;

  const handleSelectPage = (id: string) => {
    setActivePageId(id);
  };

  // Création rapide depuis le dashboard ou la sidebar
  const handleCreateNewPage = (customTitle?: string, customCategory?: WikiCategory) => {
    const title = customTitle || prompt("Titre du nouveau document :");
    if (!title || !title.trim()) return;

    const newPage = addPage({
      title: title.trim(),
      category: customCategory || 'autre',
      aliases: [],
      tags: [],
      isSecret: false,
    });
    setActivePageId(newPage.id);
  };

  const handleUpdatePageProperties = (id: string, updates: Partial<WikiPage>) => {
    updatePage(id, updates);
  };

  const handleDeletePage = (id: string) => {
    deletePage(id);
    const remaining = pages.filter(p => p.id !== id);
    if (remaining.length > 0) {
      // Si on est joueur, filtrer aussi les pages secrètes dans la sélection automatique
      const playable = isGmMode ? remaining : remaining.filter(p => !p.isSecret);
      setActivePageId(playable.length > 0 ? playable[0].id : null);
    } else {
      setActivePageId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-dark-950 text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center animate-pulse shadow-lg shadow-gold-500/20">
            <Sparkles className="w-6 h-6 text-dark-950" />
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold font-display text-gold-500/80 animate-pulse">
            Initialisation du Codex...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden relative select-none">
      
      {/* Background flouté immersif */}
      <div className="app-bg" />

      {/* Sidebar VVD-style */}
      <Sidebar
        pages={pages}
        selectedPageId={activePageId}
        onSelectPage={handleSelectPage}
        onCreateNewPage={() => handleCreateNewPage()}
        isGmMode={isGmMode}
      />

      {/* Main Workspace (Conteneur Central) */}
      <div className="flex-1 h-full flex flex-col overflow-hidden relative">
        
        {/* Top Capsule Navigation Menu (VVD.world style) */}
        <header className="h-14 px-6 flex items-center justify-between z-20 pointer-events-auto">
          {/* Section gauche (Bouton d'état) */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${isGmMode ? 'bg-purple-950/40 text-purple-400 border border-purple-900/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'}`}>
              Mode {isGmMode ? 'Maître du Jeu' : 'Joueur'}
            </span>
          </div>

          {/* Capsule centrale */}
          <div className="flex items-center bg-black/45 border border-slate-900/60 rounded-full p-1 text-xs shadow-lg backdrop-blur-md">
            <button 
              onClick={() => setActivePageId(null)}
              className={`px-4 py-1 rounded-full font-medium transition cursor-pointer ${!activePageId ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Tableau de bord
            </button>
            <span className="text-slate-800">|</span>
            <button 
              onClick={() => {
                if (pages.length > 0) {
                  const firstPage = isGmMode ? pages[0] : pages.find(p => !p.isSecret);
                  if (firstPage) setActivePageId(firstPage.id);
                }
              }}
              className={`px-4 py-1 rounded-full font-medium transition cursor-pointer ${activePageId ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Monde & Wiki
            </button>
          </div>

          {/* Section Droite (Mode MJ/Joueur Toggle + Horloge) */}
          <div className="flex items-center gap-4">
            {/* Toggle Mode MJ */}
            <button
              onClick={() => setIsGmMode(!isGmMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                isGmMode 
                  ? 'bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-900/40' 
                  : 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
              }`}
            >
              {isGmMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isGmMode ? "Mode Joueur" : "Mode MJ"}</span>
            </button>

            {/* Live Clock */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-black/35 px-3 py-1.5 rounded-full border border-slate-900/40 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentTime}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col z-10">
          {activePage && (isGmMode || !activePage.isSecret) ? (
            <WikiView
              page={activePage}
              allPages={pages}
              isGmMode={isGmMode}
              onNavigate={handleSelectPage}
              onUpdatePageProperties={handleUpdatePageProperties}
              onDeletePage={handleDeletePage}
              onAddBlock={addBlock}
              onUpdateBlock={(pageId, blockId, content, title, isSecret) => updateBlock(pageId, blockId, { content, title, isSecret })}
              onDeleteBlock={deleteBlock}
              onMoveBlock={moveBlock}
              onCreatePageFromSelection={(title, category) => {
                const newPage = createPageFromSelection(title, category);
                return newPage;
              }}
            />
          ) : (
            /* Dashboard: "Commencer avec..." (VVD.world style) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
              <div className="max-w-xl flex flex-col items-center gap-8">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-500">Commencer avec</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-display text-white mt-1">
                    Créer du Lore
                  </h2>
                </div>

                {/* Grid Buttons VVD.world Dashboard */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                  <button 
                    onClick={() => handleCreateNewPage("Nouveau Personnage", "personnage")}
                    className="glass-panel p-5 rounded-xl flex flex-col items-center gap-3 border-slate-800 hover:border-amber-500/30 hover:bg-white/5 transition duration-300 group cursor-pointer"
                  >
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition duration-300">
                      <User className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 font-display">Fiche PNJ</span>
                  </button>

                  <button 
                    onClick={() => handleCreateNewPage("Nouveau Lieu", "lieu")}
                    className="glass-panel p-5 rounded-xl flex flex-col items-center gap-3 border-slate-800 hover:border-emerald-500/30 hover:bg-white/5 transition duration-300 group cursor-pointer"
                  >
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition duration-300">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 font-display">Carte & Lieu</span>
                  </button>

                  <button 
                    onClick={() => handleCreateNewPage("Nouvelle Faction", "faction")}
                    className="glass-panel p-5 rounded-xl flex flex-col items-center gap-3 border-slate-800 hover:border-cyan-500/30 hover:bg-white/5 transition duration-300 group cursor-pointer"
                  >
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 transition duration-300">
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 font-display">Factions</span>
                  </button>

                  <button 
                    onClick={() => handleCreateNewPage("Nouvelle Intrigue", "intrigue")}
                    className="glass-panel p-5 rounded-xl flex flex-col items-center gap-3 border-slate-800 hover:border-purple-500/30 hover:bg-white/5 transition duration-300 group cursor-pointer"
                  >
                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 transition duration-300">
                      <Compass className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 font-display">Graphe Intrigue</span>
                  </button>

                  <button 
                    onClick={() => handleCreateNewPage("Nouvelle Règle", "regle")}
                    className="glass-panel p-5 rounded-xl flex flex-col items-center gap-3 border-slate-800 hover:border-red-500/30 hover:bg-white/5 transition duration-300 group cursor-pointer"
                  >
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 group-hover:scale-110 transition duration-300">
                      <BookOpen className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 font-display">Règles D&D</span>
                  </button>

                  <button 
                    onClick={() => handleCreateNewPage("Nouvel Article", "autre")}
                    className="glass-panel p-5 rounded-xl flex flex-col items-center gap-3 border-slate-800 hover:border-slate-500/30 hover:bg-white/5 transition duration-300 group cursor-pointer"
                  >
                    <div className="p-2.5 rounded-lg bg-slate-500/10 border border-slate-500/20 group-hover:scale-110 transition duration-300">
                      <Calendar className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 font-display">Chronologie</span>
                  </button>
                </div>

                <div className="text-slate-600 text-xs flex items-center justify-center gap-1.5 mt-2 bg-black/25 px-4 py-2 rounded-full border border-slate-900/40">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>En Mode Joueur, seuls les articles publics et non-masqués seront visibles.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
