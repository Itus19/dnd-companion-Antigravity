'use client';
import React, { useRef, useCallback } from 'react';
import { History } from 'lucide-react';
import { WikiWindowState, WikiPage } from '../types';

interface WikiWindowProps {
  win: WikiWindowState;
  title: string;
  category?: string;
  allPages?: WikiPage[];
  bannerImage?: string;
  isFocused: boolean;
  onFocus: () => void;
  onClose: () => void;
  onUpdate: (updates: Partial<WikiWindowState>) => void;
  onOpenHistory: () => void; // Trigger history panel
  children: React.ReactNode;
}

const CAT_DOT: Record<string, string> = {
  lieu:       '#4ade80',
  personnage: '#fbbf24',
  faction:    '#38bdf8',
  intrigue:   '#c084fc',
  regle:      '#f87171',
  autre:      '#94a3b8',
};

const CAT_LABELS: Record<string, string> = {
  lieu:       'Lieu',
  personnage: 'Personnage',
  faction:    'Faction',
  intrigue:   'Intrigue',
  regle:      'Règle',
  autre:      'Codex',
};

export default function WikiWindow({
  win, title, category = 'autre', allPages, bannerImage, isFocused,
  onFocus, onClose, onUpdate, onOpenHistory, children,
}: WikiWindowProps) {
  const winRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, wx: 0, wy: 0 });
  const resizeStart = useRef({ mx: 0, my: 0, ww: 0, wh: 0 });

  const toggleMaximize = useCallback(() => {
    onUpdate({ isMaximized: !win.isMaximized });
  }, [win.isMaximized, onUpdate]);

  // ── Drag ──
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.wiki-window-dot')) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, wx: win.x, wy: win.y };
    onFocus();

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = ev.clientX - dragStart.current.mx;
      const dy = ev.clientY - dragStart.current.my;
      const newX = Math.max(0, dragStart.current.wx + dx);
      const newY = Math.max(0, dragStart.current.wy + dy);
      onUpdate({ x: newX, y: newY });
    };
    const onUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [win.x, win.y, win.isMaximized, onFocus, onUpdate]);

  // ── Resize ──
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeStart.current = { mx: e.clientX, my: e.clientY, ww: win.width, wh: win.height };
    onFocus();

    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const dx = ev.clientX - resizeStart.current.mx;
      const dy = ev.clientY - resizeStart.current.my;
      const newW = Math.max(340, resizeStart.current.ww + dx);
      const newH = Math.max(250, resizeStart.current.wh + dy);
      onUpdate({ width: newW, height: newH });
    };
    const onUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [win.width, win.height, win.isMaximized, onFocus, onUpdate]);

  const catLabel = CAT_LABELS[category] || category;

  return (
    <div
      ref={winRef}
      className={`wiki-window ${isFocused ? 'focused' : ''} ${win.isMaximized ? 'maximized' : ''}`}
      style={
        win.isMaximized
          ? { left: 0, top: 0, width: '100%', height: '100%', zIndex: win.zIndex }
          : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }
      }
      onMouseDown={onFocus}
    >
      {/* Title bar with glowing banner backdrop and repositioned buttons */}
      <div className="wiki-window-bar relative overflow-hidden" onMouseDown={handleDragStart} onDoubleClick={toggleMaximize}>
        
        {/* Dynamic Glow from banner image */}
        {bannerImage && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-color-dodge filter blur-[4px] bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />
        )}

        {/* Header content (forced on top of glow) */}
        <div className="relative z-10 flex items-center justify-between w-full h-full px-3">
          
          {/* Left Side: Title and category indicator "Name [Lieu]" */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: CAT_DOT[category] || '#94a3b8' }}
            />
            <span className="text-xs font-semibold text-slate-200 truncate select-none">
              {title}
            </span>
            {(category === 'regle' || category === 'arme' || category === 'sort' || category === 'composant' || category === 'classe' || category === 'sous-classe') ? (() => {
              // Build breadcrumbs for rules / weapons
              const breadcrumbs: string[] = ['Règles'];
              
              // 1. Determine subCat (e.g. "Équipement")
              const subCat = (win.pageId.startsWith('spell-') || category === 'sort') ? 'Sorts'
                : (win.pageId.startsWith('class-') || win.pageId.startsWith('subclass-') || category === 'classe' || category === 'sous-classe') ? 'Classes'
                : win.pageId.startsWith('species-') ? 'Espèces'
                : win.pageId.startsWith('origin-') ? 'Origines'
                : (win.pageId.startsWith('weapon-') || win.pageId.startsWith('equipment-') || category === 'arme') ? 'Équipement'
                : (win.pageId.startsWith('cond-')) ? 'États'
                : (win.pageId.startsWith('component-') || category === 'composant') ? 'Composants'
                : win.pageId.startsWith('rule-') ? 'Conditions & Combat'
                : 'Général';
                
              breadcrumbs.push(subCat);
              
              // 2. Find parent pages in hierarchy
              if (allPages) {
                const currentPage = allPages.find(p => p.id === win.pageId);
                let parentId = currentPage?.parentPageId || (category === 'arme' ? 'equipment-armes' : undefined);
                
                let currentParent = allPages.find(p => p.id === parentId);
                const parentsList: string[] = [];
                let depth = 0;
                while (currentParent && depth < 5) {
                  if (currentParent.title !== subCat && currentParent.title !== title) {
                    parentsList.unshift(currentParent.title);
                  }
                  parentId = currentParent.parentPageId;
                  currentParent = parentId ? allPages.find(p => p.id === parentId) : undefined;
                  depth++;
                }
                breadcrumbs.push(...parentsList);
              }

              return (
                <div className="flex items-center gap-1 shrink-0">
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-[9px] text-slate-650 font-bold shrink-0">→</span>}
                      <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-500 uppercase tracking-wider shrink-0 animate-fade-in">
                        {crumb}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              );
            })() : (
              <span className="text-[9px] font-semibold px-1 py-0.5 rounded uppercase tracking-wider shrink-0 text-slate-500 bg-white/5 border border-white/5">
                {catLabel}
              </span>
            )}
          </div>

          {/* Right Side: traffic control dots with yellow mapping to history */}
          <div className="flex items-center gap-2.5 shrink-0 ml-4">
            {/* History Clock Button */}
            <button
              className="btn-history-clock text-slate-500 hover:text-amber-400 transition cursor-pointer shrink-0 p-0.5 hover:bg-white/5 rounded-full flex items-center justify-center"
              onMouseDown={e => e.stopPropagation()}
              onClick={onOpenHistory}
              title="Historique des révisions"
            >
              <History className="w-3.5 h-3.5" />
            </button>

            {/* Green -> Expand */}
            <span
              className="wiki-window-dot expand cursor-pointer shrink-0 flex items-center justify-center"
              onMouseDown={e => e.stopPropagation()}
              onClick={toggleMaximize}
              title="Agrandir / Restaurer"
            >
              <span className="text-[7px] text-emerald-950 font-extrabold pb-0.5 select-none opacity-0 hover:opacity-100 transition-opacity">⤢</span>
            </span>

            {/* Red -> Close */}
            <span
              className="wiki-window-dot close cursor-pointer shrink-0 flex items-center justify-center"
              onMouseDown={e => e.stopPropagation()}
              onClick={onClose}
              title="Fermer"
            >
              <span className="text-[7px] text-red-950 font-extrabold pb-0.5 select-none opacity-0 hover:opacity-100 transition-opacity">✕</span>
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="wiki-window-content relative z-10">
        {children}
      </div>

      {/* Resize handle */}
      {!win.isMaximized && (
        <div className="wiki-window-resize" onMouseDown={handleResizeStart} />
      )}
    </div>
  );
}
