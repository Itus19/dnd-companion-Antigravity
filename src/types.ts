export type WikiCategory = 'lieu' | 'faction' | 'personnage' | 'intrigue' | 'regle' | 'autre';

export type BlockType = 'text' | 'image' | 'statblock' | 'timeline' | 'familytree' | 'character';

export interface WikiBlock {
  id: string;
  type: BlockType;
  title?: string;
  content: string; // Contenu brut (Markdown pour 'text', JSON pour les blocs structurés)
  isSecret?: boolean; // Bloc réservé au MJ
}

export interface WikiPage {
  id: string;
  title: string;
  category: WikiCategory;
  aliases: string[]; // Noms alternatifs pour l'auto-liaison en direct
  blocks: WikiBlock[];
  tags: string[];
  isSecret?: boolean; // Article entier réservé au MJ
  createdAt: string;
  updatedAt: string;
  bannerImage?: string; // Image d'en-tête (blason/armoirie)
}
