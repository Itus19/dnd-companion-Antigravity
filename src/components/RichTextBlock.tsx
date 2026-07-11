'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, EyeOff,
  MapPin, User, Users, Compass, BookOpen, FileText, Link, X
} from 'lucide-react';
import { WikiPage, WikiCategory } from '../types';

// ─────────────────────────────────────────────────────────────
// Cursor utilities (character-offset based)
// ─────────────────────────────────────────────────────────────

function getCaretOffset(el: HTMLElement): number {
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;
    const range = sel.getRangeAt(0);
    const fullRange = document.createRange();
    fullRange.selectNodeContents(el);
    fullRange.setEnd(range.endContainer, range.endOffset);
    return fullRange.toString().length;
  } catch { return 0; }
}

function setCaretOffset(el: HTMLElement, offset: number): void {
  try {
    if (offset < 0) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let remaining = offset;
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      const len = node.length;
      if (remaining <= len) {
        const range = document.createRange();
        range.setStart(node, remaining);
        range.collapse(true);
        const sel = window.getSelection();
        if (sel) { sel.removeAllRanges(); sel.addRange(range); }
        return;
      }
      remaining -= len;
    }
    // If offset exceeds all text, place at end
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) { sel.removeAllRanges(); sel.addRange(range); }
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────
// Markdown → HTML converter (for legacy content migration)
// ─────────────────────────────────────────────────────────────

function isHtmlContent(s: string): boolean {
  return /<(p|h[1-6]|strong|em|ul|ol|li|blockquote|div|span|a|br)\b/i.test(s);
}

function formatInline(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function markdownToHtml(md: string): string {
  if (!md) return '';
  if (isHtmlContent(md)) return md; // already HTML

  const lines = md.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (inList && listType) { result.push(`</${listType}>`); inList = false; listType = null; }
  };

  lines.forEach(line => {
    if (line.startsWith('### ')) {
      closeList(); result.push(`<h3>${formatInline(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      closeList(); result.push(`<h2>${formatInline(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      closeList(); result.push(`<h1>${formatInline(line.slice(2))}</h1>`);
    } else if (line.startsWith('> ')) {
      closeList(); result.push(`<blockquote>${formatInline(line.slice(2))}</blockquote>`);
    } else if (line.match(/^[*\-] /)) {
      if (!inList || listType !== 'ul') { if (inList) closeList(); result.push('<ul>'); inList = true; listType = 'ul'; }
      result.push(`<li>${formatInline(line.slice(2))}</li>`);
    } else if (line.match(/^\d+\. /)) {
      if (!inList || listType !== 'ol') { if (inList) closeList(); result.push('<ol>'); inList = true; listType = 'ol'; }
      result.push(`<li>${formatInline(line.replace(/^\d+\. /, ''))}</li>`);
    } else if (line.trim() === '') {
      closeList(); result.push('');
    } else {
      closeList(); result.push(`<p>${formatInline(line)}</p>`);
    }
  });
  closeList();
  return result.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n');
}

// ─────────────────────────────────────────────────────────────
// Wiki detection — injects <span data-wiki-ref="id"> in DOM
// ─────────────────────────────────────────────────────────────

function applyWikiHighlights(el: HTMLElement, pages: WikiPage[]): void {
  if (!el) return;
  const caretOffset = getCaretOffset(el);

  // 1. Remove existing detection spans (keep their inner text)
  el.querySelectorAll('span[data-wiki-ref]').forEach(span => {
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
  });
  el.normalize();

  // 2. Build phrase list (longest first to avoid partial matches)
  const phrases: Array<{ text: string; pageId: string }> = [];
  pages.forEach(page => {
    if (page.title?.trim()) phrases.push({ text: page.title, pageId: page.id });
    (page.aliases || []).forEach(alias => {
      if (alias?.trim() && !phrases.some(p => p.text.toLowerCase() === alias.toLowerCase())) {
        phrases.push({ text: alias, pageId: page.id });
      }
    });
  });
  phrases.sort((a, b) => b.text.length - a.text.length);
  if (phrases.length === 0) { setCaretOffset(el, caretOffset); return; }

  const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 3. Collect text nodes (skip inside <a> tags)
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest('a')) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let tn: Text | null;
  while ((tn = walker.nextNode() as Text | null)) textNodes.push(tn);

  // 4. Process text nodes — wrap first match found per node
  for (const textNode of textNodes) {
    if (!textNode.parentNode || !el.contains(textNode)) continue;
    const text = textNode.textContent || '';
    if (!text.trim()) continue;

    let best: { phrase: typeof phrases[0]; index: number; matched: string } | null = null;

    for (const phrase of phrases) {
      const re = new RegExp(`\\b(${escRe(phrase.text)})\\b`, 'i');
      const m = re.exec(text);
      if (m && (best === null || m.index < best.index)) {
        best = { phrase, index: m.index, matched: m[0] };
      }
    }

    if (best) {
      const before = text.slice(0, best.index);
      const after = text.slice(best.index + best.matched.length);
      const span = document.createElement('span');
      span.setAttribute('data-wiki-ref', best.phrase.pageId);
      span.className = 'wiki-detected-link';
      span.textContent = best.matched;

      const parent = textNode.parentNode!;
      if (before) parent.insertBefore(document.createTextNode(before), textNode);
      parent.insertBefore(span, textNode);
      if (after) parent.insertBefore(document.createTextNode(after), textNode);
      parent.removeChild(textNode);
    }
  }

  setCaretOffset(el, caretOffset);
}

// ─────────────────────────────────────────────────────────────
// Format Toolbar
// ─────────────────────────────────────────────────────────────

const COLORS = [
  { label: 'Or', value: '#fad133' },
  { label: 'Rouge', value: '#f87171' },
  { label: 'Cyan', value: '#67e8f9' },
  { label: 'Vert', value: '#86efac' },
  { label: 'Violet', value: '#c084fc' },
  { label: 'Orange', value: '#fb923c' },
  { label: 'Blanc', value: '#f8fafc' },
  { label: 'Gris', value: '#94a3b8' },
];

function FormatToolbar({
  visible, x, y, isGmMode,
  onFormat, onClose,
}: {
  visible: boolean; x: number; y: number; isGmMode: boolean;
  onFormat: (cmd: string, value?: string) => void;
  onClose: () => void;
}) {
  const [showColors, setShowColors] = useState(false);

  useEffect(() => { if (!visible) setShowColors(false); }, [visible]);

  if (!visible) return null;

  const Btn = ({ onClick, title, children, className = '' }: {
    onClick: () => void; title: string; children: React.ReactNode; className?: string;
  }) => (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div
      style={{ left: Math.max(8, x - 210), top: y - 6, transform: 'translateY(-100%)', pointerEvents: 'auto' }}
      className="fixed z-[100] flex items-center gap-0.5 bg-[#0e1118]/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/70 px-2 py-1.5"
    >
      {/* Block format */}
      <button onMouseDown={e => { e.preventDefault(); onFormat('formatBlock', 'p'); }} className="px-1.5 py-1 text-[11px] text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer font-medium">¶</button>
      <button onMouseDown={e => { e.preventDefault(); onFormat('formatBlock', 'h1'); }} className="px-1.5 py-1 text-[11px] text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer font-black">H1</button>
      <button onMouseDown={e => { e.preventDefault(); onFormat('formatBlock', 'h2'); }} className="px-1.5 py-1 text-[11px] text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer font-black">H2</button>
      <button onMouseDown={e => { e.preventDefault(); onFormat('formatBlock', 'h3'); }} className="px-1.5 py-1 text-[11px] text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer font-bold">H3</button>

      <div className="w-px h-4 bg-slate-700 mx-0.5" />

      <Btn onClick={() => onFormat('bold')} title="Gras"><Bold className="w-3.5 h-3.5" /></Btn>
      <Btn onClick={() => onFormat('italic')} title="Italique"><Italic className="w-3.5 h-3.5" /></Btn>
      <Btn onClick={() => onFormat('underline')} title="Souligné"><Underline className="w-3.5 h-3.5" /></Btn>
      <Btn onClick={() => onFormat('strikeThrough')} title="Barré"><Strikethrough className="w-3.5 h-3.5" /></Btn>

      <div className="w-px h-4 bg-slate-700 mx-0.5" />

      {/* Color picker */}
      <div className="relative">
        <button
          onMouseDown={e => { e.preventDefault(); setShowColors(v => !v); }}
          className="flex items-center gap-0.5 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer"
          title="Couleur du texte"
        >
          <span className="text-xs font-black" style={{ color: '#fad133', textShadow: '0 0 4px rgba(250,209,51,0.4)' }}>A</span>
          <span className="text-[8px] text-slate-600">▼</span>
        </button>
        {showColors && (
          <div className="absolute top-8 left-0 bg-[#0e1118]/98 border border-slate-700 rounded-xl p-2 grid grid-cols-4 gap-1 shadow-2xl z-10">
            {COLORS.map(c => (
              <button
                key={c.value}
                onMouseDown={e => { e.preventDefault(); onFormat('foreColor', c.value); setShowColors(false); }}
                title={c.label}
                className="w-5 h-5 rounded-full border-2 border-transparent hover:border-white/40 hover:scale-110 transition cursor-pointer shadow-md"
                style={{ background: c.value }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-4 bg-slate-700 mx-0.5" />

      {/* Special */}
      <button
        onMouseDown={e => { e.preventDefault(); onFormat('spoiler'); }}
        title="Spoiler (cliquer pour révéler)"
        className="px-1.5 py-1 text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-lg transition cursor-pointer font-bold"
      >
        👁
      </button>
      {isGmMode && (
        <Btn onClick={() => onFormat('playerHidden')} title="Masqué aux joueurs" className="hover:text-purple-400">
          <EyeOff className="w-3.5 h-3.5" />
        </Btn>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Wiki Link Popover (click on detected word)
// ─────────────────────────────────────────────────────────────

const CAT_OPTIONS: { value: WikiCategory; label: string; emoji: string }[] = [
  { value: 'personnage', label: 'Personnage', emoji: '👤' },
  { value: 'lieu', label: 'Lieu', emoji: '📍' },
  { value: 'faction', label: 'Faction', emoji: '⚔️' },
  { value: 'intrigue', label: 'Intrigue', emoji: '🗡️' },
  { value: 'regle', label: 'Règle', emoji: '📖' },
  { value: 'autre', label: 'Autre', emoji: '📄' },
];

function WikiLinkPopover({
  visible, x, y, pageId, title, allPages,
  onNavigate, onCreatePage, onClose,
}: {
  visible: boolean; x: number; y: number;
  pageId: string | null; title: string;
  allPages: WikiPage[];
  onNavigate: (id: string) => void;
  onCreatePage: (title: string, cat: WikiCategory) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visible) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [visible, onClose]);

  if (!visible) return null;
  const page = pageId ? allPages.find(p => p.id === pageId) : null;

  return (
    <div
      ref={ref}
      style={{ left: Math.max(4, x - 110), top: y + 6, pointerEvents: 'auto' }}
      className="fixed z-[101] min-w-[220px] bg-[#0e1118]/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/60 p-2"
    >
      <div className="flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded-lg bg-gold-500/8 border border-gold-500/15">
        <Link className="w-3.5 h-3.5 text-gold-400 shrink-0" />
        <span className="text-gold-300 font-semibold text-xs truncate">« {title} »</span>
        <button onMouseDown={onClose} className="ml-auto text-slate-600 hover:text-slate-400 cursor-pointer"><X className="w-3 h-3" /></button>
      </div>
      {page ? (
        <button
          onMouseDown={() => { onNavigate(page.id); onClose(); }}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gold-500/10 text-slate-300 hover:text-gold-300 text-xs transition cursor-pointer"
        >
          → Ouvrir « {page.title} »
        </button>
      ) : (
        <>
          <div className="text-[10px] text-slate-500 px-2 mb-1">Créer un article :</div>
          <div className="grid grid-cols-3 gap-1">
            {CAT_OPTIONS.map(cat => (
              <button
                key={cat.value}
                onMouseDown={() => { onCreatePage(title, cat.value); onClose(); }}
                className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] transition cursor-pointer"
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main RichTextBlock Component
// ─────────────────────────────────────────────────────────────

interface RichTextBlockProps {
  content: string;
  allPages: WikiPage[];
  isGmMode: boolean;
  onChange: (html: string) => void;
  onCreatePage?: (title: string, cat: WikiCategory) => WikiPage;
  onNavigate: (id: string) => void;
  placeholder?: string;
}

export default function RichTextBlock({
  content, allPages, isGmMode, onChange, onCreatePage, onNavigate,
  placeholder = 'Cliquez pour écrire… Sélectionnez du texte pour le mettre en forme.',
}: RichTextBlockProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState({ visible: false, x: 0, y: 0 });
  const [linkPopover, setLinkPopover] = useState({ visible: false, x: 0, y: 0, pageId: null as string | null, title: '' });

  const detectionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSaved = useRef(content);
  const isComposing = useRef(false);

  // ── Initialize content on mount (convert Markdown → HTML if needed)
  useEffect(() => {
    if (!editorRef.current) return;
    const html = markdownToHtml(content);
    editorRef.current.innerHTML = html;
    lastSaved.current = html;
    // Initial wiki detection after short delay
    setTimeout(() => {
      if (editorRef.current) applyWikiHighlights(editorRef.current, allPages);
    }, 300);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── When allPages changes (new page created, etc.), re-run detection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current) applyWikiHighlights(editorRef.current, allPages);
    }, 100);
    return () => clearTimeout(timer);
  }, [allPages]);

  // ── Selection → show/hide format toolbar
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount || !editorRef.current) {
        setToolbar(t => ({ ...t, visible: false }));
        return;
      }
      const range = sel.getRangeAt(0);
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        setToolbar(t => ({ ...t, visible: false }));
        return;
      }
      const rect = range.getBoundingClientRect();
      if (rect.width < 2) { setToolbar(t => ({ ...t, visible: false })); return; }
      setToolbar({ visible: true, x: rect.left + rect.width / 2, y: rect.top });
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  // ── Input handler: auto-save + wiki detection (both debounced)
  const handleInput = useCallback(() => {
    if (isComposing.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (!editorRef.current) return;
      const html = editorRef.current.innerHTML;
      lastSaved.current = html;
      onChange(html);
    }, 700);

    clearTimeout(detectionTimer.current);
    detectionTimer.current = setTimeout(() => {
      if (editorRef.current) applyWikiHighlights(editorRef.current, allPages);
    }, 550);
  }, [onChange, allPages]);

  // ── Format command handler
  const handleFormat = useCallback((cmd: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (cmd === 'formatBlock') {
      document.execCommand('formatBlock', false, value);
    } else if (cmd === 'foreColor') {
      document.execCommand('foreColor', false, value);
    } else if (cmd === 'spoiler') {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'wiki-spoiler';
      try { range.surroundContents(span); }
      catch { span.appendChild(range.extractContents()); range.insertNode(span); }
      sel.removeAllRanges();
    } else if (cmd === 'playerHidden') {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'wiki-player-hidden';
      try { range.surroundContents(span); }
      catch { span.appendChild(range.extractContents()); range.insertNode(span); }
      sel.removeAllRanges();
    } else {
      document.execCommand(cmd, false, value);
    }

    setTimeout(() => {
      if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        lastSaved.current = html;
        onChange(html);
      }
    }, 50);
    setToolbar(t => ({ ...t, visible: false }));
  }, [onChange]);

  // ── Click handler: wiki links, spoilers, regular <a> navigation
  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Spoiler reveal/hide
    if (target.classList.contains('wiki-spoiler') || target.closest('.wiki-spoiler')) {
      const sp = target.classList.contains('wiki-spoiler') ? target : target.closest('.wiki-spoiler') as HTMLElement;
      sp?.classList.toggle('revealed');
      return;
    }

    // Wiki-detected span → show popover
    const wikiSpan = target.closest('span[data-wiki-ref]') as HTMLElement | null;
    if (wikiSpan) {
      const pageId = wikiSpan.getAttribute('data-wiki-ref');
      const rect = wikiSpan.getBoundingClientRect();
      setLinkPopover({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.bottom,
        pageId,
        title: wikiSpan.textContent || '',
      });
      return;
    }

    // Standard <a href="wiki://..."> navigation
    const anchor = target.closest('a') as HTMLAnchorElement | null;
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href?.startsWith('wiki://')) { e.preventDefault(); onNavigate(href.replace('wiki://', '')); }
    }
  }, [onNavigate]);

  // ── Create page from popover
  const handleCreateFromPopover = useCallback((title: string, cat: WikiCategory) => {
    if (!onCreatePage || !editorRef.current) return;
    const newPage = onCreatePage(title, cat);
    // Find detection span and replace with proper link
    editorRef.current.querySelectorAll('span[data-wiki-ref]').forEach(span => {
      if (span.textContent?.toLowerCase() === title.toLowerCase()) {
        const newSpan = document.createElement('span');
        newSpan.setAttribute('data-wiki-ref', newPage.id);
        newSpan.className = 'wiki-detected-link';
        newSpan.textContent = span.textContent;
        span.parentNode?.replaceChild(newSpan, span);
      }
    });
    const html = editorRef.current.innerHTML;
    lastSaved.current = html;
    onChange(html);
  }, [onCreatePage, onChange]);

  return (
    <div className="relative">
      <FormatToolbar
        visible={toolbar.visible && isGmMode}
        x={toolbar.x} y={toolbar.y}
        isGmMode={isGmMode}
        onFormat={handleFormat}
        onClose={() => setToolbar(t => ({ ...t, visible: false }))}
      />
      <WikiLinkPopover
        visible={linkPopover.visible}
        x={linkPopover.x} y={linkPopover.y}
        pageId={linkPopover.pageId}
        title={linkPopover.title}
        allPages={allPages}
        onNavigate={onNavigate}
        onCreatePage={handleCreateFromPopover}
        onClose={() => setLinkPopover(p => ({ ...p, visible: false }))}
      />
      <div
        ref={editorRef}
        contentEditable={isGmMode ? 'true' : 'false'}
        suppressContentEditableWarning
        onInput={handleInput}
        onClick={handleClick}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
        data-placeholder={placeholder}
        className={`rich-text-editor ${!isGmMode ? 'player-mode-view' : ''}`}
      />
    </div>
  );
}
