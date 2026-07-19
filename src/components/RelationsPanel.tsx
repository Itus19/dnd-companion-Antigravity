'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Link2, ChevronDown } from 'lucide-react';
import { WikiPage, WikiRelation } from '../types';

// Relation type presets
const RELATION_PRESETS = [
  'Personnage', 'Lieu', 'Faction', 'Intrigue', 'Allié', 'Ennemi',
  'Membre de', 'Basé à', 'Dirige', 'Fondateur', 'Appartient à',
  'Lié à', 'Opposé à', 'Parent de', 'Enfant de',
];

// Category color palette
const CAT_COLORS: Record<string, string> = {
  lieu:       'hsl(150, 60%, 45%)',
  personnage: 'hsl(40, 90%, 60%)',
  faction:    'hsl(200, 70%, 55%)',
  intrigue:   'hsl(280, 60%, 60%)',
  regle:      'hsl(0, 65%, 60%)',
  autre:      'hsl(220, 20%, 55%)',
};

function AddRelationPopover({
  allPages, currentPageId, isGmMode,
  onAdd, onClose,
}: {
  allPages: WikiPage[];
  currentPageId: string;
  isGmMode: boolean;
  onAdd: (type: string, targetPageId: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [relType, setRelType] = useState('Lié à');
  const [customType, setCustomType] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const filtered = allPages.filter(p =>
    p.id !== currentPageId &&
    (isGmMode || !p.isSecret) &&
    (query.trim() === '' || p.title.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 8);

  const finalType = customType.trim() || relType;

  return (
    <div
      ref={ref}
      className="absolute z-50 left-0 mt-1 w-80 bg-[#0e1118]/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/60 overflow-hidden"
    >
      {/* Type selector */}
      <div className="px-3 pt-3 pb-2 border-b border-slate-800/60">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de relation</div>
        <div className="relative">
          <button
            onMouseDown={e => { e.preventDefault(); setShowTypeDropdown(v => !v); }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 bg-dark-900 border border-slate-800 rounded-lg text-xs text-slate-300 cursor-pointer hover:border-gold-500/30"
          >
            <span>{finalType}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showTypeDropdown && (
            <div className="absolute top-8 left-0 right-0 bg-[#0e1118] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-10">
              <div className="p-1.5 border-b border-slate-800">
                <input
                  value={customType}
                  onChange={e => setCustomType(e.target.value)}
                  placeholder="Type personnalisé…"
                  className="w-full bg-transparent text-xs text-slate-300 px-2 py-1 focus:outline-none placeholder-slate-600"
                />
              </div>
              <div className="max-h-40 overflow-y-auto">
                {RELATION_PRESETS.map(p => (
                  <button
                    key={p}
                    onMouseDown={e => { e.preventDefault(); setRelType(p); setCustomType(''); setShowTypeDropdown(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page search */}
      <div className="px-3 pt-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Article lié</div>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un article…"
          className="w-full bg-dark-900 border border-slate-800 rounded-lg text-xs text-slate-300 px-2.5 py-1.5 focus:outline-none focus:border-gold-500/30 placeholder-slate-600 mb-2"
        />
        <div className="space-y-0.5 max-h-48 overflow-y-auto pb-2">
          {filtered.length === 0 && (
            <div className="text-[10px] text-slate-600 italic px-1 py-2">Aucun article trouvé.</div>
          )}
          {filtered.map(page => (
            <button
              key={page.id}
              onMouseDown={e => { e.preventDefault(); onAdd(finalType, page.id); onClose(); }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 text-left cursor-pointer group transition"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: CAT_COLORS[page.category] || '#64748b' }}
              />
              <span className="text-xs text-slate-200 flex-1 truncate">{page.title}</span>
              <span className="text-[9px] text-slate-600 capitalize shrink-0">{page.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface RelationsPanelProps {
  page: WikiPage;
  allPages: WikiPage[];
  isGmMode: boolean;
  onAddRelation: (type: string, targetPageId: string) => void;
  onRemoveRelation: (relationId: string) => void;
  onNavigate: (pageId: string) => void;
}

export default function RelationsPanel({
  page, allPages, isGmMode,
  onAddRelation, onRemoveRelation, onNavigate,
}: RelationsPanelProps) {
  const [showPopover, setShowPopover] = useState(false);

  const relations = page.relations ?? [];
  if (relations.length === 0 && !isGmMode) return null;

  return (
    <div className="flex flex-col gap-1.5 text-xs select-none">
      <span className="text-[10px] text-slate-500 uppercase font-semibold mr-1">Relations :</span>
      
      {/* Vertically stacked relation items (like Alias capsules) */}
      <div className="flex flex-col gap-1.5">
        {relations.map(rel => {
          const target = allPages.find(p => p.id === rel.targetPageId);
          if (!target) return null;
          if (!isGmMode && target.isSecret) return null;
          return (
            <div
              key={rel.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/80 border border-slate-850 text-slate-400 text-xs font-sans w-fit transition hover:border-slate-750"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: CAT_COLORS[target.category] || '#64748b' }}
              />
              <span className="font-semibold text-slate-500 uppercase text-[9px] tracking-wider">{rel.type} :</span>
              <span
                onClick={() => onNavigate(target.id)}
                className="text-gold-400 hover:text-gold-300 font-semibold cursor-pointer"
              >
                {target.title}
              </span>
              
              {isGmMode && (
                <button
                  onClick={() => onRemoveRelation(rel.id)}
                  className="text-slate-600 hover:text-slate-400 transition cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add relation button (GM only) */}
      {isGmMode && (
        <div className="relative mt-1">
          <button
            onClick={() => setShowPopover(v => !v)}
            className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-amber-500 font-semibold transition cursor-pointer px-1 py-0.5"
          >
            <Plus className="w-3 h-3" />
            <span>Ajouter une relation</span>
            <Link2 className="w-3 h-3 ml-0.5 opacity-50" />
          </button>
          {showPopover && (
            <AddRelationPopover
              allPages={allPages}
              currentPageId={page.id}
              isGmMode={isGmMode}
              onAdd={onAddRelation}
              onClose={() => setShowPopover(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
