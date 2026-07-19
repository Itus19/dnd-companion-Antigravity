import { WikiPage } from '../../types';

export const COMPONENTS_RULES: WikiPage[] = [
  {
    id: "component-soufre",
    title: "Soufre",
    category: "composant",
    aliases: ["soufre"],
    tags: ["Composants", "Magie", "Alchimie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-soufre-desc",
        type: "text",
        title: "Description",
        content: "<p>Le soufre est une substance minérale jaune, inflammable et odorante. En magie, il est principalement utilisé comme composante matérielle pour canaliser l'énergie destructrice du feu, notamment dans le sortilège emblématique de la <em>Boule de feu</em>.</p>"
      }
    ]
  },
  {
    id: "component-fiente-chauve-souris",
    title: "Fiente de chauve-souris",
    category: "composant",
    aliases: ["fiente de chauve-souris", "guano"],
    tags: ["Composants", "Magie", "Alchimie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-fiente-desc",
        type: "text",
        title: "Description",
        content: "<p>La fiente de chauve-souris (ou guano) est un composant alchimique classique. Riche en salpêtre, elle sert d'agent de combustion magique. Associée au soufre, elle permet de provoquer l'explosion déflagrante du sort de <em>Boule de feu</em>.</p>"
      }
    ]
  },
  {
    id: "component-diamant",
    title: "Diamant",
    category: "composant",
    aliases: ["diamant", "gemme"],
    tags: ["Composants", "Magie", "Pierres précieuses"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-diamant-desc",
        type: "text",
        title: "Description",
        content: "<p>Le diamant est la gemme la plus pure et la plus résistante. En magie de résurrection (comme le sort <em>Rappel à la vie</em>), il sert de réceptacle ou de catalyseur d'énergie vitale pour rappeler l'âme d'un défunt dans son corps physique. Le diamant requis est consumé par le rituel.</p>"
      }
    ]
  },
  {
    id: "component-cire",
    title: "Cire",
    category: "composant",
    aliases: ["cire"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-cire-desc",
        type: "text",
        title: "Description",
        content: "<p>Un petit morceau de cire d'abeille ou de cire végétale. Utilisé en illusionnisme pour capter la lumière ou modeler des simulacres visuels et tactiles, comme pour le sort d'<em>Invisibilité</em>.</p>"
      }
    ]
  },
  {
    id: "component-verre",
    title: "Verre",
    category: "composant",
    aliases: ["verre"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-verre-desc",
        type: "text",
        title: "Description",
        content: "<p>Un fragment de verre transparent ou de cristal de roche poli. Utilisé pour plier la lumière et créer des réfractions visuelles idéales pour masquer la silhouette d'une cible.</p>"
      }
    ]
  },
  {
    id: "component-fer",
    title: "Morceau de fer",
    category: "composant",
    aliases: ["morceau de fer", "fer"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-fer-desc",
        type: "text",
        title: "Description",
        content: "<p>Une petite pièce ou limaille de fer métallique. Utilisé pour canaliser la dureté physique et l'inertie de la matière dans les sorts de modification de masse corporelle, comme <em>Agrandissement / Rapetissement</em>.</p>"
      }
    ]
  },
  {
    id: "component-clochette",
    title: "Minuscule clochette",
    category: "composant",
    aliases: ["minuscule clochette", "clochette"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-clochette-desc",
        type: "text",
        title: "Description",
        content: "<p>Une clochette en laiton, en cuivre ou en bronze de taille réduite. Elle sert de réceptacle vibratoire pour faire retentir l'alarme magique en cas d'intrusion.</p>"
      }
    ]
  },
  {
    id: "component-fil-argent",
    title: "Fil d'argent fin",
    category: "composant",
    aliases: ["fil d'argent fin", "fil d'argent"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-fil-argent-desc",
        type: "text",
        title: "Description",
        content: "<p>Un fil métallique d'argent pur extrêmement fin. Il sert à tisser la barrière magique invisible qui délimite la zone surveillée par le sort d'<em>Alarme</em>.</p>"
      }
    ]
  },
  {
    id: "component-poussiere-diamant",
    title: "Poussière de diamant (25 po)",
    category: "composant",
    aliases: ["poussière de diamant", "diamant en poudre"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-poussiere-diamant-desc",
        type: "text",
        title: "Description",
        content: "<p>Des éclats de diamant pur broyés finement d'une valeur de 25 pièces d'or. Utilisés pour brouiller la vision magique et protéger une cible contre les sorts de divination magique (comme <em>Antidétection</em>).</p>"
      }
    ]
  },
  {
    id: "component-trousseau-de-cles",
    title: "Trousseau de clés sans clés",
    category: "composant",
    aliases: ["trousseau de clés", "clés sans clés"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-trousseau-desc",
        type: "text",
        title: "Description",
        content: "<p>Un anneau ou trousseau en métal vide, sans aucune clé. C'est le composant ironique employé pour sceller ou bloquer les facultés de logique et de cognition dans le sort d'<em>Aliénation</em> (D&D 2024).</p>"
      }
    ]
  },
  {
    id: "component-cils-gomme",
    title: "Cils et gomme arabique",
    category: "composant",
    aliases: ["cils et gomme arabique", "poudre de cils"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-cils-gomme-desc",
        type: "text",
        title: "Description",
        content: "<p>Une pincée de poudre de cils mêlée à de la gomme arabique séchée. Cette combinaison alchimique sert à piéger et courber la lumière autour de la cible pour la rendre indétectable.</p>"
      }
    ]
  },
  {
    id: "component-fourrure-bat",
    title: "Fourrure de chauve-souris",
    category: "composant",
    aliases: ["fourrure de chauve-souris", "fourrure bat"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-fourrure-bat-desc",
        type: "text",
        title: "Description",
        content: "<p>Une petite touffe de poils provenant d'une chauve-souris. Employée pour convoquer les ténèbres absolues et la cécité sensorielle.</p>"
      }
    ]
  },
  {
    id: "component-poudre-jais",
    title: "Poudre de jais",
    category: "composant",
    aliases: ["poudre de jais", "jais"],
    tags: ["Composants", "Magie"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-comp-poudre-jais-desc",
        type: "text",
        title: "Description",
        content: "<p>Du jais noir carbonisé réduit en fine poudre. Ce minéral sombre sert de liant pour absorber et éteindre la lumière magique ou naturelle dans le sort de <em>Ténèbres</em>.</p>"
      }
    ]
  }
];
