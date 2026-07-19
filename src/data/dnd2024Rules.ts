import { WikiPage } from '../types';
import { SPELLS_RULES } from './rules/spells';
import { SPECIES_RULES } from './rules/species';
import { BACKGROUNDS_RULES } from './rules/backgrounds';
import { CLASSES_RULES } from './rules/classes';
import { CONDITIONS_RULES } from './rules/conditions';
import { WEAPONS_RULES } from './rules/weapons';
import { GENERAL_RULES } from './rules/general';
import { COMPONENTS_RULES } from './rules/components';

export const DND_2024_DEFAULT_RULES: WikiPage[] = [
  ...SPELLS_RULES,
  ...SPECIES_RULES,
  ...BACKGROUNDS_RULES,
  ...CLASSES_RULES,
  ...CONDITIONS_RULES,
  ...WEAPONS_RULES,
  ...GENERAL_RULES,
  ...COMPONENTS_RULES
];
