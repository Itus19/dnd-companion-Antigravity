'use client';
import React, { useState, useCallback } from 'react';
import {
  Trash2, ChevronUp, ChevronDown, Eye, EyeOff,
  Dices, ImageIcon, Plus, Minus, Swords, User,
  Heart, Shield, Zap, BookOpen, Scroll, Star, X
} from 'lucide-react';
import { WikiBlock, WikiPage, WikiCategory } from '../types';
import RichTextBlock from './RichTextBlock';

// ─────────────────────────────────────────────────────────────
// D&D 5e Character Generation Engine
// ─────────────────────────────────────────────────────────────

const RACES: Record<string, { bonuses: Partial<Record<string,number>>, traits: string[] }> = {
  'Humain':     { bonuses: { str:1,dex:1,con:1,int:1,wis:1,cha:1 }, traits: ['Polyvalent'] },
  'Elfe':       { bonuses: { dex:2,int:1 }, traits: ['Vision dans le noir 60ft','Sens aiguisés','Ascendance féerique','Transe'] },
  'Nain':       { bonuses: { con:2,wis:1 }, traits: ['Vision dans le noir 60ft','Résistance aux poisons','Maîtrise des armes naines','Robustesse naine'] },
  'Halfelin':   { bonuses: { dex:2,cha:1 }, traits: ['Chanceux','Courageux','Agilité halfeline'] },
  'Demi-Elfe':  { bonuses: { cha:2,dex:1,int:1 }, traits: ['Vision dans le noir 60ft','Ascendance féerique','Polyvalence'] },
  'Gnome':      { bonuses: { int:2,dex:1 }, traits: ['Vision dans le noir 60ft','Ruse gnome'] },
  'Demi-Orc':   { bonuses: { str:2,con:1 }, traits: ['Vision dans le noir 60ft','Robustesse','Attaque sauvage'] },
  'Tieffelin':  { bonuses: { cha:2,int:1 }, traits: ['Vision dans le noir 60ft','Résistance infernale'] },
};

const CLASSES: Record<string, { primary: (keyof typeof DEFAULT_STATS)[], hpDie: number, ac: string, profBonus: number }> = {
  'Guerrier':    { primary: ['str','con'], hpDie: 10, ac: '16 (Cotte de mailles)', profBonus: 2 },
  'Magicien':    { primary: ['int','dex'], hpDie: 6, ac: '12 (Armure de mage)', profBonus: 2 },
  'Voleur':      { primary: ['dex','int'], hpDie: 8, ac: '14 (Armure de cuir)', profBonus: 2 },
  'Prêtre':      { primary: ['wis','cha'], hpDie: 8, ac: '16 (Cotte de mailles)', profBonus: 2 },
  'Rôdeur':      { primary: ['dex','wis'], hpDie: 10, ac: '14 (Armure de cuir)', profBonus: 2 },
  'Barde':       { primary: ['cha','dex'], hpDie: 8, ac: '13 (Armure de cuir)', profBonus: 2 },
  'Barbare':     { primary: ['str','con'], hpDie: 12, ac: '14 (Sans armure + CON)', profBonus: 2 },
  'Paladin':     { primary: ['str','cha'], hpDie: 10, ac: '18 (Armure de plaques)', profBonus: 2 },
  'Sorcier':     { primary: ['cha','dex'], hpDie: 8, ac: '12', profBonus: 2 },
  'Paysan':      { primary: ['con','str'], hpDie: 6, ac: '10', profBonus: 1 },
};

const DEFAULT_STATS = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
type StatKey = keyof typeof DEFAULT_STATS;

function roll4d6(): number {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((a, b) => a + b, 0);
}

function generateStats(race: string, className: string): typeof DEFAULT_STATS {
  const raw = Object.keys(DEFAULT_STATS).map(() => roll4d6());
  raw.sort((a, b) => b - a);
  const keys = Object.keys(DEFAULT_STATS) as StatKey[];
  const stats: typeof DEFAULT_STATS = { ...DEFAULT_STATS };

  const classDef = CLASSES[className];
  const primaries = classDef?.primary || [];

  // Assign highest rolls to primary stats
  const orderedKeys = [...primaries, ...keys.filter(k => !primaries.includes(k))];
  orderedKeys.forEach((k, i) => { stats[k] = raw[i] || 8; });

  // Apply racial bonuses
  const raceDef = RACES[race];
  if (raceDef) {
    (Object.entries(raceDef.bonuses) as [StatKey, number][]).forEach(([k, v]) => {
      stats[k] = Math.min(20, stats[k] + v);
    });
  }
  return stats;
}

function mod(v: number): string {
  const m = Math.floor((v - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function getRaceTraits(race: string): string[] {
  return RACES[race]?.traits || [];
}

// ─────────────────────────────────────────────────────────────
// Merged Character Block (replaces both character + statblock)
// ─────────────────────────────────────────────────────────────

interface CharData {
  name: string; race: string; class: string; level: number;
  alignment: string; background: string; type: string;
  hp: string; ac: string; speed: string; profBonus: number; cr: string;
  stats: typeof DEFAULT_STATS;
  skills: string; senses: string; languages: string;
  equipment: string; backstory: string;
  actions: { name: string; desc: string }[];
  traits: string[];
}

const EMPTY_CHAR: CharData = {
  name: '', race: 'Humain', class: 'Guerrier', level: 1,
  alignment: 'Neutre', background: '', type: '',
  hp: '10', ac: '10', speed: '30 ft.', profBonus: 2, cr: '',
  stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skills: '', senses: 'Perception passive 10', languages: 'Commun',
  equipment: '', backstory: '',
  actions: [{ name: 'Attaque', desc: 'Attaque de corps à corps.' }],
  traits: [],
};

const STAT_LABELS: { key: StatKey; label: string }[] = [
  { key: 'str', label: 'FOR' }, { key: 'dex', label: 'DEX' }, { key: 'con', label: 'CON' },
  { key: 'int', label: 'INT' }, { key: 'wis', label: 'SAG' }, { key: 'cha', label: 'CHA' },
];

function CharacterBlockView({ data, isEditing, isGmMode, onChange }: {
  data: CharData; isEditing: boolean; isGmMode: boolean;
  onChange: (d: CharData) => void;
}) {
  const [newAction, setNewAction] = useState({ name: '', desc: '' });
  const [newTrait, setNewTrait] = useState('');

  const set = (key: keyof CharData, value: unknown) => onChange({ ...data, [key]: value });
  const setStat = (k: StatKey, v: number) => onChange({ ...data, stats: { ...data.stats, [k]: v } });
  const setAction = (i: number, field: 'name' | 'desc', v: string) => {
    const actions = [...data.actions];
    actions[i] = { ...actions[i], [field]: v };
    onChange({ ...data, actions });
  };
  const removeAction = (i: number) => onChange({ ...data, actions: data.actions.filter((_, j) => j !== i) });
  const addAction = () => {
    if (!newAction.name.trim()) return;
    onChange({ ...data, actions: [...data.actions, { ...newAction }] });
    setNewAction({ name: '', desc: '' });
  };
  const removeTrait = (i: number) => onChange({ ...data, traits: data.traits.filter((_, j) => j !== i) });
  const addTrait = () => {
    if (!newTrait.trim()) return;
    onChange({ ...data, traits: [...data.traits, newTrait.trim()] });
    setNewTrait('');
  };
  const handleGenerate = () => {
    const stats = generateStats(data.race, data.class);
    const classDef = CLASSES[data.class];
    const conMod = Math.floor((stats.con - 10) / 2);
    const hpRoll = (classDef?.hpDie || 8) + conMod;
    const traits = getRaceTraits(data.race);
    onChange({
      ...data, stats,
      hp: `${hpRoll + (hpRoll)} (2d${classDef?.hpDie} + ${conMod * 2})`,
      ac: classDef?.ac || '10',
      profBonus: classDef?.profBonus || 2,
      traits,
    });
  };

  if (!isEditing) {
    // ── Read view ──
    return (
      <div className="dnd-stat-block rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-[#1a0f05] to-[#120a03]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center shadow-lg shrink-0">
              <User className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-amber-100 leading-tight">{data.name || 'Personnage'}</h3>
              <p className="text-xs text-amber-700/80 mt-0.5">{[data.type || `${data.race} · ${data.class}`, data.level > 0 ? `Niveau ${data.level}` : '', data.alignment].filter(Boolean).join(' — ')}</p>
            </div>
            {data.level > 0 && (
              <div className="ml-auto text-center">
                <div className="text-lg font-black text-amber-400">{data.level}</div>
                <div className="text-[9px] text-amber-700 uppercase tracking-widest">Niveau</div>
              </div>
            )}
          </div>
          {/* Combat stats bar */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-amber-900/40">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-400"><Heart className="w-3 h-3" /><span className="text-sm font-bold text-red-300">{data.hp}</span></div>
              <div className="text-[9px] text-amber-700 uppercase tracking-wider mt-0.5">Points de vie</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400"><Shield className="w-3 h-3" /><span className="text-sm font-bold text-blue-300">{data.ac}</span></div>
              <div className="text-[9px] text-amber-700 uppercase tracking-wider mt-0.5">Classe d'Armure</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-400"><Zap className="w-3 h-3" /><span className="text-sm font-bold text-green-300">+{data.profBonus}</span></div>
              <div className="text-[9px] text-amber-700 uppercase tracking-wider mt-0.5">Maîtrise</div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="dnd-divider" />
        <div className="grid grid-cols-6 px-3 py-2.5 bg-[#0f0803]">
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key} className="text-center">
              <div className="text-[10px] font-bold text-amber-700 uppercase">{label}</div>
              <div className="text-base font-black text-amber-200">{data.stats[key]}</div>
              <div className="text-xs font-semibold text-amber-500">{mod(data.stats[key])}</div>
            </div>
          ))}
        </div>
        <div className="dnd-divider" />

        {/* Details */}
        <div className="px-4 py-2.5 text-[11px] text-amber-200/80 space-y-1 bg-[#100805]">
          <div className="flex gap-1"><span className="dnd-stat-label">Vitesse</span> {data.speed}</div>
          {data.skills && <div className="flex gap-1"><span className="dnd-stat-label">Compétences</span> {data.skills}</div>}
          {data.senses && <div className="flex gap-1"><span className="dnd-stat-label">Sens</span> {data.senses}</div>}
          {data.languages && <div className="flex gap-1"><span className="dnd-stat-label">Langues</span> {data.languages}</div>}
          {data.cr && <div className="flex gap-1"><span className="dnd-stat-label">Facteur de Puissance</span> {data.cr}</div>}
        </div>

        {/* Traits */}
        {data.traits.length > 0 && (
          <>
            <div className="dnd-divider" />
            <div className="px-4 py-2.5 bg-[#0f0803]">
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-600 mb-1.5">Traits Raciaux</div>
              <div className="flex flex-wrap gap-1">
                {data.traits.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/30 border border-amber-800/30 text-amber-300">{t}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        {data.actions.length > 0 && (
          <>
            <div className="dnd-divider" />
            <div className="px-4 py-2.5 bg-[#0f0803]">
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-600 mb-1.5 flex items-center gap-1.5">
                <Swords className="w-3 h-3" /> Actions
              </div>
              <div className="space-y-2">
                {data.actions.map((a, i) => (
                  <div key={i} className="text-[11px] text-amber-200/80">
                    <span className="font-bold italic text-amber-300">{a.name}.</span>{' '}{a.desc}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Equipment + Backstory */}
        {(data.equipment || data.backstory) && (
          <>
            <div className="dnd-divider" />
            <div className="px-4 py-2.5 text-[11px] text-amber-200/80 space-y-1 bg-[#100805]">
              {data.equipment && <div><span className="dnd-stat-label">Équipement</span><span className="ml-1">{data.equipment}</span></div>}
              {data.backstory && <div className="mt-1.5"><span className="dnd-stat-label">Histoire :</span><span className="ml-1 italic">{data.backstory}</span></div>}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Edit view (form) ──
  const inputCls = "w-full bg-dark-900/80 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-gold-500/50 placeholder-slate-600";
  const labelCls = "block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1";

  return (
    <div className="space-y-4 text-xs">
      {/* Generate button */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gold-500/8 border border-gold-500/15">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Race</label>
            <select value={data.race} onChange={e => set('race', e.target.value)} className={inputCls + ' cursor-pointer'}>
              {Object.keys(RACES).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Classe</label>
            <select value={data.class} onChange={e => set('class', e.target.value)} className={inputCls + ' cursor-pointer'}>
              {Object.keys(CLASSES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-dark-950 text-xs font-black rounded-xl transition cursor-pointer shadow-lg shadow-gold-500/20 shrink-0"
        >
          <Dices className="w-3.5 h-3.5" /> Générer
        </button>
      </div>

      {/* Identity */}
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className={labelCls}>Nom</label>
          <input value={data.name} onChange={e => set('name', e.target.value)} placeholder="Nom du personnage" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Niveau</label>
          <input type="number" min="0" max="20" value={data.level} onChange={e => set('level', parseInt(e.target.value) || 0)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Alignement</label>
          <input value={data.alignment} onChange={e => set('alignment', e.target.value)} placeholder="Loyal Bon" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Historique</label>
          <input value={data.background} onChange={e => set('background', e.target.value)} placeholder="Artisan, Soldat..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Type (statblock)</label>
          <input value={data.type} onChange={e => set('type', e.target.value)} placeholder="Moyen humanoïde..." className={inputCls} />
        </div>
      </div>

      {/* Combat */}
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-2"><label className={labelCls}>Points de Vie</label><input value={data.hp} onChange={e => set('hp', e.target.value)} placeholder="45 (6d8+18)" className={inputCls} /></div>
        <div className="col-span-2"><label className={labelCls}>Classe d'Armure</label><input value={data.ac} onChange={e => set('ac', e.target.value)} placeholder="16 (Cotte)" className={inputCls} /></div>
        <div><label className={labelCls}>Vitesse</label><input value={data.speed} onChange={e => set('speed', e.target.value)} placeholder="30 ft." className={inputCls} /></div>
        <div><label className={labelCls}>Maîtrise</label><input type="number" min="1" max="6" value={data.profBonus} onChange={e => set('profBonus', parseInt(e.target.value) || 2)} className={inputCls} /></div>
        <div className="col-span-2"><label className={labelCls}>FP (XP)</label><input value={data.cr} onChange={e => set('cr', e.target.value)} placeholder="1 (200 XP)" className={inputCls} /></div>
      </div>

      {/* Stats grid */}
      <div>
        <label className={labelCls}>Caractéristiques</label>
        <div className="grid grid-cols-6 gap-1.5 mt-1">
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key} className="text-center">
              <div className="text-[9px] font-bold text-amber-700 uppercase mb-1">{label}</div>
              <input
                type="number" min="1" max="30"
                value={data.stats[key]}
                onChange={e => setStat(key, parseInt(e.target.value) || 10)}
                className="w-full bg-dark-900/80 border border-slate-800 text-center text-amber-300 text-sm font-bold py-1.5 rounded-lg focus:outline-none focus:border-amber-700/50"
              />
              <div className="text-[9px] text-amber-600 mt-0.5">{mod(data.stats[key])}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-2">
        <div><label className={labelCls}>Compétences</label><input value={data.skills} onChange={e => set('skills', e.target.value)} placeholder="Athlétisme +5, Perception +3..." className={inputCls} /></div>
        <div><label className={labelCls}>Sens</label><input value={data.senses} onChange={e => set('senses', e.target.value)} placeholder="Vision dans le noir 60ft., Perception passive 11" className={inputCls} /></div>
        <div><label className={labelCls}>Langues</label><input value={data.languages} onChange={e => set('languages', e.target.value)} placeholder="Commun, Elfique..." className={inputCls} /></div>
        <div><label className={labelCls}>Équipement</label><input value={data.equipment} onChange={e => set('equipment', e.target.value)} placeholder="Épée longue, Cotte de mailles..." className={inputCls} /></div>
        <div><label className={labelCls}>Histoire</label><textarea value={data.backstory} onChange={e => set('backstory', e.target.value)} placeholder="Le passé du personnage..." rows={2} className={inputCls + ' resize-none'} /></div>
      </div>

      {/* Actions */}
      <div>
        <label className={labelCls}>Actions</label>
        <div className="space-y-1.5 mt-1">
          {data.actions.map((a, i) => (
            <div key={i} className="flex gap-1.5 items-start">
              <input value={a.name} onChange={e => setAction(i, 'name', e.target.value)} placeholder="Nom" className={inputCls + ' w-1/3'} />
              <input value={a.desc} onChange={e => setAction(i, 'desc', e.target.value)} placeholder="Description" className={inputCls + ' flex-1'} />
              <button onClick={() => removeAction(i)} className="text-red-500/60 hover:text-red-400 p-1.5 cursor-pointer shrink-0"><Minus className="w-3 h-3" /></button>
            </div>
          ))}
          <div className="flex gap-1.5">
            <input value={newAction.name} onChange={e => setNewAction(v => ({ ...v, name: e.target.value }))} placeholder="Nouvelle action..." className={inputCls + ' w-1/3'} onKeyDown={e => e.key === 'Enter' && addAction()} />
            <input value={newAction.desc} onChange={e => setNewAction(v => ({ ...v, desc: e.target.value }))} placeholder="Description..." className={inputCls + ' flex-1'} onKeyDown={e => e.key === 'Enter' && addAction()} />
            <button onClick={addAction} className="text-green-500 hover:text-green-300 p-1.5 cursor-pointer shrink-0"><Plus className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      {/* Traits */}
      <div>
        <label className={labelCls}>Traits Raciaux / Spéciaux</label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {data.traits.map((t, i) => (
            <span key={i} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-900/30 border border-amber-800/30 text-amber-300">
              {t}
              <button onClick={() => removeTrait(i)} className="text-amber-600 hover:text-red-400 cursor-pointer"><X className="w-2.5 h-2.5" /></button>
            </span>
          ))}
          <div className="flex gap-1">
            <input value={newTrait} onChange={e => setNewTrait(e.target.value)} placeholder="Ajouter un trait..." className={inputCls + ' text-[10px] px-2 py-1'} onKeyDown={e => e.key === 'Enter' && addTrait()} />
            <button onClick={addTrait} className="text-green-500 hover:text-green-300 p-1 cursor-pointer"><Plus className="w-3 h-3" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Timeline Block
// ─────────────────────────────────────────────────────────────

interface TimelineEvent { date: string; title: string; desc: string; }

function TimelineBlock({ content, isEditing, onChange }: {
  content: string; isEditing: boolean; onChange: (v: string) => void;
}) {
  let events: TimelineEvent[] = [];
  try { events = JSON.parse(content); } catch { events = []; }
  const setEvents = (ev: TimelineEvent[]) => onChange(JSON.stringify(ev));
  const add = () => setEvents([...events, { date: '', title: 'Nouvel Évènement', desc: '' }]);
  const remove = (i: number) => setEvents(events.filter((_, j) => j !== i));
  const update = (i: number, field: keyof TimelineEvent, v: string) => {
    const ev = [...events]; ev[i] = { ...ev[i], [field]: v }; setEvents(ev);
  };

  if (!isEditing) return (
    <div className="relative pl-6 border-l-2 border-gold-500/30 space-y-4">
      {events.map((e, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-gold-500 border-2 border-dark-950 shadow-lg shadow-gold-500/30" />
          <div className="text-[10px] font-bold text-gold-500/70 uppercase tracking-wider mb-0.5">{e.date}</div>
          <div className="text-sm font-semibold text-slate-200">{e.title}</div>
          {e.desc && <div className="text-xs text-slate-400 mt-0.5">{e.desc}</div>}
        </div>
      ))}
    </div>
  );

  const inp = "bg-dark-900/80 border border-slate-800 text-slate-200 text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-gold-500/50 placeholder-slate-600";
  return (
    <div className="space-y-2">
      {events.map((e, i) => (
        <div key={i} className="flex gap-2 items-start p-2 rounded-lg bg-dark-900/40 border border-slate-800/50">
          <input value={e.date} onChange={ev => update(i, 'date', ev.target.value)} placeholder="Date / Époque" className={inp + ' w-28'} />
          <input value={e.title} onChange={ev => update(i, 'title', ev.target.value)} placeholder="Titre" className={inp + ' flex-1'} />
          <input value={e.desc} onChange={ev => update(i, 'desc', ev.target.value)} placeholder="Description" className={inp + ' flex-1'} />
          <button onClick={() => remove(i)} className="text-red-500/50 hover:text-red-400 cursor-pointer p-1"><Minus className="w-3 h-3" /></button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-xs text-gold-500/70 hover:text-gold-400 cursor-pointer py-1">
        <Plus className="w-3.5 h-3.5" /> Ajouter un évènement
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FamilyTree Block
// ─────────────────────────────────────────────────────────────

interface FamilyNode { name: string; children?: FamilyNode[]; }

function FamilyTreeNode({ node, depth = 0 }: { node: FamilyNode; depth?: number }) {
  const colors = ['text-gold-400', 'text-amber-400', 'text-slate-300', 'text-slate-400'];
  const color = colors[Math.min(depth, colors.length - 1)];
  return (
    <div className={`${depth > 0 ? 'ml-5 pl-3 border-l border-slate-700/50' : ''}`}>
      <div className={`text-xs font-semibold ${color} py-0.5`}>{node.name}</div>
      {node.children?.map((child, i) => <FamilyTreeNode key={i} node={child} depth={depth + 1} />)}
    </div>
  );
}

function FamilyTreeBlock({ content, isEditing, onChange }: {
  content: string; isEditing: boolean; onChange: (v: string) => void;
}) {
  let data: FamilyNode = { name: 'Ancêtre', children: [] };
  try { data = JSON.parse(content); } catch { /* use default */ }

  if (!isEditing) return (
    <div className="p-2">
      <FamilyTreeNode node={data} />
    </div>
  );

  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">JSON de l'arbre</label>
      <textarea
        value={JSON.stringify(data, null, 2)}
        onChange={e => { try { JSON.parse(e.target.value); onChange(e.target.value); } catch { /* invalid JSON */ } }}
        rows={8}
        className="w-full bg-dark-900/80 border border-slate-800 text-slate-300 text-[11px] font-mono px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500/50 resize-none"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main BlockRenderer
// ─────────────────────────────────────────────────────────────

interface BlockRendererProps {
  block: WikiBlock;
  allPages: WikiPage[];
  isGmMode: boolean;
  onUpdate: (content: string, title?: string, isSecret?: boolean) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onNavigate: (id: string) => void;
  onCreatePageFromSelection?: (title: string, category: WikiCategory) => WikiPage;
}

export default function BlockRenderer({
  block, allPages, isGmMode,
  onUpdate, onDelete, onMoveUp, onMoveDown, onNavigate, onCreatePageFromSelection,
}: BlockRendererProps) {
  // Text blocks are always editable (no isEditing state needed)
  // Other blocks use double-click to edit
  const [isEditing, setIsEditing] = useState(false);
  const [blockTitle, setBlockTitle] = useState(block.title || '');
  const [showSecretLabel] = useState(block.isSecret);

  const save = useCallback((content: string, title?: string, isSecret?: boolean) => {
    onUpdate(content, title ?? blockTitle, isSecret ?? block.isSecret);
  }, [onUpdate, blockTitle, block.isSecret]);

  const isTextBlock = block.type === 'text';

  // For structured blocks only
  let parsedChar: CharData = EMPTY_CHAR;
  if (block.type === 'character') {
    try { parsedChar = { ...EMPTY_CHAR, ...JSON.parse(block.content) }; } catch { /* use default */ }
  }

  const secretBadge = block.isSecret && isGmMode ? (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950/50 border border-purple-800/30 text-purple-400 uppercase tracking-wider">
      <EyeOff className="w-2.5 h-2.5" /> MJ
    </span>
  ) : null;

  return (
    <div className={`block-container group/block relative py-1 ${block.isSecret ? 'block-secret-mj' : ''}`}>
      {/* ── Block Header: Title + Controls ── */}
      <div className={`flex items-center gap-2 mb-1.5 ${isTextBlock && !blockTitle && !isGmMode ? 'hidden' : ''}`}>
        {/* Title */}
        {isGmMode ? (
          <input
            value={blockTitle}
            onChange={e => setBlockTitle(e.target.value)}
            onBlur={() => save(block.content, blockTitle)}
            placeholder={isTextBlock ? 'Titre du bloc…' : ''}
            className={`flex-1 bg-transparent text-[11px] font-bold text-slate-500 placeholder-slate-700 focus:outline-none focus:text-slate-300 ${!blockTitle ? 'opacity-0 group-hover/block:opacity-100 focus:opacity-100 transition-opacity' : ''}`}
          />
        ) : (
          blockTitle ? <span className="text-[11px] font-bold text-slate-500">{blockTitle}</span> : null
        )}

        {secretBadge}

        {/* Block controls (GM only, on hover) */}
        {isGmMode && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity ml-auto shrink-0">
            <button onClick={onMoveUp} className="p-1 text-slate-600 hover:text-slate-300 rounded cursor-pointer" title="Monter"><ChevronUp className="w-3.5 h-3.5" /></button>
            <button onClick={onMoveDown} className="p-1 text-slate-600 hover:text-slate-300 rounded cursor-pointer" title="Descendre"><ChevronDown className="w-3.5 h-3.5" /></button>
            <button
              onClick={() => save(block.content, blockTitle, !block.isSecret)}
              className={`p-1 rounded cursor-pointer ${block.isSecret ? 'text-purple-400 hover:text-purple-300' : 'text-slate-600 hover:text-purple-400'}`}
              title={block.isSecret ? "Rendre public" : "Masquer aux joueurs"}
            >
              {block.isSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            {!isTextBlock && (
              <button
                onClick={() => setIsEditing(v => !v)}
                className={`p-1 rounded cursor-pointer text-[10px] font-bold ${isEditing ? 'text-gold-400' : 'text-slate-600 hover:text-slate-300'}`}
                title={isEditing ? "Terminer" : "Modifier"}
              >
                {isEditing ? '✓' : '✎'}
              </button>
            )}
            <button onClick={onDelete} className="p-1 text-slate-700 hover:text-red-400 rounded cursor-pointer" title="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>

      {/* ── Block Content ── */}

      {/* TEXT: always-editable rich text editor */}
      {isTextBlock && (
        <RichTextBlock
          content={block.content}
          allPages={allPages}
          isGmMode={isGmMode}
          onChange={html => save(html, blockTitle, block.isSecret)}
          onCreatePage={onCreatePageFromSelection}
          onNavigate={onNavigate}
          placeholder="Cliquez pour écrire… Sélectionnez du texte pour le mettre en forme."
        />
      )}

      {/* IMAGE */}
      {block.type === 'image' && (
        <div className="rounded-xl overflow-hidden border border-slate-800/50">
          {isEditing && isGmMode ? (
            <div className="p-3 bg-dark-900/60 space-y-2">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">URL de l'image</label>
              <input
                value={block.content}
                onChange={e => save(e.target.value, blockTitle)}
                placeholder="https://..."
                className="w-full bg-dark-950 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500/50"
              />
              {block.content && (
                <img src={block.content} alt="aperçu" className="w-full h-32 object-cover rounded-lg opacity-60" onError={() => {}} />
              )}
            </div>
          ) : (
            block.content && (
              <img
                src={block.content}
                alt={blockTitle || 'Image'}
                className="w-full max-h-96 object-cover cursor-zoom-in"
                onDoubleClick={() => isGmMode && setIsEditing(true)}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )
          )}
        </div>
      )}

      {/* CHARACTER (merged with statblock) */}
      {block.type === 'character' && (
        <CharacterBlockView
          data={parsedChar}
          isEditing={isEditing && isGmMode}
          isGmMode={isGmMode}
          onChange={d => save(JSON.stringify(d), blockTitle, block.isSecret)}
        />
      )}

      {/* TIMELINE */}
      {block.type === 'timeline' && (
        <TimelineBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}

      {/* FAMILYTREE */}
      {block.type === 'familytree' && (
        <FamilyTreeBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}
    </div>
  );
}
