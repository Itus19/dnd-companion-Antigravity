import React, { useState } from 'react';
import { 
  Search, Plus, MapPin, Users, User, Compass, BookOpen, 
  FileText, ChevronDown, ChevronRight, EyeOff, Folder, Shield,
  Book, Map, Calendar, Settings, HelpCircle
} from 'lucide-react';
import { WikiPage, WikiCategory } from '../types';

interface SidebarProps {
  pages: WikiPage[];
  selectedPageId: string | null;
  onSelectPage: (id: string) => void;
  onCreateNewPage: () => void;
  isGmMode: boolean;
}

const CATEGORY_LABELS: Record<WikiCategory, { label: string; icon: React.ReactNode; color: string }> = {
  lieu: { label: 'Pays & Lieux', icon: <MapPin className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
  faction: { label: 'Factions & Cités', icon: <Users className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  personnage: { label: 'Personnages (PNJ/PJ)', icon: <User className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  intrigue: { label: 'Intrigues & Quêtes', icon: <Compass className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  regle: { label: 'Règles du Jeu', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'text-red-400' },
  autre: { label: 'Autres Codex', icon: <FileText className="w-3.5 h-3.5" />, color: 'text-slate-400' },
};

export default function Sidebar({ pages, selectedPageId, onSelectPage, onCreateNewPage, isGmMode }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<WikiCategory, boolean>>({
    lieu: false,
    faction: false,
    personnage: false,
    intrigue: false,
    regle: false,
    autre: false,
  });

  const toggleCategory = (cat: WikiCategory) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filtrer les pages selon la recherche et l'état MJ
  const filteredPages = pages.filter(page => {
    // Si on est en mode joueur, masquer les pages secrètes
    if (!isGmMode && page.isSecret) return false;

    return (
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (page.aliases && page.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  // Regrouper les pages filtrées par catégorie
  const pagesByCategory = filteredPages.reduce<Record<WikiCategory, WikiPage[]>>((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, { lieu: [], faction: [], personnage: [], intrigue: [], regle: [], autre: [] });

  return (
    <aside className="w-72 h-screen bg-black/40 backdrop-blur-xl flex flex-col border-r border-slate-900/50 select-none">
      
      {/* Title / Campaign Title */}
      <div className="p-4 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Shield className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-xs font-semibold text-slate-300 font-display tracking-wide uppercase truncate max-w-[180px]">
            Chroniques oubliées
          </span>
        </div>
      </div>

      {/* Search Input - Ultra minimal */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900/35 border border-slate-900 focus:border-slate-800 text-slate-300 placeholder-slate-650 rounded-md text-xs transition outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Categories / Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2.5">
        {(Object.keys(CATEGORY_LABELS) as WikiCategory[]).map(cat => {
          const categoryPages = pagesByCategory[cat];
          const hasPages = categoryPages.length > 0;
          const isCollapsed = collapsedCategories[cat];
          const info = CATEGORY_LABELS[cat];

          if (!hasPages && searchQuery !== '') return null;

          return (
            <div key={cat} className="space-y-0.5">
              {/* Category Header (Folder style) */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between text-xs font-medium text-slate-400 hover:text-slate-200 py-1.5 px-2 rounded-md hover:bg-white/3 transition duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? <ChevronRight className="w-3 h-3 text-slate-600" /> : <ChevronDown className="w-3 h-3 text-slate-600" />}
                  <Folder className="w-3.5 h-3.5 text-slate-500 fill-slate-500/10" />
                  <span className="font-sans font-medium">{info.label}</span>
                </div>
              </button>

              {/* Nested Children (Pages) */}
              {!isCollapsed && (
                <div className="pl-4 space-y-0.5">
                  {hasPages ? (
                    categoryPages.map(page => {
                      const isActive = selectedPageId === page.id;
                      return (
                        <button
                          key={page.id}
                          onClick={() => onSelectPage(page.id)}
                          className={`w-full text-left py-1.5 px-3.5 rounded-md text-[13px] transition duration-150 cursor-pointer flex items-center justify-between group ${
                            isActive
                              ? 'bg-white/5 text-amber-400 font-medium'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/2'
                          }`}
                        >
                          <span className="truncate pr-2">{page.title}</span>
                          
                          <div className="flex items-center gap-1">
                            {page.isSecret && (
                              <EyeOff className="w-3 h-3 text-purple-400 opacity-60" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-[11px] text-slate-600 italic block py-1 px-3.5">
                      Vide
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Document button inside tree (Minimal) */}
        {isGmMode && (
          <div className="pt-2 px-2">
            <button
              onClick={onCreateNewPage}
              className="flex items-center gap-1.5 text-slate-500 hover:text-amber-500 text-xs font-semibold py-1.5 px-2 rounded-md hover:bg-white/2 w-full text-left transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nouveau document
            </button>
          </div>
        )}
      </div>

      {/* Bottom Sleek Icon Bar (VVD.world style) */}
      <div className="p-3 border-t border-slate-900/40 flex items-center justify-around text-slate-500 bg-black/10">
        <button title="Codex" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><Book className="w-4 h-4" /></button>
        <button title="Carte interactive" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><Map className="w-4 h-4" /></button>
        <button title="Chronologie" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><Calendar className="w-4 h-4" /></button>
        <button title="Configuration" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><Settings className="w-4 h-4" /></button>
        <button title="Aide" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><HelpCircle className="w-4 h-4" /></button>
      </div>

    </aside>
  );
}
