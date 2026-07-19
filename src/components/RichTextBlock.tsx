'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, EyeOff,
  Link, X, Sparkles
} from 'lucide-react';
import { WikiPage, WikiCategory } from '../types';

// ─────────────────────────────────────────────────────────────
// Cursor utilities (character-offset based)
// ─────────────────────────────────────────────────────────────

function getCaretOffset(el: HTMLElement): number {
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return -1;
    // Make sure selection is inside this element
    if (!el.contains(sel.getRangeAt(0).commonAncestorContainer)) return -1;
    const range = sel.getRangeAt(0);
    const fullRange = document.createRange();
    fullRange.selectNodeContents(el);
    fullRange.setEnd(range.endContainer, range.endOffset);
    return fullRange.toString().length;
  } catch { return -1; }
}

function insertMarkerAtOffset(parent: Node, targetOffset: number): boolean {
  let currentOffset = 0;
  
  function traverse(node: Node): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = node.textContent?.length || 0;
      if (currentOffset + textLength >= targetOffset) {
        const splitOffset = targetOffset - currentOffset;
        const textNode = node as Text;
        const newTextNode = textNode.splitText(splitOffset);
        
        const marker = document.createElement('span');
        marker.id = 'typewriter-marker';
        node.parentNode?.insertBefore(marker, newTextNode);
        return true;
      }
      currentOffset += textLength;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (traverse(node.childNodes[i])) {
          return true;
        }
      }
    }
    return false;
  }
  
  return traverse(parent);
}


function setCaretOffset(el: HTMLElement, offset: number): void {
  if (offset < 0) return;
  try {
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
    // Place at end
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) { sel.removeAllRanges(); sel.addRange(range); }
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────
// Markdown → HTML (legacy migration)
// ─────────────────────────────────────────────────────────────

function isHtmlContent(s: string): boolean {
  return /\<(p|h[1-6]|strong|em|ul|ol|li|blockquote|div|span|a|br)\b/i.test(s);
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
  if (isHtmlContent(md)) return md;
  const lines = md.split('\n');
  const result: string[] = [];
  let inList = false; let listType: 'ul' | 'ol' | null = null;
  const closeList = () => { if (inList && listType) { result.push(`</${listType}>`); inList = false; listType = null; } };
  lines.forEach(line => {
    if (line.startsWith('### ')) { closeList(); result.push(`<h3>${formatInline(line.slice(4))}</h3>`); }
    else if (line.startsWith('## ')) { closeList(); result.push(`<h2>${formatInline(line.slice(3))}</h2>`); }
    else if (line.startsWith('# ')) { closeList(); result.push(`<h1>${formatInline(line.slice(2))}</h1>`); }
    else if (line.startsWith('> ')) { closeList(); result.push(`<blockquote>${formatInline(line.slice(2))}</blockquote>`); }
    else if (line.match(/^[*\-] /)) {
      if (!inList || listType !== 'ul') { if (inList) closeList(); result.push('<ul>'); inList = true; listType = 'ul'; }
      result.push(`<li>${formatInline(line.slice(2))}</li>`);
    } else if (line.match(/^\d+\. /)) {
      if (!inList || listType !== 'ol') { if (inList) closeList(); result.push('<ol>'); inList = true; listType = 'ol'; }
      result.push(`<li>${formatInline(line.replace(/^\d+\. /, ''))}</li>`);
    } else if (line.trim() === '') { closeList(); result.push(''); }
    else { closeList(); result.push(`<p>${formatInline(line)}</p>`); }
  });
  closeList();
  return result.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n');
}

// ─────────────────────────────────────────────────────────────
// Wiki detection — multi-word, accented char-aware
// ─────────────────────────────────────────────────────────────

const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Unicode-aware word boundary: chars that are NOT letters/digits/accented
const BOUND = `(?<![\\w\u00C0-\u024F])`;
const BENDE = `(?![\\w\u00C0-\u024F])`;

// Detect sequences of capitalized words (2+ chars) for "suggest new article" 
// e.g. "Ordre du Lion d'Or" — simple heuristic: first letter uppercase
const PROPER_NOUN_RE = /(?<![^\s,;:.!?«»()])([A-ZÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-zàâäéèêëîïôùûüç']{1,}(?:\s+(?:d'|de\s|du\s|des\s|le\s|la\s|les\s|l')?[A-ZÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-zàâäéèêëîïôùûüç']{1,})*)/g;

function applyWikiHighlights(el: HTMLElement, pages: WikiPage[]): void {
  if (!el) return;
  const caretOffset = getCaretOffset(el);

  // Remove existing detection spans
  el.querySelectorAll('span[data-wiki-ref], span[data-wiki-suggest]').forEach(span => {
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
  });
  el.normalize();

  // Build phrase list (longest first)
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

  // Collect text nodes (skip inside <a> tags)
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

  // Track spans added for "known" pages — to skip suggestion detection on those words
  const knownMatchedRanges: Array<{start: number; end: number}> = [];

  // Process text nodes — wrap all matches (not just first)
  for (const textNode of textNodes) {
    if (!textNode.parentNode || !el.contains(textNode)) continue;
    let remaining = textNode.textContent || '';
    if (!remaining.trim()) continue;

    // Find ALL matches in this text node, sorted by index
    const allMatches: Array<{ phrase: typeof phrases[0]; index: number; matched: string }> = [];
    for (const phrase of phrases) {
      const re = new RegExp(`${BOUND}(${escRe(phrase.text)})${BENDE}`, 'gi');
      let m: RegExpExecArray | null;
      while ((m = re.exec(remaining)) !== null) {
        // Check not overlapping with existing match
        const start = m.index + m[0].indexOf(m[1]);
        const end = start + m[1].length;
        const overlaps = allMatches.some(ex => !(end <= ex.index || start >= ex.index + ex.matched.length));
        if (!overlaps) allMatches.push({ phrase, index: start, matched: m[1] });
      }
    }
    allMatches.sort((a, b) => a.index - b.index);

    if (allMatches.length === 0) continue;

    // Build replacement fragment
    const parent = textNode.parentNode!;
    const frag = document.createDocumentFragment();
    let cursor = 0;
    for (const match of allMatches) {
      if (match.index > cursor) frag.appendChild(document.createTextNode(remaining.slice(cursor, match.index)));
      const span = document.createElement('span');
      span.setAttribute('data-wiki-ref', match.phrase.pageId);
      span.className = 'wiki-detected-link';
      span.textContent = match.matched;
      frag.appendChild(span);
      cursor = match.index + match.matched.length;
    }
    if (cursor < remaining.length) frag.appendChild(document.createTextNode(remaining.slice(cursor)));
    parent.replaceChild(frag, textNode);
  }

  // === Suggestion pass: detect potential proper nouns not already linked ===
  // Re-collect text nodes (after wiki spans were added)
  const textNodes2: Text[] = [];
  const walker2 = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest('a, span[data-wiki-ref]')) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  while ((tn = walker2.nextNode() as Text | null)) textNodes2.push(tn);

  for (const textNode of textNodes2) {
    if (!textNode.parentNode || !el.contains(textNode)) continue;
    const text = textNode.textContent || '';
    if (!text.trim()) continue;

    PROPER_NOUN_RE.lastIndex = 0;
    const suggestMatches: Array<{index: number; matched: string}> = [];
    let m: RegExpExecArray | null;
    while ((m = PROPER_NOUN_RE.exec(text)) !== null) {
      // Only suggest if not a common word and not already a wiki link
      const word = m[1];
      if (word.length < 3) continue;
      suggestMatches.push({ index: m.index + m[0].indexOf(m[1]), matched: word });
    }
    if (suggestMatches.length === 0) continue;

    const parent = textNode.parentNode!;
    const frag = document.createDocumentFragment();
    let cursor = 0;
    for (const match of suggestMatches) {
      if (match.index > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, match.index)));
      const span = document.createElement('span');
      span.setAttribute('data-wiki-suggest', match.matched);
      span.className = 'wiki-suggest-link';
      span.textContent = match.matched;
      frag.appendChild(span);
      cursor = match.index + match.matched.length;
    }
    if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
    parent.replaceChild(frag, textNode);
  }

  if (caretOffset >= 0) setCaretOffset(el, caretOffset);
}

// ─────────────────────────────────────────────────────────────
// Format Toolbar
// ─────────────────────────────────────────────────────────────

const COLORS = [
  { label: 'Or', value: '#fad133' }, { label: 'Rouge', value: '#f87171' },
  { label: 'Cyan', value: '#67e8f9' }, { label: 'Vert', value: '#86efac' },
  { label: 'Violet', value: '#c084fc' }, { label: 'Orange', value: '#fb923c' },
  { label: 'Blanc', value: '#f8fafc' }, { label: 'Gris', value: '#94a3b8' },
];

function FormatToolbar({ visible, x, y, isGmMode, onFormat, onClose }: {
  visible: boolean; x: number; y: number; isGmMode: boolean;
  onFormat: (cmd: string, value?: string) => void;
  onClose: () => void;
}) {
  const [showColors, setShowColors] = useState(false);
  useEffect(() => { if (!visible) setShowColors(false); }, [visible]);
  if (!visible) return null;
  const Btn = ({ onClick, title, children, className = '' }: { onClick: () => void; title: string; children: React.ReactNode; className?: string }) => (
    <button onMouseDown={e => { e.preventDefault(); onClick(); }} title={title}
      className={`p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer ${className}`}>
      {children}
    </button>
  );
  return (
    <div style={{ left: Math.max(8, x - 210), top: y - 6, transform: 'translateY(-100%)', pointerEvents: 'auto' }}
      className="fixed z-[100] flex items-center gap-0.5 bg-[#0e1118]/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/70 px-2 py-1.5">
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
      <div className="relative">
        <button onMouseDown={e => { e.preventDefault(); setShowColors(v => !v); }}
          className="flex items-center gap-0.5 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer" title="Couleur du texte">
          <span className="text-xs font-black" style={{ color: '#fad133' }}>A</span>
          <span className="text-[8px] text-slate-600">▼</span>
        </button>
        {showColors && (
          <div className="absolute top-8 left-0 bg-[#0e1118]/98 border border-slate-700 rounded-xl p-2 grid grid-cols-4 gap-1 shadow-2xl z-10">
            {COLORS.map(c => (
              <button key={c.value} onMouseDown={e => { e.preventDefault(); onFormat('foreColor', c.value); setShowColors(false); }}
                title={c.label} className="w-5 h-5 rounded-full border-2 border-transparent hover:border-white/40 hover:scale-110 transition cursor-pointer shadow-md"
                style={{ background: c.value }} />
            ))}
          </div>
        )}
      </div>
      <div className="w-px h-4 bg-slate-700 mx-0.5" />
      <button onMouseDown={e => { e.preventDefault(); onFormat('spoiler'); }}
        title="Spoiler" className="px-1.5 py-1 text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-lg transition cursor-pointer font-bold">👁</button>
      {isGmMode && <Btn onClick={() => onFormat('playerHidden')} title="Masqué aux joueurs" className="hover:text-purple-400"><EyeOff className="w-3.5 h-3.5" /></Btn>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Wiki Link Popover
// ─────────────────────────────────────────────────────────────

const CAT_OPTIONS: { value: WikiCategory; label: string; emoji: string }[] = [
  { value: 'personnage', label: 'Personnage', emoji: '👤' },
  { value: 'lieu', label: 'Lieu', emoji: '📍' },
  { value: 'faction', label: 'Faction', emoji: '⚔️' },
  { value: 'intrigue', label: 'Intrigue', emoji: '🗡️' },
  { value: 'regle', label: 'Règle', emoji: '📖' },
  { value: 'autre', label: 'Autre', emoji: '📄' },
];

function WikiLinkPopover({ visible, x, y, pageId, title, isSuggestion, allPages, onNavigate, onCreatePage, onClose }: {
  visible: boolean; x: number; y: number;
  pageId: string | null; title: string;
  isSuggestion?: boolean;
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
    <div ref={ref} style={{ left: Math.max(4, x - 110), top: y + 6, pointerEvents: 'auto' }}
      className="fixed z-[101] min-w-[220px] bg-[#0e1118]/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/60 p-2">
      <div className={`flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded-lg ${isSuggestion ? 'bg-amber-500/8 border border-amber-500/20' : 'bg-gold-500/8 border border-gold-500/15'}`}>
        {isSuggestion ? <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Link className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
        <span className={`font-semibold text-xs truncate ${isSuggestion ? 'text-amber-300' : 'text-gold-300'}`}>« {title} »</span>
        <button onMouseDown={onClose} className="ml-auto text-slate-600 hover:text-slate-400 cursor-pointer"><X className="w-3 h-3" /></button>
      </div>
      {page ? (
        <button onMouseDown={() => { onNavigate(page.id); onClose(); }}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gold-500/10 text-slate-300 hover:text-gold-300 text-xs transition cursor-pointer">
          → Ouvrir « {page.title} »
        </button>
      ) : (
        <>
          <div className="text-[10px] text-slate-500 px-2 mb-1">
            {isSuggestion ? 'Créer un article pour ce terme :' : 'Créer un article :'}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {CAT_OPTIONS.map(cat => (
              <button key={cat.value} onMouseDown={() => { onCreatePage(title, cat.value); onClose(); }}
                className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] transition cursor-pointer">
                <span>{cat.emoji}</span><span>{cat.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main RichTextBlock
// ─────────────────────────────────────────────────────────────

interface RichTextBlockProps {
  content: string;
  allPages: WikiPage[];
  isGmMode: boolean;
  onChange: (html: string) => void;
  onCreatePage?: (title: string, cat: WikiCategory) => WikiPage;
  onNavigate: (id: string) => void;
  placeholder?: string;
  typewriterText?: string;
  onTypewriterComplete?: () => void;
  onCaretContextChange?: (ctx: { before: string; after: string }) => void;
}

export default function RichTextBlock({
  content, allPages, isGmMode, onChange, onCreatePage, onNavigate,
  placeholder = 'Cliquez pour écrire… Sélectionnez du texte pour le mettre en forme.',
  typewriterText = '',
  onTypewriterComplete,
  onCaretContextChange,
}: RichTextBlockProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState({ visible: false, x: 0, y: 0 });
  const [linkPopover, setLinkPopover] = useState({
    visible: false, x: 0, y: 0,
    pageId: null as string | null,
    title: '', isSuggestion: false,
  });

  const detectionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSaved = useRef(content);
  const isComposing = useRef(false);
  const isFocused = useRef(false); // KEY: track focus to avoid cursor jump
  const allPagesRef = useRef(allPages); // keep ref in sync for callbacks
  useEffect(() => { allPagesRef.current = allPages; }, [allPages]);

  const [isTyping, setIsTyping] = useState(false);
  const lastCaretOffset = useRef<number>(-1);

  // Track selection change to save character offset and compute caret context
  useEffect(() => {
    const handleSelection = () => {
      if (!editorRef.current) return;
      try {
        const offset = getCaretOffset(editorRef.current);
        if (offset >= 0) {
          lastCaretOffset.current = offset;
          
          if (onCaretContextChange) {
            const fullText = editorRef.current.innerText || '';
            const before = fullText.slice(0, offset);
            const after = fullText.slice(offset);
            onCaretContextChange({ before, after });
          }
        }
      } catch (e) {
        // ignore selection errors
      }
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [onCaretContextChange]);

  // Typewriter effect to write text sequentially at cursor position
  useEffect(() => {
    if (!typewriterText || !editorRef.current) return;
    
    setIsTyping(true);
    const targetEl = editorRef.current;
    
    let beforeHtml = '';
    let afterHtml = '';
    
    // Insert temporary marker at last known character offset if available
    const caretOffset = lastCaretOffset.current;
    if (caretOffset >= 0 && caretOffset <= (targetEl.innerText || '').length) {
      try {
        targetEl.querySelectorAll('#typewriter-marker').forEach(m => m.remove());
        
        // Use our bulletproof DOM offset marker injector
        const success = insertMarkerAtOffset(targetEl, caretOffset);
        if (success) {
          const htmlParts = targetEl.innerHTML.split('<span id="typewriter-marker"></span>');
          beforeHtml = htmlParts[0] || '';
          afterHtml = htmlParts[1] || '';
          targetEl.querySelectorAll('#typewriter-marker').forEach(m => m.remove());
        } else {
          beforeHtml = targetEl.innerHTML;
          afterHtml = '';
        }
      } catch (err) {
        console.warn("Failed to insert caret offset marker, appending instead:", err);
        beforeHtml = targetEl.innerHTML;
        afterHtml = '';
      }
    } else {
      beforeHtml = targetEl.innerHTML;
      afterHtml = '';
    }
    
    if (beforeHtml.trim() === '<p><br></p>' || beforeHtml.trim() === '') {
      beforeHtml = '';
    }
    
    // Setup typing area keeping trailing HTML fully visible
    targetEl.innerHTML = beforeHtml + '<span id="typewriter-typing" class="text-amber-500 font-medium"></span>' + afterHtml;
    const typingSpan = targetEl.querySelector('#typewriter-typing') as HTMLElement | null;
    
    if (!typingSpan) {
      targetEl.innerHTML = beforeHtml + afterHtml;
      setIsTyping(false);
      return;
    }
    
    const words = typewriterText.split(' ');
    let wordIdx = 0;

    const interval = setInterval(() => {
      if (wordIdx >= words.length) {
        clearInterval(interval);
        setIsTyping(false);
        
        // Remove typing span tag but keep its generated content flat
        const finalGeneratedText = typingSpan.innerHTML;
        targetEl.innerHTML = beforeHtml + finalGeneratedText + afterHtml;
        
        targetEl.querySelectorAll('#typewriter-marker').forEach(m => m.remove());
        applyWikiHighlights(targetEl, allPagesRef.current);
        const finalHtml = targetEl.innerHTML;
        lastSaved.current = finalHtml;
        onChange(finalHtml);
        if (onCaretContextChange) {
          onCaretContextChange({ before: targetEl.innerText || '', after: '' });
        }
        if (onTypewriterComplete) onTypewriterComplete();
        return;
      }
      
      const word = words[wordIdx];
      if (word !== undefined) {
        const formattedWord = word.replace(/\n/g, '<br/>');
        typingSpan.innerHTML += (typingSpan.innerHTML ? ' ' : '') + formattedWord;
      }
      wordIdx++;
    }, 45);

    return () => {
      clearInterval(interval);
    };
  }, [typewriterText]);

  // Initialize content (mount only)
  useEffect(() => {
    if (!editorRef.current) return;
    const html = markdownToHtml(content);
    editorRef.current.innerHTML = html;
    lastSaved.current = html;
    setTimeout(() => {
      if (editorRef.current && !isFocused.current) {
        applyWikiHighlights(editorRef.current, allPagesRef.current);
      }
    }, 400);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When allPages changes (new page created etc.) — only re-run if NOT focused
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current && !isFocused.current) {
        applyWikiHighlights(editorRef.current, allPages);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [allPages]);

  // Selection → format toolbar
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount || !editorRef.current) {
        setToolbar(t => ({ ...t, visible: false })); return;
      }
      const range = sel.getRangeAt(0);
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        setToolbar(t => ({ ...t, visible: false })); return;
      }
      const rect = range.getBoundingClientRect();
      if (rect.width < 2) { setToolbar(t => ({ ...t, visible: false })); return; }
      setToolbar({ visible: true, x: rect.left + rect.width / 2, y: rect.top });
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  // Input: save + wiki detection (debounced, only while focused)
  const handleInput = useCallback(() => {
    if (isComposing.current) return;

    // Auto-save
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (!editorRef.current) return;
      const html = editorRef.current.innerHTML;
      if (html !== lastSaved.current) {
        lastSaved.current = html;
        onChange(html);
      }
    }, 600);

    // Wiki detection — only when focused, with longer debounce to avoid cursor jump
    clearTimeout(detectionTimer.current);
    detectionTimer.current = setTimeout(() => {
      if (editorRef.current && isFocused.current) {
        applyWikiHighlights(editorRef.current, allPagesRef.current);
      }
    }, 900);
  }, [onChange]);

  // Format
  const handleFormat = useCallback((cmd: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (cmd === 'formatBlock') { document.execCommand('formatBlock', false, value); }
    else if (cmd === 'foreColor') { document.execCommand('foreColor', false, value); }
    else if (cmd === 'spoiler') {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const span = document.createElement('span'); span.className = 'wiki-spoiler';
      try { range.surroundContents(span); } catch { span.appendChild(range.extractContents()); range.insertNode(span); }
      sel.removeAllRanges();
    } else if (cmd === 'playerHidden') {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const span = document.createElement('span'); span.className = 'wiki-player-hidden';
      try { range.surroundContents(span); } catch { span.appendChild(range.extractContents()); range.insertNode(span); }
      sel.removeAllRanges();
    } else { document.execCommand(cmd, false, value); }
    setTimeout(() => {
      if (editorRef.current) { const html = editorRef.current.innerHTML; lastSaved.current = html; onChange(html); }
    }, 50);
    setToolbar(t => ({ ...t, visible: false }));
  }, [onChange]);

  // Click: wiki links, suggestions, spoilers
  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Spoiler
    if (target.classList.contains('wiki-spoiler') || target.closest('.wiki-spoiler')) {
      const sp = target.classList.contains('wiki-spoiler') ? target : target.closest('.wiki-spoiler') as HTMLElement;
      sp?.classList.toggle('revealed'); return;
    }

    // Known wiki link
    const wikiSpan = target.closest('span[data-wiki-ref]') as HTMLElement | null;
    if (wikiSpan) {
      const pageId = wikiSpan.getAttribute('data-wiki-ref');
      const rect = wikiSpan.getBoundingClientRect();
      setLinkPopover({ visible: true, x: rect.left + rect.width / 2, y: rect.bottom, pageId, title: wikiSpan.textContent || '', isSuggestion: false });
      return;
    }

    // Suggested link (unknown proper noun)
    const suggestSpan = target.closest('span[data-wiki-suggest]') as HTMLElement | null;
    if (suggestSpan) {
      const phrase = suggestSpan.getAttribute('data-wiki-suggest') || suggestSpan.textContent || '';
      const rect = suggestSpan.getBoundingClientRect();
      setLinkPopover({ visible: true, x: rect.left + rect.width / 2, y: rect.bottom, pageId: null, title: phrase, isSuggestion: true });
      return;
    }

    // Anchor
    const anchor = target.closest('a') as HTMLAnchorElement | null;
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href?.startsWith('wiki://')) { e.preventDefault(); onNavigate(href.replace('wiki://', '')); }
    }
  }, [onNavigate]);

  // Create page from popover (wiki link or suggestion)
  const handleCreateFromPopover = useCallback((title: string, cat: WikiCategory) => {
    if (!onCreatePage || !editorRef.current) return;
    const newPage = onCreatePage(title, cat);
    // Update the span to point to the new page
    editorRef.current.querySelectorAll('span[data-wiki-suggest], span[data-wiki-ref=""]').forEach(span => {
      if (span.textContent?.toLowerCase() === title.toLowerCase()) {
        span.setAttribute('data-wiki-ref', newPage.id);
        span.removeAttribute('data-wiki-suggest');
        span.className = 'wiki-detected-link';
      }
    });
    const html = editorRef.current.innerHTML;
    lastSaved.current = html; onChange(html);
  }, [onCreatePage, onChange]);

  return (
    <div className="relative">
      <FormatToolbar visible={toolbar.visible && isGmMode} x={toolbar.x} y={toolbar.y}
        isGmMode={isGmMode} onFormat={handleFormat}
        onClose={() => setToolbar(t => ({ ...t, visible: false }))} />
      <WikiLinkPopover visible={linkPopover.visible} x={linkPopover.x} y={linkPopover.y}
        pageId={linkPopover.pageId} title={linkPopover.title} isSuggestion={linkPopover.isSuggestion}
        allPages={allPages} onNavigate={onNavigate} onCreatePage={handleCreateFromPopover}
        onClose={() => setLinkPopover(p => ({ ...p, visible: false }))} />
      <div
        ref={editorRef}
        contentEditable={isGmMode && !isTyping ? 'true' : 'false'}
        suppressContentEditableWarning
        onInput={handleInput}
        onClick={handleClick}
        onFocus={() => { isFocused.current = true; clearTimeout(detectionTimer.current); }}
        onBlur={() => {
          isFocused.current = false;
          // Save on blur
          if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            if (html !== lastSaved.current) { lastSaved.current = html; onChange(html); }
          }
          // Run detection after blur (editor no longer focused → safe)
          setTimeout(() => {
            if (editorRef.current && !isFocused.current) {
              applyWikiHighlights(editorRef.current, allPagesRef.current);
            }
          }, 150);
        }}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
        data-placeholder={placeholder}
        className={`rich-text-editor ${!isGmMode ? 'player-mode-view' : ''}`}
      />
    </div>
  );
}
