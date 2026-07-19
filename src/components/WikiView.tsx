import React, { useState } from 'react';
import { 
  EyeOff, Eye, Plus, X, Tag, ShieldAlert, Trash2, 
  MapPin, Users, User, Compass, BookOpen, FileText,
  Type, Image as ImageIcon, Sparkles, Calendar, GitFork, RotateCcw, Clock, Sword, Shield, Settings
} from 'lucide-react';
import { WikiPage, WikiCategory, WikiBlock, BlockType } from '../types';
import BlockRenderer from './BlockRenderer';
import RelationsPanel from './RelationsPanel';

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
  onAddRelation: (type: string, targetPageId: string) => void;
  onRemoveRelation: (relationId: string) => void;
  showHistory?: boolean;
  onCloseHistory?: () => void;
  getPageHistory?: (id: string) => any[];
  onRollbackPage?: (id: string, version: any) => void;
}

const WIKI_CATEGORIES = [
  { value: 'lieu', label: 'Lieu', icon: <MapPin className="w-3.5 h-3.5" /> },
  { value: 'faction', label: 'Faction', icon: <Users className="w-3.5 h-3.5" /> },
  { value: 'personnage', label: 'Personnage', icon: <User className="w-3.5 h-3.5" /> },
  { value: 'intrigue', label: 'Intrigue', icon: <Compass className="w-3.5 h-3.5" /> },
  { value: 'autre', label: 'Autre', icon: <FileText className="w-3.5 h-3.5" /> },
];

const RULES_CATEGORIES = [
  { value: 'regle', label: 'Règle', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { value: 'arme', label: 'Arme', icon: <Sword className="w-3.5 h-3.5" /> },
];

const CATEGORIES = [...WIKI_CATEGORIES, ...RULES_CATEGORIES];

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
  onAddRelation,
  onRemoveRelation,
  showHistory = false,
  onCloseHistory,
  getPageHistory,
  onRollbackPage,
}: WikiViewProps) {
  const [titleInput, setTitleInput] = useState(page.title);
  const [isAddingAlias, setIsAddingAlias] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [bannerInput, setBannerInput] = useState(page.bannerImage || '');

  React.useEffect(() => {
    setTitleInput(page.title);
    setBannerInput(page.bannerImage || '');
    setIsAddingAlias(false);
    setIsEditingBanner(false);
  }, [page.id]); // reset only when page changes, not every render

  const handleSaveTitle = () => {
    if (titleInput.trim() && titleInput.trim() !== page.title) {
      onUpdatePageProperties(page.id, { title: titleInput.trim() });
    }
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
    <div className="px-6 py-5 flex flex-col gap-5 select-text min-h-full">
        
        {/* En-tête de l'article (Titre, Propriétés, Banner) */}
        <div className="grid grid-cols-4 gap-4 pb-6 border-b border-slate-900/60">
          
          {/* Titre et Propriétés (Gauche) */}
          <div className="col-span-3 flex flex-col gap-3">
          {/* Title — always editable input */}
          <div className="flex items-center gap-2">
            <input
              className="block-title-0"
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              onBlur={handleSaveTitle}
              readOnly={!isGmMode}
              placeholder="Titre de l'article"
            />
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
                  {(page.category === 'regle' || page.category === 'arme') ? (
                    RULES_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value} className="bg-dark-950">
                        {cat.label}
                      </option>
                    ))
                  ) : (
                    WIKI_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value} className="bg-dark-950">
                        {cat.label}
                      </option>
                    ))
                  )}
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

            {/* Relations Panel (moved inside header text column to reduce space from Alias) */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-900/30">
              <RelationsPanel
                page={page}
                allPages={allPages}
                isGmMode={isGmMode}
                onAddRelation={onAddRelation}
                onRemoveRelation={onRemoveRelation}
                onNavigate={onNavigate}
              />
            </div>
          </div>

          {/* Banner / Armoirie / Crest (Droite, vvd.world portrait layout) */}
          <div className="flex flex-col items-center justify-center shrink-0">
            {isEditingBanner && isGmMode ? (
              <div className="w-32 space-y-2">
                <input
                  type="text"
                  placeholder="URL Image / Blason..."
                  value={bannerInput}
                  onChange={(e) => setBannerInput(e.target.value)}
                  className="w-full px-2 py-1.5 bg-dark-900 border border-slate-800 text-[10px] text-slate-200 rounded-lg outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveBanner()}
                />
                <div className="flex justify-between gap-1 text-[9px] px-1">
                  <button onClick={() => setIsEditingBanner(false)} className="text-slate-500 hover:text-white cursor-pointer">Annuler</button>
                  <button onClick={handleSaveBanner} className="text-gold-500 hover:text-gold-400 font-bold cursor-pointer">Valider</button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => isGmMode && setIsEditingBanner(true)}
                className={`w-36 h-48 rounded-2xl overflow-hidden border border-slate-850/60 bg-slate-950/40 flex items-center justify-center relative group/crest shadow-xl ${isGmMode ? 'cursor-pointer hover:border-gold-500/30' : ''}`}
              >
                {page.bannerImage ? (
                  <img src={page.bannerImage} alt="Blason" className="w-full h-full object-cover opacity-80 group-hover/crest:opacity-90 transition" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-650 group-hover/crest:text-slate-450 transition text-center p-3">
                    <Sparkles className="w-5 h-5 text-slate-700" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold">Blason portrait</span>
                  </div>
                )}
                {isGmMode && (
                  <div className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover/crest:flex text-[10px] font-bold text-gold-400">
                    Modifier
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Corps de l'article (Rendu ordonné des blocs avec marge mt-8) */}
        <div className="flex-grow space-y-4 mt-8">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
              >
                <Type className="w-3.5 h-3.5 text-slate-400" />
                + Texte
              </button>
              <button
                onClick={() => onAddBlock(page.id, 'image')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                + Image
              </button>
              {['regle', 'arme', 'classe', 'sous-classe', 'sort', 'composant'].includes(page.category) ? (
                <>
                  <button
                    onClick={() => onAddBlock(page.id, 'weapon')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
                  >
                    <Sword className="w-3.5 h-3.5 text-slate-400" />
                    + Statistiques d'arme
                  </button>
                  <button
                    onClick={() => onAddBlock(page.id, 'spell')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    + Bloc de sort
                  </button>
                  <button
                    onClick={() => onAddBlock(page.id, 'class')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    + Bloc de classe
                  </button>
                  {page.category === 'regle' && (
                    <button
                      onClick={() => onAddBlock(page.id, 'general_rule')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      + Paramètres Système
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => onAddBlock(page.id, 'character')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    + Fiche de personnage
                  </button>
                  <button
                    onClick={() => onAddBlock(page.id, 'timeline')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    + Chronologie
                  </button>
                  <button
                    onClick={() => onAddBlock(page.id, 'familytree')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md text-xs font-semibold shadow transition cursor-pointer"
                  >
                    <GitFork className="w-3.5 h-3.5 text-slate-400 rotate-90" />
                    + Généalogie
                  </button>
                </>
              )}


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

      {/* Revision History Sliding Drawer Overlay */}
      {showHistory && getPageHistory && onRollbackPage && (
        <div className="absolute inset-y-0 right-0 w-80 bg-[#0e1118]/98 backdrop-blur-md border-l border-slate-900 shadow-2xl p-5 z-40 flex flex-col gap-4 animate-in slide-in-from-right duration-250 select-none">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-gold-500" />
              <span>Historique des révisions</span>
            </div>
            <button onClick={onCloseHistory} className="p-1 hover:bg-slate-905 text-slate-500 hover:text-slate-300 rounded cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-2 pr-1">
            {getPageHistory(page.id).length === 0 ? (
              <div className="text-xs text-slate-600 italic py-8 text-center">Aucune modification enregistrée pour le moment.</div>
            ) : (
              getPageHistory(page.id).map((version: any, idx: number) => {
                const date = new Date(version.timestamp);
                const formatTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                const formatDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
                return (
                  <div key={idx} className="p-3 bg-dark-900/60 border border-slate-900 rounded-xl flex flex-col gap-2 hover:border-slate-850 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">{formatDate} · {formatTime}</span>
                      <span className="text-[9px] text-gold-500 font-bold uppercase px-1.5 py-0.5 rounded bg-gold-500/5">v{getPageHistory(page.id).length - idx}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-350 truncate">« {version.title} »</div>
                    <div className="text-[9px] text-slate-500">{version.blocks?.length || 0} bloc(s) de contenu</div>
                    <button
                      onClick={() => {
                        if (confirm("Voulez-vous restaurer cette version de l'article ? Les modifications actuelles seront écrasées.")) {
                          onRollbackPage(page.id, version);
                          if (onCloseHistory) onCloseHistory();
                        }
                      }}
                      className="mt-1 flex items-center justify-center gap-1.5 py-1.5 bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-dark-950 font-bold text-[10px] rounded-lg transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Restaurer
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}

