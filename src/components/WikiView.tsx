import React, { useState } from 'react';
import { 
  EyeOff, Eye, Plus, X, Tag, ShieldAlert, Trash2, 
  MapPin, Users, User, Compass, BookOpen, FileText,
  Type, Image as ImageIcon, Sparkles, Calendar, GitFork
} from 'lucide-react';
import { WikiPage, WikiCategory, WikiBlock, BlockType } from '../types';
import BlockRenderer from './BlockRenderer';

interface WikiViewProps {
  page: WikiPage;
  allPages: WikiPage[];
  isGmMode: boolean;
  onNavigate: (id: string) => void;
  onUpdatePageProperties: (id: string, updates: Partial<WikiPage>) => void;
  onDeletePage: (id: string) => void;
  onAddBlock: (pageId: string, type: BlockType) => void;
  onUpdateBlock: (pageId: string, blockId: string, content: string, title?: string, isSecret?: boolean) => void;
  onDeleteBlock: (pageId: string, blockId: string) => void;
  onMoveBlock: (pageId: string, blockId: string, direction: 'up' | 'down') => void;
  onCreatePageFromSelection?: (title: string, category: WikiCategory) => WikiPage;
}

const CATEGORIES: { value: WikiCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'lieu', label: 'Lieu', icon: <MapPin className="w-3.5 h-3.5" /> },
  { value: 'faction', label: 'Faction', icon: <Users className="w-3.5 h-3.5" /> },
  { value: 'personnage', label: 'Personnage', icon: <User className="w-3.5 h-3.5" /> },
  { value: 'intrigue', label: 'Intrigue', icon: <Compass className="w-3.5 h-3.5" /> },
  { value: 'regle', label: 'Règle', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { value: 'autre', label: 'Autre', icon: <FileText className="w-3.5 h-3.5" /> },
];

export default function WikiView({
  page,
  allPages,
  isGmMode,
  onNavigate,
  onUpdatePageProperties,
  onDeletePage,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onCreatePageFromSelection,
}: WikiViewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(page.title);
  const [isAddingAlias, setIsAddingAlias] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [bannerInput, setBannerInput] = useState(page.bannerImage || '');

  // Reset inputs when page changes
  React.useEffect(() => {
    setTitleInput(page.title);
    setBannerInput(page.bannerImage || '');
    setIsEditingTitle(false);
    setIsAddingAlias(false);
    setIsEditingBanner(false);
  }, [page]);

  const handleSaveTitle = () => {
    if (titleInput.trim() && titleInput.trim() !== page.title) {
      onUpdatePageProperties(page.id, { title: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = aliasInput.trim().toLowerCase();
    if (clean && !page.aliases.includes(clean)) {
      onUpdatePageProperties(page.id, {
        aliases: [...page.aliases, clean]
      });
      setAliasInput('');
      setIsAddingAlias(false);
    }
  };

  const handleRemoveAlias = (aliasToRemove: string) => {
    onUpdatePageProperties(page.id, {
      aliases: page.aliases.filter(a => a !== aliasToRemove)
    });
  };

  const handleSaveBanner = () => {
    onUpdatePageProperties(page.id, { bannerImage: bannerInput.trim() || undefined });
    setIsEditingBanner(false);
  };

  const handleDelete = () => {
    if (confirm(`Voulez-vous supprimer définitivement la fiche "${page.title}" ?`)) {
      onDeletePage(page.id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 select-text flex justify-center">
      <div className="w-full max-w-3xl glass-card p-6 md:p-8 flex flex-col gap-6 relative" style={{height: 'fit-content', minHeight: 'auto'}}>
        
        {/* En-tête de l'article (Titre, Propriétés, Banner) */}
        <div className="grid grid-cols-4 gap-4 pb-6 border-b border-slate-900/60">
          
          {/* Titre et Propriétés (Gauche) */}
          <div className="col-span-3 flex flex-col gap-3">
            {/* Titre éditable */}
            <div className="flex items-center gap-2">
              {isEditingTitle && isGmMode ? (
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="text-2xl font-bold bg-dark-900 border border-slate-800 text-white px-3 py-1.5 rounded-lg w-full outline-none focus:border-gold-500/50 font-display"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    autoFocus
                  />
                  <button onClick={handleSaveTitle} className="p-2 bg-gold-600 text-dark-950 font-bold rounded-lg hover:bg-gold-500 transition cursor-pointer">
                    <Plus className="w-4 h-4 rotate-45" /> {/* Symbole valider */}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group/title">
                  <h1 
                    onDoubleClick={() => isGmMode && setIsEditingTitle(true)}
                    className="text-3xl font-extrabold tracking-tight text-white font-display"
                  >
                    {page.title}
                  </h1>
                  {isGmMode && (
                    <button 
                      onClick={() => setIsEditingTitle(true)}
                      className="hidden group-title:inline-block p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-350 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 rotate-45" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Catégorie & Sécurité */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Category Dropdown (GM Mode) / Badge (Player Mode) */}
              {isGmMode ? (
                <select
                  value={page.category}
                  onChange={(e) => onUpdatePageProperties(page.id, { category: e.target.value as WikiCategory })}
                  className="px-2.5 py-1 bg-dark-900/60 border border-slate-800 text-slate-300 rounded-md outline-none cursor-pointer hover:border-slate-750 transition"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value} className="bg-dark-950">
                      {cat.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-850 rounded-md text-slate-400 font-medium font-sans">
                  {CATEGORIES.find(c => c.value === page.category)?.icon}
                  {CATEGORIES.find(c => c.value === page.category)?.label}
                </span>
              )}

              {/* Secret article toggle */}
              {isGmMode && (
                <button
                  onClick={() => onUpdatePageProperties(page.id, { isSecret: !page.isSecret })}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition cursor-pointer ${
                    page.isSecret 
                      ? 'bg-purple-950/20 border-purple-900/40 text-purple-400 font-semibold' 
                      : 'bg-dark-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {page.isSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{page.isSecret ? 'Secret (MJ uniquement)' : 'Public pour joueurs'}</span>
                </button>
              )}

              {/* Warning warning badge if secret (Player mode won't see this since the page is filtered) */}
              {page.isSecret && !isGmMode && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/10 border border-purple-900/30 text-purple-400 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                  <span>Document Caché</span>
                </span>
              )}
            </div>

            {/* Aliases Section */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs mt-1 min-h-[25px]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold mr-1">Alias :</span>
              {page.aliases && page.aliases.map((alias, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-850 text-slate-400 text-xs font-sans"
                >
                  {alias}
                  {isGmMode && (
                    <button 
                      onClick={() => handleRemoveAlias(alias)}
                      className="text-slate-650 hover:text-slate-400 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}

              {/* Add Alias Input */}
              {isGmMode && (
                isAddingAlias ? (
                  <form onSubmit={handleAddAlias} className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Nouvel alias..."
                      value={aliasInput}
                      onChange={(e) => setAliasInput(e.target.value)}
                      className="px-1.5 py-0.5 bg-dark-900 border border-slate-800 rounded text-xs text-slate-200 outline-none w-28"
                      autoFocus
                      onBlur={() => setIsAddingAlias(false)}
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingAlias(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-500 font-semibold transition cursor-pointer px-1 py-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Banner / Armoirie / Crest (Droite) */}
          <div className="flex flex-col items-center justify-center">
            {isEditingBanner && isGmMode ? (
              <div className="w-28 space-y-1.5">
                <input
                  type="text"
                  placeholder="URL Blason..."
                  value={bannerInput}
                  onChange={(e) => setBannerInput(e.target.value)}
                  className="w-full px-2 py-1 bg-dark-900 border border-slate-800 text-[10px] text-slate-200 rounded outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveBanner()}
                />
                <div className="flex justify-between gap-1 text-[9px]">
                  <button onClick={() => setIsEditingBanner(false)} className="text-slate-500 hover:text-white cursor-pointer">Annuler</button>
                  <button onClick={handleSaveBanner} className="text-gold-500 hover:text-gold-400 font-bold cursor-pointer">Valider</button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => isGmMode && setIsEditingBanner(true)}
                className={`w-24 h-24 rounded-lg overflow-hidden border border-slate-850/60 bg-slate-950/40 flex items-center justify-center relative group/crest ${isGmMode ? 'cursor-pointer hover:border-gold-500/30' : ''}`}
              >
                {page.bannerImage ? (
                  <img src={page.bannerImage} alt="Blason" className="w-full h-full object-cover opacity-75 group-hover/crest:opacity-90 transition" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-650 group-hover/crest:text-slate-450 transition text-center p-2">
                    <Sparkles className="w-5 h-5 text-slate-700" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold">Aucun blason</span>
                  </div>
                )}
                {isGmMode && (
                  <div className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover/crest:flex text-[9px] font-bold text-gold-400">
                    Modifier
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Corps de l'article (Rendu ordonné des blocs) */}
        <div className="flex-grow space-y-4">
          {page.blocks && page.blocks.map(block => (
            <BlockRenderer
              key={block.id}
              block={block}
              allPages={allPages}
              isGmMode={isGmMode}
              onUpdate={(content, title, isSecret) => onUpdateBlock(page.id, block.id, content, title, isSecret)}
              onDelete={() => onDeleteBlock(page.id, block.id)}
              onMoveUp={() => onMoveBlock(page.id, block.id, 'up')}
              onMoveDown={() => onMoveBlock(page.id, block.id, 'down')}
              onNavigate={onNavigate}
              onCreatePageFromSelection={onCreatePageFromSelection}
            />
          ))}
          {(!page.blocks || page.blocks.length === 0) && (
            <p className="text-xs text-slate-650 italic text-center py-6">
              Aucun bloc. Utilisez la barre d'outils ci-dessous pour ajouter du contenu.
            </p>
          )}
        </div>

        {/* Barre d'outils inférieure pour ajouter des blocs (Visible uniquement en mode MJ) */}
        {isGmMode && (
          <div className="border-t border-slate-900/60 pt-6 mt-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-3">
              Ajouter un bloc :
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onAddBlock(page.id, 'text')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 border border-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md text-xs font-semibold shadow transition cursor-pointer"
              >
                <Type className="w-3.5 h-3.5 text-slate-400" />
                + Texte
              </button>
              <button
                onClick={() => onAddBlock(page.id, 'image')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 border border-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md text-xs font-semibold shadow transition cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                + Image
              </button>
              <button
                onClick={() => onAddBlock(page.id, 'character')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 border border-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md text-xs font-semibold shadow transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                + Fiche de personnage
              </button>
              <button
                onClick={() => onAddBlock(page.id, 'timeline')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 border border-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md text-xs font-semibold shadow transition cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                + Chronologie
              </button>
              <button
                onClick={() => onAddBlock(page.id, 'familytree')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 border border-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md text-xs font-semibold shadow transition cursor-pointer"
              >
                <GitFork className="w-3.5 h-3.5 text-slate-400 rotate-90" />
                + Généalogie
              </button>


              <button
                onClick={handleDelete}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 border border-red-900/30 hover:border-red-900 hover:bg-red-950/50 text-red-400 rounded-md text-xs font-semibold transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer la fiche
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
