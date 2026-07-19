export type WikiCategory = string;

export type BlockType = 'text' | 'image' | 'timeline' | 'familytree' | 'character' | 'spell' | 'class' | 'species' | 'origin' | 'weapon' | 'equipment' | 'currency' | 'weapon_properties' | 'weapon_masteries' | 'general_rule';

export interface WikiBlock {
  id: string;
  type: BlockType;
  title?: string;
  content: string;
  isSecret?: boolean;
}

export interface DiceGroup {
  count: number;
  die: number;
  damageType: string;
  /** Optional bonus added to the roll: '' | '+mod' | '+modcar' | '+1'...'+5' */
  modifier?: string;
}

export interface WeaponBlockData {
  /** Legacy single-value field kept for backward compat */
  damage: string;
  damageType: string;
  /** New multi-dice support */
  damageDice?: DiceGroup[];
  /** Legacy single stat kept for backward compat */
  stat: 'str' | 'dex';
  /** New multi-stat support e.g. ['str','dex'] */
  stats?: string[];
  properties: string;
  /** Legacy single mastery string */
  mastery: string;
  /** New multi-mastery support */
  masteries?: string[];
  weight: number;
  price: string;
  description: string;
  rangeMin?: number;
  rangeMax?: number;
}

export interface EquipmentBlockData {
  ac: number;
  shieldBonus: number;
  armorType: 'light' | 'medium' | 'heavy' | 'shield' | 'other';
  weight: number;
  price: string;
  description: string;
}

// Structured schemas for Rules Blocks
export interface SpellBlockData {
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: { v: boolean; s: boolean; m: string };
  duration: string;
  classes: string[];
  damageOrEffect: string;
  description: string;
  damageDice?: DiceGroup[];
  saveRequired?: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha' | 'none';
  saveEffect?: 'half' | 'none' | 'other';
  aoeType?: 'cone' | 'sphere' | 'cube' | 'cylinder' | 'line' | 'none';
  aoeRadius?: number;
  materialComponents?: string[];
  states?: string[];
  /**
   * For cantrips (level=0): minimum character level for this scaling tier.
   * Undefined = base tier (levels 1-4). 5 = levels 5+, 11 = levels 11+, 17 = levels 17+.
   * For leveled spells (level>0): not used — the `level` field encodes the slot level.
   */
  scalingThreshold?: number;
}

export interface ClassBlockData {
  hitDie: string;
  primaryAbilities: string[];
  saves: string[];
  armorProficiencies: string[];
  weaponMastery: boolean;
  subclasses: { name: string; description: string }[];
  description: string;
}

export interface SpeciesBlockData {
  size: string;
  speed: number;
  traits: { name: string; description: string }[];
}

export interface OriginBlockData {
  abilityBoosts: string[];
  skills: string[];
  feats: string[];
  equipment: string[];
  description: string;
}

// Relation between two wiki pages (directional: source → target)
export interface WikiRelation {
  id: string;
  type: string;       // e.g. "Personnage", "Faction", "Allié", "Ennemi", custom…
  targetPageId: string;
}

export interface WikiPage {
  id: string;
  title: string;
  category: WikiCategory;
  aliases: string[];
  blocks: WikiBlock[];
  tags: string[];
  relations: WikiRelation[];  // Outgoing relations from this page
  isSecret?: boolean;
  createdAt: string;
  updatedAt: string;
  bannerImage?: string;
  parentPageId?: string;
}

// Custom Category model
export interface CustomCategory {
  id: string;
  label: string;
  color: string;
  icon?: string;
}

// Floating window state
export interface WikiWindowState {
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMaximized?: boolean;
}

export interface GeneralRuleBlockData {
  ruleType: 'spells' | 'classes' | 'races' | 'origins' | 'equipment' | 'combat';
  magicSystem: 'slots' | 'points' | 'free' | 'none';
  concentrationRule: boolean;
  spellRecovery: 'long_rest' | 'short_rest' | 'both';
  hpRecovery: 'long_rest' | 'short_rest' | 'both';
  maxLevel: number;
  multiclassing: 'allowed' | 'restricted' | 'forbidden';
  encumbranceRule: 'classic' | 'variant' | 'none';
  weaponMasteriesEnabled: boolean;
  startingLanguages: string;
  asiRule: 'free' | 'fixed' | 'none';
  description: string;
}
