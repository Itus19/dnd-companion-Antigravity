'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search, Plus, MapPin, Users, User, Compass, BookOpen,
  FileText, ChevronDown, ChevronRight, EyeOff, Folder, FolderOpen,
  Shield, Book, Map, Calendar, Settings, HelpCircle, X, GripVertical, Sparkles, Sword, FlaskConical
} from 'lucide-react';
import { WikiPage, WikiCategory } from '../types';

interface WikiFolder {
  id: string;
  name: string;
  pageIds: string[];
  isOpen: boolean;
}

const FOLDER_STORAGE_KEY = 'dnd_companion_folders_v1';

function loadFolders(): WikiFolder[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FOLDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}
function saveFolders(folders: WikiFolder[]): void {
  if (typeof window !== 'undefined') localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(folders));
}

// Default colors for built-in categories
const CAT_COLOR: Record<string, string> = {
  lieu: '#4ade80',
  personnage: '#fbbf24',
  faction: '#38bdf8',
  intrigue: '#c084fc',
  regle: '#f87171',
  arme: '#f59e0b',
  classe: '#10b981',
  'sous-classe': '#06b6d4',
  sort: '#8b5cf6',
  composant: '#ec4899',
  autre: '#94a3b8',
};

const DEFAULT_DOC_TYPES = [
  { cat: 'personnage', label: 'Personnage', icon: <User className="w-4 h-4" />, color: '#fbbf24', description: 'PNJ, PJ, monstres…' },
  { cat: 'lieu', label: 'Lieu', icon: <MapPin className="w-4 h-4" />, color: '#4ade80', description: 'Villes, régions, cartes…' },
  { cat: 'faction', label: 'Faction', icon: <Users className="w-4 h-4" />, color: '#38bdf8', description: 'Guildes, cultes, cités…' },
  { cat: 'intrigue', label: 'Intrigue', icon: <Compass className="w-4 h-4" />, color: '#c084fc', description: 'Arcs, quêtes, mystères…' },
  { cat: 'regle', label: 'Règle', icon: <BookOpen className="w-4 h-4" />, color: '#f87171', description: 'Généralités, combat…' },
  { cat: 'arme', label: 'Arme', icon: <Sword className="w-4 h-4" />, color: '#f59e0b', description: 'Fiche d\'arme (D&D 2024)…' },
  { cat: 'classe', label: 'Classe', icon: <Shield className="w-4 h-4" />, color: '#10b981', description: 'Guerrier, magicien, roublard…' },
  { cat: 'sous-classe', label: 'Sous-classe', icon: <Book className="w-4 h-4" />, color: '#06b6d4', description: 'Champion, voleur arcanique…' },
  { cat: 'sort', label: 'Sort', icon: <Sparkles className="w-4 h-4" />, color: '#8b5cf6', description: 'Sortilèges et cantrips…' },
  { cat: 'composant', label: 'Composant', icon: <FlaskConical className="w-4 h-4" />, color: '#ec4899', description: 'Composants de sorts…' },
  { cat: 'autre', label: 'Article', icon: <FileText className="w-4 h-4" />, color: '#94a3b8', description: 'Note libre, chronologie…' },
];

interface SidebarProps {
  pages: WikiPage[];
  selectedPageId: string | null;
  onSelectPage: (id: string) => void;
  onCreateNewPage: (category: WikiCategory, title?: string) => void;
  isGmMode: boolean;
  activeTab: 'world' | 'rules';
  customCategories: { id: string; label: string; color: string }[];
  onOpenSettings: () => void;
  onUpdatePageProperties: (id: string, updates: Partial<WikiPage>) => void;
}

export default function Sidebar({
  pages, selectedPageId, onSelectPage, onCreateNewPage, isGmMode,
  activeTab, customCategories, onOpenSettings, onUpdatePageProperties
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<WikiFolder[]>([]);
  const [showNewDocMenu, setShowNewDocMenu] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderNameInput, setFolderNameInput] = useState('');
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [dragOverPageId, setDragOverPageId] = useState<string | null>(null);
  const [dragOverRoot, setDragOverRoot] = useState(false);
  const [expandedPageIds, setExpandedPageIds] = useState<string[]>([]);
  const newDocRef = useRef<HTMLDivElement>(null);

  const togglePageExpand = (pageId: string) => {
    setExpandedPageIds(prev =>
      prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
    );
  };

  const isDescendant = (childId: string, parentId: string): boolean => {
    let current = pages.find(p => p.id === childId);
    while (current && current.parentPageId) {
      if (current.parentPageId === parentId) return true;
      const nextId: string = current.parentPageId;
      current = pages.find(p => p.id === nextId);
    }
    return false;
  };

  const findParentClassId = (subclassPage: WikiPage, classPages: WikiPage[]): string | null => {
    for (const tag of subclassPage.tags) {
      const parent = classPages.find(c => 
        c.title.toLowerCase() === tag.toLowerCase() || 
        c.aliases.some(a => a.toLowerCase() === tag.toLowerCase()) || 
        c.id === `class-${tag.toLowerCase()}`
      );
      if (parent) return parent.id;
    }
    return null;
  };

  const isParentClassPage = (page: WikiPage): boolean => {
    return ['class-barbare', 'class-barde', 'class-guerrier', 'class-magicien', 'class-roublard'].includes(page.id);
  };

  useEffect(() => {
    const stored = loadFolders();
    
    // Auto-initialize default D&D 2024 folders if they are missing
    const defaultFolderSpecs = [
      { id: 'folder-spells', name: '🪄 Sorts', prefixes: ['spell-'] },
      { id: 'folder-classes', name: '⚔️ Classes', prefixes: ['class-'] },
      { id: 'folder-species', name: '🧬 Espèces', prefixes: ['species-'] },
      { id: 'folder-origins', name: '📜 Origines', prefixes: ['origin-'] },
      { id: 'folder-equipment', name: '🎒 Équipement', prefixes: ['weapon-', 'equipment-'] },
      { id: 'folder-states', name: '🌀 États', prefixes: ['cond-'] },
      { id: 'folder-rules', name: '🛡️ Conditions & Combat', prefixes: ['rule-'] },
      { id: 'folder-components', name: '🧪 Composants', prefixes: ['component-'] }
    ];

    let updated = [...stored];
    let changed = false;

    defaultFolderSpecs.forEach(spec => {
      let folder = updated.find(f => f.id === spec.id);
      if (!folder) {
        folder = { id: spec.id, name: spec.name, pageIds: [], isOpen: true };
        updated.push(folder);
        changed = true;
      }
      
      // Auto-assign matching pages of these prefixes that aren't already in the folder
      const matchingPageIds = pages
        .filter(p => spec.prefixes.some(pre => p.id.startsWith(pre)))
        .map(p => p.id);
      
      matchingPageIds.forEach(id => {
        if (!folder!.pageIds.includes(id)) {
          folder!.pageIds.push(id);
          changed = true;
        }
      });
    });

    if (changed) {
      setFolders(updated);
      saveFolders(updated);
    } else {
      setFolders(stored);
    }
  }, [pages]);

  const updateFolders = useCallback((next: WikiFolder[]) => {
    setFolders(next);
    saveFolders(next);
  }, []);

  const getCategoryColor = (cat: string) => {
    if (CAT_COLOR[cat]) return CAT_COLOR[cat];
    const custom = customCategories.find(c => c.id === cat);
    return custom ? custom.color : '#94a3b8';
  };

  // Filter pages: search query, GM mode secret filter, and Active Tab filter
  const visible = pages.filter(p => {
    if (!isGmMode && p.isSecret) return false;
    
    // Tab filter
    const isRuleCategory = ['regle', 'arme', 'classe', 'sous-classe', 'sort', 'composant'].includes(p.category);
    if (activeTab === 'rules') {
      if (!isRuleCategory) return false;
    } else {
      // world tab - hide rules pages
      if (isRuleCategory) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || (p.aliases || []).some(a => a.includes(q));
  });

  const rootPages = activeTab === 'rules'
    ? visible.filter(p => {
        if (p.id.startsWith('subclass-')) {
          const hasParent = visible.some(parent => parent.id.startsWith('class-') && findParentClassId(p, visible) === parent.id);
          return !hasParent;
        }
        if (p.parentPageId && visible.some(parent => parent.id === p.parentPageId)) {
          return false;
        }
        return true;
      })
    : (() => {
        const inFolderPageIds = new Set(folders.flatMap(f => f.pageIds));
        const rootVisible = visible.filter(p => !inFolderPageIds.has(p.id));
        return rootVisible.filter(p => !p.parentPageId || !visible.some(parent => parent.id === p.parentPageId));
      })();

  const addFolder = () => {
    const newF: WikiFolder = { id: `folder-${Date.now()}`, name: 'Nouveau dossier', pageIds: [], isOpen: true };
    updateFolders([...folders, newF]);
    setEditingFolderId(newF.id);
    setFolderNameInput(newF.name);
  };

  const renameFolder = (id: string, name: string) => {
    updateFolders(folders.map(f => f.id === id ? { ...f, name: name.trim() || f.name } : f));
    setEditingFolderId(null);
  };

  const deleteFolder = (id: string) => {
    updateFolders(folders.filter(f => f.id !== id));
  };

  const toggleFolder = (id: string) => {
    updateFolders(folders.map(f => f.id === id ? { ...f, isOpen: !f.isOpen } : f));
  };

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, pageId: string) => {
    setDraggedPageId(pageId);
    e.dataTransfer.setData('text/plain', pageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnFolder = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const pageId = e.dataTransfer.getData('text/plain') || draggedPageId;
    if (!pageId) return;

    // Reset parentPageId when dragging to a folder
    onUpdatePageProperties(pageId, { parentPageId: undefined });

    updateFolders(folders.map(f => {
      if (f.id === folderId) {
        return { ...f, pageIds: f.pageIds.includes(pageId) ? f.pageIds : [...f.pageIds, pageId] };
      }
      return { ...f, pageIds: f.pageIds.filter(id => id !== pageId) };
    }));
    setDraggedPageId(null);
    setDragOverFolderId(null);
  };

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    const pageId = e.dataTransfer.getData('text/plain') || draggedPageId;
    if (!pageId) return;

    // Reset parentPageId when dragging to root
    onUpdatePageProperties(pageId, { parentPageId: undefined });

    updateFolders(folders.map(f => ({ ...f, pageIds: f.pageIds.filter(id => id !== pageId) })));
    setDraggedPageId(null);
    setDragOverRoot(false);
  };

  const handleDropOnPage = (e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();
    const pageId = e.dataTransfer.getData('text/plain') || draggedPageId;
    if (!pageId || pageId === targetPageId) return;

    // Prevent circular parenting
    if (isDescendant(targetPageId, pageId)) return;

    // Set parent relationship
    onUpdatePageProperties(pageId, { parentPageId: targetPageId });

    // Auto expand
    if (!expandedPageIds.includes(targetPageId)) {
      setExpandedPageIds(prev => [...prev, targetPageId]);
    }

    setDraggedPageId(null);
    setDragOverPageId(null);
  };

  // Page item component (recursive tree)
  const PageItem = ({ page, depth = 0 }: { page: WikiPage; depth?: number }) => {
    const isActive = selectedPageId === page.id;
    const isDragOver = dragOverPageId === page.id;

    // Find visible children
    const children = activeTab === 'rules'
      ? [
          ...(page.id.startsWith('class-')
            ? visible.filter(p => p.id.startsWith('subclass-') && findParentClassId(p, visible) === page.id)
            : []),
          ...visible.filter(p => p.parentPageId === page.id && !p.id.startsWith('subclass-'))
        ]
      : visible.filter(p => p.parentPageId === page.id);

    const hasChildren = children.length > 0;
    const isExpanded = expandedPageIds.includes(page.id);

    const handleToggleExpand = (e: React.MouseEvent) => {
      e.stopPropagation();
      togglePageExpand(page.id);
    };

    return (
      <div className="space-y-0.5 w-full">
        <div
          draggable={isGmMode}
          onDragStart={e => handleDragStart(e, page.id)}
          onDragEnd={() => { setDraggedPageId(null); setDragOverFolderId(null); setDragOverPageId(null); setDragOverRoot(false); }}
          onDragOver={e => {
            if (activeTab === 'world' && isGmMode) {
              e.preventDefault();
              e.stopPropagation();
              setDragOverPageId(page.id);
            }
          }}
          onDragLeave={e => {
            if (activeTab === 'world' && isGmMode) {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragOverPageId(null);
              }
            }
          }}
          onDrop={e => {
            if (activeTab === 'world' && isGmMode) {
              e.stopPropagation();
              handleDropOnPage(e, page.id);
            }
          }}
          className={`flex items-center gap-1.5 group/page rounded-md cursor-pointer transition duration-150 py-1.5 pr-2 ${
            isActive ? 'bg-white/5 text-amber-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          } ${draggedPageId === page.id ? 'opacity-40' : ''} ${isDragOver ? 'bg-amber-500/10 border border-amber-500/20' : ''}`}
          style={{ paddingLeft: `${Math.max(8, depth * 12)}px` }}
          onClick={() => onSelectPage(page.id)}
        >
          {hasChildren ? (
            <button
              onClick={handleToggleExpand}
              className="p-0.5 rounded hover:bg-white/5 text-slate-500 hover:text-slate-350 cursor-pointer shrink-0"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: getCategoryColor(page.category) }} />
          <span className="text-[13px] flex-1 truncate">{page.title}</span>
          {page.isSecret && <EyeOff className="w-3 h-3 text-purple-400/60 shrink-0" />}
          {isGmMode && <GripVertical className="w-3 h-3 text-slate-700 shrink-0 opacity-0 group-hover/page:opacity-100" />}
        </div>
        {hasChildren && isExpanded && (
          <div className="space-y-0.5 w-full pl-2 border-l border-white/5 ml-2 mt-1">
            {page.id === 'equipment-armes' ? (() => {
              const grouped: Record<string, WikiPage[]> = {
                "Armes courantes de corps à corps": [],
                "Armes courantes à distance": [],
                "Armes de guerre de corps à corps": [],
                "Armes de guerre à distance": [],
                "Autres armes": []
              };
              children.forEach(child => {
                const group = child.tags.find(t => t in grouped) || "Autres armes";
                grouped[group].push(child);
              });
              
              return Object.entries(grouped).map(([groupName, list]) => {
                if (list.length === 0) return null;
                return (
                  <div key={groupName} className="space-y-1 my-2">
                    <div className="text-[9px] font-black text-amber-500/75 uppercase tracking-widest px-2.5 py-1 select-none border-b border-white/5 mb-1.5 font-sans">
                      {groupName}
                    </div>
                    <div className="space-y-0.5 pl-1">
                      {list.map(child => (
                        <PageItem key={child.id} page={child} depth={depth + 1} />
                      ))}
                    </div>
                  </div>
                );
              });
            })() : (
              children.map(child => (
                <PageItem key={child.id} page={child} depth={depth + 1} />
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  // Merge built-in and custom doc types for creation menu
  const activeDocTypes = activeTab === 'rules'
    ? DEFAULT_DOC_TYPES.filter(t => ['regle', 'arme', 'classe', 'sous-classe', 'sort'].includes(t.cat))
    : [
        ...DEFAULT_DOC_TYPES.filter(t => !['regle', 'arme', 'classe', 'sous-classe', 'sort'].includes(t.cat)),
        ...customCategories.map(c => ({
          cat: c.id,
          label: c.label,
          icon: <Sparkles className="w-4 h-4" />,
          color: c.color,
          description: 'Type personnalisé'
        }))
      ];

  return (
    <aside className="w-64 h-screen bg-black/40 backdrop-blur-xl flex flex-col border-r border-slate-900/50 select-none shrink-0">
      
      {/* Campagne title / Header */}
      <div className="p-4 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Shield className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-xs font-semibold text-slate-300 font-display tracking-wide uppercase truncate max-w-[140px]">
            {activeTab === 'rules' ? 'Règles du Jeu' : 'Monde & Wiki'}
          </span>
        </div>
        {isGmMode && (
          <button onClick={addFolder} title="Nouveau dossier"
            className="p-1 rounded text-slate-600 hover:text-amber-400 hover:bg-white/5 transition cursor-pointer">
            <Folder className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <input type="text" placeholder="Rechercher…" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 bg-slate-900/35 border border-slate-900 focus:border-slate-800 text-slate-300 placeholder-slate-650 rounded-md text-xs transition outline-none" />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
        </div>
      </div>

      {/* Folders & Documents Tree */}
      <div
        className={`flex-1 overflow-y-auto px-2 py-2 space-y-0.5 ${dragOverRoot ? 'bg-white/[0.015]' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOverRoot(true); }}
        onDragLeave={() => setDragOverRoot(false)}
        onDrop={handleDropOnRoot}
      >
        {dragOverRoot && draggedPageId && (
          <div className="text-[10px] text-slate-600 italic px-2 py-1">Déposer ici → racine</div>
        )}

        {/* Folders containing matching pages - ONLY in World tab */}
        {activeTab === 'world' && folders.map(folder => {
          const folderPages = visible.filter(p => folder.pageIds.includes(p.id));
          const isDragTarget = dragOverFolderId === folder.id;
          
          // Hide folder if it contains pages but none are visible in the active tab
          const hasPagesInOtherTabs = folder.pageIds.length > 0 && folderPages.length === 0;
          if (hasPagesInOtherTabs) return null;

          // For empty folders: hide in player mode
          if (folder.pageIds.length === 0 && !isGmMode) return null;

          const folderRootPages = folderPages.filter(p => !p.parentPageId || !visible.some(parent => parent.id === p.parentPageId));

          return (
            <div key={folder.id}>
              <div
                className={`flex items-center gap-1 group/folder rounded-md px-1.5 py-1 transition ${isDragTarget ? 'bg-amber-500/10 border border-amber-500/20' : 'hover:bg-white/[0.03]'}`}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverFolderId(folder.id); setDragOverRoot(false); }}
                onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverFolderId(null); }}
                onDrop={e => { e.stopPropagation(); handleDropOnFolder(e, folder.id); }}
              >
                <button onClick={() => toggleFolder(folder.id)} className="flex items-center gap-1 flex-1 cursor-pointer min-w-0">
                  {folder.isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-600 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                  {folder.isOpen ? <FolderOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                  {editingFolderId === folder.id ? (
                    <input
                      value={folderNameInput}
                      onChange={e => setFolderNameInput(e.target.value)}
                      onBlur={() => renameFolder(folder.id, folderNameInput)}
                      onKeyDown={e => { if (e.key === 'Enter') renameFolder(folder.id, folderNameInput); if (e.key === 'Escape') setEditingFolderId(null); }}
                      className="flex-1 bg-transparent text-xs text-slate-200 outline-none border-b border-gold-500/50 ml-0.5 min-w-0"
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      className="text-xs font-medium text-slate-400 group-hover/folder:text-slate-200 truncate ml-0.5 transition"
                      onDoubleClick={() => { setEditingFolderId(folder.id); setFolderNameInput(folder.name); }}
                    >
                      {folder.name}
                    </span>
                  )}
                </button>
                {isGmMode && (
                  <button onClick={() => deleteFolder(folder.id)} className="p-0.5 text-slate-700 hover:text-red-400 rounded opacity-0 group-hover/folder:opacity-100 transition cursor-pointer shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              {folder.isOpen && (
                <div className="ml-2 pl-2 border-l border-slate-900/60 space-y-0.5 mt-0.5">
                  {folderRootPages.map(p => <PageItem key={p.id} page={p} />)}
                  {folderRootPages.length === 0 && (
                    <span className="text-[10px] text-slate-750 italic block py-1 pl-1">
                      {isDragTarget ? '← Déposez ici' : 'Aucun article'}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Root pages */}
        {rootPages.length > 0 && (
          <div className={folders.length > 0 ? 'mt-2 pt-2 border-t border-slate-900/40' : ''}>
            {folders.length > 0 && (
              <span className="text-[9px] text-slate-700 uppercase tracking-wider font-semibold px-2 block mb-1">
                Articles libres
              </span>
            )}
            {rootPages.map(p => <PageItem key={p.id} page={p} />)}
          </div>
        )}

        {visible.length === 0 && (
          <div className="text-[11px] text-slate-700 italic px-2 py-4 text-center">
            {searchQuery ? 'Aucun résultat' : 'Vide'}
          </div>
        )}
      </div>

      {/* Bottom control panel */}
      <div className="border-t border-slate-900/40 bg-black/10">
        {isGmMode && (
          <div ref={newDocRef} className="px-3 py-2 relative">
            {showNewDocMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#0e1118]/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/70 p-2 z-50">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1.5">Type de document</div>
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {activeDocTypes.map(({ cat, label, icon, color, description }) => (
                    <button
                      key={cat}
                      onClick={() => { onCreateNewPage(cat); setShowNewDocMenu(false); }}
                      className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-slate-800/60 text-left cursor-pointer transition group"
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                        <span style={{ color }}>{icon}</span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200">{label}</div>
                        <div className="text-[10px] text-slate-650 truncate">{description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setShowNewDocMenu(v => !v)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-amber-400 text-xs font-semibold py-1.5 px-2 rounded-md hover:bg-white/3 w-full text-left transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nouveau document
              <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${showNewDocMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {/* Icon controls bar */}
        <div className="p-2 flex items-center justify-around text-slate-500">
          <button title="Codex" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><Book className="w-4 h-4" /></button>
          <button title="Carte" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><Map className="w-4 h-4" /></button>
          <button title="Chronologie" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><Calendar className="w-4 h-4" /></button>
          <button onClick={onOpenSettings} title="Configuration" className="p-1 hover:text-amber-500 rounded transition cursor-pointer">
            <Settings className="w-4 h-4 text-slate-400 hover:text-amber-400" />
          </button>
          <button title="Aide" className="p-1 hover:text-amber-500 rounded transition cursor-pointer"><HelpCircle className="w-4 h-4" /></button>
        </div>
      </div>
    </aside>
  );
}
