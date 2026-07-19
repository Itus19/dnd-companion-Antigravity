import { useState, useEffect } from 'react';
import { WikiPage, WikiBlock, BlockType, WikiCategory, WikiRelation } from '../types';
import { DND_2024_DEFAULT_RULES } from '../data/dnd2024Rules';

// ─────────────────────────────────────────────────────────────
// Migration: statblock → character (runs on localStorage load)
// ─────────────────────────────────────────────────────────────

function parseStat(v: string | number): number {
  if (typeof v === 'number') return v;
  const m = String(v).match(/^(\d+)/);
  return m ? parseInt(m[1]) : 10;
}

function migrateBlock(block: WikiBlock): WikiBlock {
  if ((block.type as string) !== 'statblock') return block;
  try {
    const sb = JSON.parse(block.content);
    const charData = {
      name: sb.name || 'Personnage',
      race: 'Humain', class: 'Guerrier', level: 1,
      alignment: '', background: '',
      type: sb.type || '',
      hp: sb.hp || '10', ac: sb.ac || '10', speed: sb.speed || '30 ft.',
      profBonus: 2, cr: sb.cr || '',
      stats: {
        str: parseStat(sb.stats?.str ?? 10),
        dex: parseStat(sb.stats?.dex ?? 10),
        con: parseStat(sb.stats?.con ?? 10),
        int: parseStat(sb.stats?.int ?? 10),
        wis: parseStat(sb.stats?.wis ?? 10),
        cha: parseStat(sb.stats?.cha ?? 10),
      },
      skills: sb.skills || '', senses: sb.senses || '',
      languages: sb.languages || '',
      equipment: '', backstory: '',
      actions: sb.actions || [], traits: [],
    };
    return { ...block, type: 'character' as BlockType, content: JSON.stringify(charData), title: block.title || 'Fiche de Personnage' };
  } catch {
    return { ...block, type: 'character' as BlockType };
  }
}

function migratePages(pages: WikiPage[]): WikiPage[] {
  return pages.map(page => {
    let parentPageId = page.parentPageId;
    if (!parentPageId) {
      if (page.id.startsWith('spell-')) {
        parentPageId = 'rule-spells';
      } else if (page.id.startsWith('class-')) {
        parentPageId = 'rule-classes';
      } else if (page.id.startsWith('species-')) {
        parentPageId = 'rule-races';
      } else if (page.id.startsWith('origin-')) {
        parentPageId = 'rule-origins';
      } else if (page.id.startsWith('weapon-') || page.id.startsWith('equipment-') || page.id.startsWith('component-')) {
        parentPageId = 'rule-equipment';
      } else if (page.id.startsWith('cond-') || page.id.startsWith('rule-')) {
        if (!['rule-spells', 'rule-classes', 'rule-races', 'rule-origins', 'rule-equipment', 'rule-combat'].includes(page.id)) {
          parentPageId = 'rule-combat';
        }
      }
    }

    if (page.id === 'equipment-armes' || page.id === 'equipment-monnaie') {
      parentPageId = 'rule-equipment';
    }

    // Rename tag Espèces -> Races
    const tags = (page.tags || []).map(t => t === 'Espèces' ? 'Races' : t);

    return {
      ...page,
      parentPageId,
      tags,
      relations: page.relations ?? [],
      blocks: page.blocks.map(migrateBlock),
    };
  });
}

// ─────────────────────────────────────────────────────────────
// Initial demo data — Garrick uses new character format
// ─────────────────────────────────────────────────────────────

const INITIAL_DEMO_PAGES: WikiPage[] = [
  {
    id: 'demo-1',
    title: 'Eldoria',
    category: 'lieu',
    aliases: ['eldoria', "la cité d'eldoria", "cité d'eldoria"],
    tags: ['Capitale', 'Cité', 'Est'],
    relations: [
      { id: 'rel-1-1', type: 'Personnage', targetPageId: 'demo-2' },
      { id: 'rel-1-2', type: 'Faction', targetPageId: 'demo-3' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60',
    blocks: [
      {
        id: 'b1-1',
        type: 'text',
        content: `<p>La cité étincelante d'<strong>Eldoria</strong> est la capitale du Royaume de l'Est. Bâtie sur les falaises de marbre blanc surplombant la Mer des Tempêtes, elle est réputée pour sa sécurité et sa grande bibliothèque de magie.</p>
<h2>Quartiers Remarquables</h2>
<ul>
<li><strong>Le Plateau Doré :</strong> Le quartier noble où réside le Roi Aldous.</li>
<li><strong>Le Port des Brumes :</strong> Zone marchande animée, mais fréquentée par des contrebandiers.</li>
<li><strong>La Forge Flamboyante :</strong> Située au cœur de la basse-ville, c'est là que travaille <strong>Garrick</strong>.</li>
</ul>`
      },
      {
        id: 'b1-2',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&auto=format&fit=crop&q=80',
        title: "Les Hautes Tours d'Eldoria"
      },
      {
        id: 'b1-3',
        type: 'text',
        isSecret: true,
        content: `<h2>Informations Secrètes du MJ</h2>
<ul>
<li>Un passage secret sous la taverne de la basse-ville mène directement aux catacombes royales.</li>
<li>Le conseiller du Roi Aldous est en réalité un espion infiltré travaillant pour les <strong>ombres du passé</strong>.</li>
</ul>`
      }
    ]
  },
  {
    id: 'demo-2',
    title: 'Garrick le Forgeron',
    category: 'personnage',
    aliases: ['garrick', 'garrick le forgeron', 'garrick le nain', 'forgeron'],
    tags: ['NPC', 'Nain', 'Forgeron'],
    relations: [
      { id: 'rel-2-1', type: 'Lieu', targetPageId: 'demo-1' },
      { id: 'rel-2-2', type: 'Faction', targetPageId: 'demo-3' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60',
    blocks: [
      {
        id: 'b2-1',
        type: 'text',
        content: `<p><strong>Garrick</strong> est un nain robuste aux bras d'acier et à la barbe tressée de fils d'or. Il tient la célèbre boutique <em>La Forge Flamboyante</em> dans la basse-ville d'<strong>Eldoria</strong>.</p>
<h2>Personnalité</h2>
<p>Garrick est bourru mais extrêmement loyal. Il refuse de fabriquer des armes pour ceux qu'il juge indignes.</p>`
      },
      {
        id: 'b2-2',
        type: 'character',
        title: 'Fiche de Personnage',
        content: JSON.stringify({
          name: "Garrick le Forgeron",
          race: "Nain",
          class: "Guerrier",
          subclass: "Champion",
          level: 5,
          alignment: "Loyal Neutre",
          background: "Artisan",
          type: "Moyen humanoïde (nain)",
          hp: "45 (6d8 + 18)",
          ac: "10",
          speed: "25 ft.",
          profBonus: 3,
          cr: "1 (200 XP)",
          stats: { str: 16, dex: 12, con: 16, int: 10, wis: 13, cha: 9 },
          skills: "Outils de forgeron +6, Athlétisme +5",
          senses: "Vision dans le noir 60 ft., Perception passive 11",
          languages: "Commun, Nain",
          equipment: "Marteau de forge, Cotte de mailles de nain, bouclier",
          backstory: "Ancien forgeron d'élite, Garrick a consacré sa vie à son art après avoir perdu son frère.",
          inventoryItems: [
            { name: "Cotte de mailles de nain", qty: 1, weight: 18.0, equipped: true },
            { name: "Marteau de forge", qty: 1, weight: 2.0, equipped: true },
            { name: "Bouclier", qty: 1, weight: 3.0, equipped: true }
          ],
          actions: [],
          traits: ["Résistance aux poisons", "Maîtrise des armes naines", "Robustesse naine"],
          resources: [
            { name: "Second Souffle", desc: "Récupère 1 utilisation après un repos court, tout après un repos long.", max: 2, current: 2, recovery: "Repos Court" },
            { name: "Sursaut d'activité", desc: "Permet de faire une action supplémentaire durant votre tour.", max: 1, current: 1, recovery: "Repos Long" }
          ],
          weaponMasteries: "Épée à deux mains (Écorchure), Lance (Sape)",
          generalProficiencies: "Armures légères, moyennes, lourdes, boucliers ; Armes courantes, de guerre ; Outils de forgeron"
        })
      },
      {
        id: 'b2-3',
        type: 'text',
        isSecret: true,
        content: `<h2>Révélation Secrète (Spoilers)</h2>
<p>Garrick est un ancien membre d'élite de l'<strong>Ordre du Lion d'Or</strong>. Il a pris sa retraite après la perte de son frère dans une quête liée aux <strong>ombres du passé</strong>.</p>`
      }
    ]
  },
  {
    id: 'demo-5',
    title: 'Lilith la Saltimbanque',
    category: 'personnage',
    aliases: ['lilith', 'lilith la saltimbanque', 'roublarde', 'saltimbanque'],
    tags: ['Joueur', 'Tieffelin', 'Roublard', 'Voleur Arcanique'],
    relations: [
      { id: 'rel-5-1', type: 'Lieu', targetPageId: 'demo-1' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
    blocks: [
      {
        id: 'b5-1',
        type: 'text',
        content: `<p><strong>Lilith</strong> est une tieffeline charismatique qui captive les foules sur les scènes d'<strong>Eldoria</strong> par sa musique envoûtante et ses illusions spectaculaires. Derrière son masque d'artiste se cache une cambrioleuse hors pair qui utilise sa magie profane pour détrousser les puissants.</p>
<h2>Personnalité</h2>
<p>Lilith est vive d'esprit, taquine et possède un sens aigu de la justice sociale. Elle utilise ses gains pour financer les orphelinats de la basse-ville d'Eldoria.</p>`
      },
      {
        id: 'b5-2',
        type: 'character',
        title: 'Fiche de Personnage',
        content: JSON.stringify({
          name: "Lilith la Saltimbanque",
          race: "Tieffelin",
          class: "Roublard",
          subclass: "Voleur arcanique",
          level: 5,
          alignment: "Chaotique Bon",
          background: "Artiste",
          type: "Moyen humanoïde (tieffelin)",
          hp: "33 (5d8 + 5)",
          ac: "14",
          speed: "9 m",
          profBonus: 3,
          cr: "",
          stats: { str: 8, dex: 16, con: 12, int: 14, wis: 10, cha: 14 },
          skills: "Acrobaties +9, Représentation +8, Discrétion +9, Escamotage +9, Perception +3, Investigation +5",
          senses: "Vision dans le noir 18 m, Perception passive 13, Intuition passive 13",
          languages: "Commun, Infernale",
          equipment: "Dague, Luth, Habits d'artiste, Armure de cuir, Nécessaire de cambrioleur",
          backstory: "Lilith a fui les cercles de l'Averne pour vivre de sa passion sur la scène d'Eldoria. Elle utilise la prestidigitation magique et son agilité pour délester les marchands corrompus.",
          inventoryItems: [
            { name: "Armure de cuir", qty: 1, weight: 4.0, equipped: true },
            { name: "Dague", qty: 2, weight: 0.5, equipped: true },
            { name: "Luth d'artiste", qty: 1, weight: 1.0, equipped: false },
            { name: "Costume d'artiste", qty: 1, weight: 2.0, equipped: true },
            { name: "Outils de voleur", qty: 1, weight: 0.5, equipped: true }
          ],
          actions: [
            { name: "Dague (+6 au toucher)", desc: "1d4+3 dégâts perforants (Nick). Finesse, lancer 6/18m. Permet l'Attaque sournoise (+3d6 dégâts)." }
          ],
          traits: [
            "Résistance infernale (Feu)",
            "Ascendance infernale (Thaumaturgie, Mains brûlantes 1/long, Ténèbres 1/long)",
            "Action rusée (Courir, Se cacher, Se désengager par action bonus)",
            "Main de mage arcanique (Main de mage invisible, crocheter/voler par action bonus)",
            "Esquive instinctive (divise par deux les dégâts d'une attaque en réaction)"
          ],
          resources: [
            { name: "Mains brûlantes (Ascendance)", desc: "Sort d'évocation de feu (DD 13). 1 utilisation par repos long.", max: 1, current: 1, recovery: "Repos Long" },
            { name: "Ténèbres (Ascendance)", desc: "Sort d'évocation (Ténèbres magiques). 1 utilisation par repos long.", max: 1, current: 1, recovery: "Repos Long" }
          ],
          weaponMasteries: "Dague (Entaille / Nick), Épée courte (Harceler / Vex)",
          generalProficiencies: "Armures légères ; Armes courantes, arbalètes de poing, épées courtes, rapières ; Outils de voleur, Luth",
          spellcastingAbility: "Intelligence",
          spellSaveDc: 13,
          spellAttackBonus: 5,
          spellSlotsMax: [3, 0, 0, 0, 0, 0, 0, 0, 0],
          spellSlotsUsed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          spellsList: ["Main de mage", "Thaumaturgie", "Mains brûlantes", "Ténèbres"],
          preparedSpells: ["Mains brûlantes", "Ténèbres"],
          proficientSkills: ["Acrobaties", "Représentation", "Discrétion", "Escamotage", "Perception", "Investigation"],
          expertSkills: ["Acrobaties", "Représentation", "Discrétion", "Escamotage"]
        })
      },
      {
        id: 'b5-3',
        type: 'text',
        isSecret: true,
        content: `<h2>Révélation Secrète (Spoilers)</h2>
<p>Lilith est en réalité la fille illégitime d'un noble de la cour d'Eldoria. Elle cambriole principalement son père biologique afin de redistribuer sa fortune aux sans-abris.</p>`
      }
    ]
  },
  {
    id: 'demo-3',
    title: "L'Ordre du Lion d'Or",
    category: 'faction',
    aliases: ["l'ordre du lion d'or", "lion d'or", "lions d'or", "ordre du lion d'or"],
    tags: ['Faction', 'Paladins', 'Justice'],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'b3-1',
        type: 'text',
        content: `<p>L'<strong>Ordre du Lion d'Or</strong> est une faction de paladins et de guerriers d'élite dévoués à la protection du royaume et au maintien de la paix à <strong>Eldoria</strong>.</p>
<h2>Dogme</h2>
<ul>
<li><strong>Honneur :</strong> Protéger les faibles sans attendre de récompense.</li>
<li><strong>Justice :</strong> Faire appliquer la loi de manière équitable.</li>
</ul>`
      }
    ]
  },
  {
    id: 'demo-4',
    title: 'Les Ombres du Passé',
    category: 'intrigue',
    aliases: ['les ombres du passé', 'ombres du passé', 'ombres'],
    tags: ['Intrigue', 'Quête', 'Culte'],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'b4-1',
        type: 'text',
        content: `<p>Une intrigue secrète s'ourdit dans les bas-fonds de la cité. Une secte oubliée cherche à récupérer une relique sombre enfouie sous les fondations d'<strong>Eldoria</strong>.</p>`
      }
    ]
  },
  ...DND_2024_DEFAULT_RULES
];

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useWiki() {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [customCategories, setCustomCategories] = useState<{ id: string; label: string; color: string }[]>([]);

  // Load custom categories on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dnd_companion_custom_categories_v1');
      if (stored) {
        try { setCustomCategories(JSON.parse(stored)); } catch { /* ignore */ }
      }
    }
  }, []);

  const saveCustomCategories = (next: { id: string; label: string; color: string }[]) => {
    setCustomCategories(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dnd_companion_custom_categories_v1', JSON.stringify(next));
    }
  };

  const addCustomCategory = (label: string, color: string) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const next = [...customCategories, { id, label, color }];
    saveCustomCategories(next);
    return id;
  };

  const deleteCustomCategory = (id: string) => {
    saveCustomCategories(customCategories.filter(c => c.id !== id));
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dnd_companion_wiki_v3');
      let loadedPages: WikiPage[] = [];
      let shouldSave = false;

      if (stored) {
        try {
          loadedPages = JSON.parse(stored);
        } catch (e) {
          console.error('Erreur localStorage v3, retour démos :', e);
          loadedPages = [...INITIAL_DEMO_PAGES];
          shouldSave = true;
        }
      } else {
        const oldStored = localStorage.getItem('dnd_companion_wiki_v2');
        if (oldStored) {
          try {
            loadedPages = JSON.parse(oldStored);
          } catch {
            loadedPages = [...INITIAL_DEMO_PAGES];
          }
        } else {
          loadedPages = [...INITIAL_DEMO_PAGES];
        }
        shouldSave = true;
      }

      // Filter out duplicate or user-made Arme/Armes pages to only keep the main seed page
      const originalCount = loadedPages.length;
      loadedPages = loadedPages.filter(p => {
        if (p.id === 'equipment-arme') return false;
        if (p.id !== 'equipment-armes' && (p.title.toLowerCase() === 'armes' || p.title.toLowerCase() === 'arme')) return false;
        return true;
      });
      if (loadedPages.length !== originalCount) {
        shouldSave = true;
      }

      // Deduplicate loadedPages by ID (preferring the one with more blocks/content)
      const uniquePagesMap = new Map<string, WikiPage>();
      loadedPages.forEach(page => {
        const current = uniquePagesMap.get(page.id);
        if (!current || page.blocks.length > current.blocks.length) {
          uniquePagesMap.set(page.id, page);
        }
      });
      if (loadedPages.length !== uniquePagesMap.size) {
        shouldSave = true;
      }
      loadedPages = Array.from(uniquePagesMap.values());

      // Strip title prefixes like "Classe : " or "Sous-classe : "
      loadedPages = loadedPages.map(page => {
        if (page.category === 'regle') {
          let updatedTitle = page.title;
          if (page.title.startsWith('Classe : ')) {
            updatedTitle = page.title.substring('Classe : '.length);
            shouldSave = true;
          } else if (page.title.startsWith('Sous-classe : ')) {
            updatedTitle = page.title.substring('Sous-classe : '.length);
            if (updatedTitle.endsWith(' (Guerrier)')) {
              updatedTitle = updatedTitle.substring(0, updatedTitle.length - ' (Guerrier)'.length);
            }
            shouldSave = true;
          }
          if (updatedTitle !== page.title) {
            return { ...page, title: updatedTitle };
          }
        }
        return page;
      });

      // Auto-merge missing default rules & demo pages into existing database
      INITIAL_DEMO_PAGES.forEach(demoPage => {
        const existingIdx = loadedPages.findIndex(p => p.id === demoPage.id);
        if (existingIdx === -1) {
          loadedPages.push(demoPage);
          shouldSave = true;
        } else {
          if (demoPage.id.startsWith('weapon-') || demoPage.id.startsWith('equipment-')) {
            const existingPage = loadedPages[existingIdx];
            if (existingPage.category !== demoPage.category) {
              existingPage.category = demoPage.category;
              shouldSave = true;
            }
            if (demoPage.parentPageId && existingPage.parentPageId !== demoPage.parentPageId) {
              existingPage.parentPageId = demoPage.parentPageId;
              shouldSave = true;
            }
            if (demoPage.tags && JSON.stringify(existingPage.tags) !== JSON.stringify(demoPage.tags)) {
              existingPage.tags = demoPage.tags;
              shouldSave = true;
            }
            const hasStructuredBlock = existingPage.blocks.some(b => b.type === 'weapon' || b.type === 'equipment');
            const hasCurrencyBlock = existingPage.blocks.some(b => b.type === 'currency');
            const hasPropsBlock = existingPage.blocks.some(b => b.type === 'weapon_properties');
            const hasADeuxMains = existingPage.blocks.some(b => b.type === 'weapon_properties' && b.content.includes('a_deux_mains'));
            if (demoPage.id === 'equipment-monnaie' && !hasCurrencyBlock) {
              loadedPages[existingIdx] = { ...demoPage, blocks: demoPage.blocks.map(b => ({ ...b })) };
              shouldSave = true;
            } else if (demoPage.id === 'equipment-armes' && (!hasPropsBlock || !hasADeuxMains)) {
              loadedPages[existingIdx] = { ...demoPage, blocks: demoPage.blocks.map(b => ({ ...b })) };
              shouldSave = true;
            } else if (demoPage.id !== 'equipment-monnaie' && demoPage.id !== 'equipment-armes' && !hasStructuredBlock) {
              loadedPages[existingIdx] = { ...demoPage, blocks: demoPage.blocks.map(b => ({ ...b })) };
              shouldSave = true;
            } else if (demoPage.id !== 'equipment-monnaie' && demoPage.id !== 'equipment-armes' && hasStructuredBlock) {
              // Migrate: ensure a Résumé text block exists before the stats block
              const existingPage = loadedPages[existingIdx];
              const hasResumeBlock = existingPage.blocks.some(b => b.type === 'text' && b.title === 'Résumé');
              if (!hasResumeBlock) {
                const demoResumeBlock = demoPage.blocks.find(b => b.type === 'text' && b.title === 'Résumé');
                if (demoResumeBlock) {
                  // Extract description from the old weapon/equipment block to preserve custom lore if any
                  const statsBlock = existingPage.blocks.find(b => b.type === 'weapon' || b.type === 'equipment');
                  let existingDesc = '';
                  if (statsBlock) {
                    try {
                      const parsed = JSON.parse(statsBlock.content);
                      if (parsed.description) existingDesc = parsed.description;
                      // Remove description from stats block
                      delete parsed.description;
                      statsBlock.content = JSON.stringify(parsed);
                    } catch { /* ignore */ }
                  }
                  const resumeBlock = { ...demoResumeBlock };
                  if (existingDesc) {
                    resumeBlock.content = `<p>${existingDesc}</p>`;
                  }
                  existingPage.blocks = [resumeBlock, ...existingPage.blocks.filter(b => b.id !== resumeBlock.id)];
                  shouldSave = true;
                }
              }
            }
          } else if (demoPage.id === 'demo-5') {
            const existingPage = loadedPages[existingIdx];
            const hasExpertSkills = existingPage.blocks.some(b => b.type === 'character' && b.content.includes('expertSkills'));
            if (!hasExpertSkills) {
              existingPage.blocks = demoPage.blocks.map(b => ({ ...b }));
              shouldSave = true;
            }
          } else if (demoPage.id.startsWith('spell-')) {
            const existingPage = loadedPages[existingIdx];
            const existingSpellBlock = existingPage.blocks.find(b => b.type === 'spell');
            const demoSpellBlock = demoPage.blocks.find(b => b.type === 'spell');
            if (existingSpellBlock && demoSpellBlock) {
              try {
                const existingContent = JSON.parse(existingSpellBlock.content);
                const demoContent = JSON.parse(demoSpellBlock.content);
                const needsUpdate = !existingContent.hasOwnProperty('saveRequired') || 
                                    !existingContent.hasOwnProperty('aoeType') || 
                                    (demoContent.states && demoContent.states.length > 0 && (!existingContent.states || existingContent.states.length === 0)) ||
                                    (demoContent.materialComponents && demoContent.materialComponents.length > 0 && (!existingContent.materialComponents || existingContent.materialComponents.length === 0)) ||
                                    (existingContent.description && existingContent.description !== "");
                
                if (needsUpdate) {
                  existingPage.blocks = demoPage.blocks.map(b => ({ ...b }));
                  shouldSave = true;
                }
              } catch {
                existingPage.blocks = demoPage.blocks.map(b => ({ ...b }));
                shouldSave = true;
              }
            }
          }
        }
      });

      // Generic weapon page deduplicator (removes old duplicate pages matching default rules by title)
      const seenTitles = new Set<string>();
      const sortedPages = [...loadedPages].sort((a, b) => {
        const aIsDefault = a.id.startsWith('weapon-') || a.id.startsWith('equipment-');
        const bIsDefault = b.id.startsWith('weapon-') || b.id.startsWith('equipment-');
        if (aIsDefault && !bIsDefault) return -1;
        if (!aIsDefault && bIsDefault) return 1;
        return 0;
      });

      const cleaned: WikiPage[] = [];
      sortedPages.forEach(page => {
        const isWeapon = page.id.startsWith('weapon-') || 
                         page.category === 'arme' || 
                         page.tags.some(t => t.toLowerCase().includes('arme') || t.toLowerCase().includes('corps à corps') || t.toLowerCase().includes('distance'));
                         
        if (isWeapon) {
          const titleNorm = page.title.toLowerCase().trim();
          if (seenTitles.has(titleNorm)) {
            shouldSave = true;
            return; // Discard duplicate
          }
          seenTitles.add(titleNorm);
        }
        cleaned.push(page);
      });
      loadedPages = cleaned;

      // Force category and parent rules for specific compendium items
      loadedPages = loadedPages.map(page => {
        let updated = false;
        let next = { ...page };

        const isMainClass = [
          'class-barbare', 'class-barde', 'class-guerrier', 'class-magicien', 'class-roublard',
          'class-clerc', 'class-paladin', 'class-druide', 'class-ranger', 'class-ensorceleur',
          'class-occultiste', 'class-moine'
        ].includes(next.id);

        if (next.id.startsWith('spell-') && next.category !== 'sort') {
          next.category = 'sort';
          updated = true;
        } else if (isMainClass && next.category !== 'classe') {
          next.category = 'classe';
          updated = true;
        } else if (next.id.startsWith('subclass-') && next.category !== 'sous-classe') {
          next.category = 'sous-classe';
          updated = true;
        } else if (next.id.startsWith('component-') && next.category !== 'composant') {
          next.category = 'composant';
          updated = true;
        }

        const isWeapon = next.id.startsWith('weapon-') || next.category === 'arme';
        if (isWeapon) {
          if (next.category !== 'arme') {
            next.category = 'arme';
            updated = true;
          }
          if (next.parentPageId !== 'equipment-armes') {
            next.parentPageId = 'equipment-armes';
            updated = true;
          }

          // Auto-parse rangeMin, rangeMax, and Polyvalente properties if missing or unmigrated
          const nextBlocks = next.blocks.map(block => {
            if (block.type === 'weapon') {
              try {
                const wData = JSON.parse(block.content);
                const props = wData.properties || '';
                let blockUpdated = false;
                let cleanProps = props;

                // 1. Parse Range from Lancer, Munitions or generic portée
                const rangeMatch = props.match(/portée\s+(\d+)\/(\d+)/i) || props.match(/portee\s+(\d+)\/(\d+)/i);
                if (rangeMatch) {
                  const min = parseInt(rangeMatch[1]);
                  const max = parseInt(rangeMatch[2]);
                  if (wData.rangeMin !== min) {
                    wData.rangeMin = min;
                    blockUpdated = true;
                  }
                  if (wData.rangeMax !== max) {
                    wData.rangeMax = max;
                    blockUpdated = true;
                  }
                }

                // 2. Parse Versatile / Polyvalente (1d8) or (1d10)
                const polyMatch = props.match(/polyvalente\s*\((\d+)d(\d+)\)/i);
                if (polyMatch) {
                  const pCount = parseInt(polyMatch[1]);
                  const pDie = parseInt(polyMatch[2]);
                  const currentDice = wData.damageDice && wData.damageDice.length > 0
                    ? wData.damageDice
                    : (() => {
                        const m = (wData.damage || '1d6').match(/^(\d+)d(\d+)$/);
                        return [{ count: m ? parseInt(m[1]) : 1, die: m ? parseInt(m[2]) : 6, damageType: wData.damageType || 'perforant' }];
                      })();

                  if (currentDice.length === 1) {
                    const firstDice = currentDice[0];
                    const versatileDice = {
                      count: pCount,
                      die: pDie,
                      damageType: firstDice.damageType || 'contondant'
                    };
                    wData.damageDice = [firstDice, versatileDice];
                    wData.damage = wData.damageDice.map((d: any) => `${d.count}d${d.die}`).join(' + ');
                    blockUpdated = true;
                  }
                }

                // 3. Clean up the properties string (always clean Lancer, Munitions, and Polyvalente parentheticals)
                // a) Replace Lancer parenthetical
                cleanProps = cleanProps.replace(/lancer\s*\(portée\s+\d+\/\d+\)/i, 'Lancer')
                                       .replace(/lancer\s*\(portee\s+\d+\/\d+\)/i, 'Lancer');

                // b) Replace Munitions parenthetical (preserving suffix like flèches/carreaux/billes)
                const munitionsMatch = props.match(/munitions\s*\(portée\s+\d+\/\d+\s*;\s*(.*?)\)/i) ||
                                       props.match(/munitions\s*\(portee\s+\d+\/\d+\s*;\s*(.*?)\)/i) ||
                                       props.match(/munitions\s*\(portée\s+\d+\/\d+\)/i) ||
                                       props.match(/munitions\s*\(portee\s+\d+\/\d+\)/i);
                if (munitionsMatch) {
                  const suffix = munitionsMatch[1] || '';
                  const cleanedMunitions = suffix.trim() ? `Munitions (${suffix.trim()})` : 'Munitions';
                  cleanProps = cleanProps.replace(/munitions\s*\(portée\s+\d+\/\d+\s*;\s*.*?\)/i, cleanedMunitions)
                                         .replace(/munitions\s*\(portee\s+\d+\/\d+\s*;\s*.*?\)/i, cleanedMunitions)
                                         .replace(/munitions\s*\(portée\s+\d+\/\d+\)/i, cleanedMunitions)
                                         .replace(/munitions\s*\(portee\s+\d+\/\d+\)/i, cleanedMunitions);
                }

                // c) Replace Polyvalente parenthetical
                cleanProps = cleanProps.replace(/polyvalente\s*\((\d+)d(\d+)\)/i, 'Polyvalente');

                // d) Replace "Deux mains" with "À deux mains" (case-insensitive)
                cleanProps = cleanProps.replace(/\bdeux mains\b/i, 'À deux mains');

                // e) Deduplicate and trim
                const propItems = cleanProps.split(',').map((s: string) => s.trim()).filter(Boolean);
                const uniqueProps = Array.from(new Set(propItems));
                cleanProps = uniqueProps.join(', ');

                if (wData.properties !== cleanProps) {
                  wData.properties = cleanProps;
                  blockUpdated = true;
                }

                if (blockUpdated) {
                  updated = true;
                  return { ...block, content: JSON.stringify(wData) };
                }
              } catch {}
            }
            return block;
          });

          if (updated) {
            next.blocks = nextBlocks;
            shouldSave = true;
            return next;
          }
        }

        if (updated) {
          shouldSave = true;
          return next;
        }
        return page;
      });

      const migrated = migratePages(loadedPages);
      setPages(migrated);
      if (shouldSave) {
        localStorage.setItem('dnd_companion_wiki_v3', JSON.stringify(migrated));
      }
      setIsLoaded(true);
    }
  }, []);

  const savePages = (newPages: WikiPage[]) => {
    // Save history snapshots
    if (pages.length > 0) {
      newPages.forEach(newPage => {
        const oldPage = pages.find(p => p.id === newPage.id);
        if (oldPage) {
          const changed = oldPage.title !== newPage.title ||
            oldPage.category !== newPage.category ||
            JSON.stringify(oldPage.blocks) !== JSON.stringify(newPage.blocks);
          
          if (changed) {
            try {
              const key = `dnd_history_${newPage.id}`;
              const stored = localStorage.getItem(key);
              const history = stored ? JSON.parse(stored) : [];
              const entry = {
                timestamp: new Date().toISOString(),
                title: newPage.title,
                category: newPage.category,
                aliases: [...newPage.aliases],
                tags: [...newPage.tags],
                blocks: newPage.blocks.map(b => ({ id: b.id, type: b.type, title: b.title, content: b.content })),
              };
              
              // avoid double snapshot of exact same state
              const last = history[0];
              if (!last || last.title !== entry.title || JSON.stringify(last.blocks) !== JSON.stringify(entry.blocks)) {
                const next = [entry, ...history].slice(0, 15);
                localStorage.setItem(key, JSON.stringify(next));
              }
            } catch (e) {
              console.error('Error saving page history:', e);
            }
          }
        }
      });
    }

    setPages(newPages);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dnd_companion_wiki_v3', JSON.stringify(newPages));
    }
  };

  const getPageHistory = (pageId: string) => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(`dnd_history_${pageId}`);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  };

  const rollbackPageToVersion = (pageId: string, version: any) => {
    const updated = pages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          title: version.title,
          category: version.category,
          aliases: version.aliases,
          tags: version.tags,
          blocks: version.blocks.map((b: any) => ({ ...b })),
          updatedAt: new Date().toISOString(),
        };
      }
      return page;
    });
    savePages(updated);
  };

  const undoPageChange = (pageId: string) => {
    if (typeof window === 'undefined') return;
    try {
      const key = `dnd_history_${pageId}`;
      const stored = localStorage.getItem(key);
      const history = stored ? JSON.parse(stored) : [];
      if (history.length <= 1) return; // Need at least current + previous state
      
      const previousState = history[1];
      const updated = pages.map(page => {
        if (page.id === pageId) {
          return {
            ...page,
            title: previousState.title,
            category: previousState.category,
            aliases: previousState.aliases,
            tags: previousState.tags,
            blocks: previousState.blocks.map((b: any) => ({ ...b })),
            updatedAt: new Date().toISOString(),
          };
        }
        return page;
      });
      
      setPages(updated);
      localStorage.setItem('dnd_companion_pages', JSON.stringify(updated));
      
      const nextHistory = history.slice(1);
      localStorage.setItem(key, JSON.stringify(nextHistory));
    } catch (e) {
      console.error('Error during undoPageChange:', e);
    }
  };

  const addPage = (newPageData: Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt' | 'blocks'>): WikiPage => {
    let initialBlocks: WikiBlock[] = [];
    if (newPageData.category === 'arme') {
      initialBlocks = [
        {
          id: `block-${Date.now()}-1`,
          type: 'text',
          title: 'Résumé',
          content: `<p>Double-cliquez pour rédiger la description et le lore de l'arme.</p>`
        },
        {
          id: `block-${Date.now()}-2`,
          type: 'weapon',
          title: 'Statistiques',
          content: JSON.stringify({
            damage: "1d6",
            damageType: "perforant",
            stat: "dex",
            properties: "",
            mastery: "",
            weight: 1.0,
            price: "10 PO",
            description: ""
          })
        }
      ];
    } else {
      initialBlocks = [
        {
          id: `block-${Date.now()}-1`,
          type: 'text',
          content: `<p>Double-cliquez pour éditer ce texte.</p>`
        }
      ];
    }

    const newPage: WikiPage = {
      ...newPageData,
      id: `wiki-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      parentPageId: newPageData.parentPageId || (newPageData.category === 'arme' ? 'equipment-armes' : undefined),
      blocks: initialBlocks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...pages, newPage];
    savePages(updated);
    return newPage;
  };

  const updatePage = (id: string, updates: Partial<Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updated = pages.map(page => {
      if (page.id === id) {
        const next = { ...page, ...updates, updatedAt: new Date().toISOString() };
        // If category is changing to 'arme', auto-assign parent page to 'equipment-armes'
        if (updates.category === 'arme' && page.category !== 'arme') {
          next.parentPageId = 'equipment-armes';
          // Ensure it has a weapon block
          const hasWeaponBlock = next.blocks.some(b => b.type === 'weapon');
          if (!hasWeaponBlock) {
            next.blocks.push({
              id: `block-${Date.now()}-weapon`,
              type: 'weapon',
              title: 'Statistiques',
              content: JSON.stringify({
                damage: "1d6",
                damageType: "perforant",
                stat: "dex",
                properties: "",
                mastery: "",
                weight: 1.0,
                price: "10 PO",
                description: ""
              })
            });
          }
        }
        // If category is changing from 'arme' to something else, remove parentPageId if it was 'equipment-armes'
        else if (updates.category && updates.category !== 'arme' && page.category === 'arme') {
          if (next.parentPageId === 'equipment-armes') {
            next.parentPageId = undefined;
          }
        }
        return next;
      }
      return page;
    });
    savePages(updated);
  };

  const deletePage = (id: string) => savePages(pages.filter(p => p.id !== id));

  // ── Block management ──

  const addBlock = (pageId: string, blockType: BlockType) => {
    let initialContent = '';

    if (blockType === 'text') {
      initialContent = '<p>Nouveau paragraphe. Cliquez pour éditer.</p>';
    } else if (blockType === 'image') {
      initialContent = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
    } else if (blockType === 'character') {
      initialContent = JSON.stringify({
        name: "Nouveau Personnage", race: "Humain", class: "Guerrier", level: 1,
        alignment: "Neutre", background: "Artisan", type: "Humanoïde",
        hp: "10 (2d8 + 2)", ac: "12", speed: "30 ft.", profBonus: 2, cr: "",
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        skills: "", senses: "Perception passive 10", languages: "Commun",
        equipment: "", backstory: "",
        actions: [{ name: "Attaque", desc: "Attaque d'arme au corps à corps : +2 au toucher, 4 (1d4 + 2) dégâts." }],
        traits: [],
      });
    } else if (blockType === 'timeline') {
      initialContent = JSON.stringify([
        { date: "100 CV", title: "Fondation", desc: "La cité a été fondée." },
        { date: "150 CV", title: "Grande Guerre", desc: "Bataille majeure." }
      ]);
    } else if (blockType === 'familytree') {
      initialContent = JSON.stringify({
        rootName: "Ancêtre",
        children: [
          { name: "Enfant 1", children: [{ name: "Petit-enfant 1" }] },
          { name: "Enfant 2", children: [] }
        ]
      });
    } else if (blockType === 'weapon') {
      initialContent = JSON.stringify({
        damage: "1d6",
        damageType: "perforant",
        stat: "dex",
        properties: "",
        mastery: "",
        weight: 1.0,
        price: "10 PO",
        description: ""
      });
    }

    const titleMap: Partial<Record<BlockType, string>> = {
      character: 'Fiche de Personnage',
      timeline: 'Chronologie',
      familytree: 'Généalogie',
      weapon: 'Statistiques',
    };

    const newBlock: WikiBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: blockType,
      content: initialContent,
      title: titleMap[blockType],
    };

    const updated = pages.map(page =>
      page.id === pageId
        ? { ...page, blocks: [...page.blocks, newBlock], updatedAt: new Date().toISOString() }
        : page
    );
    savePages(updated);
  };

  const updateBlock = (pageId: string, blockId: string, updates: Partial<WikiBlock>) => {
    const updated = pages.map(page =>
      page.id === pageId
        ? {
            ...page,
            blocks: page.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b),
            updatedAt: new Date().toISOString(),
          }
        : page
    );
    savePages(updated);
  };

  const deleteBlock = (pageId: string, blockId: string) => {
    const updated = pages.map(page =>
      page.id === pageId
        ? { ...page, blocks: page.blocks.filter(b => b.id !== blockId), updatedAt: new Date().toISOString() }
        : page
    );
    savePages(updated);
  };

  const moveBlock = (pageId: string, blockId: string, direction: 'up' | 'down') => {
    const updated = pages.map(page => {
      if (page.id !== pageId) return page;
      const idx = page.blocks.findIndex(b => b.id === blockId);
      if (idx === -1) return page;
      const blocks = [...page.blocks];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx >= 0 && swapIdx < blocks.length) {
        [blocks[idx], blocks[swapIdx]] = [blocks[swapIdx], blocks[idx]];
      }
      return { ...page, blocks, updatedAt: new Date().toISOString() };
    });
    savePages(updated);
  };

  const createPageFromSelection = (title: string, category: WikiCategory): WikiPage => {
    return addPage({
      title,
      category,
      aliases: [title.toLowerCase()],
      tags: [],
      relations: [],
      parentPageId: category === 'arme' ? 'equipment-armes' : undefined,
    });
  };

  // ── Relation management (bidirectional) ──

  const addRelation = (sourcePageId: string, type: string, targetPageId: string) => {
    const relId = `rel-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const revId = `rel-${Date.now()}-${Math.random().toString(36).substr(2, 5)}r`;
    const newRel: WikiRelation = { id: relId, type, targetPageId };

    // Find the target page to determine the reverse relation label
    const targetPage = pages.find(p => p.id === targetPageId);
    const sourcePage = pages.find(p => p.id === sourcePageId);
    if (!targetPage || !sourcePage) return;

    // Build reverse relation type label (e.g. "Personnage" → "Lieu", category-based)
    const reverseType = sourcePage.category === 'lieu' ? 'Lieu'
      : sourcePage.category === 'personnage' ? 'Personnage'
      : sourcePage.category === 'faction' ? 'Faction'
      : sourcePage.category === 'intrigue' ? 'Intrigue'
      : type;

    const reverseRel: WikiRelation = { id: revId, type: reverseType, targetPageId: sourcePageId };

    const updated = pages.map(page => {
      if (page.id === sourcePageId) {
        // Avoid duplicates
        const alreadyLinked = page.relations.some(r => r.targetPageId === targetPageId && r.type === type);
        if (alreadyLinked) return page;
        return { ...page, relations: [...(page.relations ?? []), newRel], updatedAt: new Date().toISOString() };
      }
      if (page.id === targetPageId) {
        // Add reverse relation on target
        const alreadyLinked = page.relations.some(r => r.targetPageId === sourcePageId && r.type === reverseType);
        if (alreadyLinked) return page;
        return { ...page, relations: [...(page.relations ?? []), reverseRel], updatedAt: new Date().toISOString() };
      }
      return page;
    });
    savePages(updated);
  };

  const removeRelation = (sourcePageId: string, relationId: string) => {
    // Find the relation to remove
    const sourcePage = pages.find(p => p.id === sourcePageId);
    const rel = sourcePage?.relations.find(r => r.id === relationId);
    if (!rel) return;

    const updated = pages.map(page => {
      if (page.id === sourcePageId) {
        return { ...page, relations: page.relations.filter(r => r.id !== relationId), updatedAt: new Date().toISOString() };
      }
      // Also remove the back-link from the target page pointing back to source
      if (page.id === rel.targetPageId) {
        return {
          ...page,
          relations: page.relations.filter(r => r.targetPageId !== sourcePageId),
          updatedAt: new Date().toISOString(),
        };
      }
      return page;
    });
    savePages(updated);
  };

  const resetToDefault = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('dnd_companion_wiki_v3');
      pages.forEach(p => {
        localStorage.removeItem(`dnd_history_${p.id}`);
      });
      localStorage.removeItem('dnd_companion_custom_categories_v1');
      setCustomCategories([]);
      const cleanPages = INITIAL_DEMO_PAGES.map(p => ({
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setPages(cleanPages);
      localStorage.setItem('dnd_companion_wiki_v3', JSON.stringify(cleanPages));
      alert("Base de données réinitialisée aux règles D&D 2024 !");
    } catch (e) {
      console.error("Error resetting pages:", e);
    }
  };

  return {
    pages, isLoaded,
    addPage, updatePage, deletePage,
    addBlock, updateBlock, deleteBlock, moveBlock,
    createPageFromSelection,
    addRelation, removeRelation,
    customCategories, addCustomCategory, deleteCustomCategory,
    setAllPages: savePages,
    getPageHistory, rollbackPageToVersion, undoPageChange, resetToDefault,
  };
}
