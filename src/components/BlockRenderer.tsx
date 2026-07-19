'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Trash2, ChevronUp, ChevronDown, Eye, EyeOff,
  Dices, ImageIcon, Plus, Minus, Swords, User,
  Heart, Shield, Zap, BookOpen, Scroll, Star, X, Sparkles
} from 'lucide-react';
import { WikiBlock, WikiPage, WikiCategory, SpellBlockData, ClassBlockData, SpeciesBlockData, OriginBlockData, WeaponBlockData, EquipmentBlockData, GeneralRuleBlockData } from '../types';
import RichTextBlock from './RichTextBlock';
import { generateLore } from '../utils/loreGenerator';

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
  [key: string]: any;
  name: string; race: string; class: string; subclass?: string; level: number;
  alignment: string; background: string; type: string;
  hp: string; ac: string; speed: string; profBonus: number; cr: string;
  stats: typeof DEFAULT_STATS;
  skills: string; senses: string; languages: string;
  equipment: string; backstory: string;
  actions: { name: string; desc: string }[];
  traits: string[];

  // 2024 Spellcasting
  spellcastingAbility?: string;
  spellSaveDc?: number;
  spellAttackBonus?: number;
  spellSlotsMax?: number[]; // level 1 to 9 slots
  spellSlotsUsed?: number[];
  spellsList?: string[]; // Prepared spells

  // 2024 Inventory details
  gold?: number;
  silver?: number;
  copper?: number;
  electrum?: number;
  platinum?: number;
  inventory?: string[];
  inventoryItems?: { name: string; qty: number; weight: number; equipped?: boolean }[];
  currentHp?: number;
  tempHp?: number;

  // 2024 Conditions & Exhaustion
  activeConditions?: string[];
  exhaustion?: number;
  proficientSkills?: string[];
  expertSkills?: string[];
  preparedSpells?: string[];
  deathSaves?: { successes: number; failures: number };
  resources?: { name: string; desc: string; max: number; current: number; recovery: string }[];
  weaponMasteries?: string;
  generalProficiencies?: string;
}

const EMPTY_CHAR: CharData = {
  name: '', race: 'Humain', class: 'Guerrier', level: 1,
  alignment: 'Neutre', background: 'Acolyte', type: 'Moyen humanoïde',
  hp: '10', ac: '10', speed: '9 m', profBonus: 2, cr: '',
  stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skills: '', senses: 'Perception passive 10', languages: 'Commun',
  equipment: '', backstory: '',
  actions: [{ name: 'Épée longue', desc: '+4 au toucher, dégâts 1d8+2 tranchants.' }],
  traits: [],
  spellcastingAbility: 'Charisme',
  spellSaveDc: 12,
  spellAttackBonus: 4,
  spellSlotsMax: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  spellSlotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  spellsList: [],
  gold: 15,
  silver: 0,
  electrum: 0,
  copper: 0,
  platinum: 0,
  inventory: ['Symbole sacré', 'Habits de voyage'],
  inventoryItems: [
    { name: 'Épée longue', qty: 1, weight: 1.5 },
    { name: 'Sac d\'aventurier', qty: 1, weight: 2.0 },
    { name: 'Symbole sacré', qty: 1, weight: 0.5 }
  ],
  currentHp: 10,
  tempHp: 0,
  activeConditions: [],
  exhaustion: 0,
  proficientSkills: ['Perception', 'Religion'],
  expertSkills: [],
  preparedSpells: [],
  deathSaves: { successes: 0, failures: 0 },
  resources: [],
  weaponMasteries: '',
  generalProficiencies: ''
};

const STAT_LABELS: { key: StatKey; label: string }[] = [
  { key: 'str', label: 'FOR' }, { key: 'dex', label: 'DEX' }, { key: 'con', label: 'CON' },
  { key: 'int', label: 'INT' }, { key: 'wis', label: 'SAG' }, { key: 'cha', label: 'CHA' },
];

const CONDITIONS_LIST = [
  'Aveuglé', 'Charmé', 'Assourdi', 'Invisible', 'Agrippé', 'À terre', 'Paralysé', 'Pétrifié', 'Empoisonné', 'Entravé', 'Étourdi', 'Inconscient'
];

const SKILLS_LIST: { name: string; stat: StatKey }[] = [
  { name: 'Acrobaties', stat: 'dex' },
  { name: 'Arcanes', stat: 'int' },
  { name: 'Athlétisme', stat: 'str' },
  { name: 'Discrétion', stat: 'dex' },
  { name: 'Dressage', stat: 'wis' },
  { name: 'Escamotage', stat: 'dex' },
  { name: 'Histoire', stat: 'int' },
  { name: 'Intimidation', stat: 'cha' },
  { name: 'Intuition', stat: 'wis' },
  { name: 'Investigation', stat: 'int' },
  { name: 'Médecine', stat: 'wis' },
  { name: 'Nature', stat: 'int' },
  { name: 'Perception', stat: 'wis' },
  { name: 'Persuasion', stat: 'cha' },
  { name: 'Religion', stat: 'int' },
  { name: 'Représentation', stat: 'cha' },
  { name: 'Survie', stat: 'wis' },
  { name: 'Tromperie', stat: 'cha' }
];

const WEAPONS_DATABASE: Record<string, { damage: string; stat: StatKey; type: string; weight: number }> = {
  'épée courte': { damage: '1d6', stat: 'dex', type: 'perforant', weight: 1.0 },
  'épée longue': { damage: '1d8', stat: 'str', type: 'tranchant', weight: 1.5 },
  'dague': { damage: '1d4', stat: 'dex', type: 'perforant', weight: 0.5 },
  'arc court': { damage: '1d6', stat: 'dex', type: 'perforant', weight: 1.0 },
  'arc long': { damage: '1d8', stat: 'dex', type: 'perforant', weight: 1.0 },
  'marteau léger': { damage: '1d4', stat: 'str', type: 'contondant', weight: 1.0 },
  'marteau de forge': { damage: '1d8', stat: 'str', type: 'contondant', weight: 2.0 },
  'marteau de guerre': { damage: '1d8', stat: 'str', type: 'contondant', weight: 2.0 },
  'rapière': { damage: '1d8', stat: 'dex', type: 'perforant', weight: 1.0 },
  'cimeterre': { damage: '1d6', stat: 'dex', type: 'tranchant', weight: 1.5 },
  'grande hache': { damage: '1d12', stat: 'str', type: 'tranchant', weight: 3.0 },
  'grande épée': { damage: '2d6', stat: 'str', type: 'tranchant', weight: 3.0 },
  'hache de bataille': { damage: '1d8', stat: 'str', type: 'tranchant', weight: 2.0 },
  'bâton': { damage: '1d6', stat: 'str', type: 'contondant', weight: 2.0 },
  'lance': { damage: '1d6', stat: 'str', type: 'perforant', weight: 1.5 },
  'mains nues': { damage: '1', stat: 'str', type: 'contondant', weight: 0.0 }
};

// ─────────────────────────────────────────────────────────────
// Dynamic Currency Rules Helper
// ─────────────────────────────────────────────────────────────

export interface CurrencyRate {
  id: string;
  name: string;
  valueInGp: string | number;
  weightGramsPerCoin: number;
}

export const DEFAULT_CURRENCY_RATES: CurrencyRate[] = [
  { id: 'copper', name: 'Pièces de Cuivre (pc)', valueInGp: '1/100', weightGramsPerCoin: 10 },
  { id: 'silver', name: "Pièces d'Argent (pa)", valueInGp: '1/10', weightGramsPerCoin: 10 },
  { id: 'electrum', name: "Pièces d'Electrum (pe)", valueInGp: '1/2', weightGramsPerCoin: 10 },
  { id: 'gold', name: "Pièces d'Or (po)", valueInGp: '1/1', weightGramsPerCoin: 10 },
  { id: 'platinum', name: "Pièces de Platine (pp)", valueInGp: 10.0, weightGramsPerCoin: 10 },
];

export function getCurrencyRates(allPages: WikiPage[]): CurrencyRate[] {
  const monnaiePage = allPages.find(p => p.id === 'equipment-monnaie');
  if (monnaiePage) {
    const currencyBlock = monnaiePage.blocks.find(b => b.type === 'currency');
    if (currencyBlock && currencyBlock.content) {
      try {
        const parsed = JSON.parse(currencyBlock.content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
  }
  return DEFAULT_CURRENCY_RATES;
}

export function parseValueInGp(val: string | number): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    if (val.includes('/')) {
      const parts = val.split('/');
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 1.0 : parsed;
  }
  return 1.0;
}

// ─────────────────────────────────────────────────────────────
// Dynamic Weapon Properties Helper
// ─────────────────────────────────────────────────────────────

export interface WeaponProperty {
  id: string;
  name: string;
  description: string;
}

export const DEFAULT_WEAPON_PROPERTIES: WeaponProperty[] = [
  { id: 'a_deux_mains', name: 'À deux mains', description: "Cette arme nécessite les deux mains lorsque vous attaquez avec." },
  { id: 'allonge', name: 'Allonge', description: "Ce type d'arme ajoute 1,50 mètre à votre allonge lorsque vous attaquez avec, ou pour déterminer votre allonge lorsque vous effectuez une attaque d'opportunité avec (voir Combat)." },
  { id: 'chargement', name: 'Chargement', description: "En raison du temps nécessaire pour charger cette arme, vous ne pouvez tirer qu'une seule munition par action, action bonus ou réaction, quel que soit le nombre d'attaques que vous possédez." },
  { id: 'finesse', name: 'Finesse', description: "Lorsque vous effectuez une attaque avec une arme de finesse, vous pouvez au choix appliquer votre modificateur de Force ou celui de Dextérité à vos jets d'attaque et de dégâts. Le même modificateur s'applique aux deux jets." },
  { id: 'lancer', name: 'Lancer', description: "Une arme qui possède la propriété lancer peut être lancée pour réaliser une attaque à distance. Si l'arme est une arme de corps à corps, vous utilisez la même caractéristique pour le jet d'attaque et de dégâts que vous auriez utilisée au corps à corps. Par exemple, si vous lancez une hachette, vous utilisez la Force, mais si vous lancez une dague, vous pouvez utiliser la Force ou la Dextérité, car la dague possède la propriété finesse." },
  { id: 'legere', name: 'Légère', description: "Une arme légère est petite et facile à manier, ce qui la rend idéale pour les combats à deux armes. Voir les règles du combat à deux armes." },
  { id: 'lourde', name: 'Lourde', description: "Les créatures de taille P ou TP ont un désavantage aux jets d'attaque avec une arme lourde. La taille et le poids d'une arme lourde sont en effet trop importants pour qu'une créature de taille P ou TP puisse l'utiliser efficacement." },
  { id: 'munitions', name: 'Munitions', description: "Vous ne pouvez utiliser une arme qui possède la propriété munitions pour une attaque à distance que si vous avez des munitions pour celle-ci. Pour chaque attaque réalisée avec cette arme, une munition est consommée. Prendre la munition d'un carquois ou autre contenant similaire fait partie de l'attaque (vous avez besoin d'une main libre pour recharger une arme à une main). À la fin du combat, vous pouvez récupérer la moitié des munitions utilisées en passant une minute pour la recherche. Si vous utilisez ce type d'arme pour une attaque au corps à corps, l'arme est considérée comme une arme improvisée (voir les règles correspondantes). Une fronde doit être chargée pour infliger des dégâts de cette manière." },
  { id: 'polyvalente', name: 'Polyvalente', description: "Cette arme peut être tenue à une ou deux mains. Le chiffre indiqué entre parenthèses correspond aux dégâts si l'arme est tenue à deux mains lors d'une attaque au corps à corps." },
  { id: 'portee', name: 'Portée', description: "Une arme qui peut être utilisée pour effectuer une attaque à distance a une portée indiquée entre parenthèses après les propriétés munitions ou lancer. La portée spécifie deux nombres. Le premier indique la portée nominale en mètres, le deuxième la portée maximale. Au-delà de la portée nominale, vous avez un désavantage aux jets d’attaque. Vous ne pouvez attaquer une créature au-delà de la portée maximale." },
  { id: 'filet', name: 'Filet', description: "Une créature de taille G ou plus petite qui est touchée par un filet est entravée jusqu'à ce qu'elle soit libérée. Un filet n'a aucun effet sur les créatures sans forme ou de taille supérieure à G. Une créature peut utiliser son action pour effectuer un jet de Force DD 10 afin de se libérer ou de libérer une autre créature à sa portée en cas de succès. Infliger 5 points de dégâts tranchants à un filet (CA 10) permet également de libérer une créature sans la blesser, mettant fin à l'effet tout en détruisant le filet. Lorsque vous utilisez une action, une action bonus ou une réaction pour attaquer avec un filet, vous ne pouvez effectuer qu'une seule attaque, et ce quel que soit le nombre d'attaques que vous pouvez normalement réaliser." },
  { id: 'lance_darcon', name: "Lance d'arçon", description: "Vous avez un désavantage lorsque vous utilisez une lance d'arçon pour attaquer une cible à 1,50 mètre ou moins de vous. En outre, une lance d'arçon requiert deux mains pour être maniée lorsque vous n'êtes pas sur une monture." },
];

export function getWeaponProperties(allPages: WikiPage[]): WeaponProperty[] {
  const armePage = allPages.find(p => p.id === 'equipment-armes');
  if (armePage) {
    const block = armePage.blocks.find(b => b.type === 'weapon_properties');
    if (block && block.content) {
      try {
        const parsed = JSON.parse(block.content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
  }
  return DEFAULT_WEAPON_PROPERTIES;
}

// ─────────────────────────────────────────────────────────────
// Dynamic Weapon Masteries Helper
// ─────────────────────────────────────────────────────────────

export interface WeaponMastery {
  id: string;
  name: string;
  description: string;
}

export const DEFAULT_WEAPON_MASTERIES: WeaponMastery[] = [
  { id: 'coup_double', name: 'Coup double', description: "Lorsque vous effectuez l’attaque supplémentaire de la propriété Légère de l’arme, vous pouvez l’effectuer dans le cadre de l’action Attaque au lieu de devoir y consacrer votre action Bonus. Vous ne pouvez effectuer cette attaque supplémentaire qu’une seule fois par tour." },
  { id: 'ecorchure', name: 'Écorchure', description: "Si votre jet d’attaque avec cette arme rate une créature, vous pouvez lui infliger des dégâts égaux au modificateur de la caractéristique utilisée pour effectuer le jet d’attaque. Ces dégâts sont du même type que ceux infligés par l’arme, et ne peuvent être augmentés qu’en augmentant le modificateur de caractéristique." },
  { id: 'enchainement', name: 'Enchaînement', description: "Si vous touchez une créature avec un jet d’attaque de corps à corps avec cette arme, vous pouvez effectuer un jet d’attaque de corps à corps avec cette arme contre une deuxième créature située dans un rayon de 1,50 m de la première, et qui est elle aussi à votre portée. Si l’attaque touche, la deuxième créature subit les dégâts de l’arme, mais sans ajouter votre modificateur de caractéristique à ces dégâts, sauf si ce modificateur est négatif. Vous ne pouvez effectuer cette attaque supplémentaire qu’une seule fois par tour." },
  { id: 'ouverture', name: 'Ouverture', description: "Si vous touchez une créature avec cette arme et lui infligez des dégâts, vous avez un Avantage à votre prochain jet d’attaque contre cette créature avant la fin de votre tour suivant." },
  { id: 'poussee', name: 'Poussée', description: "Si vous touchez une créature avec cette arme, vous pouvez la repousser d’un maximum de 3 m en ligne droite pour peu qu’elle soit de taille G ou inférieure." },
  { id: 'ralentissement', name: 'Ralentissement', description: "Si vous touchez une créature avec cette arme et lui infligez des dégâts, vous pouvez réduire sa Vitesse de 3 m jusqu’au début de votre tour suivant. Si la créature est touchée plus d’une fois par des armes dotées de cette propriété, la réduction de sa Vitesse n’excède pas 3 m." },
  { id: 'renversement', name: 'Renversement', description: "Si vous touchez une créature avec cette arme, vous pouvez la contraindre à effectuer un jet de sauvegarde de Constitution (DD égal à 8 + le modificateur de caractéristique utilisé pour le jet d’attaque + votre bonus de maîtrise). En cas d’échec, la créature subit l’état À terre." },
  { id: 'sape', name: 'Sape', description: "Si vous touchez une créature avec cette arme, cette créature subit un Désavantage à son prochain jet d’attaque avant le début de votre tour suivant." },
];

export function getWeaponMasteries(allPages: WikiPage[]): WeaponMastery[] {
  const armesPage = allPages.find(p => p.id === 'equipment-armes');
  if (armesPage) {
    const block = armesPage.blocks.find(b => b.type === 'weapon_masteries');
    if (block && block.content) {
      try {
        const parsed = JSON.parse(block.content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
  }
  return DEFAULT_WEAPON_MASTERIES;
}

const parseWeaponFromPage = (page: WikiPage) => {
  const block = page.blocks.find(b => b.type === 'weapon');
  if (block) {
    try {
      const wData = JSON.parse(block.content) as WeaponBlockData;
      return {
        damage: wData.damage || null,
        type: wData.damageType || null,
        weight: typeof wData.weight === 'number' ? wData.weight : null,
        mastery: wData.mastery || null,
        rangeMin: typeof wData.rangeMin === 'number' ? wData.rangeMin : null,
        rangeMax: typeof wData.rangeMax === 'number' ? wData.rangeMax : null,
        damageDice: wData.damageDice || null,
        properties: wData.properties || ''
      };
    } catch {}
  }
  return { damage: null, type: null, weight: null, mastery: null, rangeMin: null, rangeMax: null, damageDice: null, properties: '' };
};

const parseArmorFromPage = (page: WikiPage) => {
  const block = page.blocks.find(b => b.type === 'equipment');
  if (block) {
    try {
      const eqData = JSON.parse(block.content) as EquipmentBlockData;
      return {
        ac: typeof eqData.ac === 'number' ? eqData.ac : null,
        shieldBonus: typeof eqData.shieldBonus === 'number' ? eqData.shieldBonus : null,
        weight: typeof eqData.weight === 'number' ? eqData.weight : null
      };
    } catch {}
  }
  return { ac: null, shieldBonus: null, weight: null };
};

function CharacterBlockView({ data, isEditing, isGmMode, allPages, onChange, backstoryOverride, onNavigate }: {
  data: CharData; isEditing: boolean; isGmMode: boolean;
  allPages: WikiPage[];
  onChange: (d: CharData) => void;
  backstoryOverride?: string | null;
  onNavigate?: (id: string) => void;
}) {
  const [newAction, setNewAction] = useState({ name: '', desc: '' });
  const [newTrait, setNewTrait] = useState('');
  const [activeTab, setActiveTab] = useState<'fiche' | 'spells'>('fiche');
  const [rollResult, setRollResult] = useState<{ label: string; roll: number; mod: number; total: number; rollMode: string; penalty: number } | null>(null);
  const [lastRolls, setLastRolls] = useState<Record<string, { total: number; roll1: number; roll2: number; mode: string }>>({});

  const [selectedSpellToAdd, setSelectedSpellToAdd] = useState('');
  const [newSense, setNewSense] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [selectedTraitPageToAdd, setSelectedTraitPageToAdd] = useState('');
  const [selectedResourcePageToAdd, setSelectedResourcePageToAdd] = useState('');
  const [newItem, setNewItem] = useState({ name: '', qty: 1, weight: 1.0 });
  const [activeRollRequest, setActiveRollRequest] = useState<{ label: string; bonus: number } | null>(null);

  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceDesc, setNewResourceDesc] = useState('');

  const penalty = data.exhaustion || 0;
  const currencyRates = getCurrencyRates(allPages);

  const maxCarry = Math.round((data.stats.str * 7.5) * 10) / 10;
  const itemsWeight = (data.inventoryItems || []).reduce((sum, it) => sum + (it.weight * (it.qty || 1)), 0);
  let coinsWeight = 0;
  let coinsCount = 0;
  currencyRates.forEach(rate => {
    const count = (data[rate.id] || 0) as number;
    coinsCount += count;
    coinsWeight += count * (rate.weightGramsPerCoin / 1000);
  });
  const totalWeight = Math.round((itemsWeight + coinsWeight) * 10) / 10;
  const weightPct = Math.max(0, Math.min(100, (totalWeight / maxCarry) * 100));

  const [activeSpellCast, setActiveSpellCast] = useState<{ title: string; baseLevel: number; damageFormula: string | null } | null>(null);

  const calculateScaledDamage = (formula: string, baseLevel: number, castLevel: number) => {
    if (castLevel <= baseLevel) return formula;
    const match = formula.replace(/\s+/g, '').match(/^(\d+)d(\d+)(.*)$/i);
    if (!match) return formula;
    const diceCount = parseInt(match[1]);
    const diceSides = parseInt(match[2]);
    const rest = match[3] || '';
    const newDiceCount = diceCount + (castLevel - baseLevel);
    return `${newDiceCount}d${diceSides}${rest}`;
  };

  const executeSpellCast = (spellName: string, baseLevel: number, castLevel: number, damageFormula: string | null) => {
    const nextUsed = [...(data.spellSlotsUsed || [0,0,0,0,0,0,0,0,0])];
    const lvlIdx = castLevel - 1;
    nextUsed[lvlIdx] = Math.min((data.spellSlotsMax || [0,0,0,0,0])[lvlIdx], (nextUsed[lvlIdx] || 0) + 1);
    
    const dc = data.spellSaveDc ? (data.spellSaveDc - penalty) : 10;
    const bonus = data.spellAttackBonus ? (data.spellAttackBonus - penalty) : 2;
    
    let rollDetails = `Incantation au Niveau ${castLevel} (DD de sauvegarde: ${dc}, Bonus d'attaque: +${bonus})`;
    
    onChange({ ...data, spellSlotsUsed: nextUsed });
    setActiveSpellCast(null);

    window.dispatchEvent(new CustomEvent('dnd-roll', {
      detail: {
        characterName: data.name || 'Personnage',
        label: `Incante : ${spellName} (Niveau ${castLevel})`,
        formula: `Consomme 1 emplacement de niveau ${castLevel}`,
        details: rollDetails,
        type: 'Sort',
        finalResult: 'LANCÉ'
      }
    }));

    if (damageFormula) {
      const scaledFormula = calculateScaledDamage(damageFormula, baseLevel, castLevel);
      setTimeout(() => {
        handleRollDmg(`${spellName} (Niveau ${castLevel})`, scaledFormula);
      }, 300);
    }
  };

  const renderSpellRow = (spellName: string, spellData: any, level: number) => {
    const isPrepared = level === 0 || (data.preparedSpells || []).includes(spellName);
    const toHitMatch = spellData.description?.match(/([+-]\d+)\s*au\s*toucher/i);
    const toHitBonus = toHitMatch ? parseInt(toHitMatch[1]) : (data.spellAttackBonus || 2);
    const finalBonus = toHitBonus - penalty;
    const rollKey = `Sort : ${spellName}`;
    const dmgFormula = parseDmgFormula(spellData.damageOrEffect || spellData.description || '');

    return (
      <div key={spellName} className="flex justify-between items-center p-3 rounded-lg bg-white/2 border border-white/5 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {level > 0 && (
              <button
                type="button"
                onClick={() => {
                  const preps = [...(data.preparedSpells || [])];
                  if (preps.includes(spellName)) {
                    onChange({ ...data, preparedSpells: preps.filter(s => s !== spellName) });
                  } else {
                    onChange({ ...data, preparedSpells: [...preps, spellName] });
                  }
                }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase transition border cursor-pointer shrink-0 ${
                  isPrepared
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-extrabold shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {isPrepared ? 'Préparé' : 'Non préparé'}
              </button>
            )}
            <strong className="text-slate-200 text-sm font-bold truncate">{spellName}</strong>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">({spellData.school || 'École'})</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{spellData.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {level === 0 ? (
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleRoll(rollKey, toHitBonus, getRollMode(spellName))}
                className="px-2.5 py-1.5 rounded-lg border border-gold-500/25 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 font-bold text-xs transition duration-200 cursor-pointer min-w-[65px]"
              >
                Lancer
              </button>
              {dmgFormula && (
                <button
                  type="button"
                  onClick={() => handleRollDmg(spellName, dmgFormula)}
                  className="px-2.5 py-1.5 rounded-lg border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition duration-200 cursor-pointer min-w-[65px]"
                >
                  Dégâts
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              disabled={!isPrepared}
              onClick={() => setActiveSpellCast({ title: spellName, baseLevel: level, damageFormula: dmgFormula })}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition duration-200 min-w-[80px] ${
                isPrepared
                  ? 'border border-gold-500/25 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 cursor-pointer font-bold'
                  : 'border-slate-800 bg-slate-900/20 text-slate-500 cursor-not-allowed font-medium'
              }`}
            >
              Incanter
            </button>
          )}
        </div>
      </div>
    );
  };

  const [newResourceMax, setNewResourceMax] = useState(2);
  const [newResourceRecovery, setNewResourceRecovery] = useState('Repos Court');

  const addResource = () => {
    if (!newResourceName.trim()) return;
    const list = [...(data.resources || [])];
    list.push({
      name: newResourceName.trim(),
      desc: newResourceDesc.trim() || 'Aptitude de classe.',
      max: newResourceMax,
      current: newResourceMax,
      recovery: newResourceRecovery
    });
    onChange({ ...data, resources: list });
    setNewResourceName('');
    setNewResourceDesc('');
    setNewResourceMax(2);
    setNewResourceRecovery('Repos Court');
  };

  const removeResource = (rIdx: number) => {
    const list = (data.resources || []).filter((_, i) => i !== rIdx);
    onChange({ ...data, resources: list });
  };

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

  const removeSense = (sIdx: number) => {
    const list = (data.senses || '').split(',').map(s => s.trim()).filter(Boolean);
    const updated = list.filter((_, idx) => idx !== sIdx);
    onChange({ ...data, senses: updated.join(', ') });
  };
  const addSense = (val: string) => {
    const clean = val.trim();
    if (!clean) return;
    const list = (data.senses || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!list.includes(clean)) {
      list.push(clean);
      onChange({ ...data, senses: list.join(', ') });
    }
  };

  const removeLanguage = (lIdx: number) => {
    const list = (data.languages || '').split(',').map(s => s.trim()).filter(Boolean);
    const updated = list.filter((_, idx) => idx !== lIdx);
    onChange({ ...data, languages: updated.join(', ') });
  };
  const addLanguage = (val: string) => {
    const clean = val.trim();
    if (!clean) return;
    const list = (data.languages || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!list.includes(clean)) {
      list.push(clean);
      onChange({ ...data, languages: list.join(', ') });
    }
  };

  const handleAddTraitFromPage = (pageTitle: string) => {
    const page = allPages.find(p => p.title === pageTitle);
    if (!page) return;
    const block = page.blocks.find(b => b.type === 'text') || page.blocks[0];
    const rawContent = block ? block.content : '';
    const cleanDesc = rawContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const cleanTitle = page.title;
    const finalTrait = `${cleanTitle}: ${cleanDesc || 'Aptitude/Trait.'}`;
    
    const list = [...(data.traits || [])];
    if (!list.some(t => t.startsWith(cleanTitle + ':'))) {
      onChange({ ...data, traits: [...list, finalTrait] });
    }
    setSelectedTraitPageToAdd('');
  };

  const parseMulticlass = (classStr: string, levelVal: number, subclassStr: string = '') => {
    const str = classStr || '';
    const subStr = subclassStr || '';
    const subparts = subStr.split('/').map(s => s.trim());
    
    if (str.includes('/')) {
      return str.split('/').map((part, idx) => {
        const trimmed = part.trim();
        const match = trimmed.match(/^(.*?)\s+(\d+)$/);
        const sub = subparts[idx] === '-' ? '' : (subparts[idx] || '');
        if (match) {
          return { name: match[1], level: parseInt(match[2]) || 1, subclass: sub };
        }
        return { name: trimmed, level: 1, subclass: sub };
      });
    }
    return [{ name: str || 'Guerrier', level: levelVal || 1, subclass: subStr }];
  };

  const updateMulticlass = (list: { name: string; level: number; subclass: string }[]) => {
    if (list.length === 0) {
      onChange({ ...data, class: 'Guerrier', level: 1, subclass: '' });
    } else if (list.length === 1) {
      onChange({ ...data, class: list[0].name, level: list[0].level, subclass: list[0].subclass });
    } else {
      const classString = list.map(c => `${c.name} ${c.level}`).join(' / ');
      const totalLevel = list.reduce((sum, c) => sum + c.level, 0);
      const subclassString = list.map(c => c.subclass.trim() || '-').join(' / ');
      onChange({ ...data, class: classString, level: totalLevel, subclass: subclassString });
    }
  };

  const handleGenerate = () => {
    let stats = { ...DEFAULT_STATS };
    let primaryKeys: StatKey[] = ['str', 'con'];
    let classHpDie = 8;
    let classAc = '10';
    let classProf = 2;
    let traits: string[] = [];
    let speed = '9 m';
    let type = 'Moyen humanoïde';
    let skillsList: string[] = [];
    let equipmentList: string[] = [];

    const classPage = allPages.find(p => p.category === 'regle' && (p.title.toLowerCase() === data.class.toLowerCase() || p.aliases.some(a => a.toLowerCase() === data.class.toLowerCase())));
    const classBlock = classPage?.blocks.find(b => b.type === 'class');
    if (classBlock) {
      try {
        const clsData: ClassBlockData = JSON.parse(classBlock.content);
        const dieMatch = clsData.hitDie.match(/d(\d+)/);
        if (dieMatch) classHpDie = parseInt(dieMatch[1]);
        const abilityMap: Record<string, StatKey> = { 'force': 'str', 'dextérité': 'dex', 'constitution': 'con', 'intelligence': 'int', 'sagesse': 'wis', 'charisme': 'cha' };
        if (clsData.primaryAbilities.length > 0) primaryKeys = clsData.primaryAbilities.map(a => abilityMap[a.toLowerCase()] || 'str');
      } catch {}
    } else {
      const classDef = CLASSES[data.class] || { primary: ['str', 'con'] as StatKey[], hpDie: 8, ac: '10', profBonus: 2 };
      classHpDie = classDef.hpDie;
      classAc = classDef.ac;
      classProf = classDef.profBonus;
      primaryKeys = classDef.primary as StatKey[];
    }

    const racePage = allPages.find(p => p.category === 'regle' && (p.title.toLowerCase() === data.race.toLowerCase() || p.aliases.some(a => a.toLowerCase() === data.race.toLowerCase())));
    const raceBlock = racePage?.blocks.find(b => b.type === 'species');
    if (raceBlock) {
      try {
        const specData: SpeciesBlockData = JSON.parse(raceBlock.content);
        speed = `${specData.speed} m`;
        type = `${specData.size} humanoïde (${data.race.toLowerCase()})`;
        traits = specData.traits.map(t => `${t.name}: ${t.description}`);
      } catch {}
    }

    const bgPage = allPages.find(p => p.category === 'regle' && (p.title.toLowerCase() === data.background.toLowerCase() || p.aliases.some(a => a.toLowerCase() === data.background.toLowerCase())));
    const bgBlock = bgPage?.blocks.find(b => b.type === 'origin');
    if (bgBlock) {
      try {
        const origData: OriginBlockData = JSON.parse(bgBlock.content);
        skillsList = origData.skills;
        equipmentList = origData.equipment;
      } catch {}
    }

    const rawRolls = Array.from({ length: 6 }, () => roll4d6()).sort((a, b) => b - a);
    const orderedKeys = [...primaryKeys, ...Object.keys(DEFAULT_STATS).filter(k => !primaryKeys.includes(k as StatKey)) as StatKey[]];
    orderedKeys.forEach((k, i) => { stats[k] = rawRolls[i] || 10; });

    const conMod = Math.floor((stats.con - 10) / 2);
    const hpRoll = classHpDie + conMod;

    onChange({
      ...data,
      stats,
      hp: `${hpRoll}`,
      currentHp: hpRoll,
      ac: classAc,
      speed,
      type,
      profBonus: classProf,
      traits,
      spellSlotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      spellsList: [],
      gold: 15,
      silver: 0,
      copper: 0,
      platinum: 0,
      inventoryItems: [
        { name: 'Sac d\'aventurier', qty: 1, weight: 2.0 },
        ...equipmentList.map(e => ({ name: e, qty: 1, weight: 1.0 }))
      ],
      activeConditions: [],
      exhaustion: 0,
      proficientSkills: skillsList
    });
  };

  const handleRoll = (label: string, bonus: number, rollMode: 'normal' | 'advantage' | 'disadvantage' = 'normal') => {
    const conds = data.activeConditions || [];
    const labelLower = label.toLowerCase();
    
    const isSavingThrow = labelLower.includes('sauvegarde');
    const isAbilityCheck = labelLower.includes('skill_') || labelLower.includes('compétence') || label === 'Initiative' || ['FOR', 'DEX', 'CON', 'INT', 'SAG', 'CHA'].includes(label);
    const isAttackRoll = labelLower.includes('attaque') || labelLower.includes('arc') || labelLower.includes('marteau') || labelLower.includes('épée') || labelLower.includes('dague');

    // 1. STR/DEX saves auto-fail for Paralyzed, Petrified, Stunned, Unconscious
    const isStrOrDexSave = isSavingThrow && (labelLower.includes('for') || labelLower.includes('dex') || labelLower.includes('dextérité'));
    if (isStrOrDexSave && (conds.includes('Paralysé') || conds.includes('Pétrifié') || conds.includes('Étourdi') || conds.includes('Inconscient'))) {
      window.dispatchEvent(new CustomEvent('dnd-roll', {
        detail: {
          characterName: data.name || 'Personnage',
          label,
          formula: '-',
          details: `Échec automatique (états actifs : ${conds.filter(c => ['Paralysé', 'Pétrifié', 'Étourdi', 'Inconscient'].includes(c)).join(', ')})`,
          type: 'Sauvegarde',
          finalResult: 'ÉCHEC'
        }
      }));
      return;
    }

    // 2. Resolve advantage/disadvantage from conditions
    let hasAdv = false;
    let hasDis = false;

    if (conds.includes('Empoisonné') && (isAbilityCheck || isAttackRoll)) {
      hasDis = true;
    }
    if (conds.includes('Aveuglé') && isAttackRoll) {
      hasDis = true;
    }
    if (conds.includes('À terre') && isAttackRoll) {
      hasDis = true;
    }
    if (conds.includes('Entravé')) {
      if (isAttackRoll) hasDis = true;
      if (isSavingThrow && (labelLower.includes('dex') || labelLower.includes('dextérité'))) hasDis = true;
    }
    if (conds.includes('Invisible')) {
      if (isAttackRoll) hasAdv = true;
      if (labelLower.includes('discrétion')) hasAdv = true;
    }

    let finalRollMode = rollMode;
    if (hasAdv && hasDis) {
      finalRollMode = 'normal';
    } else if (hasAdv) {
      if (rollMode === 'disadvantage') finalRollMode = 'normal';
      else finalRollMode = 'advantage';
    } else if (hasDis) {
      if (rollMode === 'advantage') finalRollMode = 'normal';
      else finalRollMode = 'disadvantage';
    }

    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const penalty = data.exhaustion || 0;
    
    let roll = roll1;
    let modeLabel = 'Normal';
    
    if (finalRollMode === 'advantage') {
      roll = Math.max(roll1, roll2);
      modeLabel = 'Avantage';
    } else if (finalRollMode === 'disadvantage') {
      roll = Math.min(roll1, roll2);
      modeLabel = 'Désavantage';
    }

    const total = roll + bonus - penalty;
    const details = `${modeLabel} (Jet: ${roll}${finalRollMode !== 'normal' ? `, dés: ${roll1}, ${roll2}` : ''}) | Modificateur: ${bonus >= 0 ? '+' : ''}${bonus}${penalty > 0 ? ` | Épuisement: -${penalty}` : ''}`;
    const formula = `d20 ${bonus >= 0 ? '+' : ''}${bonus}`;

    window.dispatchEvent(new CustomEvent('dnd-roll', {
      detail: { characterName: data.name || 'Personnage', label, formula, details, type: 'Test', finalResult: total }
    }));
  };

  const parseDmgFormula = (desc: string) => {
    const match = desc.match(/dégâts\s+([1-9]\d*d[1-9]\d*(?:\s*[+-]\s*\d+)?)/i) || desc.match(/([1-9]\d*d[1-9]\d*(?:\s*[+-]\s*\d+)?)/);
    return match ? match[1].trim() : null;
  };

  const handleRollDmg = (key: string, formula: string) => {
    const cleaned = formula.replace(/\s+/g, '');
    const match = cleaned.match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/i);
    if (!match) return;
    
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const op = match[3];
    const modifier = match[4] ? parseInt(match[4]) : 0;
    
    const rolls: number[] = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      sum += r;
    }
    
    let total = sum;
    if (op === '+') total += modifier;
    if (op === '-') total -= modifier;
    total = Math.max(1, total);
    
    const details = `${count}d${sides} (${rolls.join('+')})${op ? ` ${op} ${modifier}` : ''}`;
    
    window.dispatchEvent(new CustomEvent('dnd-roll', {
      detail: { characterName: data.name || 'Personnage', label: `Dégâts : ${key}`, formula, details, type: 'Dégâts', finalResult: total }
    }));
  };

  const handleAdjustHp = (amount: number) => {
    const max = parseInt(data.hp) || 10;
    const cur = data.currentHp ?? max;
    const next = Math.max(0, Math.min(max, cur + amount));
    set('currentHp', next);
  };

  const toggleSlotUsed = (lvlIdx: number, slotIdx: number) => {
    const used = [...(data.spellSlotsUsed || [0, 0, 0, 0, 0, 0, 0, 0, 0])];
    const max = (data.spellSlotsMax || [0, 0, 0, 0, 0, 0, 0, 0, 0])[lvlIdx];
    const cur = used[lvlIdx];

    if (slotIdx < cur) {
      used[lvlIdx] = Math.max(0, cur - 1);
    } else {
      used[lvlIdx] = Math.min(max, cur + 1);
    }
    set('spellSlotsUsed', used);
  };

  const handleAddSpell = () => {
    if (!selectedSpellToAdd) return;
    const list = [...(data.spellsList || [])];
    if (!list.includes(selectedSpellToAdd)) {
      onChange({ ...data, spellsList: [...list, selectedSpellToAdd] });
    }
    setSelectedSpellToAdd('');
  };

  const handleRemoveSpell = (spell: string) => {
    onChange({ ...data, spellsList: (data.spellsList || []).filter(s => s !== spell) });
  };

  const handleAddInventoryItem = () => {
    if (!newItem.name.trim()) return;
    const list = [...(data.inventoryItems || [])];
    list.push({ name: newItem.name.trim(), qty: newItem.qty || 1, weight: newItem.weight || 0 });
    onChange({ ...data, inventoryItems: list, ac: '' });
    setNewItem({ name: '', qty: 1, weight: 1.0 });
  };

  const handleRemoveInventoryItem = (idx: number) => {
    const list = (data.inventoryItems || []).filter((_, i) => i !== idx);
    onChange({ ...data, inventoryItems: list, ac: '' });
  };

  const toggleItemEquipped = (idx: number) => {
    const list = [...(data.inventoryItems || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], equipped: !list[idx].equipped };
      onChange({ ...data, inventoryItems: list, ac: '' });
    }
  };

  const toggleSkillProficiency = (skillName: string) => {
    const profs = [...(data.proficientSkills || [])];
    const experts = [...(data.expertSkills || [])];
    
    if (experts.includes(skillName)) {
      // Cycle from Expert -> None
      onChange({
        ...data,
        expertSkills: experts.filter(s => s !== skillName),
        proficientSkills: profs.filter(s => s !== skillName)
      });
    } else if (profs.includes(skillName)) {
      // Cycle from Proficient -> Expert
      onChange({
        ...data,
        proficientSkills: profs.filter(s => s !== skillName),
        expertSkills: [...experts, skillName]
      });
    } else {
      // Cycle from None -> Proficient
      onChange({
        ...data,
        proficientSkills: [...profs, skillName]
      });
    }
  };

  const getRollMode = (rollLabel: string) => {
    const conds = data.activeConditions || [];
    if (rollLabel === 'Discrétion' && conds.includes('Invisible')) return 'advantage';
    if (rollLabel === 'Attaque' || rollLabel.toLowerCase().includes('épée') || rollLabel.toLowerCase().includes('dague') || rollLabel.toLowerCase().includes('arc')) {
      if (conds.includes('Invisible')) return 'advantage';
      if (conds.includes('Aveuglé') || conds.includes('À terre') || conds.includes('Entravé') || conds.includes('Agrippé')) return 'disadvantage';
    }
    return 'normal';
  };

  const availableSpells = allPages.filter(p => p.category === 'regle' && p.blocks.some(b => b.type === 'spell'));
  const equipmentPages = allPages.filter(p => (p.category === 'regle' || p.category === 'arme') && (p.id.startsWith('weapon-') || p.id.startsWith('equipment-')));

  const filteredAvailableSpells = availableSpells.filter(p => {
    const spellBlock = p.blocks.find(b => b.type === 'spell');
    if (!spellBlock) return false;
    try {
      const spellData = JSON.parse(spellBlock.content);
      const allowedClasses = (spellData.classes || []).map((c: string) => c.toLowerCase());
      return allowedClasses.includes(data.class.toLowerCase());
    } catch {
      return true;
    }
  });

  const getActionSuggestions = () => {
    const suggestionsList: { name: string; desc: string; type: string }[] = [];
    equipmentPages.forEach(p => {
      let damage = '1d6';
      let type = 'perforant';
      let stat: StatKey = 'str';
      const parsed = parseWeaponFromPage(p);

      Object.entries(WEAPONS_DATABASE).forEach(([wKey, wVal]) => {
        if (p.title.toLowerCase().includes(wKey)) {
          damage = wVal.damage;
          type = wVal.type;
          stat = wVal.stat;
        }
      });

      if (parsed && parsed.damage) {
        damage = parsed.damage;
        if (parsed.type) type = parsed.type;
      }
      const statMod = Math.floor((data.stats[stat] - 10) / 2);
      const toHit = statMod + data.profBonus;
      const damageBonus = statMod >= 0 ? `+${statMod}` : `${statMod}`;
      suggestionsList.push({
        name: p.title,
        desc: `${toHit >= 0 ? '+' : ''}${toHit} au toucher, dégâts ${damage}${damageBonus} ${type}.`,
        type: 'Arme'
      });
    });
    allPages.forEach(p => {
      if (p.category === 'regle' && p.tags.some(t => t.toLowerCase() === data.class.toLowerCase())) {
        const textContent = p.blocks.map(b => b.content.replace(/<[^>]*>/g, '')).join(' ');
        suggestionsList.push({
          name: p.title,
          desc: textContent.substring(0, 120) + (textContent.length > 120 ? '...' : ''),
          type: 'Capacité de Classe'
        });
      }
    });
    const speciesPage = allPages.find(p => p.category === 'regle' && (p.title.toLowerCase() === data.race.toLowerCase() || p.aliases.some(a => a.toLowerCase() === data.race.toLowerCase())));
    if (speciesPage) {
      speciesPage.blocks.forEach(b => {
        if (b.type === 'species') {
          try {
            const specData = JSON.parse(b.content);
            (specData.traits || []).forEach((tr: { name: string; description: string }) => {
              suggestionsList.push({
                name: tr.name,
                desc: tr.description,
                type: 'Trait d\'Espèce'
              });
            });
          } catch {}
        }
      });
    }
    const originPage = allPages.find(p => p.category === 'regle' && (p.title.toLowerCase() === data.background.toLowerCase() || p.aliases.some(a => a.toLowerCase() === data.background.toLowerCase())));
    if (originPage) {
      originPage.blocks.forEach(b => {
        if (b.type === 'origin') {
          try {
            const origData = JSON.parse(b.content);
            (origData.feats || []).forEach((feat: string) => {
              suggestionsList.push({
                name: feat,
                desc: `Don lié à l'historique ${data.background}.`,
                type: 'Don d\'Origine'
              });
            });
          } catch {}
        }
      });
    }
    return suggestionsList;
  };

  const actionSuggestions = getActionSuggestions();

  if (!isEditing) {
    const maxHp = parseInt(data.hp) || 10;
    const curHp = data.currentHp ?? maxHp;
    const hpPct = Math.max(0, Math.min(100, (curHp / maxHp) * 100));
    const conds = data.activeConditions || [];
    const penalty = data.exhaustion || 0;

    const isSavingThrowProficient = (statKey: string) => {
      const cls = (data.class || '').toLowerCase();
      if (cls.includes('guerrier') || cls.includes('fighter') || cls.includes('barbare') || cls.includes('paladin')) {
        return statKey === 'str' || statKey === 'con';
      }
      if (cls.includes('magicien') || cls.includes('wizard') || cls.includes('druide')) {
        return statKey === 'int' || statKey === 'wis';
      }
      if (cls.includes('voleur') || cls.includes('rogue') || cls.includes('barde') || cls.includes('ensorceleur')) {
        return statKey === 'dex' || statKey === 'cha';
      }
      if (cls.includes('prêtre') || cls.includes('pretre') || cls.includes('cleric') || cls.includes('rôdeur') || cls.includes('rodeur')) {
        return statKey === 'wis' || statKey === 'cha' || statKey === 'str' || statKey === 'dex';
      }
      return false;
    };

    const ds = data.deathSaves || { successes: 0, failures: 0 };
    const setDeathSaves = (successes: number, failures: number) => {
      onChange({ ...data, deathSaves: { successes, failures } });
    };

    const handleRollDeathSave = () => {
      const rollVal = Math.floor(Math.random() * 20) + 1;
      let newSuccesses = ds.successes;
      let newFailures = ds.failures;
      let details = "";

      if (rollVal === 20) {
        setTimeout(() => {
          onChange({ ...data, currentHp: 1, deathSaves: { successes: 0, failures: 0 } });
        }, 1000);
        details = "20 NATUREL ! Le personnage reprend conscience avec 1 PV !";
        window.dispatchEvent(new CustomEvent('dnd-roll', {
          detail: { characterName: data.name || 'Personnage', label: "Sauvegarde de Mort", formula: "d20", details, type: "Mort", finalResult: rollVal }
        }));
        return;
      } else if (rollVal === 1) {
        newFailures = Math.min(3, newFailures + 2);
        details = "1 NATUREL ! 2 Échecs.";
      } else if (rollVal >= 10) {
        newSuccesses = Math.min(3, newSuccesses + 1);
        details = "Réussite.";
      } else {
        newFailures = Math.min(3, newFailures + 1);
        details = "Échec.";
      }

      const successesFinal = newSuccesses;
      const failuresFinal = newFailures;
      
      setTimeout(() => {
        if (successesFinal >= 3) {
          onChange({ ...data, deathSaves: { successes: 0, failures: 0 } });
        } else if (failuresFinal >= 3) {
          onChange({ ...data, deathSaves: { successes: successesFinal, failures: failuresFinal } });
        } else {
          onChange({ ...data, deathSaves: { successes: successesFinal, failures: failuresFinal } });
        }
      }, 1000);

      details += ` (Sauvegardes: ${newSuccesses} R / ${newFailures} E)`;
      window.dispatchEvent(new CustomEvent('dnd-roll', {
        detail: { characterName: data.name || 'Personnage', label: "Sauvegarde de Mort", formula: "d20", details, type: "Mort", finalResult: rollVal }
      }));
    };

    const handleShortRest = () => {
      const nextResources = (data.resources || []).map(r => {
        if (r.recovery.toLowerCase().includes('court') || r.name.toLowerCase().includes('souffle')) {
          return { ...r, current: Math.min(r.max, r.current + 1) };
        }
        return r;
      });
      onChange({
        ...data,
        resources: nextResources,
        deathSaves: { successes: 0, failures: 0 }
      });
      window.dispatchEvent(new CustomEvent('dnd-roll', {
        detail: { characterName: data.name || 'Personnage', label: "Repos Court", formula: "Repos", details: "Ressources à récupération courte restaurées (+1 Second Souffle, etc.).", type: "Repos", finalResult: "Ok" }
      }));
    };

    const handleLongRest = () => {
      const nextResources = (data.resources || []).map(r => ({ ...r, current: r.max }));
      const nextSpellSlotsUsed = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const nextExhaustion = Math.max(0, (data.exhaustion || 0) - 1);
      onChange({
        ...data,
        currentHp: maxHp,
        tempHp: 0,
        resources: nextResources,
        spellSlotsUsed: nextSpellSlotsUsed,
        exhaustion: nextExhaustion,
        deathSaves: { successes: 0, failures: 0 }
      });
      window.dispatchEvent(new CustomEvent('dnd-roll', {
        detail: { characterName: data.name || 'Personnage', label: "Repos Long", formula: "Repos", details: `Repos complet : PV restaurés au max (${maxHp}), sorts/ressources réinitialisés. Épuisement : ${nextExhaustion}.`, type: "Repos", finalResult: "Ok" }
      }));
    };

    const toggleResourceSlot = (rIdx: number, slotIdx: number) => {
      const next = [...(data.resources || [])];
      if (next[rIdx]) {
        const res = next[rIdx];
        const cur = res.current;
        const nextVal = slotIdx < cur ? cur - 1 : cur + 1;
        next[rIdx] = { ...res, current: Math.max(0, Math.min(res.max, nextVal)) };
        onChange({ ...data, resources: next });
      }
    };

    // Sync weapons from EQUIPPED inventory items to combat actions
    const inventoryWeapons: typeof data.actions = [];
    const currentInvItems = data.inventoryItems || [];
    currentInvItems.forEach(item => {
      if (item.equipped) {
        const nameLower = item.name.toLowerCase();
        const spPage = allPages.find(p => p.category === 'regle' && (p.title.toLowerCase() === nameLower || p.aliases.some(a => a.toLowerCase() === nameLower)));
        let damage = '1d6';
        let type = 'perforant';
        let stat: StatKey = 'str';
        let parsed = spPage ? parseWeaponFromPage(spPage) : null;

        Object.entries(WEAPONS_DATABASE).forEach(([wKey, wVal]) => {
          if (nameLower.includes(wKey)) {
            damage = wVal.damage;
            type = wVal.type;
            stat = wVal.stat;
          }
        });

        if (parsed && parsed.damage) {
          damage = parsed.damage;
          if (parsed.type) type = parsed.type;
        }

        let rangeStr = '';
        if (parsed && (parsed.rangeMin || parsed.rangeMax)) {
          rangeStr = ` (Portée : ${parsed.rangeMin || 0}/${parsed.rangeMax || 0} m)`;
        }

        const statMod = Math.floor((data.stats[stat] - 10) / 2);
        const toHit = statMod + data.profBonus;
        const damageBonus = statMod >= 0 ? `+${statMod}` : `${statMod}`;

        let isVersatile = parsed?.properties.toLowerCase().includes('polyvalente');
        let damageDesc = '';
        if (parsed && parsed.damageDice && parsed.damageDice.length >= 2 && isVersatile) {
          const d1 = parsed.damageDice[0];
          const d2 = parsed.damageDice[1];
          const d1Str = `${d1.count}d${d1.die}${damageBonus}`;
          const d2Str = `${d2.count}d${d2.die}${damageBonus}`;
          damageDesc = `${d1Str} ${d1.damageType} (1 main) ou ${d2Str} ${d2.damageType} (2 mains)`;
        } else {
          damageDesc = `${damage}${damageBonus} ${type}`;
        }

        inventoryWeapons.push({
          name: item.name,
          desc: `${toHit >= 0 ? '+' : ''}${toHit} au toucher${rangeStr}, dégâts ${damageDesc}.`
        });
      }
    });

    // Sync spells from spells list to combat actions
    const spellActions: typeof data.actions = [];
    (data.spellsList || []).forEach(spName => {
      const spPage = allPages.find(p => p.category === 'regle' && p.title.toLowerCase() === spName.toLowerCase());
      const spBlock = spPage?.blocks.find(b => b.type === 'spell');
      if (spBlock) {
        try {
          const spVal = JSON.parse(spBlock.content);
          const desc = `Temps : ${spVal.castingTime} | Portée : ${spVal.range} | Effet : ${spVal.damageOrEffect || 'Aucun'}. ${spVal.description}`;
          spellActions.push({
            name: `Sort : ${spName}`,
            desc
          });
        } catch {
          spellActions.push({
            name: `Sort : ${spName}`,
            desc: `Lancer le sort ${spName}.`
          });
        }
      } else {
        spellActions.push({
          name: `Sort : ${spName}`,
          desc: `Lancer le sort ${spName}.`
        });
      }
    });

    const mergedActions = [...inventoryWeapons, ...spellActions];
    const mergedInventoryItems = currentInvItems;

    // AC Calculator based on equipped items
    const calcAC = () => {
      const dexMod = Math.floor((data.stats.dex - 10) / 2);
      let baseAc = 10;
      let addDex = true;
      let maxDex = 99;
      let shieldBonus = 0;
      
      currentInvItems.forEach(it => {
        if (it.equipped) {
          const nameLower = it.name.toLowerCase();
          const spPage = allPages.find(p => p.category === 'regle' && (p.title.toLowerCase() === nameLower || p.aliases.some(a => a.toLowerCase() === nameLower)));
          const parsed = spPage ? parseArmorFromPage(spPage) : null;
          
          if (parsed && parsed.shieldBonus !== null) {
            shieldBonus += parsed.shieldBonus;
          } else if (parsed && parsed.ac !== null) {
            baseAc = parsed.ac;
            const tagsLower = spPage?.tags.map(t => t.toLowerCase()) || [];
            if (tagsLower.includes('lourdes') || tagsLower.includes('lourde') || nameLower.includes('harnois') || nameLower.includes('plates') || nameLower.includes('mailles') || nameLower.includes('clibanion')) {
              addDex = false;
            } else if (tagsLower.includes('intermédiaires') || tagsLower.includes('intermediaire') || tagsLower.includes('moyennes') || nameLower.includes('chemise') || nameLower.includes('cuirasse') || nameLower.includes('écailles') || nameLower.includes('ecailles')) {
              maxDex = 2;
            }
          } else {
            if (nameLower.includes('bouclier')) {
              shieldBonus += 2;
            } else if (nameLower.includes('cotte') || nameLower.includes('cote') || nameLower.includes('harnois') || nameLower.includes('clibanion') || nameLower.includes('plates') || nameLower.includes('mailles')) {
              baseAc = 16;
              if (nameLower.includes('harnois') || nameLower.includes('plates')) baseAc = 18;
              addDex = false;
            } else if (nameLower.includes('chemise') || nameLower.includes('cuirasse') || nameLower.includes('écailles') || nameLower.includes('ecailles')) {
              baseAc = 13;
              if (nameLower.includes('cuirasse')) baseAc = 14;
              maxDex = 2;
            } else if (nameLower.includes('cuir') || nameLower.includes('matelassé') || nameLower.includes('matelasse')) {
              baseAc = 11;
              if (nameLower.includes('cuir clouté') || nameLower.includes('cuir cloute') || nameLower.includes('clouté') || nameLower.includes('cloute')) baseAc = 12;
            }
          }
        }
      });
      const dexContribution = addDex ? Math.min(dexMod, maxDex) : 0;
      return baseAc + dexContribution + shieldBonus;
    };

    const cleanAcInput = (data.ac || '').replace(/\s*\(.*?\)\s*/g, '').trim();
    const displayedAc = (cleanAcInput && cleanAcInput !== '10') ? cleanAcInput : String(calcAC());

    const dexMod = Math.floor((data.stats.dex - 10) / 2);
    const initTotal = dexMod - penalty;
    const initiativeStr = initTotal >= 0 ? `+${initTotal}` : `${initTotal}`;

    const baseSpeedMatch = data.speed.match(/(\d+(?:\.\d+)?)/);
    const baseSpeedVal = baseSpeedMatch ? parseFloat(baseSpeedMatch[1]) : 9;
    let finalSpeed = baseSpeedVal - (1.5 * penalty);
    
     if (totalWeight > maxCarry) finalSpeed = Math.max(0, finalSpeed - 3);
    if (conds.some(c => ['Agrippé', 'Restreint', 'Entravé', 'Paralysé', 'Pétrifié', 'Inconscient'].includes(c))) finalSpeed = 0;

    return (
      <div className="dnd-stat-block rounded-xl border border-amber-900/35 overflow-hidden bg-black/40 backdrop-blur-md text-xs shadow-xl space-y-4 pb-4 relative">
        
        {/* Header view */}
        <div className="px-5 pt-5 pb-3 bg-gradient-to-b from-[#1a0f05] to-black/30 border-b border-amber-950/25 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-950 flex items-center justify-center shadow-lg border border-gold-500/20 shrink-0">
              <User className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display text-white tracking-wide">{data.name || 'Personnage'}</h3>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">
                {[
                  data.race,
                  parseMulticlass(data.class, data.level, data.subclass)
                    .map(c => `${c.name}${c.subclass ? ` (${c.subclass})` : ''} Lvl ${c.level}`)
                    .join(' / '),
                  data.background,
                  data.alignment
                ].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 w-full md:w-1/2 font-sans">
            <div className="w-full flex flex-row items-center gap-4 justify-end">
              {/* PV Text */}
              <div className="flex flex-col items-end shrink-0 leading-tight">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Points de Vie</span>
                <div className="flex items-baseline gap-1.5">
                  <strong className="text-sm sm:text-base font-black text-red-400">{curHp} <span className="text-xs text-slate-500 font-bold">/ {maxHp}</span></strong>
                  {data.tempHp ? <span className="text-[9px] text-sky-400 font-black">({data.tempHp} Temp)</span> : null}
                </div>
              </div>

              {/* Thicker Progress Bar */}
              <div className="flex-1 h-3.5 bg-dark-950/80 border border-slate-900 rounded-full overflow-hidden relative shadow-inner shadow-black/60 hidden sm:block">
                <div 
                  className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full transition-all duration-300" 
                  style={{ width: `${hpPct}%` }} 
                />
              </div>

              {/* Larger buttons */}
              <div className="flex gap-1 shrink-0">
                {[-5, -1, 1, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleAdjustHp(v)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black transition cursor-pointer border text-[10px] ${
                      v < 0 
                        ? 'bg-red-950/50 border-red-500/30 text-red-400 hover:bg-red-900/40 hover:border-red-500/50' 
                        : 'bg-green-950/50 border-green-500/30 text-green-400 hover:bg-green-900/40 hover:border-green-500/50'
                    }`}
                    title={v > 0 ? `Ajouter ${v} PV` : `Retirer ${Math.abs(v)} PV`}
                  >
                    {v > 0 ? `+${v}` : v}
                  </button>
                ))}
              </div>
            </div>

            {curHp === 0 && (
              <div className="w-full mt-1 p-2 rounded-xl bg-red-950/40 border border-red-500/20 text-center space-y-2 max-w-xs">
                <span className="text-[10px] text-red-400 font-extrabold uppercase tracking-wider block">Sauvegardes de Mort</span>
                <div className="flex justify-center items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-green-400 font-bold uppercase mr-1">Réussites:</span>
                    {[1, 2, 3].map(i => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          const nextS = ds.successes === i ? i - 1 : i;
                          setDeathSaves(nextS, ds.failures);
                        }}
                        className={`w-3 h-3 rounded-full border transition cursor-pointer ${
                          ds.successes >= i ? 'bg-green-500 border-green-400' : 'bg-transparent border-slate-700 hover:border-green-500/50'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-red-400 font-bold uppercase mr-1">Échecs:</span>
                    {[1, 2, 3].map(i => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          const nextF = ds.failures === i ? i - 1 : i;
                          setDeathSaves(ds.successes, nextF);
                        }}
                        className={`w-3 h-3 rounded-full border transition cursor-pointer ${
                          ds.failures >= i ? 'bg-red-500 border-red-400' : 'bg-transparent border-slate-700 hover:border-red-500/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRollDeathSave}
                    className="px-2 py-0.5 bg-red-800 hover:bg-red-700 text-white font-extrabold text-[9px] rounded border border-red-600 transition cursor-pointer"
                  >
                    Lancer Jet de Mort
                  </button>
                </div>

                {ds.failures >= 3 && (
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-bounce mt-1">
                    ☠️ LE PERSONNAGE EST MORT ☠️
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Core Header Stats Strip */}
        <div className="mx-5 grid grid-cols-3 sm:grid-cols-7 gap-2 bg-[#0c0805]/45 border border-slate-900/60 rounded-xl p-2.5 text-center text-xs font-bold text-slate-350 font-sans">
          <div className="flex flex-col items-center justify-center p-1 rounded bg-black/10">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">CA</span>
            <strong className="text-lg font-black text-slate-200">{displayedAc}</strong>
          </div>
          <button
            type="button"
            onClick={() => setActiveRollRequest({ label: 'Initiative', bonus: dexMod })}
            className="flex flex-col items-center justify-center p-1 rounded bg-black/10 border border-transparent hover:border-gold-500/20 transition cursor-pointer w-full"
          >
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Initiative</span>
            <strong className="text-lg font-black text-slate-200">{initiativeStr}</strong>
          </button>
          <div className="flex flex-col items-center justify-center p-1 rounded bg-black/10">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Vitesse</span>
            <strong className="text-lg font-black text-slate-200">{finalSpeed} m</strong>
          </div>
          <div className="flex flex-col items-center justify-center p-1 rounded bg-black/10">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Maîtrise</span>
            <strong className="text-lg font-black text-gold-450">+{data.profBonus}</strong>
          </div>
          <div className="flex flex-col items-center justify-center p-1 rounded bg-black/10">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Perception P.</span>
            <strong className="text-lg font-black text-slate-200">
              {(() => {
                const wisMod = Math.floor((data.stats.wis - 10) / 2);
                const isExpert = (data.expertSkills || []).includes('Perception');
                const isProf = (data.proficientSkills || []).includes('Perception') || isExpert;
                const bonus = isExpert ? data.profBonus * 2 : isProf ? data.profBonus : 0;
                return 10 + wisMod + bonus;
              })()}
            </strong>
          </div>
          <div className="flex flex-col items-center justify-center p-1 rounded bg-black/10">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Intuition P.</span>
            <strong className="text-lg font-black text-slate-200">
              {(() => {
                const wisMod = Math.floor((data.stats.wis - 10) / 2);
                const isExpert = (data.expertSkills || []).includes('Intuition');
                const isProf = (data.proficientSkills || []).includes('Intuition') || isExpert;
                const bonus = isExpert ? data.profBonus * 2 : isProf ? data.profBonus : 0;
                return 10 + wisMod + bonus;
              })()}
            </strong>
          </div>
          <div className="flex flex-col items-center justify-center p-1 rounded bg-black/10">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Épuisement</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <button type="button" onClick={() => set('exhaustion', Math.max(0, penalty - 1))} className="w-3.5 h-3.5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center font-bold text-[9px] cursor-pointer">-</button>
              <strong className="text-lg font-black text-amber-400">{penalty}</strong>
              <button type="button" onClick={() => set('exhaustion', Math.min(10, penalty + 1))} className="w-3.5 h-3.5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center font-bold text-[9px] cursor-pointer">+</button>
            </div>
          </div>
        </div>

        {/* Conditions Bar */}
        <div className="mx-5 p-2 bg-[#090503]/50 border border-slate-900 rounded-xl space-y-1.5">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">États & Conditions Actives</span>
          <div className="flex flex-wrap gap-1">
            {CONDITIONS_LIST.map(cond => {
              const isActive = conds.includes(cond);
              return (
                <button
                  type="button"
                  key={cond}
                  onClick={() => {
                    const active = [...conds];
                    if (active.includes(cond)) {
                      set('activeConditions', active.filter(c => c !== cond));
                    } else {
                      set('activeConditions', [...active, cond]);
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition border cursor-pointer ${
                    isActive 
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 font-extrabold shadow-sm' 
                      : 'bg-white/2 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {cond}
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency and Rests Bar */}
        <div className="mx-5 flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#0d0703]/40 border border-amber-950/15 rounded-xl p-2 font-sans select-none">
          {/* Coins list */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-350 font-bold tracking-wider">
            {currencyRates.map(rate => {
              let bgCls = "bg-yellow-500 border-yellow-600 shadow-yellow-500/20";
              const id = rate.id.toLowerCase();
              if (id.includes('copper') || id === 'pc') bgCls = "bg-amber-700/80 border-amber-800 shadow-amber-600/20";
              else if (id.includes('silver') || id === 'pa') bgCls = "bg-slate-400/80 border-slate-500 shadow-slate-300/20";
              else if (id.includes('electrum') || id === 'pe') bgCls = "bg-blue-400/80 border-blue-500 shadow-blue-400/20";
              else if (id.includes('platinum') || id === 'pp') bgCls = "bg-slate-200 border-slate-300 shadow-slate-100/20";
              else if (id.includes('gold') || id === 'po') bgCls = "bg-yellow-500 border-yellow-600 shadow-yellow-500/20";
              else {
                bgCls = "bg-purple-500 border-purple-600 shadow-purple-500/20";
              }
              const match = rate.name.match(/\(([^)]+)\)/);
              const suffix = match ? match[1].toUpperCase() : rate.id.toUpperCase();
              return (
                <div key={rate.id} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full border shadow-sm ${bgCls}`} />
                  <span>{data[rate.id] ?? 0} {suffix}</span>
                </div>
              );
            })}
          </div>

          {/* Rests buttons */}
          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleShortRest}
              className="px-3 py-1 bg-[#160e0a] hover:bg-[#251810] text-slate-300 text-[10px] font-bold rounded-lg border border-gold-500/20 transition cursor-pointer"
            >
              Repos Court
            </button>
            <button
              type="button"
              onClick={handleLongRest}
              className="px-3 py-1 bg-amber-700/80 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg border border-amber-800 transition cursor-pointer"
            >
              Repos Long
            </button>
          </div>
        </div>

        {/* Two-Column Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-5 pt-1 items-start">
          
          {/* Left Column: Stats & Skills */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
            
            {/* Characteristics stack (2 columns of 3 vertical rectangles) */}
            <div className="grid grid-cols-2 gap-2">
              {STAT_LABELS.map(({ key, label }) => {
                const val = data.stats[key];
                const baseBonus = Math.floor((val - 10) / 2);
                const finalBonus = baseBonus - penalty;
                const saveBonus = baseBonus + (isSavingThrowProficient(key) ? data.profBonus : 0);
                const finalSaveBonus = saveBonus - penalty;

                return (
                  <div
                    key={key}
                    onClick={() => setActiveRollRequest({ label, bonus: baseBonus })}
                    className="glass-panel py-2 px-1 rounded-2xl border border-slate-800/40 hover:border-gold-500/25 transition duration-305 text-center group cursor-pointer flex flex-col items-center justify-between bg-black/20 h-28 relative"
                  >
                    {/* Stat label */}
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5 select-none">
                      {label}
                    </span>

                    {/* Modifier */}
                    <div className="text-2xl font-black text-slate-100 group-hover:scale-105 transition-transform duration-200 leading-none">
                      {finalBonus >= 0 ? `+${finalBonus}` : finalBonus}
                    </div>

                    {/* Raw Score */}
                    <span className="text-[10px] font-bold text-slate-500 block select-none">
                      {val}
                    </span>

                    {/* Saving throw pill */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering the attribute check
                        setActiveRollRequest({ label: `Sauvegarde de ${label}`, bonus: saveBonus });
                      }}
                      className="w-16 py-0.5 rounded-full border border-gold-500/30 bg-gold-500/5 hover:bg-gold-500/15 text-[8.5px] font-black text-gold-450 uppercase transition cursor-pointer mb-1 shadow-sm leading-none shrink-0"
                    >
                      SAU {finalSaveBonus >= 0 ? `+${finalSaveBonus}` : finalSaveBonus}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Compétences (Skills) Card */}
            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800/40 bg-[#0b0704]/40">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-2 border-b border-slate-900/45 pb-1">Compétences</span>
              <div className="space-y-1 font-sans">
                {SKILLS_LIST.map(skill => {
                  const statVal = data.stats[skill.stat];
                  const statMod = Math.floor((statVal - 10) / 2);
                  const isExpert = (data.expertSkills || []).includes(skill.name);
                  const isProf = (data.proficientSkills || []).includes(skill.name) || isExpert;
                  const totalBonus = statMod + (isExpert ? data.profBonus * 2 : isProf ? data.profBonus : 0);
                  const finalBonus = totalBonus - penalty;
                  const rollKey = `Skill_${skill.name}`;
                  
                  return (
                    <div
                      key={skill.name}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('.prof-bullet')) return;
                        setActiveRollRequest({ label: rollKey, bonus: totalBonus });
                      }}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-white/5 transition text-xs cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSkillProficiency(skill.name);
                          }}
                          className="prof-bullet w-3.5 h-3.5 flex items-center justify-center shrink-0 text-amber-500 hover:text-amber-400 text-xs font-bold cursor-pointer"
                        >
                          {isExpert ? '◈' : isProf ? '●' : '○'}
                        </button>
                        <span className={`font-semibold ${isExpert ? 'text-gold-450 font-black' : isProf ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>{skill.name}</span>
                        <span className="text-[8px] text-slate-500 uppercase font-bold ml-1">({STAT_LABELS.find(l => l.key === skill.stat)?.label})</span>
                      </div>
                      
                      <span className="text-[11px] font-black text-slate-400 group-hover:text-gold-450 transition select-none">
                        {finalBonus >= 0 ? `+${finalBonus}` : finalBonus}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Tabbed Content */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-4 border-l border-slate-900/30 pl-0 md:pl-4">
            
            {/* Tab controls */}
            <div className="flex border-b border-slate-900/40 pb-1.5 gap-2 select-none">
              {[
                { id: 'fiche', label: 'Fiche' },
                { id: 'spells', label: 'Sorts' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition cursor-pointer ${
                    activeTab === t.id 
                      ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20 shadow-md shadow-gold-500/5'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Fiche (Actions, Inventaire, Traits & Maîtrises regroupés) */}
            {activeTab === 'fiche' && (
              <div className="py-2 space-y-6">

                {/* Section 1: Attaques & Aptitudes (Combat) */}
                <div className="space-y-4">
                  {/* Weapons attacks list */}
                  <div>
                    <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 border-b border-slate-900 pb-1"><Swords className="w-3.5 h-3.5" /> Attaques</h4>
                    <div className="space-y-1.5">
                      {mergedActions.filter(a => !a.name.toLowerCase().includes('sort :')).map((act, i) => {
                        const toHitMatch = act.desc.match(/([+-]\d+)\s*au\s*toucher/i);
                        const toHitBonus = toHitMatch ? parseInt(toHitMatch[1]) : 0;
                        const finalBonus = toHitBonus - penalty;
                        const rollKey = `Action_${act.name}_${i}`;
                        const formula = `d20 ${finalBonus >= 0 ? '+' : ''}${finalBonus}`;
                        const tooltip = `D20 + Attaque (${toHitBonus >= 0 ? '+' : ''}${toHitBonus})${penalty > 0 ? ` - Épuisement (${penalty})` : ''}`;

                        const dmgFormula = parseDmgFormula(act.desc);
                        const dmgKey = `Dmg_${act.name}_${i}`;

                        return (
                          <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/2 border border-white/5">
                            <div>
                              <strong className="text-slate-200 block text-sm font-bold">{act.name}</strong>
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{act.desc}</p>
                            </div>
                            {(toHitMatch || dmgFormula) && (
                              <div className="flex items-center gap-3 shrink-0">
                                {toHitMatch && (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <div className="group/tool relative inline-block">
                                      <span className="text-[10px] font-bold text-slate-500 cursor-help border-b border-dotted border-slate-750 px-1 select-none">
                                        {formula}
                                      </span>
                                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 w-32 -translate-x-1/2 rounded bg-black/90 border border-gold-500/20 p-1.5 text-[8px] text-slate-300 shadow-xl opacity-0 group-hover/tool:opacity-100 transition-opacity duration-150 text-center leading-normal">
                                        {tooltip}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRoll(rollKey, toHitBonus, getRollMode(act.name))}
                                      className="px-3 py-1.5 rounded-lg border border-gold-500/25 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 font-bold text-xs transition duration-200 cursor-pointer min-w-[75px]"
                                    >
                                      Lancer
                                    </button>
                                  </div>
                                )}

                                {dmgFormula && (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <div className="group/dmg relative inline-block">
                                      <span className="text-[10px] font-bold text-slate-500 cursor-help border-b border-dotted border-slate-750 px-1 select-none">
                                        {dmgFormula}
                                      </span>
                                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 w-32 -translate-x-1/2 rounded bg-black/90 border border-red-500/20 p-1.5 text-[8px] text-slate-350 shadow-xl opacity-0 group-hover/dmg:opacity-100 transition-opacity duration-150 text-center leading-normal">
                                        Formule de dégâts
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRollDmg(dmgKey, dmgFormula)}
                                      className="px-3 py-1.5 rounded-lg border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition duration-200 cursor-pointer min-w-[75px]"
                                    >
                                      Dégâts
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Weapon Mastery Actions / Bottes d'armes */}
                  {data.weaponMasteries && (
                    <div className="mt-3">
                      <span className="text-[10px] font-black text-amber-600/80 uppercase tracking-widest block mb-2 select-none">Bottes de Maîtrise d'Armes</span>
                      <div className="space-y-1.5">
                        {(data.inventoryItems || [])
                          .filter(it => it.equipped)
                          .map((it, idx) => {
                            const nameLower = it.name.toLowerCase();
                            const masteryStr = (data.weaponMasteries || '').toLowerCase();
                            const isMastered = masteryStr.includes(nameLower) ||
                                               nameLower.split(' ').some(w => masteryStr.includes(w));
                            if (!isMastered) return null;

                            const wpPage = allPages.find(p => (p.category === 'regle' || p.category === 'arme') && (p.title.toLowerCase() === nameLower || p.aliases.some(a => a.toLowerCase() === nameLower)));
                            const parsedWeapon = wpPage ? parseWeaponFromPage(wpPage) : null;
                            const rawMastery = parsedWeapon?.mastery || '';
                            if (!rawMastery) return null;

                            const allMasteries = getWeaponMasteries(allPages);
                            const matchedMastery = allMasteries.find(m => {
                              const mNameLower = m.name.toLowerCase();
                              const rawLower = rawMastery.toLowerCase();
                              if (rawLower.includes(mNameLower)) return true;
                              if (mNameLower === 'coup double' && (rawLower.includes('nick') || rawLower.includes('entaille') || rawLower.includes('coup double'))) return true;
                              if (mNameLower === 'ouverture' && (rawLower.includes('vex') || rawLower.includes('harceler') || rawLower.includes('ouverture'))) return true;
                              if (mNameLower === 'écorchure' && (rawLower.includes('graze') || rawLower.includes('écorchure') || rawLower.includes('ecorchure'))) return true;
                              if (mNameLower === 'enchaînement' && (rawLower.includes('cleave') || rawLower.includes('enchaînement') || rawLower.includes('enchainement'))) return true;
                              if (mNameLower === 'poussée' && (rawLower.includes('push') || rawLower.includes('poussée') || rawLower.includes('poussee'))) return true;
                              if (mNameLower === 'ralentissement' && (rawLower.includes('slow') || rawLower.includes('ralentissement'))) return true;
                              if (mNameLower === 'renversement' && (rawLower.includes('topple') || rawLower.includes('renversement'))) return true;
                              if (mNameLower === 'sape' && (rawLower.includes('sap') || rawLower.includes('sape'))) return true;
                              return false;
                            });

                            if (!matchedMastery) return null;

                            return (
                              <div key={idx} className="p-3 rounded-lg bg-white/2 border border-amber-500/10 flex justify-between items-start gap-3 font-sans">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-[9px] uppercase tracking-wide">
                                      Botte : {matchedMastery.name}
                                    </span>
                                    <strong className="text-slate-350 text-xs font-bold">{it.name}</strong>
                                  </div>
                                  <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
                                    {matchedMastery.description}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    window.dispatchEvent(new CustomEvent('dnd-roll', {
                                      detail: {
                                        characterName: data.name || 'Personnage',
                                        label: `Botte : ${matchedMastery.name}`,
                                        formula: "Action Spéciale",
                                        details: matchedMastery.description,
                                        type: "Botte",
                                        finalResult: "ACTIVÉ"
                                      }
                                    }));
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-amber-500/25 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs transition duration-200 cursor-pointer shrink-0 mt-0.5"
                                >
                                  Déclencher
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Ressources tracker */}
                  {data.resources && data.resources.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 border-b border-slate-900 pb-1">⚡ Ressources & Aptitudes</h4>
                      <div className="space-y-2">
                        {data.resources.map((res, rIdx) => (
                          <div key={rIdx} className="p-3 rounded-lg bg-white/2 border border-white/5 flex justify-between items-center">
                            <div>
                              <strong className="text-slate-200 block text-xs font-bold">{res.name}</strong>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{res.desc} ({res.recovery})</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-4">
                              {Array.from({ length: res.max }).map((_, slotIdx) => {
                                const isAvailable = slotIdx < res.current;
                                return (
                                  <button
                                    type="button"
                                    key={slotIdx}
                                    onClick={() => toggleResourceSlot(rIdx, slotIdx)}
                                    className={`w-3.5 h-3.5 rounded-full border transition cursor-pointer flex items-center justify-center ${
                                      isAvailable 
                                        ? 'bg-amber-500 border-amber-400 shadow shadow-amber-500/20' 
                                        : 'bg-transparent border-slate-700 hover:border-amber-500/50'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 2: Inventaire & Équipements */}
                <div className="space-y-4 pt-4 border-t border-slate-900/60 font-sans">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-amber-600" /> Sacoche & Équipements</h4>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{totalWeight} kg / {maxCarry} kg</span>
                  </div>
                  <div className="w-full h-2 bg-dark-950 border border-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${totalWeight > maxCarry ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${weightPct}%` }} />
                  </div>

                  <div className="space-y-1">
                    {mergedInventoryItems.map((it, i) => {
                      const isEquippable = it.name.toLowerCase().includes('maille') || 
                                          it.name.toLowerCase().includes('cuirasse') || 
                                          it.name.toLowerCase().includes('cuir') || 
                                          it.name.toLowerCase().includes('bouclier') ||
                                          it.name.toLowerCase().includes('plates') ||
                                          it.name.toLowerCase().includes('harnois') ||
                                          Object.keys(WEAPONS_DATABASE).some(w => it.name.toLowerCase().includes(w));
                      return (
                        <div key={i} className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/2 border border-white/5 font-sans text-xs">
                          <div className="flex items-center gap-2">
                            {isEquippable && (
                              <button
                                type="button"
                                onClick={() => toggleItemEquipped(i)}
                                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase transition border cursor-pointer ${
                                  it.equipped
                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-extrabold shadow-sm'
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                }`}
                              >
                                {it.equipped ? 'Porté' : 'Porter'}
                              </button>
                            )}
                            <span className={`font-semibold ${it.equipped ? 'text-amber-300 font-bold' : 'text-slate-200'}`}>
                              {it.name} (x{it.qty || 1})
                            </span>
                          </div>
                          <span className="text-slate-500 font-bold">{Math.round((it.weight * (it.qty || 1)) * 10) / 10} kg</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Traits, Dons & Maîtrises */}
                <div className="space-y-4 pt-4 border-t border-slate-900/60 font-sans">
                  <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> Traits, Dons & Maîtrises</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1 select-none">Maîtrise d'Armes</span>
                      <p className="text-xs text-slate-350 bg-white/2 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                        {data.weaponMasteries || "Aucune maîtrise d'armes définie."}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1 select-none">Maîtrises Générales</span>
                      <p className="text-xs text-slate-350 bg-white/2 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                        {data.generalProficiencies || "Aucune maîtrise générale définie."}
                      </p>
                    </div>
                  </div>

                  {data.traits.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {data.traits.map((tr, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white/2 border border-white/5">
                          <strong className="text-slate-200 block mb-0.5 font-bold text-xs">{tr.split(':')[0]}</strong>
                          <p className="text-[10px] text-slate-400 leading-normal">{tr.split(':')[1] || 'Trait passif.'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Tab: Spells (Sorts) */}
            {activeTab === 'spells' && (
              <div className="py-2 space-y-4 font-sans">
                <div className="grid grid-cols-3 gap-3 p-3 bg-[#0c0805]/45 border border-slate-900/60 rounded-xl text-center text-slate-355">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider font-sans">Carac. Incantation</span>
                    <strong className="text-slate-200">{data.spellcastingAbility}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider font-sans">DD de Sauvegarde</span>
                    <strong className="text-gold-400">{data.spellSaveDc ? (data.spellSaveDc - penalty) : 10}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider font-sans">Bonus Attaque</span>
                    <strong className="text-slate-200">+{data.spellAttackBonus ? (data.spellAttackBonus - penalty) : 2}</strong>
                  </div>
                </div>

                {/* Spell Slots tracker */}
                <div>
                  <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 border-b border-slate-900 pb-1">⚡ Emplacements de Sorts</h4>
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, lvlIdx) => {
                      const max = (data.spellSlotsMax || [0, 0, 0, 0, 0, 0, 0, 0, 0])[lvlIdx];
                      if (max === 0) return null;
                      const used = (data.spellSlotsUsed || [0, 0, 0, 0, 0, 0, 0, 0, 0])[lvlIdx];
                      return (
                        <div key={lvlIdx} className="p-2.5 rounded-lg bg-white/2 border border-white/5 flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-350">Niveau {lvlIdx + 1}</span>
                          <div className="flex gap-1.5">
                            {Array.from({ length: max }).map((_, slotIdx) => {
                              const isUsed = slotIdx < used;
                              return (
                                <button
                                  type="button"
                                  key={slotIdx}
                                  onClick={() => {
                                    const nextUsed = [...(data.spellSlotsUsed || [0, 0, 0, 0, 0, 0, 0, 0, 0])];
                                    const nextVal = slotIdx < used ? used - 1 : used + 1;
                                    nextUsed[lvlIdx] = Math.max(0, Math.min(max, nextVal));
                                    onChange({ ...data, spellSlotsUsed: nextUsed });
                                  }}
                                  className={`w-3.5 h-3.5 rounded-full border transition cursor-pointer flex items-center justify-center ${
                                    isUsed
                                      ? 'bg-amber-500 border-amber-400 shadow shadow-amber-500/20'
                                      : 'bg-transparent border-slate-700 hover:border-amber-500/50'
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Spell Casting Slot Selector Modal/Inline */}
                {activeSpellCast && (
                  <div className="p-4 rounded-xl border border-gold-500/30 bg-[#160f0a] space-y-3 animate-in fade-in duration-150">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Incanter : {activeSpellCast.title}</h4>
                      <button type="button" onClick={() => setActiveSpellCast(null)} className="text-slate-400 hover:text-slate-200 text-xs">✕</button>
                    </div>
                    <p className="text-xs text-slate-450">Choisissez le niveau de l'emplacement à consommer pour lancer ce sort.</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const lvl = i + 1;
                        const max = (data.spellSlotsMax || [0,0,0,0,0])[i];
                        if (max === 0 || lvl < activeSpellCast.baseLevel) return null;
                        const used = (data.spellSlotsUsed || [0,0,0,0,0])[i];
                        const remaining = max - used;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            disabled={remaining <= 0}
                            onClick={() => executeSpellCast(activeSpellCast.title, activeSpellCast.baseLevel, lvl, activeSpellCast.damageFormula)}
                            className={`flex-1 min-w-[70px] py-2 px-3 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center ${
                              remaining > 0
                                ? 'border-gold-500/20 bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 cursor-pointer'
                                : 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <span>Lvl {lvl}</span>
                            <span className="text-[9px] font-normal text-slate-500">{remaining} dispo</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Spellbook Sections */}
                <div className="space-y-4 pt-2">
                  {/* Tours de magie (Niveau 0) */}
                  <div>
                    <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 border-b border-slate-900 pb-1">🪄 Tours de magie (Niveau 0)</h4>
                    <div className="space-y-1.5">
                      {(data.spellsList || []).map(spellName => {
                        const page = allPages.find(p => p.title === spellName && p.category === 'regle');
                        const spellBlock = page?.blocks.find(b => b.type === 'spell');
                        if (!spellBlock) return null;
                        try {
                          const spellData = JSON.parse(spellBlock.content);
                          if (spellData.level !== 0) return null;
                          return renderSpellRow(spellName, spellData, 0);
                        } catch {
                          return null;
                        }
                      })}
                      {!(data.spellsList || []).some(spellName => {
                        const page = allPages.find(p => p.title === spellName && p.category === 'regle');
                        const spellBlock = page?.blocks.find(b => b.type === 'spell');
                        try {
                          return spellBlock && JSON.parse(spellBlock.content).level === 0;
                        } catch {
                          return false;
                        }
                      }) && (
                        <p className="text-xs text-slate-500 italic px-1">Aucun tour de magie connu.</p>
                      )}
                    </div>
                  </div>

                  {/* Sorts de Niveau 1+ */}
                  <div>
                    <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 border-b border-slate-900 pb-1">🔮 Sorts préparés & connus (Niveau 1+)</h4>
                    <div className="space-y-1.5">
                      {(data.spellsList || []).map(spellName => {
                        const page = allPages.find(p => p.title === spellName && p.category === 'regle');
                        const spellBlock = page?.blocks.find(b => b.type === 'spell');
                        if (!spellBlock) return null;
                        try {
                          const spellData = JSON.parse(spellBlock.content);
                          if (spellData.level === 0) return null;
                          return renderSpellRow(spellName, spellData, spellData.level);
                        } catch {
                          return null;
                        }
                      })}
                      {!(data.spellsList || []).some(spellName => {
                        const page = allPages.find(p => p.title === spellName && p.category === 'regle');
                        const spellBlock = page?.blocks.find(b => b.type === 'spell');
                        try {
                          return spellBlock && JSON.parse(spellBlock.content).level > 0;
                        } catch {
                          return false;
                        }
                      }) && (
                        <p className="text-xs text-slate-500 italic px-1">Aucun sort de niveau 1+ connu.</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Roll Mode Selector Modal */}
        {activeRollRequest && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[2px] font-sans">
            <div className="p-5 rounded-2xl bg-[#110b06] border border-gold-500/30 shadow-2xl text-center space-y-4 max-w-xs w-full animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">Mode de Jet</h4>
              <p className="text-xs font-bold text-slate-200">{activeRollRequest.label.replace('Skill_', 'Compétence : ').replace('Initiative', 'Initiative')}</p>
              
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleRoll(activeRollRequest.label, activeRollRequest.bonus, 'normal');
                    setActiveRollRequest(null);
                  }}
                  className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition cursor-pointer"
                >
                  Normal (1d20)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRoll(activeRollRequest.label, activeRollRequest.bonus, 'advantage');
                    setActiveRollRequest(null);
                  }}
                  className="w-full py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold transition cursor-pointer"
                >
                  Avantage (2d20, garde le max)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRoll(activeRollRequest.label, activeRollRequest.bonus, 'disadvantage');
                    setActiveRollRequest(null);
                  }}
                  className="w-full py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition cursor-pointer"
                >
                  Désavantage (2d20, garde le min)
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setActiveRollRequest(null)}
                className="text-[10px] text-slate-550 hover:text-slate-400 uppercase font-black tracking-wider block mx-auto pt-2 cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  const inputCls = "w-full bg-dark-900/80 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-gold-500/50 placeholder-slate-600";
  const labelCls = "block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1";

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gold-500/8 border border-gold-500/15">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <input value={data.name} onChange={e => set('name', e.target.value)} placeholder="Nom du personnage..." className={inputCls} />
          <button onClick={handleGenerate} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-dark-950 font-black rounded-lg transition">
            <Dices className="w-3.5 h-3.5" /> Générer Auto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850">
        <div className="col-span-2"><label className={labelCls}>Points de Vie Max</label><input value={data.hp} onChange={e => set('hp', e.target.value)} placeholder="10" className={inputCls} /></div>
        <div className="col-span-2"><label className={labelCls}>Points de Vie Actuels</label><input type="number" value={data.currentHp ?? 10} onChange={e => set('currentHp', parseInt(e.target.value) || 10)} className={inputCls} /></div>
        <div><label className={labelCls}>CA</label><input value={data.ac} onChange={e => set('ac', e.target.value)} placeholder="10" className={inputCls} /></div>
        <div><label className={labelCls}>Vitesse de base</label><input value={data.speed} onChange={e => set('speed', e.target.value)} placeholder="9 m" className={inputCls} /></div>
        <div><label className={labelCls}>Maîtrise</label><input type="number" value={data.profBonus} onChange={e => set('profBonus', parseInt(e.target.value) || 2)} className={inputCls} /></div>
        <div><label className={labelCls}>FP</label><input value={data.cr} onChange={e => set('cr', e.target.value)} placeholder="1/4" className={inputCls} /></div>
      </div>

      {/* Identity Details - Row 1 (Unchanging elements) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850 font-sans">
        <div>
          <label className={labelCls}>Espèce / Race</label>
          <input value={data.race} onChange={e => set('race', e.target.value)} placeholder="Humain..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Historique (Origine)</label>
          <input value={data.background} onChange={e => set('background', e.target.value)} placeholder="Acolyte..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Type (Statblock)</label>
          <input value={data.type} onChange={e => set('type', e.target.value)} placeholder="Humanoïde..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Alignement</label>
          <input value={data.alignment} onChange={e => set('alignment', e.target.value)} placeholder="Neutre..." className={inputCls} />
        </div>
      </div>

      {/* Identity Details - Row 2 (Classes & levels) */}
      <div className="bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850 space-y-3 font-sans">
        <label className={labelCls}>Classes, Niveaux & Sous-classes</label>
        <div className="space-y-2 mt-1">
          {parseMulticlass(data.class, data.level, data.subclass).map((c, idx, arr) => (
            <div key={idx} className="flex gap-2 items-end bg-black/15 p-2 rounded-lg border border-slate-900/40">
              <div className="flex-1">
                <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Classe</label>
                <input
                  value={c.name}
                  onChange={e => {
                    const next = arr.map((item, i) => i === idx ? { ...item, name: e.target.value } : item);
                    updateMulticlass(next);
                  }}
                  placeholder="Classe (ex: Guerrier)..."
                  className={inputCls}
                />
              </div>
              <div className="flex-1">
                <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Sous-classe</label>
                <input
                  value={c.subclass || ''}
                  onChange={e => {
                    const next = arr.map((item, i) => i === idx ? { ...item, subclass: e.target.value } : item);
                    updateMulticlass(next);
                  }}
                  placeholder="Sous-classe (ex: Champion)..."
                  className={inputCls}
                />
              </div>
              <div className="w-20">
                <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Niveau</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={c.level}
                  onChange={e => {
                    const next = arr.map((item, i) => i === idx ? { ...item, level: parseInt(e.target.value) || 1 } : item);
                    updateMulticlass(next);
                  }}
                  className={inputCls}
                />
              </div>
              {arr.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const next = arr.filter((_, i) => i !== idx);
                    updateMulticlass(next);
                  }}
                  className="text-red-500 hover:text-red-400 font-bold p-1.5 shrink-0 cursor-pointer mb-0.5"
                  title="Supprimer cette classe"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const current = parseMulticlass(data.class, data.level, data.subclass);
            updateMulticlass([...current, { name: 'Magicien', level: 1, subclass: '' }]);
          }}
          className="mt-2 text-[10px] text-gold-500 hover:text-gold-400 font-bold underline block cursor-pointer"
        >
          + Ajouter une classe (Multiclasser)
        </button>
      </div>

      {/* Stats Grid */}
      <div className="bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850">
        <label className={labelCls}>Caractéristiques de base</label>
        <div className="grid grid-cols-6 gap-1.5 mt-1">
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key} className="text-center">
              <span className="text-[9px] font-bold text-amber-700 uppercase mb-1 block">{label}</span>
              <input
                type="number" min={1} max={30}
                value={data.stats[key]}
                onChange={e => setStat(key, parseInt(e.target.value) || 10)}
                className="w-full bg-dark-900 border border-slate-850 text-center text-amber-300 text-xs font-bold py-1 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Spells config */}
      <div className="bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850 space-y-2">
        <h4 className="text-[10px] font-bold text-gold-450 uppercase border-b border-slate-850 pb-1">Sortilèges & Grimoire</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelCls}>Carac. Sorts</label>
            <input value={data.spellcastingAbility} onChange={e => set('spellcastingAbility', e.target.value)} placeholder="Charisme" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>DD Sauvegarde</label>
            <input type="number" value={data.spellSaveDc} onChange={e => set('spellSaveDc', parseInt(e.target.value) || 10)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Bonus Attaque</label>
            <input type="number" value={data.spellAttackBonus} onChange={e => set('spellAttackBonus', parseInt(e.target.value) || 2)} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Emplacements Max (Lvls 1 à 5)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const maxSlots = (data.spellSlotsMax || [0, 0, 0, 0, 0, 0, 0, 0, 0]);
              return (
                <div key={i} className="text-center">
                  <div className="text-[8px] text-slate-500 font-bold">Lvl {i + 1}</div>
                  <input
                    type="number" min={0} max={10}
                    value={maxSlots[i]}
                    onChange={e => {
                      const next = [...maxSlots];
                      next[i] = parseInt(e.target.value) || 0;
                      set('spellSlotsMax', next);
                    }}
                    className="w-full bg-dark-900 border border-slate-850 text-center text-xs py-1 rounded-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Add spell list */}
        <div>
          <label className={labelCls}>Ajouter un sort</label>
          <div className="flex gap-1.5">
            <select value={selectedSpellToAdd} onChange={e => setSelectedSpellToAdd(e.target.value)} className={inputCls + ' cursor-pointer'}>
              <option value="">Sélectionner un sort...</option>
              {filteredAvailableSpells.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
            </select>
            <button onClick={handleAddSpell} className="px-3 bg-gold-600 hover:bg-gold-500 text-dark-950 font-bold rounded-lg">Ajouter</button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(data.spellsList || []).map((s, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-gold-550/10 border border-gold-500/20 text-gold-400">
                {s}
                <button onClick={() => handleRemoveSpell(s)} className="text-gold-500 hover:text-red-400 font-bold">✕</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trésor & Sac Config */}
      <div className="bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850 space-y-3">
        <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider border-b border-slate-800 pb-1">Sac de transport & Pièces</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {currencyRates.map(rate => {
            const label = rate.name.replace('Pièces de ', '').replace("Pièces d'", '').replace('Pièces ', '');
            return (
              <div key={rate.id}>
                <label className={labelCls}>{label}</label>
                <input
                  type="number"
                  value={data[rate.id] ?? 0}
                  onChange={e => set(rate.id, parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
              </div>
            );
          })}
        </div>
        {/* Real-time Carry Weight Bar */}
        <div className="pt-2 border-t border-slate-900/60 font-sans space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Poids Total Actuel (Bourse incluse)</span>
            <span className="font-bold text-slate-350">{totalWeight} kg / {maxCarry} kg</span>
          </div>
          <div className="w-full h-2 bg-dark-950 border border-slate-900 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${totalWeight > maxCarry ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${weightPct}%` }} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Ajouter un équipement</label>
          <div className="flex gap-1.5 items-end mt-1">
            <div className="flex-1">
              <select
                value={newItem.name}
                onChange={e => {
                  const val = e.target.value;
                  let weight = newItem.weight;
                  const spPage = allPages.find(p => p.title === val && p.category === 'regle');
                  if (spPage) {
                    const parsedWeapon = parseWeaponFromPage(spPage);
                    const parsedArmor = parseArmorFromPage(spPage);
                    if (parsedWeapon.weight !== null) {
                      weight = parsedWeapon.weight;
                    } else if (parsedArmor.weight !== null) {
                      weight = parsedArmor.weight;
                    }
                  } else {
                    Object.entries(WEAPONS_DATABASE).forEach(([wKey, wVal]) => {
                      if (val.toLowerCase().includes(wKey)) {
                        weight = wVal.weight;
                      }
                    });
                    if (val.toLowerCase().includes('cotte') || val.toLowerCase().includes('cote')) weight = 25.0;
                    if (val.toLowerCase().includes('clibanion')) weight = 20.0;
                    if (val.toLowerCase().includes('bouclier')) weight = 3.0;
                  }
                  setNewItem(v => ({ ...v, name: val, weight }));
                }}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">Sélectionner...</option>
                {equipmentPages.map(p => (
                  <option key={p.id} value={p.title}>{p.title}</option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <input type="number" step={0.1} placeholder="Poids..." value={newItem.weight} onChange={e => setNewItem(v => ({ ...v, weight: parseFloat(e.target.value) || 0 }))} className={inputCls} />
            </div>
            <button onClick={handleAddInventoryItem} className="px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-dark-950 font-black rounded-lg transition text-xs shrink-0 cursor-pointer">
              + Ajouter
            </button>
          </div>
        </div>
        <div className="space-y-1 mt-2">
          {(data.inventoryItems || []).map((it, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 rounded bg-dark-950 border border-slate-900 text-slate-350">
              <span className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleItemEquipped(idx)}
                  className={`px-1 rounded text-[8px] font-bold ${it.equipped ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-slate-400'}`}
                >
                  {it.equipped ? 'Porté' : 'Porter'}
                </button>
                {it.name} - {it.weight} kg
              </span>
              <button onClick={() => handleRemoveInventoryItem(idx)} className="text-red-500 hover:text-red-400">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Languages & Senses Config */}
      <div className="grid grid-cols-2 gap-3 bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850">
        {/* Senses */}
        <div>
          <label className={labelCls}>Sens particuliers</label>
          <div className="space-y-1 mt-2">
            {(data.senses || '').split(',').map(s => s.trim()).filter(Boolean).map((s, idx) => (
              <div key={idx} className="flex justify-between items-center px-2.5 py-1.5 rounded bg-dark-950 border border-slate-900/60 text-slate-350 text-xs font-sans">
                <span>{s}</span>
                <button type="button" onClick={() => removeSense(idx)} className="text-red-500 hover:text-red-400 font-bold cursor-pointer shrink-0 ml-1">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-2.5 items-end">
            <select
              value={newSense}
              onChange={e => setNewSense(e.target.value)}
              className={inputCls + ' cursor-pointer flex-1 w-1/2'}
            >
              <option value="">Sélectionner...</option>
              <option value="Vision dans le noir 18m">Vision dans le noir 18m</option>
              <option value="Vision dans le noir supérieure 36m">Vision dans le noir supérieure 36m</option>
              <option value="Vision aveugle 9m">Vision aveugle 9m</option>
              <option value="Vision aveugle 18m">Vision aveugle 18m</option>
              <option value="Vision pure 18m">Vision pure 18m</option>
              <option value="Vision tremblante 18m">Vision tremblante 18m</option>
            </select>
            <input
              placeholder="Custom..."
              value={newSense}
              onChange={e => setNewSense(e.target.value)}
              className={inputCls + ' flex-1 w-1/2'}
            />
            <button
              type="button"
              onClick={() => {
                if (newSense) {
                  addSense(newSense);
                  setNewSense('');
                }
              }}
              className="px-2.5 py-1.5 bg-gold-600 hover:bg-gold-500 text-dark-950 font-black rounded-lg transition text-xs shrink-0 cursor-pointer"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className={labelCls}>Langues parlées</label>
          <div className="space-y-1 mt-2">
            {(data.languages || '').split(',').map(l => l.trim()).filter(Boolean).map((l, idx) => (
              <div key={idx} className="flex justify-between items-center px-2.5 py-1.5 rounded bg-dark-950 border border-slate-900/60 text-slate-350 text-xs font-sans">
                <span>{l}</span>
                <button type="button" onClick={() => removeLanguage(idx)} className="text-red-500 hover:text-red-400 font-bold cursor-pointer shrink-0 ml-1">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-2.5 items-end">
            <select
              value={newLanguage}
              onChange={e => setNewLanguage(e.target.value)}
              className={inputCls + ' cursor-pointer flex-1 w-1/2'}
            >
              <option value="">Sélectionner...</option>
              <option value="Commun">Commun</option>
              <option value="Nain">Nain</option>
              <option value="Elfe">Elfe</option>
              <option value="Géant">Géant</option>
              <option value="Gobelin">Gobelin</option>
              <option value="Orc">Orc</option>
              <option value="Draconique">Draconique</option>
              <option value="Céleste">Céleste</option>
              <option value="Abyssal">Abyssal</option>
              <option value="Infernal">Infernal</option>
              <option value="Sylvestre">Sylvestre</option>
              <option value="Argot des voleurs">Argot des voleurs</option>
            </select>
            <input
              placeholder="Custom..."
              value={newLanguage}
              onChange={e => setNewLanguage(e.target.value)}
              className={inputCls + ' flex-1 w-1/2'}
            />
            <button
              type="button"
              onClick={() => {
                if (newLanguage) {
                  addLanguage(newLanguage);
                  setNewLanguage('');
                }
              }}
              className="px-2.5 py-1.5 bg-gold-600 hover:bg-gold-500 text-dark-950 font-black rounded-lg transition text-xs shrink-0 cursor-pointer"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Traits Config */}
      <div className="bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850 space-y-2">
        <label className={labelCls}>Traits spéciaux & Dons</label>
        <div className="space-y-1.5 mt-2">
          {data.traits.map((t, i) => {
            const name = t.split(':')[0];
            const desc = t.split(':')[1] || '';
            return (
              <div key={i} className="flex justify-between items-start p-2.5 rounded bg-dark-950 border border-slate-900/60 text-slate-355 text-xs font-sans gap-3">
                <div className="flex-1">
                  <strong className="text-slate-200 block text-xs font-bold">{name}</strong>
                  {desc && <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{desc}</p>}
                </div>
                <button onClick={() => removeTrait(i)} className="text-red-500 hover:text-red-400 font-bold cursor-pointer shrink-0 mt-0.5">✕</button>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1.5 mt-2 pt-1 border-t border-slate-900/20 items-end">
          <div className="flex-1 w-1/2">
            <select
              value={selectedTraitPageToAdd}
              onChange={e => setSelectedTraitPageToAdd(e.target.value)}
              className={inputCls + ' cursor-pointer'}
            >
              <option value="">Sélectionner...</option>
              {allPages
                .filter(p => p.category === 'regle' && !p.id.startsWith('spell-') && !p.id.startsWith('weapon-') && !p.id.startsWith('equipment-'))
                .map(p => (
                  <option key={p.id} value={p.title}>{p.title}</option>
                ))
              }
            </select>
          </div>
          <div className="flex-1 w-1/2">
            <input
              value={newTrait}
              onChange={e => setNewTrait(e.target.value)}
              placeholder="Custom (Nom: Desc)..."
              className={inputCls}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (selectedTraitPageToAdd) {
                handleAddTraitFromPage(selectedTraitPageToAdd);
              } else if (newTrait) {
                addTrait();
              }
            }}
            className="px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-dark-950 font-black rounded-lg transition text-xs shrink-0 cursor-pointer"
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* Weapon Masteries & General Proficiencies */}
      <div className="grid grid-cols-2 gap-2 bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850">
        <div>
          <label className={labelCls}>Maîtrises d'Armes</label>
          <input value={data.weaponMasteries || ''} onChange={e => set('weaponMasteries', e.target.value)} placeholder="Épée longue (Lésion), Marteau (Propulsion)..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Maîtrises Générales</label>
          <input value={data.generalProficiencies || ''} onChange={e => set('generalProficiencies', e.target.value)} placeholder="Armures lourdes, outils de forgeron..." className={inputCls} />
        </div>
      </div>

      {/* Resources Management */}
      <div className="bg-[#0f0a05]/20 p-3 rounded-xl border border-slate-850 space-y-3">
        <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider border-b border-slate-800 pb-1">Suivi de Ressources de Classe</h4>
        
        {/* Existing resources list */}
        <div className="space-y-2">
          {(data.resources || []).map((res, rIdx) => (
            <div key={rIdx} className="flex justify-between items-center p-2 rounded bg-dark-950 border border-slate-900 text-slate-350 text-xs">
              <div>
                <strong>{res.name}</strong> ({res.max} utilisations / {res.recovery})
                <p className="text-[10px] text-slate-500">{res.desc}</p>
              </div>
              <button onClick={() => removeResource(rIdx)} className="text-red-500 hover:text-red-400">✕</button>
            </div>
          ))}
        </div>

        {/* Add resource form */}
        <div className="p-3 rounded-lg border border-slate-850 bg-[#0f0a05]/40 space-y-2 mt-2 font-sans text-xs">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Ajouter une ressource</span>
          
          <div className="flex gap-1.5 items-end">
            <div className="flex-1 w-1/2">
              <label className={labelCls}>Depuis les règles</label>
              <select
                value={selectedResourcePageToAdd}
                onChange={e => {
                  const val = e.target.value;
                  setSelectedResourcePageToAdd(val);
                  if (val) {
                    const page = allPages.find(p => p.title === val);
                    if (page) {
                      setNewResourceName(page.title);
                      const block = page.blocks.find(b => b.type === 'text') || page.blocks[0];
                      const cleanDesc = block ? block.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
                      setNewResourceDesc(cleanDesc);
                      let maxUses = 2;
                      let recovery = 'Repos Court';
                      const lowerDesc = cleanDesc.toLowerCase();
                      if (lowerDesc.includes('repos long') || lowerDesc.includes('par repos long')) {
                        recovery = 'Repos Long';
                      }
                      if (lowerDesc.includes('repos court') || lowerDesc.includes('par repos court')) {
                        recovery = 'Repos Court';
                      }
                      const usesMatch = lowerDesc.match(/(\d+)\s+utilisation/);
                      if (usesMatch) {
                        maxUses = parseInt(usesMatch[1]);
                      }
                      setNewResourceMax(maxUses);
                      setNewResourceRecovery(recovery);
                    }
                  }
                }}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="">Sélectionner...</option>
                {allPages
                  .filter(p => p.category === 'regle' && p.tags.some(t => t.toLowerCase() === 'capacités' || t.toLowerCase() === 'capacites' || t.toLowerCase() === 'aptitudes'))
                  .map(p => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex-1 w-1/2">
              <label className={labelCls}>Nom personnalisé</label>
              <input value={newResourceName} onChange={e => setNewResourceName(e.target.value)} placeholder="Second Souffle..." className={inputCls} />
            </div>
            <button
              onClick={() => {
                addResource();
                setSelectedResourcePageToAdd('');
              }}
              className="px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-dark-950 font-black rounded-lg transition text-xs shrink-0 cursor-pointer"
            >
              + Ajouter
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-1 items-end">
            <div className="col-span-2">
              <label className={labelCls}>Description</label>
              <input value={newResourceDesc} onChange={e => setNewResourceDesc(e.target.value)} placeholder="Récupère 1d10 + niveau PV..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Max utilisations</label>
              <input type="number" min={1} max={20} value={newResourceMax} onChange={e => setNewResourceMax(parseInt(e.target.value) || 1)} className={inputCls} />
            </div>
          </div>
          <div className="mt-1">
            <label className={labelCls}>Type de Récupération</label>
            <select value={newResourceRecovery} onChange={e => setNewResourceRecovery(e.target.value)} className={inputCls + ' cursor-pointer'}>
              <option value="Repos Court">Repos Court</option>
              <option value="Repos Long">Repos Long</option>
            </select>
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

  // Lore Generator states
  const [showSparklePopover, setShowSparklePopover] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [localBackstoryOverride, setLocalBackstoryOverride] = useState<string | null>(null);
  const [caretContext, setCaretContext] = useState<{ before: string; after: string }>({ before: '', after: '' });

  // Find parent page information
  const parentPage = allPages.find(p => p.blocks.some(b => b.id === block.id));
  const pageCategory = parentPage?.category || 'autre';
  const pageTitle = parentPage?.title || '';

  // Get prompts list dynamically based on category, block title, and cursor context (closet subtitle)
  const getPresetPrompts = (): string[] => {
    // Detect closest heading topic before the cursor
    let detectedTopic = '';
    if (caretContext.before) {
      // Look for keywords in the last 300 characters before the cursor to catch subtitles/headings
      const lastSegment = caretContext.before.slice(-300).toLowerCase();
      if (lastSegment.includes('apparence') || lastSegment.includes('physique') || lastSegment.includes('description')) {
        detectedTopic = 'apparence';
      } else if (lastSegment.includes('histoire') || lastSegment.includes('passé') || lastSegment.includes('origine') || lastSegment.includes('fondation')) {
        detectedTopic = 'histoire';
      } else if (lastSegment.includes('rumeur') || lastSegment.includes('secret') || lastSegment.includes('légende')) {
        detectedTopic = 'rumeur';
      }
    }

    const titleLower = (detectedTopic || blockTitle).toLowerCase();
    
    if (pageCategory === 'personnage') {
      const presets = ["Décrire l'apparence physique", "Développer son passé", "Révéler ses secrets"];
      if (titleLower.includes('apparence') || titleLower.includes('physique') || titleLower.includes('description')) {
        return ["Décrire l'apparence physique", "Développer son passé", "Révéler ses secrets"];
      }
      if (titleLower.includes('histoire') || titleLower.includes('passé') || titleLower.includes('origine')) {
        return ["Développer son passé", "Décrire l'apparence physique", "Révéler ses secrets"];
      }
      if (titleLower.includes('rumeur') || titleLower.includes('secret') || titleLower.includes('légende')) {
        return ["Révéler ses secrets", "Développer son passé", "Décrire l'apparence physique"];
      }
      return presets;
    } else if (pageCategory === 'lieu') {
      const presets = ["Décrire l'atmosphère", "Rédiger l'histoire locale", "Créer des secrets ou légendes"];
      if (titleLower.includes('apparence') || titleLower.includes('atmosphère') || titleLower.includes('description')) {
        return ["Décrire l'atmosphère", "Rédiger l'histoire locale", "Créer des secrets ou légendes"];
      }
      if (titleLower.includes('histoire') || titleLower.includes('passé') || titleLower.includes('origine') || titleLower.includes('fondation')) {
        return ["Rédiger l'histoire locale", "Décrire l'atmosphère", "Créer des secrets ou légendes"];
      }
      if (titleLower.includes('rumeur') || titleLower.includes('secret') || titleLower.includes('légende')) {
        return ["Créer des secrets ou légendes", "Décrire l'atmosphère", "Rédiger l'histoire locale"];
      }
      return presets;
    } else if (pageCategory === 'faction') {
      const presets = ["Raconter la création et origines", "Détailler les rumeurs et conflits"];
      if (titleLower.includes('histoire') || titleLower.includes('origine') || titleLower.includes('création')) {
        return ["Raconter la création et origines", "Détailler les rumeurs et conflits"];
      }
      if (titleLower.includes('rumeur') || titleLower.includes('conflit') || titleLower.includes('secret')) {
        return ["Détailler les rumeurs et conflits", "Raconter la création et origines"];
      }
      return presets;
    }
    
    return ["Rédiger une description d'ambiance", "Créer du lore fantastique"];
  };

  const presetPrompts = getPresetPrompts();

  // Set default prompt selection when popover opens or presets sort
  useEffect(() => {
    if (showSparklePopover && presetPrompts.length > 0) {
      setSelectedPrompt(presetPrompts[0]);
    }
  }, [showSparklePopover, blockTitle, caretContext.before]);

  const save = useCallback((content: string, title?: string, isSecret?: boolean) => {
    onUpdate(content, title ?? blockTitle, isSecret ?? block.isSecret);
  }, [onUpdate, blockTitle, block.isSecret]);

  const handleTriggerGeneration = async () => {
    setIsGenerating(true);
    try {
      const apiKey = typeof window !== 'undefined' ? localStorage.getItem('dnd_companion_api_key') || '' : '';
      const relations = parentPage?.relations?.map(r => {
        const target = allPages.find(p => p.id === r.targetPageId);
        return { type: r.type, targetTitle: target?.title || 'quelqu\'un' };
      }) || [];

      const existingText = parentPage?.blocks
        .filter(b => b.type === 'text' && b.id !== block.id)
        .map(b => b.content)
        .join('\n') || '';

      const generated = await generateLore({
        pageTitle,
        pageCategory,
        blockTitle: selectedPrompt || blockTitle || 'Description',
        existingText,
        relations,
        length,
        apiKey,
        caretBefore: caretContext.before,
        caretAfter: caretContext.after
      });

      if (block.type === 'text') {
        setTypewriterText(generated);
      } else if (block.type === 'character') {
        // Character backstory typewriter simulation
        setLocalBackstoryOverride('');
        let wordIdx = 0;
        const words = generated.split(' ');
        const interval = setInterval(() => {
          if (wordIdx >= words.length) {
            clearInterval(interval);
            setIsGenerating(false);
            setShowSparklePopover(false);
            const finalBackstory = words.join(' ');
            save(JSON.stringify({ ...parsedChar, backstory: finalBackstory }), blockTitle);
            setLocalBackstoryOverride(null);
            return;
          }
          wordIdx++;
          const partial = words.slice(0, wordIdx).join(' ');
          setLocalBackstoryOverride(partial);
        }, 45);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (block.type === 'text') {
        setIsGenerating(false);
        setShowSparklePopover(false);
      }
    }
  };

  const isTextBlock = block.type === 'text';

  // For structured blocks only
  let parsedChar: CharData = EMPTY_CHAR;
  if (block.type === 'character') {
    try {
      const parsed = JSON.parse(block.content);
      parsedChar = {
        ...EMPTY_CHAR,
        ...parsed,
        stats: { ...EMPTY_CHAR.stats, ...(parsed.stats || {}) },
        spellSlotsMax: parsed.spellSlotsMax ? [...parsed.spellSlotsMax] : [...EMPTY_CHAR.spellSlotsMax!],
        spellSlotsUsed: parsed.spellSlotsUsed ? [...parsed.spellSlotsUsed] : [...EMPTY_CHAR.spellSlotsUsed!],
        spellsList: parsed.spellsList ? [...parsed.spellsList] : [...EMPTY_CHAR.spellsList!],
        inventory: parsed.inventory ? [...parsed.inventory] : [...EMPTY_CHAR.inventory!],
        inventoryItems: parsed.inventoryItems ? parsed.inventoryItems.map((it: any) => ({ ...it })) : [...(EMPTY_CHAR.inventoryItems || [])],
        actions: parsed.actions ? parsed.actions.map((a: any) => ({ ...a })) : [...EMPTY_CHAR.actions],
        traits: parsed.traits ? [...parsed.traits] : [...EMPTY_CHAR.traits],
        activeConditions: parsed.activeConditions ? [...parsed.activeConditions] : [...(EMPTY_CHAR.activeConditions || [])],
        proficientSkills: parsed.proficientSkills ? [...parsed.proficientSkills] : [...(EMPTY_CHAR.proficientSkills || [])]
      };
    } catch { /* use default */ }
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
            onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
            placeholder={isTextBlock ? 'Titre du bloc…' : ''}
            className={`block-title-h1 ${!blockTitle ? 'opacity-0 group-hover/block:opacity-100 focus:opacity-100 transition-opacity' : ''}`}
          />
        ) : (
          blockTitle ? <h2 className="block-title-h1 pointer-events-none">{blockTitle}</h2> : null
        )}

        {secretBadge}

        {/* Block controls (GM only, on hover) */}
        {isGmMode && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity ml-auto shrink-0 relative">
            {/* Sparkles button */}
            {(block.type === 'text' || block.type === 'character') && (
              <div className="relative">
                <button
                  onClick={() => setShowSparklePopover(v => !v)}
                  className="p-1 text-slate-600 hover:text-amber-400 rounded cursor-pointer transition-colors"
                  title="Générer du Lore avec l'IA"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
                {showSparklePopover && (
                  <div className="absolute right-0 top-7 z-50 w-72 modal-glass-card p-4 rounded-xl shadow-2xl flex flex-col gap-3 text-xs text-slate-350 border border-slate-800/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="font-bold uppercase tracking-wider text-[10px] text-amber-300">Générateur de Lore</span>
                      </div>
                      <button onClick={() => setShowSparklePopover(false)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    {/* 1. Prompt presets */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Choisir un angle rédactionnel</label>
                      <div className="flex flex-col gap-1">
                        {presetPrompts.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPrompt(p)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg border transition cursor-pointer text-[11px] ${
                              selectedPrompt === p
                                ? 'bg-amber-500/15 border-amber-500/35 text-amber-300 font-bold'
                                : 'bg-black/10 border-transparent hover:bg-slate-800/40 hover:text-white'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Length Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Longueur du texte</label>
                      <div className="grid grid-cols-3 gap-1 bg-black/10 p-0.5 rounded-lg border border-slate-800/30">
                        {(['short', 'medium', 'long'] as const).map(l => (
                          <button
                            key={l}
                            onClick={() => setLength(l)}
                            className={`py-1 rounded-md text-[10px] uppercase font-bold transition cursor-pointer ${
                              length === l
                                ? 'bg-amber-500/25 text-amber-300 shadow'
                                : 'text-slate-500 hover:text-slate-350'
                            }`}
                          >
                            {l === 'short' ? 'Court' : l === 'medium' ? 'Moyen' : 'Long'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Action button */}
                    <button
                      onClick={handleTriggerGeneration}
                      disabled={isGenerating}
                      className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 text-xs font-black rounded-lg transition shadow-lg shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                          <span>Magie en cours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Lancer la magie</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
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
          typewriterText={typewriterText}
          onTypewriterComplete={() => setTypewriterText('')}
          onCaretContextChange={setCaretContext}
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
          allPages={allPages}
          onChange={d => save(JSON.stringify(d), blockTitle, block.isSecret)}
          backstoryOverride={localBackstoryOverride}
          onNavigate={onNavigate}
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

      {/* SPELL */}
      {block.type === 'spell' && (
        <SpellBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
          allPages={allPages}
          onNavigate={onNavigate}
        />
      )}

      {/* CLASS */}
      {block.type === 'class' && (
        <ClassBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}

      {/* SPECIES */}
      {block.type === 'species' && (
        <SpeciesBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}

      {/* ORIGIN */}
      {block.type === 'origin' && (
        <OriginBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}

      {/* WEAPON */}
      {block.type === 'weapon' && (
        <WeaponBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
          allPages={allPages}
        />
      )}

      {/* EQUIPMENT */}
      {block.type === 'equipment' && (
        <EquipmentBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}

      {/* CURRENCY */}
      {block.type === 'currency' && (
        <CurrencyBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}

      {/* WEAPON PROPERTIES */}
      {block.type === 'weapon_properties' && (
        <WeaponPropertiesBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}

      {/* WEAPON MASTERIES */}
      {block.type === 'weapon_masteries' && (
        <WeaponMasteriesBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}

      {/* GENERAL RULE */}
      {block.type === 'general_rule' && (
        <GeneralRuleBlock
          content={block.content}
          isEditing={isEditing && isGmMode}
          onChange={v => save(v, blockTitle)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Interactive Rule Blocks Rendering & Editing Components
// ─────────────────────────────────────────────────────────────

function SpellBlock({ content, isEditing, onChange, allPages = [], onNavigate }: { content: string; isEditing: boolean; onChange: (v: string) => void; allPages?: WikiPage[]; onNavigate?: (id: string) => void }) {
  let data: SpellBlockData = {
    level: 1, school: 'Abjuration', castingTime: '1 action', range: '9 mètres',
    components: { v: true, s: true, m: '' }, duration: '8 heures',
    classes: [], damageOrEffect: '', description: '',
    damageDice: [],
    saveRequired: 'none',
    saveEffect: 'none',
    aoeType: 'none',
    aoeRadius: 0,
    materialComponents: [],
    states: []
  };
  try {
    if (content) data = { ...data, ...JSON.parse(content) };
  } catch { /* ignore */ }

  const set = (key: keyof SpellBlockData, val: any) => {
    onChange(JSON.stringify({ ...data, [key]: val }));
  };

  const schoolColors: Record<string, string> = {
    'Abjuration': 'border-sky-500/30 text-sky-400 bg-sky-500/5 shadow-sky-500/10 shadow-lg',
    'Transmutation': 'border-orange-500/30 text-orange-400 bg-orange-500/5 shadow-orange-500/10 shadow-lg',
    'Conjuration': 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5 shadow-cyan-500/10 shadow-lg',
    'Divination': 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5 shadow-yellow-500/10 shadow-lg',
    'Enchantement': 'border-pink-500/30 text-pink-400 bg-pink-500/5 shadow-pink-500/10 shadow-lg',
    'Évocation': 'border-red-500/30 text-red-400 bg-red-500/5 shadow-red-500/10 shadow-lg',
    'Illusion': 'border-purple-500/30 text-purple-400 bg-purple-500/5 shadow-purple-500/10 shadow-lg',
    'Nécromancie': 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 shadow-emerald-500/10 shadow-lg'
  };

  const activeColor = schoolColors[data.school] || 'border-slate-800 text-slate-300 bg-slate-900/40';

  const ALL_CLASSES = ['Magicien', 'Ensorceleur', 'Clerc', 'Barde', 'Paladin', 'Druide', 'Ranger', 'Roublard', 'Barbare', 'Occultiste', 'Moine'];
  const DAMAGE_TYPES = ['perforant', 'tranchant', 'contondant', 'feu', 'froid', 'foudre',
    'acide', 'poison', 'psychique', 'radiant', 'nécrotique', 'tonnerre', 'force', 'soin'];
  const MODIFIER_OPTIONS = [
    { value: '', label: 'Aucun' },
    { value: '+mod', label: '+Mod de sort' },
    { value: '+modcar', label: '+Mod de carac.' },
    { value: '+1', label: '+1' }, { value: '+2', label: '+2' },
    { value: '+3', label: '+3' }, { value: '+4', label: '+4' }, { value: '+5', label: '+5' },
  ];

  const SAVE_LABELS: Record<string, string> = {
    none: 'Aucun',
    str: 'Force',
    dex: 'Dextérité',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Sagesse',
    cha: 'Charisme'
  };

  const SAVE_EFFECTS: Record<string, string> = {
    none: 'Aucun effet',
    half: 'Demi-dégâts',
    other: 'Autre'
  };

  const AOE_LABELS: Record<string, string> = {
    none: 'Aucune',
    cone: 'Cône',
    sphere: 'Sphère',
    cube: 'Cube',
    cylinder: 'Cylindre',
    line: 'Ligne'
  };

  const normDice = data.damageDice || [];
  const classes = data.classes || [];
  const componentPages = allPages.filter(p => p.category === 'composant');
  const conditionPages = allPages.filter(p => p.id.startsWith('cond-'));

  const toggleClass = (cls: string) => {
    const next = classes.includes(cls) ? classes.filter(c => c !== cls) : [...classes, cls];
    set('classes', next);
  };

  const saveDice = (dice: any[]) => {
    const nextStr = dice.map(d => {
      const base = `${d.count}d${d.die} ${d.damageType}`;
      return d.modifier ? `${base} ${d.modifier}` : base;
    }).join(' + ');
    onChange(JSON.stringify({
      ...data,
      damageDice: dice,
      damageOrEffect: nextStr || data.damageOrEffect
    }));
  };

  // Build the tier label for the header
  const tierLabel = (() => {
    if (data.level === 0) {
      const t = data.scalingThreshold;
      if (!t) return 'Tour de magie · Perso Niv. 1–4';
      return `Tour de magie · Perso Niv. ${t}+`;
    }
    return `Emplacement Niv. ${data.level}`;
  })();

  const hasM = !!data.components.m || (data.materialComponents && data.materialComponents.length > 0);

  const parsedRange = (() => {
    const normalized = (data.range || '').toLowerCase();
    if (normalized.includes('personn') || normalized.includes('perso')) {
      return { type: 'personal' as const, value: 0 };
    }
    if (normalized.includes('contact') || normalized.includes('tactile')) {
      return { type: 'contact' as const, value: 0 };
    }
    const match = normalized.match(/(\d+(?:[.,]\d+)?)/);
    if (match) {
      return { type: 'distance' as const, value: parseFloat(match[1].replace(',', '.')) };
    }
    return { type: 'distance' as const, value: 9 };
  })();

  const formatRange = (type: 'personal' | 'contact' | 'distance', value: number) => {
    if (type === 'personal') {
      return 'Personnelle';
    } else if (type === 'contact') {
      return 'Contact';
    } else {
      return `${value} mètres`;
    }
  };

  const toggleM = () => {
    if (hasM) {
      onChange(JSON.stringify({
        ...data,
        materialComponents: [],
        components: { ...data.components, m: '' }
      }));
    } else {
      onChange(JSON.stringify({
        ...data,
        components: { ...data.components, m: 'composant' }
      }));
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 modal-glass-card rounded-xl space-y-4 text-xs font-sans">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
              {data.level === 0 ? 'Palier perso. min. (0 = base)' : 'Niveau d\'emplacement'}
            </label>
            {data.level === 0 ? (
              <input type="number" min={0} max={20} value={data.scalingThreshold ?? 0}
                onChange={e => set('scalingThreshold', parseInt(e.target.value) || 0)}
                placeholder="0 = bloc de base"
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
            ) : (
              <input type="number" min={1} max={9} value={data.level} onChange={e => set('level', parseInt(e.target.value) || 1)}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
            )}
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">École de Magie</label>
            <select value={data.school} onChange={e => set('school', e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
              {['Abjuration', 'Transmutation', 'Conjuration', 'Divination', 'Enchantement', 'Évocation', 'Illusion', 'Nécromancie'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Niveau de base (cantrip only — shown separately) */}
        {data.level === 0 && (
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Niveau du sort (0 = Tour de magie)</label>
            <input type="number" min={0} max={9} value={data.level} onChange={e => set('level', parseInt(e.target.value) || 0)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Temps d'incantation</label>
            <input type="text" value={data.castingTime} onChange={e => set('castingTime', e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Type de Portée</label>
            <select
              value={parsedRange.type}
              onChange={e => {
                const newType = e.target.value as 'personal' | 'contact' | 'distance';
                const newVal = newType === 'distance' ? (parsedRange.value || 9) : 0;
                const newRangeStr = formatRange(newType, newVal);
                onChange(JSON.stringify({ ...data, range: newRangeStr }));
              }}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40"
            >
              <option value="personal">Personnelle</option>
              <option value="contact">Contact</option>
              <option value="distance">Distance</option>
            </select>
          </div>
          {parsedRange.type === 'distance' ? (
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Portée (mètres)</label>
              <input
                type="number"
                min={0}
                step="any"
                value={parsedRange.value}
                onChange={e => {
                  const newVal = parseFloat(e.target.value) || 0;
                  const newRangeStr = formatRange('distance', newVal);
                  onChange(JSON.stringify({ ...data, range: newRangeStr }));
                }}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40"
              />
            </div>
          ) : (
            <div className="opacity-45 select-none">
              <label className="block text-[10px] text-slate-600 font-bold uppercase mb-1">Portée (mètres)</label>
              <input
                type="text"
                disabled
                value="—"
                className="w-full bg-slate-900 border border-slate-850 text-slate-500 px-3 py-1.5 rounded-lg cursor-not-allowed text-center"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Zone d'Effet (AOE)</label>
            <select
              value={data.aoeType || 'none'}
              onChange={e => {
                const newAoeType = e.target.value as any;
                let newType = parsedRange.type;
                if (newAoeType === 'cone' || newAoeType === 'line') {
                  newType = 'personal';
                }
                const newRangeStr = formatRange(newType, parsedRange.value);
                onChange(JSON.stringify({ ...data, aoeType: newAoeType, range: newRangeStr }));
              }}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40"
            >
              {Object.entries(AOE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {data.aoeType && data.aoeType !== 'none' && (
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/20">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Rayon / Longueur de la Zone (mètres)</label>
              <input
                type="number"
                min={0}
                step="any"
                value={data.aoeRadius || ''}
                onChange={e => {
                  const newRadius = parseFloat(e.target.value) || 0;
                  const newRangeStr = formatRange(parsedRange.type, parsedRange.value);
                  onChange(JSON.stringify({ ...data, aoeRadius: newRadius, range: newRangeStr }));
                }}
                placeholder="ex: 6"
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Durée</label>
            <input type="text" value={data.duration} onChange={e => set('duration', e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        </div>

        {/* ── Composantes (toggles + dropdown sur la même ligne) ───────── */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Composantes</label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => set('components', { ...data.components, v: !data.components.v })}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${data.components.v
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}
            >
              {data.components.v && <span className="mr-1">✓</span>}Verbal (V)
            </button>

            <button
              onClick={() => set('components', { ...data.components, s: !data.components.s })}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${data.components.s
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}
            >
              {data.components.s && <span className="mr-1">✓</span>}Somatique (S)
            </button>

            <button
              onClick={toggleM}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${hasM
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}
            >
              {hasM && <span className="mr-1">✓</span>}Matériel (M)
            </button>

            {hasM && componentPages.length > 0 && (
              <select
                onChange={e => {
                  if (e.target.value) {
                    const nextComps = data.materialComponents || [];
                    if (!nextComps.includes(e.target.value)) {
                      const updated = [...nextComps, e.target.value];
                      const mText = updated.map(id => allPages.find(p => p.id === id)?.title).filter(Boolean).join(' et ');
                      onChange(JSON.stringify({
                        ...data,
                        materialComponents: updated,
                        components: { ...data.components, m: mText }
                      }));
                    }
                    e.target.value = '';
                  }
                }}
                className="bg-dark-950 border border-slate-800 text-slate-400 px-2 py-1 rounded-lg outline-none text-xs focus:border-gold-500/40 max-w-[130px] h-7"
              >
                <option value="">+ Ajouter...</option>
                {componentPages.map(cp => (
                  <option key={cp.id} value={cp.id}>{cp.title}</option>
                ))}
              </select>
            )}
          </div>

          {/* Badges des composants sélectionnés */}
          {hasM && (data.materialComponents || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 bg-slate-900/40 border border-slate-800/50 p-2 rounded-lg">
              {(data.materialComponents || []).map(id => {
                const page = allPages.find(p => p.id === id);
                if (!page) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-300 font-bold text-[11px]"
                  >
                    <span>{page.title}</span>
                    <button
                      onClick={() => {
                        const nextComps = (data.materialComponents || []).filter(x => x !== id);
                        const mText = nextComps.map(cid => allPages.find(p => p.id === cid)?.title).filter(Boolean).join(' et ');
                        onChange(JSON.stringify({
                          ...data,
                          materialComponents: nextComps,
                          components: { ...data.components, m: mText }
                        }));
                      }}
                      className="text-pink-500 hover:text-pink-400 font-extrabold ml-1 leading-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── États appliqués ── */}
        <div>
          <div className="flex items-center gap-2">
            <label className="block text-[10px] text-slate-500 font-bold uppercase">États appliqués</label>
            {conditionPages.length > 0 && (
              <select
                onChange={e => {
                  if (e.target.value) {
                    const nextStates = data.states || [];
                    if (!nextStates.includes(e.target.value)) {
                      set('states', [...nextStates, e.target.value]);
                    }
                    e.target.value = '';
                  }
                }}
                className="bg-dark-950 border border-slate-800 text-slate-400 px-2 py-1 rounded-lg outline-none text-xs focus:border-gold-500/40 max-w-[130px] h-7"
              >
                <option value="">+ État...</option>
                {conditionPages.map(cp => (
                  <option key={cp.id} value={cp.id}>{cp.title}</option>
                ))}
              </select>
            )}
          </div>

          {(data.states || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 bg-slate-900/40 border border-slate-800/50 p-2 rounded-lg">
              {(data.states || []).map(id => {
                const page = allPages.find(p => p.id === id);
                if (!page) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-300 font-bold text-[11px]"
                  >
                    <span>{page.title}</span>
                    <button
                      onClick={() => {
                        const nextStates = (data.states || []).filter(x => x !== id);
                        set('states', nextStates);
                      }}
                      className="text-teal-500 hover:text-teal-400 font-extrabold ml-1 leading-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* ── Classes associées (style caractéristiques d'arme) ───────── */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Classes associées</label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CLASSES.map(cls => {
              const active = classes.includes(cls);
              return (
                <button key={cls} onClick={() => toggleClass(cls)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${active
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}>
                  {active && <span className="mr-1">✓</span>}{cls}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Groupes de dés (sélection identique aux armes) ──────────── */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Dégâts / Soin du sort</label>

          {normDice.length === 0 && (
            <div className="mb-2">
              <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Effet alternatif (si aucun dé de dégât)</label>
              <input
                type="text"
                value={data.damageOrEffect || ''}
                onChange={e => set('damageOrEffect', e.target.value)}
                placeholder="ex: Zone de ténèbres magiques, Alerte sonore ou mentale..."
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40"
              />
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap p-2 rounded-lg bg-slate-900/60 border border-slate-700 mb-2">
            <DiceCountPicker
              onAdd={(count, die, damageType) => saveDice([...normDice, { count, die, damageType, modifier: '' }])}
              damageTypes={DAMAGE_TYPES}
            />
          </div>
          {normDice.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {normDice.map((dice, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                  <span className={dice.damageType === 'soin' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {dice.count}d{dice.die}
                  </span>
                  <span className="text-slate-500 text-[10px]">{dice.damageType}</span>
                  <select
                    value={dice.modifier || ''}
                    onChange={e => {
                      const next = normDice.map((d, i) => i === idx ? { ...d, modifier: e.target.value } : d);
                      saveDice(next);
                    }}
                    className="bg-slate-900 border border-slate-700 text-slate-400 rounded text-[10px] px-1 py-0.5 outline-none"
                  >
                    {MODIFIER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <button onClick={() => saveDice(normDice.filter((_, i) => i !== idx))}
                    className="text-slate-600 hover:text-red-400 transition-colors font-bold leading-none ml-0.5">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1.5">Jet de Sauvegarde Requis</label>
            <select value={data.saveRequired || 'none'} onChange={e => set('saveRequired', e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
              {Object.entries(SAVE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1.5">Effet si réussi</label>
            <select value={data.saveEffect || 'none'} onChange={e => set('saveEffect', e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
              {Object.entries(SAVE_EFFECTS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>


      </div>
    );
  }

  const renderMaterialComponentsList = () => {
    const list = data.materialComponents || [];
    if (list.length > 0) {
      return (
        <span className="inline-flex items-center gap-1">
          {list.map((id, index) => {
            const cp = allPages.find(p => p.id === id);
            if (!cp) return null;
            return (
              <React.Fragment key={id}>
                {index > 0 && <span className="text-slate-500">et</span>}
                <button
                  onClick={() => onNavigate?.(cp.id)}
                  className="text-pink-400 hover:text-pink-300 underline font-bold cursor-pointer transition-colors inline-block"
                >
                  {cp.title}
                </button>
              </React.Fragment>
            );
          })}
        </span>
      );
    }
    // Fallback to components.m parsing if materialComponents array is empty
    if (!data.components.m) return null;
    const matched = componentPages.find(cp =>
      data.components.m.toLowerCase().includes(cp.title.toLowerCase())
    );
    if (matched) {
      const idx = data.components.m.toLowerCase().indexOf(matched.title.toLowerCase());
      const before = data.components.m.slice(0, idx);
      const matchText = data.components.m.slice(idx, idx + matched.title.length);
      const after = data.components.m.slice(idx + matched.title.length);
      return (
        <span>
          {before}
          <button
            onClick={() => onNavigate?.(matched.id)}
            className="text-pink-400 hover:text-pink-300 underline font-bold cursor-pointer transition-colors px-0.5 inline-block"
          >
            {matchText}
          </button>
          {after}
        </span>
      );
    }
    return <span>{data.components.m}</span>;
  };

  const compStr = [
    data.components.v && 'V',
    data.components.s && 'S',
    data.components.m && 'M'
  ].filter(Boolean).join(', ');

  return (
    <div className={`p-5 rounded-xl border ${activeColor} flex flex-col gap-4 font-serif shadow-lg`}>
      <div className="border-b border-white/5 pb-2 flex items-center justify-between">
        <h4 className="text-[12px] font-bold text-orange-400/90 tracking-widest uppercase">
          {data.school} · {tierLabel}
        </h4>
        <div className="flex gap-1">
          {classes.map(c => (
            <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase font-sans font-bold tracking-wider">{c}</span>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm font-sans">
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">Dégâts / Effet</span>
          {normDice.length > 0 ? (
            <div className="flex items-baseline flex-wrap gap-1">
              {normDice.map((d, i) => {
                const isHeal = d.damageType === 'soin';
                const modLabel = d.modifier === '+mod' ? ' + mod. de sort'
                  : d.modifier === '+modcar' ? ' + mod. de carac.'
                  : d.modifier ? ` ${d.modifier}` : '';
                return (
                  <span key={i} className="flex items-baseline gap-1">
                    {i > 0 && <span className="text-slate-500 text-xs">+</span>}
                    <strong className={isHeal ? 'text-emerald-400 text-base' : 'text-red-400 text-base'}>
                      {d.count}d{d.die}
                    </strong>
                    <span className={`text-sm ${isHeal ? 'text-emerald-300/80' : 'text-slate-400'}`}>
                      {d.damageType}{modLabel}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : data.states && data.states.length > 0 ? (
            <strong className="text-slate-200 text-xs leading-normal block text-pink-400">
              Application d'état : {data.states.map(id => allPages.find(p => p.id === id)?.title || id).join(', ')}
            </strong>
          ) : (
            <strong className="text-slate-200 text-sm">{data.damageOrEffect || '—'}</strong>
          )}
        </div>
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">Incantation</span>
          <strong className="text-slate-200 text-sm">{data.castingTime}</strong>
        </div>
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">Portée</span>
          <strong className="text-slate-200 text-sm">{data.range}</strong>
        </div>
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">Durée</span>
          <strong className="text-slate-200 text-sm">{data.duration}</strong>
        </div>
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">Composantes</span>
          <div className="text-slate-200 text-sm font-semibold">
            <span>{compStr}</span>
            {hasM && (
              <span className="text-[11px] text-slate-400 font-normal ml-1">
                ({renderMaterialComponentsList()})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Jet de Sauvegarde */}
      {data.saveRequired && data.saveRequired !== 'none' && (
        <div className="space-y-3 mt-1">
          <h1 className="text-[13px] font-black text-slate-350 uppercase tracking-widest border-b border-white/5 pb-1.5">Jet de Sauvegarde</h1>
          <div className="pl-3 border-l-2 border-purple-500/30">
            <span className="text-purple-300 font-bold text-sm block mb-0.5">Sauvegarde requise : {SAVE_LABELS[data.saveRequired]}</span>
            <p className="text-[13px] text-slate-350 leading-relaxed font-sans">
              La cible doit réussir un jet de sauvegarde de <strong>{SAVE_LABELS[data.saveRequired]}</strong> contre votre DD de sauvegarde.
              En cas de réussite : <span className="text-purple-400 font-semibold">{SAVE_EFFECTS[data.saveEffect || 'none']}</span>.
            </p>
          </div>
        </div>
      )}

      {/* Zone d'Effet */}
      {data.aoeType && data.aoeType !== 'none' && (
        <div className="space-y-3 mt-1">
          <h1 className="text-[13px] font-black text-slate-350 uppercase tracking-widest border-b border-white/5 pb-1.5">Zone d'Effet</h1>
          <div className="pl-3 border-l-2 border-cyan-500/30">
            <span className="text-cyan-300 font-bold text-sm block mb-0.5">Zone : {AOE_LABELS[data.aoeType]}</span>
            <p className="text-[13px] text-slate-350 leading-relaxed font-sans">
              Le sort se propage dans une zone en forme de <strong>{AOE_LABELS[data.aoeType].toLowerCase()}</strong>
              {data.aoeRadius ? ` d'un rayon ou d'une longueur de ${data.aoeRadius} mètres` : ''}.
            </p>
          </div>
        </div>
      )}

      {/* États Appliqués */}
      {data.states && data.states.length > 0 && (
        <div className="space-y-3 mt-1">
          <h1 className="text-[13px] font-black text-slate-350 uppercase tracking-widest border-b border-white/5 pb-1.5">États Appliqués</h1>
          {data.states.map(id => {
            const cp = allPages.find(p => p.id === id);
            if (!cp) return null;
            const textBlock = cp.blocks.find(b => b.type === 'text');
            return (
              <div key={id} className="pl-3 border-l-2 border-teal-500/30">
                <button
                  onClick={() => onNavigate?.(cp.id)}
                  className="text-teal-300 font-bold text-sm block mb-0.5 hover:text-teal-200 underline text-left"
                >
                  État : {cp.title}
                </button>
                {textBlock ? (
                  <div
                    className="text-[13px] text-slate-350 leading-relaxed font-sans prose prose-invert max-w-none prose-xs mt-1"
                    dangerouslySetInnerHTML={{ __html: textBlock.content }}
                  />
                ) : (
                  <p className="text-[13px] text-slate-500 italic font-sans">Aucune description disponible pour cet état.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GeneralRuleBlock({ content, isEditing, onChange }: { content: string; isEditing: boolean; onChange: (v: string) => void }) {
  let data: GeneralRuleBlockData = {
    ruleType: 'spells',
    magicSystem: 'slots',
    concentrationRule: true,
    spellRecovery: 'long_rest',
    hpRecovery: 'long_rest',
    maxLevel: 20,
    multiclassing: 'allowed',
    encumbranceRule: 'classic',
    weaponMasteriesEnabled: true,
    startingLanguages: 'Commun',
    asiRule: 'free',
    description: ''
  };
  try {
    if (content) data = { ...data, ...JSON.parse(content) };
  } catch { /* ignore */ }

  const set = (key: keyof GeneralRuleBlockData, val: any) => {
    onChange(JSON.stringify({ ...data, [key]: val }));
  };

  const TYPE_LABELS: Record<string, string> = {
    spells: "Magie & Sorts",
    classes: "Classes & Progression",
    races: "Races / Espèces",
    origins: "Origines & Dons",
    equipment: "Équipement & Économie",
    combat: "Combat & Conditions"
  };

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-350">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Type de Règle</label>
            <select value={data.ruleType} onChange={e => set('ruleType', e.target.value)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Description / Note</label>
            <input type="text" value={data.description} onChange={e => set('description', e.target.value)}
              placeholder="ex: Règles de magie de la campagne..."
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        </div>

        {/* Spells-specific parameters */}
        {data.ruleType === 'spells' && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Système de Magie</label>
              <select value={data.magicSystem} onChange={e => set('magicSystem', e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
                <option value="slots">Emplacements de sorts (Standard)</option>
                <option value="points">Points de magie (Variante DMG)</option>
                <option value="free">Magie libre / Sans slots</option>
                <option value="none">Aucune magie</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Récupération des Sorts</label>
              <select value={data.spellRecovery} onChange={e => set('spellRecovery', e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
                <option value="long_rest">Repos long uniquement</option>
                <option value="short_rest">Repos court uniquement</option>
                <option value="both">Repos long et repos court</option>
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-1">
              <input type="checkbox" checked={data.concentrationRule} onChange={e => set('concentrationRule', e.target.checked)}
                id="chk-concentration" className="w-3.5 h-3.5 bg-slate-900 border border-slate-700 text-amber-500 rounded" />
              <label htmlFor="chk-concentration" className="text-slate-400 font-medium">Activer la règle de concentration</label>
            </div>
          </div>
        )}

        {/* Classes-specific parameters */}
        {data.ruleType === 'classes' && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Niveau Maximum</label>
              <input type="number" value={data.maxLevel} onChange={e => set('maxLevel', parseInt(e.target.value) || 20)}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Multiclassage</label>
              <select value={data.multiclassing} onChange={e => set('multiclassing', e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
                <option value="allowed">Autorisé (Standard)</option>
                <option value="restricted">Restreint (avec conditions)</option>
                <option value="forbidden">Interdit</option>
              </select>
            </div>
          </div>
        )}

        {/* Races-specific parameters */}
        {data.ruleType === 'races' && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Attribution Caractéristiques (ASI)</label>
              <select value={data.asiRule} onChange={e => set('asiRule', e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
                <option value="free">Libre (+2/+1 ou +1/+1/+1) (2024)</option>
                <option value="fixed">Fixe par race (2014)</option>
                <option value="none">Aucun bonus racial</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Langues de départ</label>
              <input type="text" value={data.startingLanguages} onChange={e => set('startingLanguages', e.target.value)}
                placeholder="ex: Commun + 1 langue au choix..."
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
            </div>
          </div>
        )}

        {/* Equipment-specific parameters */}
        {data.ruleType === 'equipment' && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Règles d'encombrement</label>
              <select value={data.encumbranceRule} onChange={e => set('encumbranceRule', e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
                <option value="classic">Standard (Force × 15 en livres)</option>
                <option value="variant">Variante (Force × 5 en livres)</option>
                <option value="none">Désactivé (Aucune limite)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" checked={data.weaponMasteriesEnabled} onChange={e => set('weaponMasteriesEnabled', e.target.checked)}
                id="chk-masteries" className="w-3.5 h-3.5 bg-slate-900 border border-slate-700 text-amber-500 rounded" />
              <label htmlFor="chk-masteries" className="text-slate-400 font-medium">Activer les Maîtrises d'armes (2024)</label>
            </div>
          </div>
        )}

        {/* Combat-specific parameters */}
        {data.ruleType === 'combat' && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Récupération des PV</label>
              <select value={data.hpRecovery} onChange={e => set('hpRecovery', e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40">
                <option value="long_rest">Repos long uniquement (Standard)</option>
                <option value="short_rest">Repos court uniquement</option>
                <option value="both">Repos long et repos court</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Read-only dashboard view
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-950/40 border border-slate-800/50 shadow-xl">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/40">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-sans">
          Paramètres Système : {TYPE_LABELS[data.ruleType]}
        </h4>
        {data.description && (
          <span className="text-[10px] text-slate-500 italic ml-auto font-sans">
            {data.description}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-sans text-slate-350">
        {data.ruleType === 'spells' && (
          <>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Système de Magie</span>
              <strong className="text-slate-200">
                {data.magicSystem === 'slots' ? 'Emplacements de sorts'
                 : data.magicSystem === 'points' ? 'Points de magie'
                 : data.magicSystem === 'free' ? 'Magie libre' : 'Aucun'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Récupération</span>
              <strong className="text-slate-200">
                {data.spellRecovery === 'long_rest' ? 'Repos long'
                 : data.spellRecovery === 'short_rest' ? 'Repos court' : 'Long et Court'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Concentration</span>
              <strong className={data.concentrationRule ? 'text-emerald-400' : 'text-rose-400'}>
                {data.concentrationRule ? 'Activée' : 'Désactivée'}
              </strong>
            </div>
          </>
        )}

        {data.ruleType === 'classes' && (
          <>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Niveau Max</span>
              <strong className="text-slate-200">{data.maxLevel}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Multiclassage</span>
              <strong className="text-slate-200">
                {data.multiclassing === 'allowed' ? 'Autorisé'
                 : data.multiclassing === 'restricted' ? 'Restreint' : 'Interdit'}
              </strong>
            </div>
          </>
        )}

        {data.ruleType === 'races' && (
          <>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Attribution ASI</span>
              <strong className="text-slate-200">
                {data.asiRule === 'free' ? 'Origines libres (2024)'
                 : data.asiRule === 'fixed' ? 'Fixe par race (2014)' : 'Aucun'}
              </strong>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Langues de départ</span>
              <strong className="text-slate-200">{data.startingLanguages}</strong>
            </div>
          </>
        )}

        {data.ruleType === 'equipment' && (
          <>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Règles d'encombrement</span>
              <strong className="text-slate-200">
                {data.encumbranceRule === 'classic' ? 'Standard (x15)'
                 : data.encumbranceRule === 'variant' ? 'Variante (x5)' : 'Aucune limite'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Maîtrises d'armes (2024)</span>
              <strong className={data.weaponMasteriesEnabled ? 'text-emerald-400' : 'text-slate-500'}>
                {data.weaponMasteriesEnabled ? 'Actives' : 'Inactives'}
              </strong>
            </div>
          </>
        )}

        {data.ruleType === 'combat' && (
          <>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[9px] block mb-0.5">Récupération des PV</span>
              <strong className="text-slate-200">
                {data.hpRecovery === 'long_rest' ? 'Repos long uniquement'
                 : data.hpRecovery === 'short_rest' ? 'Repos court uniquement' : 'Repos long et court'}
              </strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ClassBlock({ content, isEditing, onChange }: { content: string; isEditing: boolean; onChange: (v: string) => void }) {
  let data: ClassBlockData = {
    hitDie: '1d8', primaryAbilities: [], saves: [], armorProficiencies: [],
    weaponMastery: false, subclasses: [], description: ''
  };
  try {
    if (content) data = { ...data, ...JSON.parse(content) };
  } catch { /* ignore */ }

  const set = (key: keyof ClassBlockData, val: any) => {
    onChange(JSON.stringify({ ...data, [key]: val }));
  };

  const handleAddSubclass = () => {
    set('subclasses', [...data.subclasses, { name: 'Nouvelle sous-classe', description: '' }]);
  };
  const handleUpdateSubclass = (i: number, field: 'name' | 'description', val: string) => {
    const subs = [...data.subclasses];
    subs[i] = { ...subs[i], [field]: val };
    set('subclasses', subs);
  };
  const handleRemoveSubclass = (i: number) => {
    set('subclasses', data.subclasses.filter((_, j) => j !== i));
  };

  if (isEditing) {
    return (
      <div className="p-4 modal-glass-card rounded-xl space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Dé de Vie</label>
            <input type="text" value={data.hitDie} onChange={e => set('hitDie', e.target.value)} placeholder="ex: 1d8, 1d10"
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Caractéristiques principales (séparées par virgules)</label>
            <input type="text" value={data.primaryAbilities.join(', ')} onChange={e => set('primaryAbilities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Sauvegardes maîtrisées</label>
            <input type="text" value={data.saves.join(', ')} onChange={e => set('saves', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div className="flex items-center pt-5">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={data.weaponMastery} onChange={e => set('weaponMastery', e.target.checked)} />
              <span>Accès aux Maîtrises d'Armes</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Maîtrises d'Armures (séparées par virgules)</label>
          <input type="text" value={data.armorProficiencies.join(', ')} onChange={e => set('armorProficiencies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Description de classe</label>
          <textarea rows={3} value={data.description} onChange={e => set('description', e.target.value)}
            className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40 font-serif" />
        </div>

        <div className="space-y-2 border-t border-slate-800/80 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] text-slate-400 font-bold uppercase">Sous-classes révisées (2024)</h4>
            <button onClick={handleAddSubclass} className="px-2 py-0.5 bg-gold-600 hover:bg-gold-500 text-dark-950 font-bold rounded text-[10px]">
              + Ajouter
            </button>
          </div>
          {data.subclasses.map((sub, i) => (
            <div key={i} className="p-3 bg-dark-950 border border-slate-900 rounded-lg space-y-2 relative">
              <button onClick={() => handleRemoveSubclass(i)} className="absolute top-2 right-2 text-slate-600 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <input type="text" value={sub.name} onChange={e => handleUpdateSubclass(i, 'name', e.target.value)}
                placeholder="Nom de la sous-classe" className="bg-transparent text-slate-200 border-b border-slate-800 focus:border-gold-500/50 pb-0.5 outline-none font-bold w-[80%]" />
              <textarea rows={2} value={sub.description} onChange={e => handleUpdateSubclass(i, 'description', e.target.value)}
                placeholder="Description..." className="w-full bg-transparent border-none text-slate-400 outline-none" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-red-500/10 bg-red-950/2 flex flex-col gap-4 font-serif">
      <div className="border-b border-white/5 pb-2">
        <h4 className="text-[10px] font-bold text-red-400 tracking-widest uppercase">Classe Révisée D&D 2024</h4>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs font-sans text-slate-350">
        <div className="bg-white/2 border border-white/5 p-2 rounded-lg text-center">
          <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
          <span className="text-[9px] text-slate-500 block uppercase">Dé de Vie</span>
          <strong>{data.hitDie}</strong>
        </div>
        <div className="bg-white/2 border border-white/5 p-2 rounded-lg text-center">
          <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <span className="text-[9px] text-slate-500 block uppercase">Carac. Clés</span>
          <strong className="truncate block">{data.primaryAbilities.join(' / ') || 'Toutes'}</strong>
        </div>
        <div className="bg-white/2 border border-white/5 p-2 rounded-lg text-center">
          <Shield className="w-4 h-4 text-sky-500 mx-auto mb-1" />
          <span className="text-[9px] text-slate-500 block uppercase">Sauvegardes</span>
          <strong>{data.saves.join(', ') || 'Aucune'}</strong>
        </div>
      </div>

      <div className="space-y-1.5 text-xs font-sans">
        <div><span className="text-slate-500 font-bold uppercase text-[9px] mr-2">Maîtrise d'armes :</span> {data.weaponMastery ? 'Oui (accès complet)' : 'Standard'}</div>
        <div><span className="text-slate-500 font-bold uppercase text-[9px] mr-2">Armures :</span> {data.armorProficiencies.join(', ') || 'Aucune'}</div>
      </div>

      <p className="text-xs leading-relaxed text-slate-300 pt-1 border-t border-white/5">{data.description || 'Aucune description.'}</p>

      {data.subclasses.length > 0 && (
        <div className="mt-2 space-y-2">
          <h5 className="text-[10px] font-bold font-sans text-red-400/80 tracking-widest uppercase">Sous-classes</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.subclasses.map((sub, i) => (
              <div key={i} className="p-3 bg-white/2 border border-white/5 rounded-lg">
                <strong className="text-xs font-sans text-amber-400 block mb-1">{sub.name}</strong>
                <p className="text-xs text-slate-400 leading-normal font-sans">{sub.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SpeciesBlock({ content, isEditing, onChange }: { content: string; isEditing: boolean; onChange: (v: string) => void }) {
  let data: SpeciesBlockData = { size: 'Moyenne', speed: 9, traits: [] };
  try {
    if (content) data = { ...data, ...JSON.parse(content) };
  } catch { /* ignore */ }

  const set = (key: keyof SpeciesBlockData, val: any) => {
    onChange(JSON.stringify({ ...data, [key]: val }));
  };

  const handleAddTrait = () => {
    set('traits', [...data.traits, { name: 'Nouveau trait', description: '' }]);
  };
  const handleUpdateTrait = (i: number, field: 'name' | 'description', val: string) => {
    const ts = [...data.traits];
    ts[i] = { ...ts[i], [field]: val };
    set('traits', ts);
  };
  const handleRemoveTrait = (i: number) => {
    set('traits', data.traits.filter((_, j) => j !== i));
  };

  if (isEditing) {
    return (
      <div className="p-4 modal-glass-card rounded-xl space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Taille</label>
            <input type="text" value={data.size} onChange={e => set('size', e.target.value)} placeholder="ex: Moyenne, Petite"
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Vitesse (mètres)</label>
            <input type="number" step={0.5} value={data.speed} onChange={e => set('speed', parseFloat(e.target.value) || 9)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-800/80 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] text-slate-400 font-bold uppercase">Traits d'Espèce</h4>
            <button onClick={handleAddTrait} className="px-2 py-0.5 bg-gold-600 hover:bg-gold-500 text-dark-950 font-bold rounded text-[10px]">
              + Ajouter
            </button>
          </div>
          {data.traits.map((tr, i) => (
            <div key={i} className="p-3 bg-dark-950 border border-slate-900 rounded-lg space-y-2 relative">
              <button onClick={() => handleRemoveTrait(i)} className="absolute top-2 right-2 text-slate-600 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <input type="text" value={tr.name} onChange={e => handleUpdateTrait(i, 'name', e.target.value)}
                placeholder="Nom du trait" className="bg-transparent text-slate-200 border-b border-slate-800 focus:border-gold-500/50 pb-0.5 outline-none font-bold w-[80%]" />
              <textarea rows={2} value={tr.description} onChange={e => handleUpdateTrait(i, 'description', e.target.value)}
                placeholder="Description..." className="w-full bg-transparent border-none text-slate-400 outline-none" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-950/2 flex flex-col gap-4 font-serif">
      <div className="border-b border-white/5 pb-2">
        <h4 className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Espèce révisée D&D 2024</h4>
      </div>

      <div className="flex items-center gap-4 text-xs font-sans text-slate-350">
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Taille</span> <strong>{data.size}</strong></div>
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Vitesse</span> <strong>{data.speed} mètres ({Math.round(data.speed / 1.5 * 5)} ft.)</strong></div>
      </div>

      {data.traits.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-white/5 font-sans">
          {data.traits.map((tr, i) => (
            <div key={i} className="text-xs">
              <strong className="text-emerald-400 font-semibold block mb-0.5">{tr.name}</strong>
              <p className="text-slate-350 leading-relaxed">{tr.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OriginBlock({ content, isEditing, onChange }: { content: string; isEditing: boolean; onChange: (v: string) => void }) {
  let data: OriginBlockData = { abilityBoosts: [], skills: [], feats: [], equipment: [], description: '' };
  try {
    if (content) data = { ...data, ...JSON.parse(content) };
  } catch { /* ignore */ }

  const set = (key: keyof OriginBlockData, val: any) => {
    onChange(JSON.stringify({ ...data, [key]: val }));
  };

  if (isEditing) {
    return (
      <div className="p-4 modal-glass-card rounded-xl space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Ajustements recommandés</label>
            <input type="text" value={data.abilityBoosts.join(', ')} onChange={e => set('abilityBoosts', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="ex: Sagesse, Intelligence" className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Compétences maîtrisées</label>
            <input type="text" value={data.skills.join(', ')} onChange={e => set('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="ex: Religion, Intuition" className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Dons d'Origines (2024)</label>
            <input type="text" value={data.feats.join(', ')} onChange={e => set('feats', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="ex: Béni" className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Équipement de départ</label>
            <input type="text" value={data.equipment.join(', ')} onChange={e => set('equipment', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="ex: Symbole sacré, 15 PO" className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Description historique</label>
          <textarea rows={3} value={data.description} onChange={e => set('description', e.target.value)}
            className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40 font-serif" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-amber-500/10 bg-amber-950/2 flex flex-col gap-4 font-serif">
      <div className="border-b border-white/5 pb-2">
        <h4 className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">Origine de personnage (D&D 2024)</h4>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-sans text-slate-350">
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Ajustement de Caractéristiques</span> {data.abilityBoosts.join(' et ') || 'Au choix'}</div>
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Compétences clés</span> {data.skills.join(', ') || 'Aucune'}</div>
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Don d'Origine accordé</span> <strong className="text-amber-400">{data.feats.join(', ') || 'Aucun'}</strong></div>
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Pécule & Matériel</span> {data.equipment.join(', ') || 'Aucun'}</div>
      </div>

      <p className="text-xs leading-relaxed text-slate-300 pt-2 border-t border-white/5">{data.description || 'Aucune description.'}</p>
    </div>
  );
}

// Composant interne avec état local pour la ligne d'ajout de dés
function DiceCountPicker({ onAdd, damageTypes }: {
  onAdd: (count: number, die: number, damageType: string) => void;
  damageTypes: string[];
}) {
  const [count, setCount] = React.useState(1);
  const [die, setDie] = React.useState(6);
  const [damageType, setDamageType] = React.useState(damageTypes[0] || 'perforant');

  return (
    <>
      {/* −/count/+ */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => setCount(c => Math.max(1, c - 1))}
          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition-colors">−</button>
        <span className="w-6 text-center text-slate-200 font-bold">{count}</span>
        <button onClick={() => setCount(c => Math.min(10, c + 1))}
          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition-colors">+</button>
      </div>
      <span className="text-slate-500 font-bold shrink-0">d</span>
      {/* Boutons type de dé */}
      <div className="flex gap-1 shrink-0">
        {[4, 6, 8, 10, 12, 20].map(d => (
          <button key={d} onClick={() => setDie(d)}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${die === d
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'}`}>
            d{d}
          </button>
        ))}
      </div>
      {/* Type de dégâts */}
      <select value={damageType} onChange={e => setDamageType(e.target.value)}
        className="flex-1 min-w-0 bg-dark-950 border border-slate-800 text-slate-350 px-2 py-1 rounded-lg outline-none focus:border-gold-500/40 cursor-pointer text-[11px]">
        {damageTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
      </select>
      {/* Résumé + bouton Ajouter */}
      <span className="text-red-400 font-bold text-xs shrink-0">{count}d{die}</span>
      <button onClick={() => { onAdd(count, die, damageType); setCount(1); setDie(6); setDamageType(damageTypes[0] || 'perforant'); }}
        className="shrink-0 px-3 py-1 rounded-lg text-[11px] font-bold bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30 transition-colors">
        + Ajouter
      </button>
    </>
  );
}

function WeaponBlock({ content, isEditing, onChange, allPages = [] }: { content: string; isEditing: boolean; onChange: (v: string) => void; allPages?: WikiPage[] }) {
  let data: WeaponBlockData = {
    damage: '1d6', damageType: 'perforant', stat: 'dex',
    properties: '', mastery: '', weight: 1.0, price: '', description: ''
  };
  try {
    if (content) data = { ...data, ...JSON.parse(content) };
  } catch { /* ignore */ }

  const set = (key: keyof WeaponBlockData, val: any) => {
    onChange(JSON.stringify({ ...data, [key]: val }));
  };

  // ── Helpers: migrate legacy single fields → new array fields ──────────
  const STAT_LABELS: Record<string, string> = {
    str: 'Force', dex: 'Dextérité', con: 'Constitution',
    int: 'Intelligence', wis: 'Sagesse', cha: 'Charisme'
  };
  const DAMAGE_TYPES = ['perforant', 'tranchant', 'contondant', 'feu', 'froid', 'foudre',
    'acide', 'poison', 'psychique', 'radiant', 'nécrotique', 'tonnerre', 'force'];

  // Normalize damageDice: migrate from legacy damage+damageType if needed
  const normDice: import('../types').DiceGroup[] = (() => {
    if (data.damageDice && data.damageDice.length > 0) return data.damageDice;
    const m = (data.damage || '1d6').match(/^(\d+)d(\d+)$/);
    return [{ count: m ? parseInt(m[1]) : 1, die: m ? parseInt(m[2]) : 6, damageType: data.damageType || 'perforant' }];
  })();

  // Normalize stats: migrate from legacy stat string
  const normStats: string[] = data.stats && data.stats.length > 0 ? data.stats : [data.stat || 'dex'];

  // Normalize masteries: migrate from legacy mastery string
  const normMasteries: string[] = (() => {
    if (data.masteries && data.masteries.length > 0) return data.masteries;
    return data.mastery ? [data.mastery] : [];
  })();

  // Persist helper: always write both new arrays AND legacy compat fields
  const saveAll = (patch: Partial<typeof data & { damageDice: import('../types').DiceGroup[]; stats: string[]; masteries: string[] }>) => {
    const next = { ...data, ...patch };
    const dice = patch.damageDice ?? normDice;
    const sts = patch.stats ?? normStats;
    const msts = patch.masteries ?? normMasteries;
    // Sync legacy fields from first element for backward compat
    next.damageDice = dice;
    next.stats = sts;
    next.masteries = msts;
    next.damage = dice.map(d => `${d.count}d${d.die}`).join(' + ');
    next.damageType = dice[0]?.damageType || 'perforant';
    next.stat = (sts[0] as 'str' | 'dex') || 'dex';
    next.mastery = msts.join(', ');
    onChange(JSON.stringify(next));
  };

  // ── EDIT MODE ────────────────────────────────────────────────────────
  if (isEditing) {
    const allProperties = getWeaponProperties(allPages);
    const allMasteries = getWeaponMasteries(allPages);
    const selectedProps = (data.properties || '').split(',').map(s => s.trim()).filter(Boolean);
    const toggleProperty = (name: string) => {
      const next = selectedProps.includes(name)
        ? selectedProps.filter(p => p !== name)
        : [...selectedProps, name];
      saveAll({ properties: next.join(', ') });
    };

    const updateDice = (idx: number, patch: Partial<import('../types').DiceGroup>) => {
      const next = normDice.map((d, i) => i === idx ? { ...d, ...patch } : d);
      saveAll({ damageDice: next });
    };
    const addDice = () => saveAll({ damageDice: [...normDice, { count: 1, die: 6, damageType: 'perforant' }] });
    const removeDice = (idx: number) => saveAll({ damageDice: normDice.filter((_, i) => i !== idx) });

    const toggleStat = (s: string) => {
      const next = normStats.includes(s) ? normStats.filter(x => x !== s) : [...normStats, s];
      saveAll({ stats: next.length ? next : ['dex'] });
    };

    const toggleMastery = (name: string) => {
      const next = normMasteries.includes(name)
        ? normMasteries.filter(m => m !== name)
        : [...normMasteries, name];
      saveAll({ masteries: next });
    };

    const ALL_STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const FALLBACK_MASTERIES = ['Coup double', 'Écorchure', 'Enchaînement', 'Ouverture', 'Poussée', 'Ralentissement', 'Renversement', 'Sape'];

    return (
      <div className="p-4 modal-glass-card rounded-xl space-y-5 text-xs font-sans">

        {/* ── Poids, Prix, Portée Min & Portée Max ────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Poids (kg)</label>
            <input type="number" step={0.1} min={0} value={data.weight} onChange={e => saveAll({ weight: parseFloat(e.target.value) || 0 })}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Prix</label>
            <input type="text" value={data.price} onChange={e => saveAll({ price: e.target.value })}
              placeholder="ex: 10 PO" className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Portée Min (m)</label>
            <input type="number" min={0} value={data.rangeMin ?? ''} onChange={e => saveAll({ rangeMin: e.target.value ? parseInt(e.target.value) || 0 : undefined })}
              placeholder="ex: 24" className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Portée Max (m)</label>
            <input type="number" min={0} value={data.rangeMax ?? ''} onChange={e => saveAll({ rangeMax: e.target.value ? parseInt(e.target.value) || 0 : undefined })}
              placeholder="ex: 96" className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        </div>

        {/* ── Groupes de dés ─────────────────────────────────────────── */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Dégâts</label>

          {/* Ligne d'ajout — tout sur une seule ligne */}
          <div className="flex items-center gap-2 flex-wrap p-2 rounded-lg bg-slate-900/60 border border-slate-700 mb-2">
            <DiceCountPicker
              onAdd={(count, die, damageType) =>
                saveAll({ damageDice: [...normDice, { count, die, damageType }] })
              }
              damageTypes={DAMAGE_TYPES}
            />
          </div>

          {/* Liste des dés ajoutés */}
          {normDice.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {normDice.map((dice, idx) => (
                <div key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                  <span className="text-red-400 font-bold">{dice.count}d{dice.die}</span>
                  <span className="text-slate-500 text-[10px]">{dice.damageType}</span>
                  <button onClick={() => saveAll({ damageDice: normDice.filter((_, i) => i !== idx) })}
                    className="text-slate-600 hover:text-red-400 transition-colors font-bold leading-none ml-0.5">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Caractéristiques ───────────────────────────────────────── */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">
            Caractéristique(s)
            {normStats.length > 1 && <span className="ml-2 text-amber-400/80 normal-case font-normal">au choix du joueur</span>}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATS.map(s => {
              const active = normStats.includes(s);
              return (
                <button key={s} onClick={() => toggleStat(s)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${active
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}>
                  {active && <span className="mr-1">✓</span>}{STAT_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Propriétés ─────────────────────────────────────────────── */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">
            Propriétés
            {selectedProps.length > 0 && <span className="ml-2 text-amber-400/80 normal-case font-normal">{selectedProps.join(', ')}</span>}
          </label>
          {allProperties.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {allProperties.map(p => {
                const active = selectedProps.includes(p.name);
                return (
                  <button key={p.name} onClick={() => toggleProperty(p.name)} title={p.description}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${active
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}>
                    {active && <span className="mr-1">✓</span>}{p.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-600 italic">Aucune propriété trouvée dans la fiche «&nbsp;Armes&nbsp;».</p>
          )}
        </div>

        {/* ── Bottes d'arme — multiples ──────────────────────────────── */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">
            Botte(s) d'Arme
            {normMasteries.length > 1 && <span className="ml-2 text-amber-400/80 normal-case font-normal">{normMasteries.length} bottes</span>}
          </label>
          {(allMasteries.length > 0 ? allMasteries.map(m => m.name) : FALLBACK_MASTERIES).map(name => {
            const active = normMasteries.includes(name);
            const found = allMasteries.find(m => m.name === name);
            return (
              <div key={name} className="mb-1.5">
                <button onClick={() => toggleMastery(name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-2 ${active
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'}`}>
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 text-[9px] transition-all ${active ? 'bg-amber-500 border-amber-500 text-black' : 'border-slate-600'}`}>
                    {active && '✓'}
                  </span>
                  {name}
                </button>
                {active && found && (
                  <p className="mt-0.5 text-[10px] text-slate-500 italic leading-relaxed border-l-2 border-amber-500/30 pl-2 ml-2">{found.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── VIEW MODE ────────────────────────────────────────────────────────
  const matchedPropertiesList = (data.properties || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(pName => {
      const matched = getWeaponProperties(allPages).find(wp => wp.name.toLowerCase() === pName.toLowerCase() || pName.toLowerCase().startsWith(wp.name.toLowerCase()));
      return matched ? { name: pName, desc: matched.description } : { name: pName, desc: null };
    });

  const allMasteriesList = getWeaponMasteries(allPages);
  const resolvedMasteries = normMasteries
    .map(name => allMasteriesList.find(m => m.name === name) ?? null)
    .filter(Boolean) as { name: string; description: string }[];

  const damageLabel = normDice.map(d => `${d.count}d${d.die} ${d.damageType}`).join(' + ');
  const statsLabel = normStats.map(s => STAT_LABELS[s] || s).join(' ou ');
  const isVersatile = (data.properties || '').toLowerCase().includes('polyvalente');

  return (
    <div className="p-5 rounded-xl border border-amber-500/10 bg-amber-950/2 flex flex-col gap-4 font-serif">
      <div className="border-b border-white/5 pb-2">
        <h4 className="text-[12px] font-bold text-amber-400 tracking-widest uppercase">Arme</h4>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-sans">
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">Dégâts</span>
          {isVersatile && normDice.length >= 2 ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <strong className="text-red-400 text-base">{normDice[0].count}d{normDice[0].die}</strong>
                <span className="text-slate-400 text-[10px]">(1 main)</span>
                <span className="text-slate-500 text-[10px]">{normDice[0].damageType}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <strong className="text-amber-500 text-sm">{normDice[1].count}d{normDice[1].die}</strong>
                <span className="text-slate-400 text-[10px]">(2 mains)</span>
                <span className="text-slate-500 text-[10px]">{normDice[1].damageType}</span>
              </div>
            </div>
          ) : (
            normDice.map((d, i) => (
              <div key={i} className="flex items-baseline flex-wrap gap-1">
                <strong className="text-red-400 text-base">{d.count}d{d.die}</strong>
                <span className="text-slate-400 text-sm">{d.damageType}</span>
                {i < normDice.length - 1 && <span className="text-slate-500 mx-1">+</span>}
              </div>
            ))
          )}
        </div>
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">
            {normStats.length > 1 ? 'Caractéristique (au choix)' : 'Caractéristique'}
          </span>
          <strong className="text-slate-250 text-sm">{statsLabel}</strong>
        </div>
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">Portée</span>
          <strong className="text-slate-250 text-sm">
            {(() => {
              const hasLancer = (data.properties || '').toLowerCase().includes('lancer');
              const hasRange = data.rangeMin || data.rangeMax;
              if (hasRange) {
                if (hasLancer) {
                  return `CàC / Lancer (${data.rangeMin || 0} / ${data.rangeMax || 0} m)`;
                }
                return `${data.rangeMin || 0} / ${data.rangeMax || 0} m`;
              }
              return 'Corps à corps';
            })()}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 font-bold uppercase text-[11px] block mb-1">Poids & Prix</span>
          <span className="text-slate-200 text-sm">{data.weight} kg</span>
          {data.price && <span className="text-amber-500 text-sm font-semibold ml-1.5">· {data.price}</span>}
        </div>
      </div>

      {/* Propriétés */}
      {matchedPropertiesList.length > 0 && (
        <div className="space-y-3">
          <h1 className="text-[13px] font-black text-slate-350 uppercase tracking-widest border-b border-white/5 pb-1.5">Propriétés</h1>
          {matchedPropertiesList.map((p, i) => (
            <div key={i} className="pl-3 border-l-2 border-amber-500/25">
              <span className="text-amber-300 font-bold text-sm block mb-0.5">{p.name}</span>
              {p.desc
                ? <p className="text-[13px] text-slate-350 leading-relaxed font-sans">{p.desc}</p>
                : <p className="text-[13px] text-slate-500 italic font-sans">Aucune description disponible.</p>
              }
            </div>
          ))}
        </div>
      )}

      {/* Bottes d'arme — affichage multiple */}
      {resolvedMasteries.length > 0 && (
        <div className="space-y-3">
          <h1 className="text-[13px] font-black text-slate-350 uppercase tracking-widest border-b border-white/5 pb-1.5">
            {resolvedMasteries.length > 1 ? 'Bottes d\'arme' : 'Botte d\'arme'}
          </h1>
          {resolvedMasteries.map((m, i) => (
            <div key={i} className="pl-3 border-l-2 border-amber-500/50">
              <span className="text-amber-400 font-bold text-sm block mb-0.5">{m.name}</span>
              <p className="text-[13px] text-slate-350 leading-relaxed font-sans">{m.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.description && (
        <p className="text-sm leading-relaxed text-slate-250 pt-2 border-t border-white/5 font-sans">{data.description}</p>
      )}
    </div>
  );
}

function EquipmentBlock({ content, isEditing, onChange }: { content: string; isEditing: boolean; onChange: (v: string) => void }) {
  let data: EquipmentBlockData = {
    ac: 0, shieldBonus: 0, armorType: 'other', weight: 1.0, price: '', description: ''
  };
  try {
    if (content) data = { ...data, ...JSON.parse(content) };
  } catch { /* ignore */ }

  const set = (key: keyof EquipmentBlockData, val: any) => {
    onChange(JSON.stringify({ ...data, [key]: val }));
  };

  if (isEditing) {
    return (
      <div className="p-4 modal-glass-card rounded-xl space-y-3 text-xs">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Classe d'Armure (CA)</label>
            <input type="number" value={data.ac} onChange={e => set('ac', parseInt(e.target.value) || 0)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Bonus de Bouclier</label>
            <input type="number" value={data.shieldBonus} onChange={e => set('shieldBonus', parseInt(e.target.value) || 0)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Type d'Équipement</label>
            <select value={data.armorType} onChange={e => set('armorType', e.target.value as any)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40 cursor-pointer">
              <option value="light">Armure légère</option>
              <option value="medium">Armure intermédiaire</option>
              <option value="heavy">Armure lourde</option>
              <option value="shield">Bouclier</option>
              <option value="other">Autre objet</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Poids (kg)</label>
            <input type="number" step={0.1} value={data.weight} onChange={e => set('weight', parseFloat(e.target.value) || 0)}
              className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Prix</label>
            <input type="text" value={data.price} onChange={e => set('price', e.target.value)}
              placeholder="ex: 75 PO" className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Description</label>
          <textarea rows={3} value={data.description} onChange={e => set('description', e.target.value)}
            className="w-full bg-dark-950 border border-slate-800 text-slate-350 px-3 py-1.5 rounded-lg outline-none focus:border-gold-500/40 font-serif" />
        </div>
      </div>
    );
  }

  const armorTypeLabels = {
    light: 'Armure légère',
    medium: 'Armure intermédiaire',
    heavy: 'Armure lourde',
    shield: 'Bouclier',
    other: 'Autre équipement'
  };

  return (
    <div className="p-5 rounded-xl border border-amber-500/10 bg-amber-950/2 flex flex-col gap-4 font-serif">
      <div className="border-b border-white/5 pb-2">
        <h4 className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">Équipement (D&D 2024)</h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans text-slate-350">
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Type</span> <strong>{armorTypeLabels[data.armorType]}</strong></div>
        {data.armorType !== 'shield' && data.ac > 0 && (
          <div><span className="text-slate-500 font-bold uppercase text-[9px] block">CA (Base)</span> <strong className="text-emerald-400 text-sm">{data.ac}</strong></div>
        )}
        {data.armorType === 'shield' && data.shieldBonus > 0 && (
          <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Bonus CA</span> <strong className="text-emerald-400 text-sm">+{data.shieldBonus}</strong></div>
        )}
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Poids</span> <span>{data.weight} kg</span></div>
        <div><span className="text-slate-500 font-bold uppercase text-[9px] block">Prix</span> <span>{data.price || 'Gratuit'}</span></div>
      </div>

      <p className="text-xs leading-relaxed text-slate-300 pt-2 border-t border-white/5">{data.description || 'Aucune description.'}</p>
    </div>
  );
}

function CurrencyBlock({ content, isEditing, onChange }: { content: string; isEditing: boolean; onChange: (v: string) => void }) {
  let rates: CurrencyRate[] = DEFAULT_CURRENCY_RATES;
  try {
    if (content) {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        rates = parsed;
      }
    }
  } catch { /* ignore */ }

  const handleUpdateRate = (idx: number, field: keyof CurrencyRate, value: any) => {
    const next = rates.map((r, i) => i === idx ? { ...r, [field]: value } : r);
    onChange(JSON.stringify(next));
  };

  const handleAddRate = () => {
    const newId = `custom-coin-${Date.now()}`;
    const next = [...rates, { id: newId, name: 'Nouvelle pièce (xx)', valueInGp: 1.0, weightGramsPerCoin: 10 }];
    onChange(JSON.stringify(next));
  };

  const handleRemoveRate = (idx: number) => {
    const next = rates.filter((_, i) => i !== idx);
    onChange(JSON.stringify(next));
  };

  const tableHeaderCls = "px-3 py-2 text-left text-[10px] font-bold text-amber-500 uppercase tracking-wider border-b border-slate-800";
  const tableCellCls = "px-3 py-2 border-b border-slate-850 text-slate-300 text-xs";

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 bg-[#0f0a05]/20 rounded-xl border border-slate-850">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className={tableHeaderCls}>Code ID</th>
                <th className={tableHeaderCls}>Nom de la pièce</th>
                <th className={tableHeaderCls}>Valeur en PO</th>
                <th className={tableHeaderCls}>Poids (g / pièce)</th>
                <th className="px-3 py-2 border-b border-slate-800 shrink-0"></th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate, idx) => (
                <tr key={rate.id}>
                  <td className={tableCellCls}>
                    <input
                      type="text"
                      value={rate.id}
                      onChange={e => handleUpdateRate(idx, 'id', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      className="w-20 bg-slate-900/60 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:border-amber-500/50 outline-none text-xs"
                      placeholder="code"
                    />
                  </td>
                  <td className={tableCellCls}>
                    <input
                      type="text"
                      value={rate.name}
                      onChange={e => handleUpdateRate(idx, 'name', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:border-amber-500/50 outline-none text-xs"
                      placeholder="Ex: Pièces de Cuivre (pc)"
                    />
                  </td>
                  <td className={tableCellCls}>
                    <input
                      type="text"
                      value={rate.valueInGp}
                      onChange={e => handleUpdateRate(idx, 'valueInGp', e.target.value)}
                      className="w-20 bg-slate-900/60 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:border-amber-500/50 outline-none text-xs"
                      placeholder="1/100 ou 0.01"
                    />
                  </td>
                  <td className={tableCellCls}>
                    <input
                      type="number"
                      value={rate.weightGramsPerCoin}
                      onChange={e => handleUpdateRate(idx, 'weightGramsPerCoin', parseFloat(e.target.value) || 0)}
                      className="w-20 bg-slate-900/60 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:border-amber-500/50 outline-none text-xs"
                    />
                  </td>
                  <td className="px-3 py-2 border-b border-slate-850 text-right shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveRate(idx)}
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={handleAddRate}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/30 rounded-lg transition cursor-pointer font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une monnaie</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0a05]/20 p-4 rounded-xl border border-slate-850 space-y-3">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className={tableHeaderCls}>Pièce</th>
              <th className={tableHeaderCls}>Valeur en PO</th>
              <th className={tableHeaderCls}>Poids par pièce</th>
            </tr>
          </thead>
          <tbody>
            {rates.map(rate => (
              <tr key={rate.id} className="hover:bg-white/[0.01] transition duration-150">
                <td className="px-3 py-2.5 border-b border-slate-850 text-slate-200 text-xs font-semibold">{rate.name}</td>
                <td className="px-3 py-2.5 border-b border-slate-850 text-amber-500 text-xs font-mono font-bold">
                  {rate.valueInGp} PO
                </td>
                <td className="px-3 py-2.5 border-b border-slate-850 text-slate-400 text-xs font-mono">
                  {rate.weightGramsPerCoin} g
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WeaponPropertiesBlock({ content, isEditing, onChange }: { content: string; isEditing: boolean; onChange: (v: string) => void }) {
  let propsList: WeaponProperty[] = DEFAULT_WEAPON_PROPERTIES;
  try {
    if (content) {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        propsList = parsed;
      }
    }
  } catch { /* ignore */ }

  const handleUpdateProp = (idx: number, field: keyof WeaponProperty, value: string) => {
    const next = propsList.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    onChange(JSON.stringify(next));
  };

  const handleAddProp = () => {
    const newId = `prop-${Date.now()}`;
    const next = [...propsList, { id: newId, name: 'Nouvelle propriété', description: 'Description de la propriété...' }];
    onChange(JSON.stringify(next));
  };

  const handleRemoveProp = (idx: number) => {
    const next = propsList.filter((_, i) => i !== idx);
    onChange(JSON.stringify(next));
  };

  const tableHeaderCls = "px-3 py-2 text-left text-[10px] font-bold text-amber-500 uppercase tracking-wider border-b border-slate-800";
  const tableCellCls = "px-3 py-2 border-b border-slate-850 text-slate-300 text-xs";

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 bg-[#0f0a05]/20 rounded-xl border border-slate-850">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className={tableHeaderCls} style={{ width: '20%' }}>Nom de la propriété</th>
                <th className={tableHeaderCls} style={{ width: '70%' }}>Description de la règle</th>
                <th className="px-3 py-2 border-b border-slate-800 shrink-0" style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {propsList.map((prop, idx) => (
                <tr key={prop.id}>
                  <td className={tableCellCls} style={{ verticalAlign: 'top' }}>
                    <input
                      type="text"
                      value={prop.name}
                      onChange={e => handleUpdateProp(idx, 'name', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded px-2 py-1.5 text-slate-200 focus:border-amber-500/50 outline-none text-xs font-bold"
                      placeholder="Nom"
                    />
                  </td>
                  <td className={tableCellCls}>
                    <textarea
                      rows={2}
                      value={prop.description}
                      onChange={e => handleUpdateProp(idx, 'description', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:border-amber-500/50 outline-none text-xs font-sans"
                      placeholder="Description de la règle..."
                    />
                  </td>
                  <td className="px-3 py-2 border-b border-slate-850 text-right shrink-0" style={{ verticalAlign: 'middle' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveProp(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={handleAddProp}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/30 rounded-lg transition cursor-pointer font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une propriété</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0a05]/20 p-4 rounded-xl border border-slate-850 space-y-3">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className={tableHeaderCls} style={{ width: '25%' }}>Propriété</th>
              <th className={tableHeaderCls} style={{ width: '75%' }}>Règle & Effets</th>
            </tr>
          </thead>
          <tbody>
            {propsList.map(prop => (
              <tr key={prop.id} className="hover:bg-white/[0.01] transition duration-150">
                <td className="px-3 py-3 border-b border-slate-850 text-slate-200 text-xs font-semibold">{prop.name}</td>
                <td className="px-3 py-3 border-b border-slate-850 text-slate-350 text-xs leading-relaxed font-sans">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WeaponMasteriesBlock({ content, isEditing, onChange }: { content: string; isEditing: boolean; onChange: (v: string) => void }) {
  let masteriesList: WeaponMastery[] = DEFAULT_WEAPON_MASTERIES;
  try {
    if (content) {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        masteriesList = parsed;
      }
    }
  } catch { /* ignore */ }

  const handleUpdateMastery = (idx: number, field: keyof WeaponMastery, value: string) => {
    const next = masteriesList.map((m, i) => i === idx ? { ...m, [field]: value } : m);
    onChange(JSON.stringify(next));
  };

  const handleAddMastery = () => {
    const newId = `mastery-${Date.now()}`;
    const next = [...masteriesList, { id: newId, name: 'Nouvelle botte', description: 'Description de la botte...' }];
    onChange(JSON.stringify(next));
  };

  const handleRemoveMastery = (idx: number) => {
    const next = masteriesList.filter((_, i) => i !== idx);
    onChange(JSON.stringify(next));
  };

  const tableHeaderCls = "px-3 py-2 text-left text-[10px] font-bold text-amber-500 uppercase tracking-wider border-b border-slate-800";
  const tableCellCls = "px-3 py-2 border-b border-slate-850 text-slate-300 text-xs";

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 bg-[#0f0a05]/20 rounded-xl border border-slate-850">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className={tableHeaderCls} style={{ width: '20%' }}>Nom de la botte</th>
                <th className={tableHeaderCls} style={{ width: '70%' }}>Description des effets</th>
                <th className="px-3 py-2 border-b border-slate-800 shrink-0" style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {masteriesList.map((mastery, idx) => (
                <tr key={mastery.id}>
                  <td className={tableCellCls} style={{ verticalAlign: 'top' }}>
                    <input
                      type="text"
                      value={mastery.name}
                      onChange={e => handleUpdateMastery(idx, 'name', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded px-2 py-1.5 text-slate-200 focus:border-amber-500/50 outline-none text-xs font-bold"
                      placeholder="Nom"
                    />
                  </td>
                  <td className={tableCellCls}>
                    <textarea
                      rows={2}
                      value={mastery.description}
                      onChange={e => handleUpdateMastery(idx, 'description', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:border-amber-500/50 outline-none text-xs font-sans"
                      placeholder="Description des effets..."
                    />
                  </td>
                  <td className="px-3 py-2 border-b border-slate-850 text-right shrink-0" style={{ verticalAlign: 'middle' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveMastery(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={handleAddMastery}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/30 rounded-lg transition cursor-pointer font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une botte</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0a05]/20 p-4 rounded-xl border border-slate-850 space-y-3">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className={tableHeaderCls} style={{ width: '25%' }}>Botte</th>
              <th className={tableHeaderCls} style={{ width: '75%' }}>Description des effets</th>
            </tr>
          </thead>
          <tbody>
            {masteriesList.map(mastery => (
              <tr key={mastery.id} className="hover:bg-white/[0.01] transition duration-150">
                <td className="px-3 py-3 border-b border-slate-850 text-slate-200 text-xs font-semibold">{mastery.name}</td>
                <td className="px-3 py-3 border-b border-slate-850 text-slate-350 text-xs leading-relaxed font-sans">
                  {mastery.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

