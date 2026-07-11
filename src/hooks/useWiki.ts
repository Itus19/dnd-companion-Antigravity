import { useState, useEffect } from 'react';
import { WikiPage, WikiBlock, BlockType, WikiCategory } from '../types';

// ─────────────────────────────────────────────────────────────
// Migration: statblock → character (runs on localStorage load)
// ─────────────────────────────────────────────────────────────

function parseStat(v: string | number): number {
  if (typeof v === 'number') return v;
  const m = String(v).match(/^(\d+)/);
  return m ? parseInt(m[1]) : 10;
}

function migrateBlock(block: WikiBlock): WikiBlock {
  if (block.type !== 'statblock') return block;
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
  return pages.map(page => ({
    ...page,
    blocks: page.blocks.map(migrateBlock),
  }));
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
          level: 5,
          alignment: "Loyal Neutre",
          background: "Artisan",
          type: "Moyen humanoïde (nain)",
          hp: "45 (6d8 + 18)",
          ac: "16 (Cotte de mailles de nain)",
          speed: "25 ft.",
          profBonus: 3,
          cr: "1 (200 XP)",
          stats: { str: 16, dex: 12, con: 16, int: 10, wis: 13, cha: 9 },
          skills: "Outils de forgeron +6, Athlétisme +5",
          senses: "Vision dans le noir 60 ft., Perception passive 11",
          languages: "Commun, Nain",
          equipment: "Marteau de forge, Cotte de mailles de nain, bouclier",
          backstory: "Ancien forgeron d'élite, Garrick a consacré sa vie à son art après avoir perdu son frère.",
          actions: [
            {
              name: "Marteau de Forge",
              desc: "Attaque d'arme au corps à corps : +5 au toucher, allonge 5 ft., une cible. Touché : 7 (1d8 + 3) dégâts contondants."
            }
          ],
          traits: ["Résistance aux poisons", "Maîtrise des armes naines", "Robustesse naine"]
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
    id: 'demo-3',
    title: "L'Ordre du Lion d'Or",
    category: 'faction',
    aliases: ["l'ordre du lion d'or", "lion d'or", "lions d'or", "ordre du lion d'or"],
    tags: ['Faction', 'Paladins', 'Justice'],
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'b4-1',
        type: 'text',
        content: `<p>Une intrigue secrète s'ourdit dans les bas-fonds de la cité. Une secte oubliée cherche à récupérer une relique sombre enfouie sous les fondations d'<strong>Eldoria</strong>.</p>`
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useWiki() {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dnd_companion_wiki_v3');
      if (stored) {
        try {
          const parsed: WikiPage[] = JSON.parse(stored);
          setPages(migratePages(parsed));
        } catch (e) {
          console.error('Erreur localStorage v3, retour démos :', e);
          setPages(INITIAL_DEMO_PAGES);
        }
      } else {
        // Check old key and migrate
        const oldStored = localStorage.getItem('dnd_companion_wiki_v2');
        if (oldStored) {
          try {
            const parsed: WikiPage[] = JSON.parse(oldStored);
            const migrated = migratePages(parsed);
            setPages(migrated);
            localStorage.setItem('dnd_companion_wiki_v3', JSON.stringify(migrated));
          } catch {
            setPages(INITIAL_DEMO_PAGES);
            localStorage.setItem('dnd_companion_wiki_v3', JSON.stringify(INITIAL_DEMO_PAGES));
          }
        } else {
          setPages(INITIAL_DEMO_PAGES);
          localStorage.setItem('dnd_companion_wiki_v3', JSON.stringify(INITIAL_DEMO_PAGES));
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const savePages = (newPages: WikiPage[]) => {
    setPages(newPages);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dnd_companion_wiki_v3', JSON.stringify(newPages));
    }
  };

  const addPage = (newPageData: Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt' | 'blocks'>): WikiPage => {
    const newPage: WikiPage = {
      ...newPageData,
      id: `wiki-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      blocks: [
        {
          id: `block-${Date.now()}-1`,
          type: 'text',
          content: `<p>Double-cliquez pour éditer ce texte.</p>`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...pages, newPage];
    savePages(updated);
    return newPage;
  };

  const updatePage = (id: string, updates: Partial<Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updated = pages.map(page =>
      page.id === id ? { ...page, ...updates, updatedAt: new Date().toISOString() } : page
    );
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
    }

    const titleMap: Partial<Record<BlockType, string>> = {
      character: 'Fiche de Personnage',
      timeline: 'Chronologie',
      familytree: 'Généalogie',
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
    const newPage: WikiPage = {
      id: `wiki-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title, category,
      aliases: [title.toLowerCase()],
      tags: [],
      blocks: [{ id: `block-${Date.now()}-1`, type: 'text', content: `<p>Double-cliquez pour éditer ce texte.</p>` }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...pages, newPage];
    savePages(updated);
    return newPage;
  };

  return {
    pages, isLoaded,
    addPage, updatePage, deletePage,
    addBlock, updateBlock, deleteBlock, moveBlock,
    createPageFromSelection,
  };
}
