'use client';
import React, { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, Scroll, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { WikiPage, SpellBlockData, ClassBlockData, SpeciesBlockData, OriginBlockData } from '../types';

interface CompendiumPortalProps {
  pages: WikiPage[];
  onOpenPage: (pageId: string) => void;
  isGmMode: boolean;
  onExportRules?: () => void;
  onImportRules?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type CompendiumFilter = 'all' | 'spells' | 'classes' | 'species' | 'origins' | 'rules';

export default function CompendiumPortal({
  pages, onOpenPage, isGmMode, onExportRules, onImportRules
}: CompendiumPortalProps) {
  const [activeFilter, setActiveFilter] = useState<CompendiumFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpellLevel, setSelectedSpellLevel] = useState<string>('all');

  const rulesPages = useMemo(() => {
    return pages.filter(p => (p.category === 'regle' || p.category === 'arme') && (isGmMode || !p.isSecret));
  }, [pages, isGmMode]);

  // Filter & Search
  const filteredPages = useMemo(() => {
    return rulesPages.filter(p => {
      // Category filter
      if (activeFilter === 'spells') {
        const isSpell = p.id.startsWith('spell-') || p.tags.some(t => t.toLowerCase() === 'sorts' || t.toLowerCase() === 'sort');
        if (!isSpell) return false;
      } else if (activeFilter === 'classes') {
        const isClass = p.id.startsWith('class-') || p.tags.some(t => t.toLowerCase() === 'classes' || t.toLowerCase() === 'classe');
        if (!isClass) return false;
      } else if (activeFilter === 'species') {
        const isSpecies = p.id.startsWith('species-') || p.tags.some(t => t.toLowerCase() === 'espèces' || t.toLowerCase() === 'espèce' || t.toLowerCase() === 'race');
        if (!isSpecies) return false;
      } else if (activeFilter === 'origins') {
        const isOrigin = p.id.startsWith('origin-') || p.tags.some(t => t.toLowerCase() === 'origines' || t.toLowerCase() === 'origine' || t.toLowerCase() === 'background');
        if (!isOrigin) return false;
      } else if (activeFilter === 'rules') {
        const isCombat = p.id.startsWith('rule-') || p.tags.some(t => t.toLowerCase() === 'règles' || t.toLowerCase() === 'conditions' || t.toLowerCase() === 'règle');
        if (!isCombat) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesAliases = p.aliases.some(a => a.toLowerCase().includes(q));
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        
        // Search inside block contents
        const matchesBlocks = p.blocks.some(b => {
          if (b.type === 'text') return b.content.toLowerCase().includes(q);
          try {
            const parsed = JSON.parse(b.content);
            return (parsed.description || '').toLowerCase().includes(q) || 
                   (parsed.damageOrEffect || '').toLowerCase().includes(q);
          } catch {
            return b.content.toLowerCase().includes(q);
          }
        });

        if (!matchesTitle && !matchesAliases && !matchesTags && !matchesBlocks) return false;
      }

      // Spell level sub-filter
      if (activeFilter === 'spells' && selectedSpellLevel !== 'all') {
        const spellBlock = p.blocks.find(b => b.type === 'spell');
        if (spellBlock) {
          try {
            const spellData = JSON.parse(spellBlock.content);
            if (String(spellData.level) !== selectedSpellLevel) return false;
          } catch {
            return false;
          }
        } else {
          return false;
        }
      }

      return true;
    });
  }, [rulesPages, activeFilter, searchQuery, selectedSpellLevel]);

  // School Colors Helper
  const getSchoolColor = (school: string) => {
    const colors: Record<string, string> = {
      'Abjuration': 'text-sky-400 border-sky-500/20 bg-sky-500/5',
      'Transmutation': 'text-orange-400 border-orange-500/20 bg-orange-500/5',
      'Conjuration': 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
      'Divination': 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
      'Enchantement': 'text-pink-400 border-pink-500/20 bg-pink-500/5',
      'Évocation': 'text-red-400 border-red-500/20 bg-red-500/5',
      'Illusion': 'text-purple-400 border-purple-500/20 bg-purple-500/5',
      'Nécromancie': 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
    };
    return colors[school] || 'text-slate-400 border-slate-800 bg-slate-900/40';
  };

  // Card Content Renderer
  const RuleCard = ({ page }: { page: WikiPage }) => {
    // Detect type
    const spellBlock = page.blocks.find(b => b.type === 'spell');
    const classBlock = page.blocks.find(b => b.type === 'class');
    const speciesBlock = page.blocks.find(b => b.type === 'species');
    const originBlock = page.blocks.find(b => b.type === 'origin');
    const weaponBlock = page.blocks.find(b => b.type === 'weapon');
    const equipmentBlock = page.blocks.find(b => b.type === 'equipment');

    let subBadge = '';
    let detailsStr = '';
    let previewDesc = '';
    let glowClass = 'hover:border-slate-700/50 hover:shadow-slate-500/5';

    if (spellBlock) {
      try {
        const d: SpellBlockData = JSON.parse(spellBlock.content);
        subBadge = d.school;
        detailsStr = `Niv. ${d.level} · ${d.castingTime} · ${d.range}`;
        previewDesc = d.description;
        const colors: Record<string, string> = {
          'Abjuration': 'hover:border-sky-500/30 hover:shadow-sky-500/10',
          'Transmutation': 'hover:border-orange-500/30 hover:shadow-orange-500/10',
          'Conjuration': 'hover:border-cyan-500/30 hover:shadow-cyan-500/10',
          'Divination': 'hover:border-yellow-500/30 hover:shadow-yellow-500/10',
          'Enchantement': 'hover:border-pink-500/30 hover:shadow-pink-500/10',
          'Évocation': 'hover:border-red-500/30 hover:shadow-red-500/10',
          'Illusion': 'hover:border-purple-500/30 hover:shadow-purple-500/10',
          'Nécromancie': 'hover:border-emerald-500/30 hover:shadow-emerald-500/10'
        };
        glowClass = colors[d.school] || glowClass;
      } catch {}
    } else if (weaponBlock) {
      try {
        const d = JSON.parse(weaponBlock.content);
        subBadge = `Arme`;
        detailsStr = `Dégâts: ${d.damage} ${d.damageType} · ${d.mastery || 'Pas de maîtrise'}`;
        previewDesc = d.description;
        glowClass = 'hover:border-amber-600/30 hover:shadow-amber-600/10';
      } catch {}
    } else if (equipmentBlock) {
      try {
        const d = JSON.parse(equipmentBlock.content);
        const typeLabels = { light: 'Légère', medium: 'Moyenne', heavy: 'Lourde', shield: 'Bouclier', other: 'Équip.' };
        subBadge = typeLabels[d.armorType as keyof typeof typeLabels] || 'Équip.';
        detailsStr = d.armorType === 'shield' ? `CA: +${d.shieldBonus}` : d.ac > 0 ? `CA: ${d.ac}` : `Poids: ${d.weight}kg`;
        previewDesc = d.description;
        glowClass = 'hover:border-blue-500/30 hover:shadow-blue-500/10';
      } catch {}
    } else if (classBlock) {
      try {
        const d: ClassBlockData = JSON.parse(classBlock.content);
        subBadge = `DV: ${d.hitDie}`;
        detailsStr = `Carac. Clés: ${d.primaryAbilities.join(' / ')}`;
        previewDesc = d.description;
        glowClass = 'hover:border-red-500/30 hover:shadow-red-500/10';
      } catch {}
    } else if (speciesBlock) {
      try {
        const d: SpeciesBlockData = JSON.parse(speciesBlock.content);
        subBadge = `Vitesse: ${d.speed}m`;
        detailsStr = `Taille: ${d.size} · ${d.traits.length} traits`;
        previewDesc = d.traits.length > 0 ? `${d.traits[0].name}: ${d.traits[0].description}` : '';
        glowClass = 'hover:border-emerald-500/30 hover:shadow-emerald-500/10';
      } catch {}
    } else if (originBlock) {
      try {
        const d: OriginBlockData = JSON.parse(originBlock.content);
        subBadge = 'Origine';
        detailsStr = `Boosts: ${d.abilityBoosts.join(' / ')}`;
        previewDesc = d.description;
        glowClass = 'hover:border-amber-500/30 hover:shadow-amber-500/10';
      } catch {}
    } else {
      // Normal HTML rule block
      subBadge = 'Général';
      previewDesc = page.blocks[0]?.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...';
    }

    return (
      <button
        onClick={() => onOpenPage(page.id)}
        className={`glass-panel p-4 rounded-xl border border-slate-800/40 text-left transition duration-300 flex flex-col justify-between h-40 ${glowClass} shadow-md cursor-pointer`}
      >
        <div className="w-full space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-200 truncate font-display">{page.title}</span>
            {subBadge && (
              <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                spellBlock ? getSchoolColor(subBadge) : 'text-slate-400 border-slate-800 bg-white/5'
              }`}>
                {subBadge}
              </span>
            )}
          </div>
          {detailsStr && <p className="text-[10px] font-semibold text-slate-500 tracking-wide">{detailsStr}</p>}
          <p className="text-[11px] text-slate-400 leading-normal line-clamp-3 font-serif mt-1">{previewDesc}</p>
        </div>

        <div className="w-full flex items-center justify-between border-t border-slate-900/30 pt-2 text-[9px] text-slate-600 font-bold uppercase tracking-wider">
          <span>{page.tags[0] || 'Règles'}</span>
          <span className="text-gold-500/60 hover:text-gold-400 transition">Consulter →</span>
        </div>
      </button>
    );
  };

  return (
    <div className="absolute inset-0 flex flex-col z-0 bg-dark-950/20 overflow-hidden">
      
      {/* Search and Filters Header */}
      <div className="px-8 py-6 border-b border-slate-900/40 bg-black/15 backdrop-blur-sm shrink-0 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold tracking-tight text-white font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-400" /> Compendium D&D 2024
          </h2>
          <p className="text-xs text-slate-500 font-medium">Recherchez et filtrez instantanément les règles, sorts, classes et espèces.</p>
        </div>

        {/* Action button bar */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {onExportRules && (
            <button
              onClick={onExportRules}
              className="px-3.5 py-1.5 bg-dark-900 hover:bg-dark-850 border border-slate-800 text-slate-350 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Exporter Règles
            </button>
          )}
          {onImportRules && (
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={onImportRules}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button
                className="px-3.5 py-1.5 bg-dark-900 hover:bg-dark-850 border border-slate-800 text-slate-350 text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Importer JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation tabs & Search Inputs */}
      <div className="px-8 py-3 bg-black/5 border-b border-slate-900/20 shrink-0 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'spells', label: '🪄 Sorts' },
            { id: 'classes', label: '⚔️ Classes' },
            { id: 'species', label: '🧬 Espèces' },
            { id: 'origins', label: '📜 Origines' },
            { id: 'rules', label: '🛡️ Combat' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { setActiveFilter(f.id as CompendiumFilter); setSelectedSpellLevel('all'); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeFilter === f.id 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-md shadow-red-500/3'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/3 border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          {activeFilter === 'spells' && (
            <select
              value={selectedSpellLevel}
              onChange={e => setSelectedSpellLevel(e.target.value)}
              className="bg-slate-900/60 border border-slate-900 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-slate-800 cursor-pointer"
            >
              <option value="all">Tous les niveaux</option>
              <option value="0">Tours de magie (0)</option>
              <option value="1">Niveau 1</option>
              <option value="2">Niveau 2</option>
              <option value="3">Niveau 3</option>
              <option value="5">Niveau 5</option>
              <option value="6">Niveau 6</option>
              <option value="8">Niveau 8</option>
            </select>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une règle..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-48 sm:w-60 pl-8 pr-3 py-1.5 bg-slate-900/40 border border-slate-900 focus:border-slate-800 text-slate-300 placeholder-slate-650 rounded-lg text-xs transition outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2" />
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {filteredPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-700">
            <Scroll className="w-12 h-12 text-slate-800 mb-3" />
            <p className="text-sm font-semibold">Aucune fiche de règle trouvée</p>
            <p className="text-xs text-slate-850 mt-1">Ajustez vos filtres ou créez une nouvelle fiche de règle depuis le menu latéral.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPages.map(page => (
              <RuleCard key={page.id} page={page} />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Hint Footer */}
      <div className="px-8 py-3 border-t border-slate-900/40 bg-black/10 shrink-0 flex items-center justify-center gap-1.5 text-[10px] text-slate-550 font-bold uppercase tracking-wider">
        <ShieldAlert className="w-3.5 h-3.5 text-red-500/40" />
        <span>Les règles et sorts sont organisés automatiquement en dossiers dans votre menu latéral.</span>
      </div>
    </div>
  );
}
