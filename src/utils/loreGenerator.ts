import { WikiCategory } from '../types';

interface GenerationContext {
  pageTitle: string;
  pageCategory: WikiCategory;
  blockTitle: string;
  existingText: string;
  relations: { type: string; targetTitle: string }[];
  length: 'short' | 'medium' | 'long';
  apiKey?: string;
  caretBefore?: string;
  caretAfter?: string;
}

// ─────────────────────────────────────────────────────────────
// Rich lists of vocabulary for premium procedural fantasy generation
// ─────────────────────────────────────────────────────────────

const LOOKS = [
  'profond et empreint de sagesse', 'sombre, presque menaçant', 'doux et observateur', 
  'fatigué par de longues années de voyage', 'brillant d\'une lueur magique instable',
  'indéchiffrable, masquant ses intentions', 'vif et plein d\'assurance'
];

const HEIGHTS = [
  'imposante et athlétique', 'svelte et agile', 'robuste et trapue', 
  'commune, lui permettant de se fondre dans la foule', 'élancée et noble'
];

const CLOTHING_HERO = [
  'porte des braies de cuir usées et un manteau de voyage doublé de fourrure',
  'arbore une armure de plaques gravée de runes anciennes',
  'est vêtu de robes de soie sombre, brodées d\'argent de l\'ancienne académie',
  'porte une cape de mailles discrète et des vêtements de forestier patinés par le temps'
];

const SCARS = [
  'Une longue cicatrice traverse sa tempe gauche, souvenir d\'une embuscade',
  'Plusieurs marques de brûlures magiques sur ses mains témoignent d\'expériences risquées',
  'Son visage porte la marque solennelle de son initiation passée',
  'Ses traits réguliers ne laissent transparaître aucune faiblesse physique'
];

const KEY_ITEMS = [
  'un grimoire scellé par une lanière de cuir noir',
  'un pendentif d\'ambre renfermant une étincelle de feu éternel',
  'une dague à double tranchant forgée dans un acier inconnu',
  'une bague gravée des armoiries d\'une dynastie éteinte'
];

const BACKGROUNDS = [
  'a grandi au milieu des bibliothèques sacrées, apprenant les secrets des anciens',
  'a été chassé de sa terre natale après la trahison de ses pairs',
  'a passé sa jeunesse à arpenter les routes sombres en tant que mercenaire',
  'a reçu l\'appel des esprits sylvestres lors d\'une nuit de solstice'
];

const EVENTS = [
  'le serment solennel prêté devant l\'autel de pierre a tout changé',
  'la découverte d\'un artefact enfoui a scellé son destin à tout jamais',
  'une querelle fraternelle l\'a forcé à prendre le chemin de l\'exil',
  'la chute de la forteresse a anéanti sa famille et forgé sa soif de justice'
];

const RUMORS_HERO = [
  'Certains chuchotent à voix basse dans les tavernes qu\'il possèderait une clé du sanctuaire',
  'On murmure qu\'il a conclu un pacte secret avec une entité de l\'ombre',
  'Des voyageurs jurent l\'avoir vu utiliser des sorts interdits sous la nouvelle lune',
  'La légende prétend qu\'il est le dernier héritier légitime d\'un trône perdu'
];

const GEOGRAPHY = [
  'situé au sommet d\'une falaise escarpée faisant face à l\'océan de brume',
  'niché au cœur d\'une forêt millénaire où les arbres murmurent des incantations',
  'bâti sur les ruines d\'une gigantesque cité souterraine oubliée de tous',
  'établi dans une vallée fertile protégée par des montagnes sacrées'
];

const ARCHITECTURE = [
  'présente des flèches gothiques élancées taillées dans de la pierre noire',
  'est composé de huttes de bois moussu intégrées à la canopée',
  'affiche des murailles cyclopéennes couvertes de mousse et de glyphes anciens',
  'mêle le marbre blanc étincelant à des structures de verre magique'
];

const ATMOSPHERE = [
  'Une atmosphère de secret et d\'oppression règne dans chaque ruelle étroite',
  'L\'air y est toujours frais, imprégné de l\'odeur de sève et de magie ancienne',
  'Un silence surnaturel plane sur les lieux, seulement troublé par le vent',
  'L\'agitation constante des marchands s\'y mêle aux murmures des prêtres'
];

const RUMORS_PLACE = [
  'Il se murmure que les catacombes dissimulent le tombeau d\'un roi maudit',
  'Les anciens prétendent que le lieu disparaît complètement lors des éclipses',
  'Certains disent qu\'une bête fantastique rôde dans les souterrains la nuit',
  'On raconte que quiconque y passe une nuit entière perd la mémoire de ses crimes'
];

const FACTION_ORIGIN = [
  'a été fondé pour protéger les frontières contre les incursions des ombres',
  'est né d\'un schisme idéologique au sein de l\'ancienne académie de magie',
  's\'est constitué en secret pour préserver les reliques divines oubliées',
  'rassemble les bannis et les révoltés luttant pour reconquérir leur dignité'
];

const FACTION_GOAL = [
  'Leur objectif ultime demeure la restauration de la paix d\'autrefois',
  'Ils recherchent activement un savoir interdit capable de plier la réalité',
  'Chaque membre jure de traquer sans relâche les traîtres à leur cause',
  'Ils protègent farouchement le secret du passage vers la vallée éternelle'
];

const CHAR_HISTORY_CONCL = [
  "Désormais, il poursuit sa route avec une détermination sans faille, refusant de répéter les erreurs tragiques d'autrefois.",
  "Son chemin reste semé d'embûches, mais sa résolution à accomplir son destin demeure inébranlable.",
  "Chaque pas le rapproche désormais de son but ultime, malgré les épreuves passées.",
  "Nul ne sait ce qu'il adviendra, mais son voyage se poursuit sous des cieux incertains."
];

const CHAR_RUMOR_CONCL = [
  "Quoi qu'il en soit, sa seule présence suffit à alimenter les conversations les plus folles dans les tavernes des environs.",
  "Les bavards s'accordent néanmoins à dire que son ombre plane sur les plus grands secrets du royaume.",
  "La vérité reste à découvrir, mais les rumeurs à son sujet ne cessent de se propager à la nuit tombée.",
  "Ces récits, qu'ils soient vrais ou exagérés, font désormais de lui une légende vivante."
];

const PLACE_HISTORY_CONCL = [
  "Aujourd'hui encore, la pierre résonne des exploits et des tragédies des temps passés.",
  "Les ruines témoignent toujours de cette grandeur passée aux yeux des rares voyageurs.",
  "Ce riche héritage continue de marquer l'atmosphère solennelle de ces lieux historiques.",
  "Chaque monument raconte ainsi une époque de gloire et de décadence désormais révolue."
];

const PLACE_RUMOR_CONCL = [
  "Les mystères qui entourent cet endroit continuent d'attirer les érudits et les pilleurs de tombes du monde entier.",
  "Nul n'ose s'y aventurer seul, de peur de réveiller les esprits endormis sous les dalles.",
  "Les secrets enfouis continuent de hanter les esprits des habitants de la région.",
  "Cette réputation maudite tient les curieux à l'écart, protégeant les vérités cachées."
];

const FACTION_CONCL = [
  "Leurs agents opèrent dans l'ombre, guidés par un code de conduite strict.",
  "Les initiés gardent le silence, protégeant l'influence invisible de leur cabale.",
  "Leurs desseins demeurent impénétrables pour le commun des mortels.",
  "Leur réseau s'étend discrètement, influençant les cours et les guildes en secret."
];

const DEFAULT_CONCL = [
  "Chaque chroniqueur s'accorde à dire que ce sujet renferme encore de nombreuses vérités à découvrir.",
  "Les pages du grimoire de campagne restent ouvertes pour y inscrire la suite de ces événements.",
  "Les recherches futures permettront sans doute de lever le voile sur ces zones d'ombre.",
  "C'est un jalon essentiel dans la compréhension globale des forces en présence."
];

function pickRandom(arr: string[], avoidTexts?: string[]): string {
  if (!avoidTexts || avoidTexts.length === 0) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const combinedAvoid = avoidTexts.join(' ').toLowerCase();
  const candidates = arr.filter(item => {
    // Split punctuation and check for matches of significant words (length > 4)
    const words = item.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').split(/\s+/);
    const matchesAnySignificantWord = words.some(w => w.length > 4 && combinedAvoid.includes(w));
    return !matchesAnySignificantWord;
  });
  
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate procedural text
function generateProcedural(ctx: GenerationContext): string {
  const name = ctx.pageTitle;
  const cat = ctx.pageCategory;
  const blockTitle = ctx.blockTitle.toLowerCase().trim();
  const avoidList = [ctx.existingText, ctx.caretBefore || '', ctx.caretAfter || ''];
  
  // Format relations
  const relationNames = ctx.relations.map(r => r.targetTitle);
  const relationStr = relationNames.length > 0 
    ? ` lié directement à ${relationNames.slice(0, 2).join(' et ')}`
    : '';

  const sentences: string[] = [];

  if (cat === 'personnage') {
    if (blockTitle.includes('apparence') || blockTitle.includes('description')) {
      sentences.push(`${name} présente une stature ${pickRandom(HEIGHTS, avoidList)}.`);
      sentences.push(`Son regard est ${pickRandom(LOOKS, avoidList)}.`);
      sentences.push(`Il ${pickRandom(CLOTHING_HERO, avoidList)}.`);
      sentences.push(pickRandom(SCARS, avoidList) + '.');
      sentences.push(`À sa ceinture, on distingue clairement ${pickRandom(KEY_ITEMS, avoidList)}.`);
      if (relationNames.length > 0) {
        sentences.push(`Son port et son allure rappellent son allégeance à ${relationNames[0]}.`);
      }
    } else if (blockTitle.includes('histoire') || blockTitle.includes('passé') || blockTitle.includes('origine')) {
      sentences.push(`${name} ${pickRandom(BACKGROUNDS, avoidList)}.`);
      sentences.push(`Dans son passé, ${pickRandom(EVENTS, avoidList)}.`);
      if (relationNames.length > 0) {
        sentences.push(`Ses pas l'ont conduit à croiser le chemin de ${relationNames.join(', ')}, marquant un tournant décisif dans sa quête.`);
      }
      sentences.push(pickRandom(CHAR_HISTORY_CONCL, avoidList));
    } else if (blockTitle.includes('rumeur') || blockTitle.includes('secret') || blockTitle.includes('légende')) {
      sentences.push(pickRandom(RUMORS_HERO, avoidList) + '.');
      sentences.push(`Certains voyageurs racontent des récits étranges à son sujet.`);
      if (relationNames.length > 0) {
        sentences.push(`La plupart des suspicions tournent autour de ses relations troubles avec ${relationNames[0]}.`);
      }
      sentences.push(pickRandom(CHAR_RUMOR_CONCL, avoidList));
    } else {
      // Generic PNJ block
      sentences.push(`${name} est une figure marquante${relationStr}.`);
      sentences.push(`Son histoire personnelle reste en grande partie enveloppée de mystère.`);
      sentences.push('D\'une stature ' + pickRandom(HEIGHTS, avoidList) + ', il porte sur lui ' + pickRandom(KEY_ITEMS, avoidList) + '.');
      sentences.push(`On raconte que sa destinée est irrémédiablement liée à celle de son entourage.`);
    }
  } else if (cat === 'lieu') {
    if (blockTitle.includes('histoire') || blockTitle.includes('origine') || blockTitle.includes('fondation')) {
      sentences.push(`Bâti sur les fondations d'un ancien empire, ${name} a traversé les âges.`);
      sentences.push(`Ce lieu ${pickRandom(GEOGRAPHY, avoidList)}.`);
      sentences.push(`Au fil des siècles, les conflits ont façonné son destin.`);
      if (relationNames.length > 0) {
        sentences.push(`Des figures légendaires comme ${relationNames.join(' ou ')} y ont laissé une empreinte indélébile.`);
      }
      sentences.push(pickRandom(PLACE_HISTORY_CONCL, avoidList));
    } else if (blockTitle.includes('apparence') || blockTitle.includes('géographie') || blockTitle.includes('description')) {
      sentences.push(`${name} est un lieu singulier, ${pickRandom(GEOGRAPHY, avoidList)}.`);
      sentences.push(`Son architecture ${pickRandom(ARCHITECTURE, avoidList)}.`);
      sentences.push(`${pickRandom(ATMOSPHERE, avoidList)}.`);
      if (relationNames.length > 0) {
        sentences.push(`Sa proximité spirituelle ou physique avec ${relationNames[0]} influence grandement la vie locale.`);
      }
    } else if (blockTitle.includes('rumeur') || blockTitle.includes('secret') || blockTitle.includes('légende')) {
      sentences.push(pickRandom(RUMORS_PLACE, avoidList) + '.');
      sentences.push(`Plusieurs gardes refusent de s'aventurer dans certains recoins après le coucher du soleil.`);
      if (relationNames.length > 0) {
        sentences.push(`Certaines rumeurs prétendent qu'un secret scellé relie ce site à ${relationNames[0]}.`);
      }
      sentences.push(pickRandom(PLACE_RUMOR_CONCL, avoidList));
    } else {
      // Generic Location block
      sentences.push(`${name} est un endroit mystérieux${relationStr}.`);
      sentences.push(`Niché dans un environnement impressionnant, il ${pickRandom(GEOGRAPHY, avoidList)}.`);
      sentences.push(`${pickRandom(ATMOSPHERE, avoidList)}.`);
    }
  } else if (cat === 'faction') {
    sentences.push(`L'organisation connue sous le nom de ${name} ${pickRandom(FACTION_ORIGIN, avoidList)}.`);
    sentences.push(`${pickRandom(FACTION_GOAL, avoidList)}.`);
    if (relationNames.length > 0) {
      sentences.push(`Leurs activités les amènent souvent à interagir avec ${relationNames.join(', ')}.`);
    }
    sentences.push(pickRandom(FACTION_CONCL, avoidList));
  } else {
    // Generic default procedural lore
    sentences.push(`${name} fait partie intégrante du codex de la campagne${relationStr}.`);
    sentences.push(`Les détails le concernant révèlent une importance cruciale pour l'intrigue.`);
    if (relationNames.length > 0) {
      sentences.push(`Des rapports étroits le lient avec les éléments suivants : ${relationNames.join(', ')}.`);
    }
    sentences.push(pickRandom(DEFAULT_CONCL, avoidList));
  }

  // Adjust length (Tripling quantity: short is ~6 sentences, medium is ~3 paragraphs, long is ~9 paragraphs)
  let resultText = '';
  const p1 = sentences.join(' ');
  
  if (ctx.length === 'short') {
    // A single rich paragraph of 6-8 sentences
    const extra = cat === 'personnage' 
      ? `De plus, ${pickRandom(SCARS).toLowerCase()}.` 
      : cat === 'lieu' 
        ? `En outre, ${pickRandom(ATMOSPHERE).toLowerCase()}.`
        : `Les archives locales confirment l'importance de ce sujet.`;
    resultText = `${p1} ${extra}`;
  } else if (ctx.length === 'medium') {
    // 3 paragraphs
    const p2 = cat === 'personnage'
      ? `${name} ${pickRandom(BACKGROUNDS)}. Dans les tavernes, ${pickRandom(RUMORS_HERO).toLowerCase()}.`
      : cat === 'lieu'
        ? `Le paysage environnant est ${pickRandom(GEOGRAPHY)}. Sur place, ${pickRandom(RUMORS_PLACE).toLowerCase()}.`
        : `Les agents secrets opèrent dans l'ombre. ${pickRandom(FACTION_GOAL)}.`;
        
    const p3 = `Les légendes à ce propos continuent de croître. Les aventuriers de passage rapportent des témoignages de plus en plus troublants, indiquant que le plus grand mystère reste encore à élucider.`;
    
    resultText = `${p1}\n\n${p2}\n\n${p3}`;
  } else {
    // long: ~9 paragraphs
    const paras: string[] = [];
    paras.push(p1);
    
    // Paragraph 2
    paras.push(cat === 'personnage'
      ? `Son passé est marqué par de lourds secrets. On raconte notamment que ${pickRandom(EVENTS)}.`
      : `Le site possède des secrets oubliés. Son architecture globale ${pickRandom(ARCHITECTURE)}.`);
      
    // Paragraph 3  
    paras.push(cat === 'personnage'
      ? `${pickRandom(RUMORS_HERO)}.`
      : `${pickRandom(RUMORS_PLACE)}.`);
      
    // Paragraph 4
    paras.push(`Les parchemins anciens font mention de forces mystiques à l'œuvre. Les érudits s'accordent à dire que l'influence de cet élément s'étend bien au-delà de la frontière connue du royaume.`);
    
    // Paragraph 5
    paras.push(relationNames.length > 0
      ? `Les rapports complexes entretenus avec ${relationNames.join(', ')} alimentent les plus vives spéculations dans les cours royales.`
      : `Les ramifications de cette intrigue se déploient en silence, touchant des entités insoupçonnées.`);
      
    // Paragraph 6
    paras.push(`Les éclaireurs surveillent les frontières jour et nuit. Chaque rumeur, chaque détail est consigné pour anticiper les troubles à venir.`);
    
    // Paragraph 7
    paras.push(`Les caravanes marchandes propagent ces contes jusque dans les contrées d'Orient, éveillant la curiosité de puissants seigneurs.`);
    
    // Paragraph 8
    paras.push(`D'après les murmures secrets des oracles, le véritable dénouement de cette chronique ne surviendra qu'à la fin des temps.`);
    
    // Paragraph 9
    paras.push(`C'est au gré des alliances scellées et des batailles futures que se gravera la suite de ce destin.`);
    
    resultText = paras.join('\n\n');
  }

  // Caret Context injection simulation (Anaphora and seamless pronoun transition)
  if (ctx.caretBefore || ctx.caretAfter) {
    const pronoun = cat === 'personnage' ? 'Celui-ci' : cat === 'lieu' ? 'Ce lieu' : 'Cette organisation';
    if (resultText.startsWith(name)) {
      resultText = resultText.replace(name, pronoun);
    }
  }

  return resultText;
}

// ─────────────────────────────────────────────────────────────
// Real LLM API Caller (Gemini / OpenAI)
// ─────────────────────────────────────────────────────────────

async function generateRealLLM(ctx: GenerationContext, key: string): Promise<string> {
  const isGemini = key.startsWith('AIzaSy'); // Google AI API key format prefix
  
  // Tripled lengths
  const lengthPrompt = ctx.length === 'short' 
    ? 'génère un paragraphe complet d\'environ 6 à 8 phrases.' 
    : ctx.length === 'medium'
      ? 'génère 3 paragraphes très détaillés et immersifs.'
      : 'génère un récit extrêmement riche, long et exhaustif d\'environ 9 à 12 longs paragraphes.';

  const relationsPrompt = ctx.relations.length > 0
    ? `Intègre impérativement dans le récit les éléments suivants qui sont liés à cet article : ${ctx.relations.map(r => `"${r.targetTitle}" (relation: ${r.type})`).join(', ')}.`
    : '';

  // Caret position instructions (Append/Complete feature + Anaphora rule)
  let caretInstructions = `Contexte général / Autres blocs de la fiche : "${ctx.existingText.slice(0, 1000)}"`;
  if (ctx.caretBefore || ctx.caretAfter) {
    caretInstructions = `
Le curseur de l'utilisateur est placé précisément au milieu du texte actuel.
- Texte situé AVANT la position du curseur : "${ctx.caretBefore}"
- Texte situé APRÈS la position du curseur : "${ctx.caretAfter}"

Consignes obligatoires pour la transition et la cohésion :
1. Rédige une SUITE fluide qui commence exactement là où se trouve le curseur (après le texte avant) et qui fait la transition logique et grammaticale avec le texte après.
2. RÈGLE CRITIQUE DE LIEN ET D'ANAPHORE : Ne commence pas ton texte généré par le nom propre "${ctx.pageTitle}". À la place, utilise des pronoms de rappel ou des périphrases de transition ("Celui-ci", "Il", "Ce dernier", "Ce lieu", "Cette assemblée") pour reprendre naturellement le sujet de la phrase précédente.
3. RÈGLE D'OR DE NON-RÉPÉTITION : Analyse scrupuleusement le texte situé avant le curseur ("${ctx.caretBefore}") et le contexte général ("${ctx.existingText.slice(0, 1000)}"). Ne répète JAMAIS les faits, qualificatifs, descriptions physiques ou anecdotes déjà écrites dans ces sections. Tu dois apporter des éléments NOUVEAUX et complémentaires qui enrichissent la fiche sans paraphraser ou redire ce qui y figure déjà.
`;
  } else {
    caretInstructions = `
Contexte général / Autres blocs de la fiche : "${ctx.existingText.slice(0, 1000)}"

RÈGLE D'OR DE NON-RÉPÉTITION : Analyse scrupuleusement le contexte ci-dessus. Ne répète sous aucun prétexte les faits, descriptions physiques, origines, anecdotes ou qualificatifs déjà mentionnés. Apporte du contenu entièrement NOUVEAU, complémentaire et cohérent qui enrichit la fiche sans redire ou paraphraser ce qui existe déjà.
`;
  }

  const systemInstructions = `Tu es un écrivain de fantasy hors pair et un professeur de lettres classiques françaises. Ton style est captivant, riche, élégant et fluide. Tu rédiges en français de manière très fluide en évitant les répétitions et en faisant progresser le récit à chaque phrase.`;
  
  const userPrompt = `
Génère le contenu textuel pour un bloc de l'article suivant :
- Nom de l'article : "${ctx.pageTitle}"
- Catégorie : "${ctx.pageCategory}"
- Titre du bloc à rédiger : "${ctx.blockTitle || 'Description'}"
- Longueur demandée : ${lengthPrompt}
${caretInstructions}
${relationsPrompt}

Rédige uniquement le texte à insérer (pas de salutations, pas de balises markdown de titre de bloc, juste les paragraphes de lore en français).
`;

  if (isGemini) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstructions }] },
        generationConfig: {
          temperature: 0.73,
          maxOutputTokens: ctx.length === 'short' ? 450 : ctx.length === 'medium' ? 1200 : 2750
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Gemini a renvoyé une erreur : ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Format de réponse Gemini invalide.");
    return text.trim();
  } else {
    const url = 'https://api.openai.com/v1/chat/completions';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.73,
        max_tokens: ctx.length === 'short' ? 450 : ctx.length === 'medium' ? 1200 : 2750
      })
    });

    if (!response.ok) {
      throw new Error(`API OpenAI a renvoyé une erreur : ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("Format de réponse OpenAI invalide.");
    return text.trim();
  }
}

// ─────────────────────────────────────────────────────────────
// Primary Entry Point
// ─────────────────────────────────────────────────────────────

export async function generateLore(ctx: GenerationContext): Promise<string> {
  if (ctx.apiKey && ctx.apiKey.trim()) {
    try {
      return await generateRealLLM(ctx, ctx.apiKey.trim());
    } catch (err) {
      console.warn("Erreur avec l'API Réelle, repli sur la génération locale :", err);
      return generateProcedural(ctx);
    }
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateProcedural(ctx));
    }, 1200);
  });
}
