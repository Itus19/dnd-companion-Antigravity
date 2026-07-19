import { WikiPage } from '../../types';

export const BACKGROUNDS_RULES: WikiPage[] = [
  {
    "id": "origin-acolyte",
    "title": "Origine : Acolyte",
    "category": "regle",
    "aliases": [
      "acolyte",
      "croyant"
    ],
    "tags": [
      "Origines",
      "Backgrounds",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-or-aco-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Serviteur des dieux et gardien des rites</h3>\n<p>Vous avez consacré votre jeunesse à la dévotion religieuse, résidant dans un temple, une abbaye ou un sanctuaire sacré. Vous y avez appris les écritures saintes et les rituels en l'honneur des divinités de votre panthéon.</p>\n<p>Vous apportez avec vous la foi inébranlable et le réconfort moral que procure l'appartenance à un ordre sacré.</p>"
      },
      {
        "id": "b-or-aco-1",
        "type": "origin",
        "title": "Données d'origine",
        "content": "{\"abilityBoosts\":[\"Sagesse\",\"Intelligence\"],\"skills\":[\"Intuition\",\"Religion\"],\"feats\":[\"Béni (Priest)\"],\"equipment\":[\"Symbole sacré\",\"Livre de prières\",\"Habits de cérémonie\",\"15 PO\"],\"description\":\"Vous avez passé votre vie au service d'un temple, apprenant les rites et les textes sacrés. Le don d'origine Béni vous accorde deux tours de magie de prêtre.\"}"
      }
    ]
  },
  {
    "id": "origin-sage",
    "title": "Origine : Sage",
    "category": "regle",
    "aliases": [
      "sage",
      "érudit",
      "bibliothécaire"
    ],
    "tags": [
      "Origines",
      "Backgrounds",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-or-sag-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Érudit des académies de savoir</h3>\n<p>Vous croyez fermement que le savoir est la clé de la puissance. Vous avez passé d'innombrables heures à lire des parchemins anciens, à recopier des manuscrits et à étudier la géographie ou la magie dans de grandes bibliothèques.</p>\n<p>Votre esprit cartésien et votre mémoire encyclopédique font de vous la référence pour dénouer les énigmes historiques.</p>"
      },
      {
        "id": "b-or-sag-1",
        "type": "origin",
        "title": "Données d'origine",
        "content": "{\"abilityBoosts\":[\"Intelligence\",\"Sagesse\"],\"skills\":[\"Arcanes\",\"Histoire\"],\"feats\":[\"Initié à la magie (Magicien)\"],\"equipment\":[\"Matériel de calligraphie\",\"Grimoire vierge\",\"Robe d'érudit\",\"10 PO\"],\"description\":\"Vous avez passé des années à étudier les mystères de la nature ou de l'histoire dans les grandes bibliothèques académiques. Vous connaissez deux tours de magie et un sort de niveau 1 de magicien.\"}"
      }
    ]
  },
  {
    "id": "origin-artisan",
    "title": "Origine : Artisan de la guilde",
    "category": "regle",
    "aliases": [
      "artisan de la guilde",
      "artisan",
      "guild artisan"
    ],
    "tags": [
      "Origines",
      "Backgrounds",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-or-art-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Membre d'une guilde d'artisans</h3>\n<p>Vous avez été formé par une guilde d'artisans (comme les forgerons, les maçons ou les menuisiers). Vous connaissez les secrets de fabrication de votre métier, savez négocier le prix des matières premières et possédez un réseau de confrères dans toutes les grandes cités.</p>"
      },
      {
        "id": "b-or-art-1",
        "type": "origin",
        "title": "Données d'origine",
        "content": "{\"abilityBoosts\":[\"Force\",\"Constitution\"],\"skills\":[\"Intuition\",\"Persuasion\"],\"feats\":[\"Artisanat (Crafter)\"],\"equipment\":[\"Outils de forgeron\",\"Lettre d'introduction de la guilde\",\"Habits de voyage\",\"15 PO\"],\"description\":\"Vous êtes membre d'une guilde marchande ou artisanale respectable. Le don Artisanat vous permet d'obtenir des réductions sur l'achat d'équipement et d'outils de fabrication.\"}"
      }
    ]
  },
  {
    "id": "origin-artiste",
    "title": "Origine : Artiste",
    "category": "regle",
    "aliases": ["artiste", "saltimbanque", "entertainer"],
    "tags": ["Origines", "Backgrounds", "2024"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-or-art-desc-custom",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Spectacle, musique et divertissement</h3>\n<p>Vous vous épanouissez sous les projecteurs, devant une foule captivée. Qu'il s'agisse de musique, d'acrobaties, de comédie ou de poésie, votre art est votre vie.</p>\n<p>Vous savez comment capter l'attention, divertir les clients d'une taverne ou vous attirer les faveurs des nobles locaux.</p>"
      },
      {
        "id": "b-or-art-1-custom",
        "type": "origin",
        "title": "Données d'origine",
        "content": "{\"abilityBoosts\":[\"Dextérité\",\"Charisme\"],\"skills\":[\"Acrobaties\",\"Représentation\"],\"feats\":[\"Musicien (Musician)\"],\"equipment\":[\"Instrument de musique (Luth)\",\"Costume d'artiste\",\"Maquillage\",\"15 PO\"],\"description\":\"Vous vivez pour la scène. Le don Musicien vous permet d'inspirer vos compagnons durant les repos courts en leur donnant l'Inspiration Héroïque.\"}"
      }
    ]
  }
];
