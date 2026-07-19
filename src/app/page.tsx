"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useWiki } from '../hooks/useWiki';
import Sidebar from '../components/Sidebar';
import WikiView from '../components/WikiView';
import WikiWindow from '../components/WikiWindow';
import SettingsModal from '../components/SettingsModal';
import PlayerWikiPortal from '../components/PlayerWikiPortal';
import CompendiumPortal from '../components/CompendiumPortal';
import {
  Sparkles, Eye, EyeOff, ShieldAlert, Clock,
  FileText, MapPin, User, Users, Compass, BookOpen, Calendar,
  Download, Upload, Plus, Settings, Dices, Scroll
} from 'lucide-react';
import { WikiPage, WikiCategory, WikiWindowState } from '../types';

// Default window sizes
const DEFAULT_W = 680;
const DEFAULT_H = 560;

const isRuleCategory = (cat: string) => ['regle', 'arme', 'classe', 'sous-classe', 'sort', 'composant'].includes(cat);

type ActiveTab = 'dashboard' | 'world' | 'rules' | 'wiki' | 'solo';

function cascadePosition(count: number, viewW: number, viewH: number): { x: number; y: number } {
  const offset = (count % 8) * 28;
  const x = Math.max(20, Math.min(offset + 60, viewW - DEFAULT_W - 20));
  const y = Math.max(20, Math.min(offset + 30, viewH - DEFAULT_H - 20));
  return { x, y };
}

const renderDieSvg = (sides: number) => {
  if (sides === 4) {
    // D4: Triangle
    return <polygon points="50,12 90,82 10,82" className="fill-amber-700/90 stroke-gold-450 stroke-[3]" />;
  }
  if (sides === 6) {
    // D6: Square
    return <rect x="15" y="15" width="70" height="70" rx="10" className="fill-amber-700/90 stroke-gold-450 stroke-[3]" />;
  }
  if (sides === 8) {
    // D8: Octahedron (Diamond)
    return <polygon points="50,10 85,50 50,90 15,50" className="fill-amber-700/90 stroke-gold-450 stroke-[3]" />;
  }
  if (sides === 10) {
    // D10: Deltoid
    return <polygon points="50,10 85,35 50,90 15,35" className="fill-amber-700/90 stroke-gold-450 stroke-[3]" />;
  }
  if (sides === 12) {
    // D12: Pentagon
    return <polygon points="50,10 85,35 72,80 28,80 15,35" className="fill-amber-700/90 stroke-gold-450 stroke-[3]" />;
  }
  // D20 (or default): Hexagon
  return <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" className="fill-amber-700/90 stroke-gold-500 stroke-[3]" />;
};

const getDieTextY = (sides: number) => {
  if (sides === 4) return 60;
  if (sides === 6) return 50;
  if (sides === 8) return 50;
  if (sides === 10) return 46;
  if (sides === 12) return 48;
  return 50;
};

export default function Home() {
  const {
    pages, isLoaded, addPage, updatePage, deletePage,
    addBlock, updateBlock, deleteBlock, moveBlock,
    createPageFromSelection, addRelation, removeRelation,
    customCategories, addCustomCategory, deleteCustomCategory,
    setAllPages, getPageHistory, rollbackPageToVersion, undoPageChange, resetToDefault
  } = useWiki();

  const [openHistoryPageIds, setOpenHistoryPageIds] = useState<string[]>([]);

  const toggleHistoryPageId = useCallback((pageId: string) => {
    setOpenHistoryPageIds(prev =>
      prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
    );
  }, []);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [worldWindows, setWorldWindows] = useState<WikiWindowState[]>([]);
  const [rulesWindows, setRulesWindows] = useState<WikiWindowState[]>([]);
  const [maxZ, setMaxZ] = useState(100);
  const [isGmMode, setIsGmMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('default');
  const workspaceRef = React.useRef<HTMLDivElement>(null);

  const [rollHistory, setRollHistory] = useState<{ id: string; characterName: string; label: string; details: string; result: string | number; type: string; time: string }[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [hasNewRolls, setHasNewRolls] = useState(false);
  const [diceAnim, setDiceAnim] = useState<{
    active: boolean;
    characterName: string;
    label: string;
    formula: string;
    type: string;
    count: number;
    sides: number;
    tempResults: number[];
    finalRolls: number[];
    finalResult: number | string;
  } | null>(null);

  const pushToHistory = useCallback((characterName: string, label: string, details: string, type: string, result: string | number) => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setRollHistory(prev => [
      ...prev,
      { id: Math.random().toString(), characterName, label, details, result, type, time }
    ]);
    setHasNewRolls(true);
  }, []);

  const playDiceRollAnimation = useCallback((characterName: string, label: string, formula: string, details: string, type: string, finalResult: number | string) => {
    // 1. Parse count and sides from the formula (e.g. "2d6 + 3", "d20", "1d4")
    let count = 1;
    let sides = 20;
    const match = formula.match(/([1-9]\d*)d([1-9]\d*)/i) || formula.match(/d([1-9]\d*)/i);
    if (match) {
      if (match[1] && match[2]) {
        count = parseInt(match[1]) || 1;
        sides = parseInt(match[2]) || 20;
      } else if (match[1]) {
        count = 1;
        sides = parseInt(match[1]) || 20;
      }
    }

    // 2. Parse individual final rolls from details string
    let finalRolls: number[] = [];
    
    // Check for advantage/disadvantage rolls: "(Jet: 14, dés: 12, 14)"
    const advantageMatch = details.match(/dés:\s*([0-9\s,]+)/);
    if (advantageMatch) {
      const parts = advantageMatch[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (parts.length > 0) {
        finalRolls = parts;
        count = parts.length;
        sides = 20;
      }
    } else {
      // Check for normal details inside parenthesis: "2d6 (4+2) + 3" or "(Jet: 12)"
      const parenMatch = details.match(/\(([^)]+)\)/);
      if (parenMatch) {
        const content = parenMatch[1];
        if (content.includes('+')) {
          finalRolls = content.split('+').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        } else {
          // Check for "Jet: 14"
          const jetMatch = content.match(/Jet:\s*([1-9]\d*)/i);
          if (jetMatch) {
            finalRolls = [parseInt(jetMatch[1])];
          } else {
            // Check for raw number list, e.g. "(4)"
            const numMatch = content.match(/(\d+)/);
            if (numMatch) {
              finalRolls = [parseInt(numMatch[1])];
            }
          }
        }
      }
    }

    // Fallback if finalRolls length does not match count or parsing fails
    if (finalRolls.length !== count) {
      if (count === 1) {
        const numVal = typeof finalResult === 'number' ? finalResult : parseInt(String(finalResult));
        let rawGuess = !isNaN(numVal) ? numVal : 10;
        const modMatch = formula.match(/[-+]\s*(\d+)/);
        if (modMatch) {
          const modVal = parseInt(modMatch[1]);
          const isMinus = formula.includes('-');
          rawGuess = isMinus ? rawGuess + modVal : rawGuess - modVal;
        }
        finalRolls = [Math.max(1, Math.min(sides, rawGuess))];
      } else {
        // Generate random final rolls that sum roughly to the result
        const numVal = typeof finalResult === 'number' ? finalResult : parseInt(String(finalResult)) || 10;
        let sum = 0;
        finalRolls = [];
        for (let i = 0; i < count; i++) {
          const r = Math.floor(Math.random() * sides) + 1;
          finalRolls.push(r);
          sum += r;
        }
      }
    }

    setDiceAnim({
      active: true,
      characterName,
      label,
      formula,
      type,
      count,
      sides,
      tempResults: Array(count).fill(1).map(() => Math.floor(Math.random() * sides) + 1),
      finalRolls,
      finalResult
    });

    let counter = 0;
    const interval = setInterval(() => {
      setDiceAnim(prev => {
        if (!prev) return null;
        return {
          ...prev,
          tempResults: Array(prev.count).fill(1).map(() => Math.floor(Math.random() * prev.sides) + 1)
        };
      });
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setDiceAnim(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tempResults: prev.finalRolls
          };
        });
        setTimeout(() => {
          setDiceAnim(null);
          pushToHistory(characterName, label, details, type, finalResult);
        }, 650);
      }
    }, 70);
  }, [pushToHistory]);

  useEffect(() => {
    const handleRollEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setIsHistoryOpen(true);
        setHasNewRolls(false);
        playDiceRollAnimation(
          detail.characterName || 'Personnage',
          detail.label,
          detail.formula,
          detail.details,
          detail.type,
          detail.finalResult
        );
      }
    };
    window.addEventListener('dnd-roll', handleRollEvent);
    return () => window.removeEventListener('dnd-roll', handleRollEvent);
  }, [playDiceRollAnimation]);

  const logsEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHistoryOpen) {
      setTimeout(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [rollHistory, isHistoryOpen]);

  // Load and apply theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('dnd_companion_theme') || 'default';
      setTheme(storedTheme);
      const body = document.body;
      body.classList.remove('theme-default', 'theme-grimoire', 'theme-neon', 'theme-slate');
      body.classList.add(`theme-${storedTheme}`);
    }
  }, []);

  const handleChangeTheme = (nextTheme: string) => {
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dnd_companion_theme', nextTheme);
      const body = document.body;
      body.classList.remove('theme-default', 'theme-grimoire', 'theme-neon', 'theme-slate');
      body.classList.add(`theme-${nextTheme}`);
    }
  };

  // Find which page window has the highest zIndex
  const getFocusedPageId = useCallback((): string | null => {
    const windows = activeTab === 'world' ? worldWindows : activeTab === 'rules' ? rulesWindows : [];
    if (windows.length === 0) return null;
    let highestZ = -1;
    let focusedId: string | null = null;
    windows.forEach(w => {
      if (w.zIndex > highestZ) {
        highestZ = w.zIndex;
        focusedId = w.pageId;
      }
    });
    return focusedId;
  }, [worldWindows, rulesWindows, activeTab]);

  // Global Ctrl+Z (Undo) event listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        const activeEl = document.activeElement;
        const isEditingText = activeEl && (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.hasAttribute('contenteditable') ||
          activeEl.getAttribute('contenteditable') === 'true'
        );
        
        if (!isEditingText) {
          const pageId = getFocusedPageId();
          if (pageId) {
            e.preventDefault();
            undoPageChange(pageId);
          }
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [getFocusedPageId, undoPageChange]);

  // Clock
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  // Open first page on load
  useEffect(() => {
    if (isLoaded && pages.length > 0 && worldWindows.length === 0) {
      const first = pages.find(p => p.title === 'Eldoria') || pages[0];
      if (first && first.category !== 'regle') {
        openWindowInTab('world', first.id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Window manager helper
  const openWindowInTab = useCallback((tab: 'world' | 'rules', pageId: string) => {
    const setWindows = tab === 'world' ? setWorldWindows : setRulesWindows;
    setWindows(prev => {
      const existing = prev.find(w => w.pageId === pageId);
      if (existing) {
        const newZ = maxZ + 1;
        setMaxZ(newZ);
        return prev.map(w => w.pageId === pageId ? { ...w, zIndex: newZ } : w);
      }
      const viewW = workspaceRef.current?.clientWidth || window.innerWidth - 240;
      const viewH = workspaceRef.current?.clientHeight || window.innerHeight - 56;
      const pos = cascadePosition(prev.length, viewW, viewH);
      const newZ = maxZ + 1;
      setMaxZ(newZ);
      return [...prev, {
        pageId,
        x: pos.x, y: pos.y,
        width: DEFAULT_W, height: DEFAULT_H,
        zIndex: newZ,
      }];
    });
    setActiveTab(tab);
  }, [maxZ]);

  const closeWindowInTab = useCallback((tab: 'world' | 'rules', pageId: string) => {
    const setWindows = tab === 'world' ? setWorldWindows : setRulesWindows;
    setWindows(prev => prev.filter(w => w.pageId !== pageId));
  }, []);

  const focusWindowInTab = useCallback((tab: 'world' | 'rules', pageId: string) => {
    const setWindows = tab === 'world' ? setWorldWindows : setRulesWindows;
    setMaxZ(z => {
      const newZ = z + 1;
      setWindows(prev => prev.map(w => w.pageId === pageId ? { ...w, zIndex: newZ } : w));
      return newZ;
    });
  }, []);

  const updateWindowInTab = useCallback((tab: 'world' | 'rules', pageId: string, updates: Partial<WikiWindowState>) => {
    const setWindows = tab === 'world' ? setWorldWindows : setRulesWindows;
    setWindows(prev => prev.map(w => w.pageId === pageId ? { ...w, ...updates } : w));
  }, []);

  // Handle sidebar selection based on category
  const handleSelectSidebarPage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    if (isRuleCategory(page.category)) {
      openWindowInTab('rules', pageId);
    } else {
      openWindowInTab('world', pageId);
    }
  };

  // Create page
  const handleCreateNewPage = (category: WikiCategory, title?: string) => {
    const t = title || `Nouveau ${category}`;
    const newPage = addPage({
      title: t.trim(),
      category,
      aliases: [],
      tags: [],
      relations: [],
      isSecret: false,
    });
    if (isRuleCategory(category)) {
      openWindowInTab('rules', newPage.id);
    } else {
      openWindowInTab('world', newPage.id);
    }
  };

  const handleDeletePage = (id: string) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    deletePage(id);
    if (isRuleCategory(page.category)) {
      closeWindowInTab('rules', id);
    } else {
      closeWindowInTab('world', id);
    }
  };

  // ── Import / Export RULES specifically
  const handleExportRules = () => {
    try {
      const rules = pages.filter(p => isRuleCategory(p.category));
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rules, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `regles-dnd-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Erreur lors de l'export des règles : " + e);
    }
  };

  const handleImportRules = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          // Merge imported rules (overwrite matching IDs or add new ones)
          const nonRules = pages.filter(p => p.category !== 'regle' && p.category !== 'arme');
          const merged = [...nonRules, ...imported];
          setAllPages(merged);
          alert("Base de règles importée et fusionnée avec succès !");
        } else {
          alert("Format invalide. Le fichier doit contenir un tableau d'articles de règles.");
        }
      } catch (err) {
        alert("Erreur de lecture du JSON de règles : " + err);
      }
    };
    reader.readAsText(file);
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

  // Active windows based on tab
  const activeWindows = activeTab === 'world' ? worldWindows : activeTab === 'rules' ? rulesWindows : [];

  return (
    <main className="flex h-screen w-screen overflow-hidden relative select-none">
      <div className="app-bg" />

      {/* Sidebar - render only if World or Rules tab is active */}
      {(activeTab === 'world' || activeTab === 'rules') && (
        <Sidebar
          pages={pages}
          selectedPageId={activeWindows.length > 0 ? activeWindows[activeWindows.length - 1]?.pageId : null}
          onSelectPage={handleSelectSidebarPage}
          onCreateNewPage={handleCreateNewPage}
          isGmMode={isGmMode}
          activeTab={activeTab}
          customCategories={customCategories}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onUpdatePageProperties={updatePage}
        />
      )}

      {/* Workspace Area */}
      <div className="flex-1 h-full flex flex-col overflow-hidden relative">

        {/* Top Header Navigation */}
        <header className="h-14 px-6 flex items-center justify-between z-20 pointer-events-auto shrink-0 bg-black/10 border-b border-slate-900/40">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${isGmMode ? 'bg-purple-950/40 text-purple-400 border border-purple-900/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'}`}>
              Mode {isGmMode ? 'Maître du Jeu' : 'Joueur'}
            </span>
          </div>

          {/* Core Menu Tabs */}
          <div className="flex items-center bg-black/45 border border-slate-900/60 rounded-full p-1 text-xs shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-full font-medium transition cursor-pointer ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Tableau de bord
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={() => {
                setActiveTab('world');
                const nonRule = pages.find(p => !isRuleCategory(p.category));
                if (nonRule && worldWindows.length === 0) openWindowInTab('world', nonRule.id);
              }}
              className={`px-4 py-1.5 rounded-full font-medium transition cursor-pointer ${activeTab === 'world' ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Monde
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={() => {
                setActiveTab('rules');
                const rule = pages.find(p => isRuleCategory(p.category));
                if (rule && rulesWindows.length === 0) openWindowInTab('rules', rule.id);
              }}
              className={`px-4 py-1.5 rounded-full font-medium transition cursor-pointer ${activeTab === 'rules' ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Règles
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={() => setActiveTab('wiki')}
              className={`px-4 py-1.5 rounded-full font-medium transition cursor-pointer ${activeTab === 'wiki' ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Wiki (Joueur)
            </button>
            <span className="text-slate-800">|</span>
            <button
              disabled
              className="px-4 py-1.5 rounded-full font-medium text-slate-700 cursor-not-allowed opacity-50"
            >
              Solo (Bientôt)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGmMode(!isGmMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${isGmMode ? 'bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-900/40' : 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'}`}
            >
              {isGmMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isGmMode ? "Mode Joueur" : "Mode MJ"}</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-black/35 rounded-full border border-slate-900/40 text-slate-400 hover:text-gold-400 transition cursor-pointer"
              title="Configuration globale"
            >
              <Settings className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-black/35 px-3 py-1.5 rounded-full border border-slate-900/40 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentTime}</span>
            </div>
          </div>
        </header>

        {/* Dynamic workspace wrapper based on activeTab */}
        <div ref={workspaceRef} className="wiki-workspace flex-1 relative">

          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-0 overflow-y-auto">
              <div className="max-w-xl flex flex-col items-center gap-8 py-8">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-500">Campagne active</span>
                  <h2 className="text-3xl font-extrabold tracking-tight font-display text-white mt-1">Tableau de Bord MJ</h2>
                </div>
                
                {/* 5 columns grid without rules card */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full max-w-2xl">
                  {[
                    { label: 'Fiche PNJ', cat: 'personnage' as WikiCategory, icon: <User className="w-5 h-5 text-amber-400" /> },
                    { label: 'Carte & Lieu', cat: 'lieu' as WikiCategory, icon: <MapPin className="w-5 h-5 text-emerald-400" /> },
                    { label: 'Factions', cat: 'faction' as WikiCategory, icon: <Users className="w-5 h-5 text-cyan-400" /> },
                    { label: 'Graphe Intrigue', cat: 'intrigue' as WikiCategory, icon: <Compass className="w-5 h-5 text-purple-400" /> },
                    { label: 'Articles', cat: 'autre' as WikiCategory, icon: <Calendar className="w-5 h-5 text-slate-400" /> },
                  ].map(({ label, cat, icon }) => (
                    <button
                      key={cat}
                      onClick={() => handleCreateNewPage(cat)}
                      className="glass-panel p-4 rounded-xl flex flex-col items-center gap-3 border-slate-800 hover:bg-white/5 transition duration-300 group cursor-pointer"
                    >
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition duration-300">
                        {icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-300 font-display">{label}</span>
                    </button>
                  ))}
                </div>
                <div className="text-slate-650 text-xs flex items-center justify-center gap-1.5 mt-2 bg-black/25 px-4 py-2 rounded-full border border-slate-900/40">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Créez et organisez vos PNJ, géographie et quêtes ici. Le livre des règles a son onglet dédié.</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. RULES DASHBOARD (when rules windows empty) */}
          {activeTab === 'rules' && rulesWindows.length === 0 && (
            <CompendiumPortal
              pages={pages}
              onOpenPage={(id) => openWindowInTab('rules', id)}
              isGmMode={isGmMode}
              onExportRules={handleExportRules}
              onImportRules={handleImportRules}
            />
          )}

          {/* 3. WIKI PLAYER PORTAL VIEW */}
          {activeTab === 'wiki' && (
            <PlayerWikiPortal
              pages={pages}
              customCategories={customCategories}
              isGmMode={isGmMode}
              onNavigateToArticle={(id) => {
                setActiveTab('world');
                openWindowInTab('world', id);
              }}
            />
          )}

          {/* Render Active Tab's windows */}
          {(activeTab === 'world' || activeTab === 'rules') && activeWindows.map(win => {
            const page = pages.find(p => p.id === win.pageId);
            if (!page) return null;
            if (!isGmMode && page.isSecret) return null;
            const isFocused = win.zIndex === Math.max(...activeWindows.map(w => w.zIndex));
            const tab = activeTab as 'world' | 'rules';

            return (
              <WikiWindow
                key={win.pageId}
                win={win}
                title={page.title}
                category={page.category}
                allPages={pages}
                bannerImage={page.bannerImage}
                isFocused={isFocused}
                onFocus={() => focusWindowInTab(tab, win.pageId)}
                onClose={() => closeWindowInTab(tab, win.pageId)}
                onUpdate={updates => updateWindowInTab(tab, win.pageId, updates)}
                onOpenHistory={() => toggleHistoryPageId(page.id)}
              >
                <WikiView
                  page={page}
                  allPages={pages}
                  isGmMode={isGmMode}
                  onNavigate={(id) => handleSelectSidebarPage(id)}
                  onUpdatePageProperties={(id, updates) => updatePage(id, updates)}
                  onDeletePage={handleDeletePage}
                  onAddBlock={addBlock}
                  onUpdateBlock={(pageId, blockId, content, title, isSecret) =>
                    updateBlock(pageId, blockId, { content, title, isSecret })
                  }
                  onDeleteBlock={deleteBlock}
                  onMoveBlock={moveBlock}
                  onCreatePageFromSelection={(title, category) => {
                    const np = createPageFromSelection(title, category);
                    if (isRuleCategory(category)) {
                      openWindowInTab('rules', np.id);
                    } else {
                      openWindowInTab('world', np.id);
                    }
                    return np;
                  }}
                  onAddRelation={(type, targetPageId) => addRelation(win.pageId, type, targetPageId)}
                  onRemoveRelation={(relId) => removeRelation(win.pageId, relId)}
                  showHistory={openHistoryPageIds.includes(page.id)}
                  onCloseHistory={() => toggleHistoryPageId(page.id)}
                  getPageHistory={getPageHistory}
                  onRollbackPage={rollbackPageToVersion}
                />
              </WikiWindow>
            );
          })}

        </div>
      </div>

      {/* Global Config Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onChangeTheme={handleChangeTheme}
        pages={pages}
        onImportCampaign={(parsedPages) => {
          setAllPages(parsedPages);
          // clear windows since databases have updated
          setWorldWindows([]);
          setRulesWindows([]);
        }}
        customCategories={customCategories}
        onAddCustomCategory={addCustomCategory}
        onDeleteCustomCategory={deleteCustomCategory}
        onResetToDefault={() => {
          resetToDefault();
          setWorldWindows([]);
          setRulesWindows([]);
        }}
      />

      {/* Collapsible Dice Log History (Baldur's Gate 3 log style) */}
      <div className="fixed bottom-4 right-4 z-50 font-sans">
        {!isHistoryOpen ? (
          <button
            type="button"
            onClick={() => {
              setIsHistoryOpen(true);
              setHasNewRolls(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gold-600 hover:bg-gold-500 text-dark-950 font-black shadow-lg shadow-gold-500/10 border border-gold-450 transition cursor-pointer relative"
          >
            <Dices className="w-4 h-4" />
            <span>Logs de Jets</span>
            {hasNewRolls && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        ) : (
          <div className="w-80 h-96 rounded-2xl bg-[#0b0704]/95 border border-gold-500/30 shadow-2xl flex flex-col overflow-hidden relative animate-in slide-in-from-bottom duration-250">
            <div className="px-4 py-3 bg-[#160d06] border-b border-gold-500/20 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-gold-450 font-bold text-xs uppercase tracking-wider">
                <Scroll className="w-3.5 h-3.5" />
                <span>Historique des Jets</span>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {diceAnim && diceAnim.active ? (
              /* Fullscreen Dice Roll Animation Inside Drawer */
              <div className="absolute inset-0 bg-[#0d0704] z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-200">
                <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider block">
                  🎲 {diceAnim.characterName} lance...
                </span>
                <span className="text-xs font-extrabold text-slate-200 block leading-tight">{diceAnim.label}</span>
                <span className="text-[9px] text-slate-550 block font-mono">{diceAnim.formula}</span>
                
                {/* Dice container */}
                <div className="flex items-center justify-center gap-4 py-3 flex-wrap max-w-full">
                  {diceAnim.tempResults.map((val, idx) => (
                    <div
                      key={idx}
                      className="relative w-14 h-14 animate-bounce"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                        {renderDieSvg(diceAnim.sides)}
                        <text
                          x="50"
                          y={getDieTextY(diceAnim.sides)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white font-mono text-3xl font-black select-none"
                        >
                          {val}
                        </text>
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black animate-pulse pt-2">Lancement en cours...</div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {rollHistory.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-600 text-xs font-medium italic">
                    Aucun jet enregistré.
                  </div>
                ) : (
                  rollHistory.map(roll => (
                    <div key={roll.id} className="p-2.5 rounded-lg bg-white/2 border border-slate-900 text-xs space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[9px] text-slate-550 font-black uppercase tracking-wider">{roll.characterName}</span>
                        <span className="text-[9px] text-slate-555">{roll.time}</span>
                      </div>
                      <strong className="text-amber-400 font-bold block mt-0.5">{roll.label}</strong>
                      <div className="text-[10.5px] text-slate-400 leading-normal">{roll.details}</div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-1">
                        <span className="text-[9px] text-slate-550 uppercase font-black">{roll.type}</span>
                        <strong className="text-sm text-white font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          {roll.result}
                        </strong>
                      </div>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
