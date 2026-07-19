import { WikiPage } from '../../types';

export const WEAPONS_RULES: WikiPage[] = [
  {
    "id": "weapon-baton-de-combat",
    "title": "Bâton de combat",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["bâton de combat", "baton de combat", "quarterstaff"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-baton-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Un long bâton en bois robuste utilisé par les moines, druides et voyageurs comme arme défensive ou outil de marche.</p>"
      },
      {
        "id": "b-baton-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "contondant" }, { count: 1, die: 8, damageType: "contondant" }],
          stats: ["str"],
          properties: "Polyvalente",
          mastery: "Renversement",
          weight: 2.0,
          price: "2 PA",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-dague",
    "title": "Dague",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["dague", "dagger"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-dague-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une lame courte et pointue, facile à dissimuler, pouvant être lancée ou utilisée avec dextérité lors des affrontements au corps à corps.</p>"
      },
      {
        "id": "b-dague-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 4, damageType: "perforant" }],
          stats: ["dex", "str"],
          properties: "Finesse, Lancer, Légère",
          mastery: "Coup double",
          weight: 0.5,
          price: "2 PO",
          description: "",
          rangeMin: 6,
          rangeMax: 18
        })
      }
    ]
  },
  {
    "id": "weapon-gourdin",
    "title": "Gourdin",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["gourdin", "club"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-gourdin-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une simple pièce de bois lourd ou une branche sculptée, facile à utiliser pour assommer les adversaires.</p>"
      },
      {
        "id": "b-gourdin-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 4, damageType: "contondant" }],
          stats: ["str"],
          properties: "Légère",
          mastery: "Ralentissement",
          weight: 1.0,
          price: "1 PA",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-hachette",
    "title": "Hachette",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["hachette", "handaxe"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-hachette-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une petite hache polyvalente, équilibrée pour être lancée ou maniée rapidement en combat rapproché.</p>"
      },
      {
        "id": "b-hachette-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "tranchant" }],
          stats: ["str"],
          properties: "Lancer, Légère",
          mastery: "Ouverture",
          weight: 1.0,
          price: "5 PO",
          description: "",
          rangeMin: 6,
          rangeMax: 18
        })
      }
    ]
  },
  {
    "id": "weapon-javeline",
    "title": "Javeline",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["javeline", "javelin"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-javeline-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une lance légère conçue principalement pour être lancée sur les lignes ennemies à distance.</p>"
      },
      {
        "id": "b-javeline-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "perforant" }],
          stats: ["str"],
          properties: "Lancer",
          mastery: "Ralentissement",
          weight: 1.0,
          price: "5 PA",
          description: "",
          rangeMin: 9,
          rangeMax: 36
        })
      }
    ]
  },
  {
    "id": "weapon-lance",
    "title": "Lance",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["lance", "spear"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-lance-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une arme d'hast simple dotée d'une pointe en métal, redoutable et utilisable à une ou deux mains.</p>"
      },
      {
        "id": "b-lance-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "perforant" }, { count: 1, die: 8, damageType: "perforant" }],
          stats: ["str"],
          properties: "Lancer, Polyvalente",
          mastery: "Sape",
          weight: 1.5,
          price: "1 PO",
          description: "",
          rangeMin: 6,
          rangeMax: 18
        })
      }
    ]
  },
  {
    "id": "weapon-marteau-leger",
    "title": "Marteau léger",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["marteau léger", "marteau leger", "light hammer"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-marteau-l-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Un petit marteau de combat léger conçu pour être lancé ou utilisé rapidement en combat rapproché.</p>"
      },
      {
        "id": "b-marteau-l-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 4, damageType: "contondant" }],
          stats: ["str"],
          properties: "Lancer, Légère",
          mastery: "Coup double",
          weight: 1.0,
          price: "2 PO",
          description: "",
          rangeMin: 6,
          rangeMax: 18
        })
      }
    ]
  },
  {
    "id": "weapon-masse-darmes",
    "title": "Masse d'armes",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["masse d'armes", "masse d'arme", "mace"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-masse-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une masse métallique lourde et à bride, conçue pour écraser les protections métalliques adverses.</p>"
      },
      {
        "id": "b-masse-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "contondant" }],
          stats: ["str"],
          properties: "",
          mastery: "Sape",
          weight: 2.0,
          price: "5 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-massue",
    "title": "Massue",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["massue", "greatclub"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-massue-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une grande pièce de bois cloutée ou lestée exigeant l'usage de ses deux mains pour porter des coups puissants.</p>"
      },
      {
        "id": "b-massue-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "contondant" }],
          stats: ["str"],
          properties: "Deux mains",
          mastery: "Poussée",
          weight: 5.0,
          price: "2 PA",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-serpe",
    "title": "Serpe",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["serpe", "sickle"],
    "tags": ["Armes courantes de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-serpe-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une lame incurvée de type faucille, idéale pour les attaques légères au corps à corps.</p>"
      },
      {
        "id": "b-serpe-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 4, damageType: "tranchant" }],
          stats: ["str"],
          properties: "Légère",
          mastery: "Coup double",
          weight: 1.0,
          price: "1 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-arbalete-legere",
    "title": "Arbalète légère",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["arbalète légère", "arbalete legere", "light crossbow"],
    "tags": ["Armes courantes à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-arbalete-l-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une arbalète compacte, facile à armer et à utiliser, mais demandant un temps de rechargement.</p>"
      },
      {
        "id": "b-arbalete-l-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "perforant" }],
          stats: ["dex"],
          properties: "Chargement, Deux mains, Munitions (portée 24/96 ; carreaux)",
          mastery: "Ralentissement",
          weight: 2.5,
          price: "25 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-arc-court",
    "title": "Arc court",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["arc court", "arccourt", "shortbow"],
    "tags": ["Armes courantes à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-arc-c-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>L'Arc court est une arme de tir compacte, idéale pour le harcèlement à distance moyenne et facile à manipuler même dans les espaces confinés.</p>"
      },
      {
        "id": "b-arc-c-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "perforant" }],
          stats: ["dex"],
          properties: "Deux mains, Munitions (portée 24/96 ; flèches)",
          mastery: "Ouverture",
          weight: 1.0,
          price: "25 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-flechette",
    "title": "Fléchette",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["fléchette", "flechette", "dart"],
    "tags": ["Armes courantes à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-flechette-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une petite pointe en métal lestée conçue pour être lancée avec précision sur les ennemis.</p>"
      },
      {
        "id": "b-flechette-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 4, damageType: "perforant" }],
          stats: ["dex", "str"],
          properties: "Finesse, Lancer (portée 6/18)",
          mastery: "Ouverture",
          weight: 0.125,
          price: "5 PC",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-fronde",
    "title": "Fronde",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["fronde", "sling"],
    "tags": ["Armes courantes à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-fronde-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une simple lanière de cuir permettant de propulser des billes de plomb ou des pierres rondes à distance moyenne.</p>"
      },
      {
        "id": "b-fronde-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 4, damageType: "contondant" }],
          stats: ["dex"],
          properties: "Munitions (portée 9/36 ; billes)",
          mastery: "Ralentissement",
          weight: 0.0,
          price: "1 PA",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-cimeterre",
    "title": "Cimeterre",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["cimeterre", "scimitar"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cimeterre-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une épée à lame courbe tranchante, équilibrée pour les attaques fluides et rapides au corps à corps.</p>"
      },
      {
        "id": "b-cimeterre-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "tranchant" }],
          stats: ["dex", "str"],
          properties: "Finesse, Légère",
          mastery: "Coup double",
          weight: 1.5,
          price: "25 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-coutille",
    "title": "Coutille",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["coutille", "glaive"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-coutille-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une lourde arme d'hast tranchante munie d'une grande lame de type couperet fixée au bout du manche.</p>"
      },
      {
        "id": "b-coutille-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 10, damageType: "tranchant" }],
          stats: ["str"],
          properties: "Allonge, Deux mains, Lourde",
          mastery: "Écorchure",
          weight: 3.0,
          price: "20 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-epee-a-deux-mains",
    "title": "Épée à deux mains",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["épée à deux mains", "epee a deux mains", "greatsword"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-greatsword-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une immense épée lourde, symbole de force brute au combat, nécessitant impérativement l'usage des deux mains.</p>"
      },
      {
        "id": "b-greatsword-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 2, die: 6, damageType: "tranchant" }],
          stats: ["str"],
          properties: "Deux mains, Lourde",
          mastery: "Écorchure",
          weight: 3.0,
          price: "50 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-epee-courte",
    "title": "Épée courte",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["épée courte", "epee courte", "shortsword"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-wp-epee-c-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>L'Épée courte est une arme perforante légère et maniable, très populaire auprès des aventuriers qui privilégient la dextérité à la force brute.</p>"
      },
      {
        "id": "b-wp-epee-c-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "perforant" }],
          stats: ["dex", "str"],
          properties: "Finesse, Légère",
          mastery: "Ouverture",
          weight: 1.0,
          price: "10 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-epee-longue",
    "title": "Épée longue",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["épée longue", "epee longue", "longsword"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-longsword-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>L'épée de chevalier classique, polyvalente et équilibrée, qui s'utilise à une main ou à deux mains pour plus de force.</p>"
      },
      {
        "id": "b-longsword-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "tranchant" }, { count: 1, die: 10, damageType: "tranchant" }],
          stats: ["str"],
          properties: "Polyvalente",
          mastery: "Sape",
          weight: 1.5,
          price: "15 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-fleau-darmes",
    "title": "Fléau d'armes",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["fléau d'armes", "fleau d'armes", "flail"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-fleau-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une poignée reliée par une chaîne à une lourde bille métallique hérissée de pointes, idéale pour contourner les boucliers.</p>"
      },
      {
        "id": "b-fleau-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "contondant" }],
          stats: ["str"],
          properties: "",
          mastery: "Sape",
          weight: 1.0,
          price: "10 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-fouet",
    "title": "Fouet",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["fouet", "whip"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-fouet-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une longue lanière de cuir tressé permettant d'attaquer avec allonge et précision, idéale pour entraver ou harceler.</p>"
      },
      {
        "id": "b-fouet-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 4, damageType: "tranchant" }],
          stats: ["dex", "str"],
          properties: "Allonge, Finesse",
          mastery: "Ralentissement",
          weight: 1.5,
          price: "2 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-hache-a-deux-mains",
    "title": "Hache à deux mains",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["hache à deux mains", "hache a deux mains", "greataxe"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-greataxe-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une immense hache de combat lourde à deux mains capable de délivrer des coups de taille dévastateurs.</p>"
      },
      {
        "id": "b-greataxe-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 12, damageType: "tranchant" }],
          stats: ["str"],
          properties: "Deux mains, Lourde",
          mastery: "Enchaînement",
          weight: 3.5,
          price: "30 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-hache-darmes",
    "title": "Hache d'armes",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["hache d'armes", "hache d'arme", "battleaxe"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-battleaxe-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une hache de guerre équilibrée pour le combat à une main, mais également très efficace prise à deux mains.</p>"
      },
      {
        "id": "b-battleaxe-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "tranchant" }, { count: 1, die: 10, damageType: "tranchant" }],
          stats: ["str"],
          properties: "Polyvalente",
          mastery: "Renversement",
          weight: 2.0,
          price: "10 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-hallebarde",
    "title": "Hallebarde",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["hallebarde", "halberd"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-halberd-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une arme d'hast lourde combinant les caractéristiques d'une lance, d'une hache et d'un crochet de cavalerie.</p>"
      },
      {
        "id": "b-halberd-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 10, damageType: "tranchant" }],
          stats: ["str"],
          properties: "Allonge, Deux mains, Lourde",
          mastery: "Enchaînement",
          weight: 3.0,
          price: "20 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-lance-darcon",
    "title": "Lance d'arçon",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["lance d'arçon", "lance d'arcon", "lance"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-lance-a-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une très longue lance de cavalerie conçue pour empaler les ennemis lors des charges équestres, nécessitant deux mains à pied.</p>"
      },
      {
        "id": "b-lance-a-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 10, damageType: "perforant" }],
          stats: ["str"],
          properties: "Allonge, Deux mains (sauf à cheval), Lourde",
          mastery: "Renversement",
          weight: 3.0,
          price: "10 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-maillet-darmes",
    "title": "Maillet d'armes",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["maillet d'armes", "maillet d'arme", "maul"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-maul-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Un marteau de guerre géant à deux mains conçu pour broyer les protections et renverser les cibles les plus lourdes.</p>"
      },
      {
        "id": "b-maul-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 2, die: 6, damageType: "contondant" }],
          stats: ["str"],
          properties: "Deux mains, Lourde",
          mastery: "Renversement",
          weight: 5.0,
          price: "10 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-marteau-de-guerre",
    "title": "Marteau de guerre",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["marteau de guerre", "warhammer"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-warhammer-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Un marteau de combat classique associant une face plate pour écraser et un bec pointu pour percer, très populaire chez les nains.</p>"
      },
      {
        "id": "b-warhammer-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "contondant" }, { count: 1, die: 10, damageType: "contondant" }],
          stats: ["str"],
          properties: "Polyvalente",
          mastery: "Poussée",
          weight: 2.5,
          price: "15 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-morgenstern",
    "title": "Morgenstern",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["morgenstern", "morningstar"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-morningstar-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une masse d'armes dotée d'une tête à pointes métalliques rigides, infligeant de redoutables blessures perforantes.</p>"
      },
      {
        "id": "b-morningstar-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "perforant" }],
          stats: ["str"],
          properties: "",
          mastery: "Sape",
          weight: 2.0,
          price: "15 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-pic-de-guerre",
    "title": "Pic de guerre",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["pic de guerre", "war pick"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-warpick-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Un pic d'armes à bec de corbin lourd conçu pour transpercer les plaques d'acier et les mailles lourdes.</p>"
      },
      {
        "id": "b-warpick-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "perforant" }, { count: 1, die: 10, damageType: "perforant" }],
          stats: ["str"],
          properties: "Polyvalente",
          mastery: "Sape",
          weight: 1.0,
          price: "5 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-pique",
    "title": "Pique",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["pique", "pike"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-pike-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une très longue lance d'infanterie formant un rempart de pointes, idéale pour tenir à distance les charges de cavalerie.</p>"
      },
      {
        "id": "b-pike-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 10, damageType: "perforant" }],
          stats: ["str"],
          properties: "Allonge, Deux mains, Lourde",
          mastery: "Poussée",
          weight: 9.0,
          price: "5 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-rapiere",
    "title": "Rapière",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["rapière", "rapiere", "rapier"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rapier-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une épée fine à lame effilée optimisée pour l'escrime et les frappes d'estoc rapides et précises.</p>"
      },
      {
        "id": "b-rapier-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "perforant" }],
          stats: ["dex", "str"],
          properties: "Finesse",
          mastery: "Ouverture",
          weight: 1.0,
          price: "25 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-trident",
    "title": "Trident",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["trident"],
    "tags": ["Armes de guerre de corps à corps", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-trident-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une fourche métallique à trois dents, pouvant être lancée ou tenue à deux mains au corps à corps.</p>"
      },
      {
        "id": "b-trident-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "perforant" }, { count: 1, die: 10, damageType: "perforant" }],
          stats: ["str"],
          properties: "Lancer, Polyvalente",
          mastery: "Renversement",
          weight: 2.0,
          price: "5 PO",
          description: "",
          rangeMin: 6,
          rangeMax: 18
        })
      }
    ]
  },
  {
    "id": "weapon-arbalete-de-poing",
    "title": "Arbalète de poing",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["arbalète de poing", "arbalete de poing", "hand crossbow"],
    "tags": ["Armes de guerre à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-arbalete-p-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une arbalète miniature utilisable à une main, idéale pour les attaques discrètes et surprises.</p>"
      },
      {
        "id": "b-arbalete-p-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 6, damageType: "perforant" }],
          stats: ["dex"],
          properties: "Chargement, Légère, Munitions (portée 9/36 ; carreaux)",
          mastery: "Ouverture",
          weight: 1.5,
          price: "75 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-arbalete-lourde",
    "title": "Arbalète lourde",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["arbalète lourde", "arbalete lourde", "heavy crossbow"],
    "tags": ["Armes de guerre à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-arbalete-h-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une lourde arbalète sur affût de bois dotée d'une très grande puissance de pénétration à longue portée.</p>"
      },
      {
        "id": "b-arbalete-h-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 10, damageType: "perforant" }],
          stats: ["dex"],
          properties: "Chargement, Deux mains, Lourde, Munitions (portée 30/120 ; carreaux)",
          mastery: "Poussée",
          weight: 9.0,
          price: "50 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-arc-long",
    "title": "Arc long",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["arc long", "longbow"],
    "tags": ["Armes de guerre à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-arc-l-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Un grand arc traditionnel en bois d'if exigeant de la force pour être bandé, tirant des flèches à très longue distance.</p>"
      },
      {
        "id": "b-arc-l-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 8, damageType: "perforant" }],
          stats: ["dex"],
          properties: "Deux mains, Lourde, Munitions (portée 45/180 ; flèches)",
          mastery: "Ralentissement",
          weight: 1.0,
          price: "50 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-mousquet",
    "title": "Mousquet",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["mousquet", "musket"],
    "tags": ["Armes de guerre à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-mousquet-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une arme à feu de combat primitive à canon long propulsant des balles de plomb bruyantes avec une grande puissance d'impact.</p>"
      },
      {
        "id": "b-mousquet-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 12, damageType: "perforant" }],
          stats: ["dex"],
          properties: "Chargement, Deux mains, Munitions (portée 12/36 ; balles)",
          mastery: "Ralentissement",
          weight: 5.0,
          price: "500 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-pistolet",
    "title": "Pistolet",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["pistolet", "pistol"],
    "tags": ["Armes de guerre à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-pistolet-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Une arme à feu de poing à canon court, détonante et mortelle à moyenne et courte portée.</p>"
      },
      {
        "id": "b-pistolet-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 10, damageType: "perforant" }],
          stats: ["dex"],
          properties: "Chargement, Munitions (portée 9/27 ; balles)",
          mastery: "Ouverture",
          weight: 1.5,
          price: "250 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "weapon-sarbacane",
    "title": "Sarbacane",
    "category": "arme",
    "parentPageId": "equipment-armes",
    "aliases": ["sarbacane", "blowgun"],
    "tags": ["Armes de guerre à distance", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-sarbacane-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Un long tube permettant de propulser silencieusement de petits dards, souvent enduits de poisons affaiblissants.</p>"
      },
      {
        "id": "b-sarbacane-stats",
        "type": "weapon",
        "title": "Statistiques",
        "content": JSON.stringify({
          damageDice: [{ count: 1, die: 1, damageType: "perforant" }],
          stats: ["dex"],
          properties: "Chargement, Munitions (portée 7,50/30 ; dards)",
          mastery: "Ouverture",
          weight: 0.5,
          price: "10 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "equipment-cotte-de-mailles",
    "title": "Cotte de mailles",
    "category": "regle",
    "aliases": ["cotte de mailles", "cotte de maille", "cotte", "chain mail"],
    "tags": ["Équipement", "Armures", "Lourdes", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-eq-cotte-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>La Cotte de mailles est une armure métallique composée de milliers d'anneaux de fer entrelacés. Elle offre une protection robuste et complète contre les coups tranchants et perforants.</p>"
      },
      {
        "id": "b-eq-cotte-stats",
        "type": "equipment",
        "title": "Statistiques",
        "content": JSON.stringify({
          ac: 16,
          shieldBonus: 0,
          armorType: "heavy",
          weight: 25.0,
          price: "75 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "equipment-bouclier",
    "title": "Bouclier",
    "category": "regle",
    "aliases": ["bouclier", "shield"],
    "tags": ["Équipement", "Armures", "Boucliers", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-eq-bouclier-resume",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Un Bouclier est une plaque de bois, de métal ou de cuir renforcé portée au bras pour dévier les attaques physiques et magiques.</p>"
      },
      {
        "id": "b-eq-bouclier-stats",
        "type": "equipment",
        "title": "Statistiques",
        "content": JSON.stringify({
          ac: 0,
          shieldBonus: 2,
          armorType: "shield",
          weight: 3.0,
          price: "10 PO",
          description: ""
        })
      }
    ]
  },
  {
    "id": "equipment-monnaie",
    "title": "Monnaie",
    "category": "regle",
    "aliases": ["monnaie", "pièces", "pièce d'or", "pièce d'argent", "pièce de cuivre", "po", "pa", "pc", "pp", "pe"],
    "tags": ["Équipement", "Règles", "Monnaie", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-eq-monnaie-res",
        "type": "text",
        "title": "Résumé",
        "content": "<p>Les pièces communes ont différentes dénominations en fonction de la valeur du métal. Les trois pièces de monnaie les plus courantes sont la pièce d'or (po), la pièce d'argent (pa) et la pièce de cuivre (pc).</p>"
      },
      {
        "id": "b-eq-monnaie-val",
        "type": "currency",
        "title": "Tableau d'Équivalence & Poids",
        "content": "[{\"id\":\"copper\",\"name\":\"Pièces de Cuivre (pc)\",\"valueInGp\":\"1/100\",\"weightGramsPerCoin\":10},{\"id\":\"silver\",\"name\":\"Pièces d'Argent (pa)\",\"valueInGp\":\"1/10\",\"weightGramsPerCoin\":10},{\"id\":\"electrum\",\"name\":\"Pièces d'Electrum (pe)\",\"valueInGp\":\"1/2\",\"weightGramsPerCoin\":10},{\"id\":\"gold\",\"name\":\"Pièces d'Or (po)\",\"valueInGp\":\"1/1\",\"weightGramsPerCoin\":10},{\"id\":\"platinum\",\"name\":\"Pièces de Platine (pp)\",\"valueInGp\":10,\"weightGramsPerCoin\":10}]"
      }
    ]
  },
  {
    "id": "equipment-armes",
    "title": "Armes",
    "category": "regle",
    "aliases": ["arme", "armes", "weapon", "weapons", "propriété des armes", "propriétés des armes", "bottes d'armes", "bottes d'arme", "botte d'arme"],
    "tags": ["Équipement", "Règles", "Armes", "2024"],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-eq-arme-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Chaque arme possède des propriétés spécifiques qui régissent son fonctionnement en combat, telles que la possibilité d'utiliser la Dextérité au lieu de la Force (Finesse), la capacité d'attaquer avec une action bonus (Légère), ou la nécessité d'utiliser ses deux mains (Deux mains).</p>"
      },
      {
        "id": "b-eq-arme-props",
        "type": "weapon_properties",
        "title": "Propriétés des armes",
        "content": "[{\"id\":\"a_deux_mains\",\"name\":\"À deux mains\",\"description\":\"Cette arme nécessite les deux mains lorsque vous attaquez avec.\"},{\"id\":\"allonge\",\"name\":\"Allonge\",\"description\":\"Ce type d'arme ajoute 1,50 mètre à votre allonge lorsque vous attaquez avec, ou pour déterminer votre allonge lorsque vous effectuez une attaque d'opportunité avec (voir Combat).\"},{\"id\":\"chargement\",\"name\":\"Chargement\",\"description\":\"En raison du temps nécessaire pour charger cette arme, vous ne pouvez tirer qu'une seule munition par action, action bonus ou réaction, quel que soit le nombre d'attaques que vous possédez.\"},{\"id\":\"finesse\",\"name\":\"Finesse\",\"description\":\"Lorsque vous effectuez une attaque avec une arme de finesse, vous pouvez au choix appliquer votre modificateur de Force ou celui de Dextérité à vos jets d'attaque et de dégâts. Le même modificateur s'applique aux deux jets.\"},{\"id\":\"lancer\",\"name\":\"Lancer\",\"description\":\"Une arme qui possède la propriété lancer peut être lancée pour réaliser une attaque à distance. Si l'arme est une arme de corps à corps, vous utilisez la même caractéristique pour le jet d'attaque et de dégâts que vous auriez utilisée au corps à corps. Par exemple, si vous lancez une hachette, vous utilisez la Force, mais si vous lancez une dague, vous pouvez utiliser la Force ou la Dextérité, car la dague possède la propriété finesse.\"},{\"id\":\"legere\",\"name\":\"Légère\",\"description\":\"Une arme légère est petite et facile à manier, ce qui la rend idéale pour les combats à deux armes. Voir les règles du combat à deux armes.\"},{\"id\":\"lourde\",\"name\":\"Lourde\",\"description\":\"Les créatures de taille P ou TP ont un désavantage aux jets d'attaque avec une arme lourde. La taille et le poids d'une arme lourde sont en effet trop importants pour qu'une créature de taille P ou TP puisse l'utiliser efficacement.\"},{\"id\":\"munitions\",\"name\":\"Munitions\",\"description\":\"Vous ne pouvez utiliser une arme qui possède la propriété munitions pour une attaque à distance que si vous avez des munitions pour celle-ci. Pour chaque attaque réalisée avec cette arme, une munition est consommée. Prendre la munition d'un carquois ou autre contenant similaire fait partie de l'attaque (vous avez besoin d'une main libre pour recharger une arme à une main). À la fin du combat, vous pouvez récupérer la moitié des munitions utilisées en passant une minute pour la recherche. Si vous utilisez ce type d'arme pour une attaque au corps à corps, l'arme est considérée comme une arme improvisée (voir les règles correspondantes). Une fronde doit être chargée pour infliger des dégâts de cette manière.\"},{\"id\":\"polyvalente\",\"name\":\"Polyvalente\",\"description\":\"Cette arme peut être tenue à une ou deux mains. Le chiffre indiqué entre parenthèses correspond aux dégâts si l'arme est tenue à deux mains lors d'une attaque au corps à corps.\"},{\"id\":\"portee\",\"name\":\"Portée\",\"description\":\"Une arme qui peut être utilisée pour effectuer une attaque à distance a une portée indiquée après les propriétés munitions ou lancer. La portée spécifie deux nombres. Le premier indique la portée nominale en mètres, le deuxième la portée maximale. Au-delà de la portée nominale, vous avez un désavantage aux jets d’attaque. Vous ne pouvez attaquer une créature au-delà de la portée maximale.\"},{\"id\":\"filet\",\"name\":\"Filet\",\"description\":\"Une créature de taille G ou plus petite qui est touchée par un filet est entravée jusqu'à ce qu'elle soit libérée. Un filet n'a aucun effet sur les créatures sans forme ou de taille supérieure à G. Une créature peut utiliser son action pour effectuer un jet de Force DD 10 afin de se libérer ou de libérer une autre créature à sa portée en cas de succès. Infliger 5 points de dégâts tranchants à un filet (CA 10) permet également de libérer une créature sans la blesser, mettant fin à l'effet tout en détruisant le filet. Lorsque vous utilisez une action, une action bonus ou une réaction pour attaquer avec un filet, vous ne pouvez effectuer qu'une seule attaque, et ce quel que soit le nombre d'attaques que vous pouvez normalement réaliser.\"},{\"id\":\"lance_darcon\",\"name\":\"Lance d'arçon\",\"description\":\"Vous avez un désavantage lorsque vous utilisez une lance d'arçon pour attaquer une cible à 1,50 mètre ou moins de vous. En outre, une lance d'arçon requiert deux mains pour être maniée lorsque vous n'êtes pas sur une monture.\"}]"
      },
      {
        "id": "b-eq-armes-bottes-desc",
        "type": "text",
        "title": "Bottes d'armes",
        "content": "<p>Chaque arme est dotée d’une botte, qui n’est utilisable que par un personnage disposant d’une capacité, comme Bottes d’arme, qui déverrouille cette propriété pour le personnage. Les bottes sont définies ci-dessous.</p>"
      },
      {
        "id": "b-eq-armes-bottes-block",
        "type": "weapon_masteries",
        "title": "Définition des bottes d'armes",
        "content": "[{\"id\":\"coup_double\",\"name\":\"Coup double\",\"description\":\"Lorsque vous effectuez l’attaque supplémentaire de la propriété Légère de l’arme, vous pouvez l’effectuer dans le cadre de l’action Attaque au lieu de devoir y consacrer votre action Bonus. Vous ne pouvez effectuer cette attaque supplémentaire qu’une seule fois par tour.\"},{\"id\":\"ecorchure\",\"name\":\"Écorchure\",\"description\":\"Si votre jet d’attaque avec cette arme rate une créature, vous pouvez lui infliger des dégâts égaux au modificateur de la caractéristique utilisée pour effectuer le jet d’attaque. Ces dégâts sont du même type que ceux infligés par l’arme, et ne peuvent être augmentés qu’en augmentant le modificateur de caractéristique.\"},{\"id\":\"enchainement\",\"name\":\"Enchaînement\",\"description\":\"Si vous touchez une créature avec un jet d’attaque de corps à corps avec cette arme, vous pouvez effectuer un jet d’attaque de corps à corps avec cette arme contre une deuxième créature située dans un rayon de 1,50 m de la première, et qui est elle aussi à votre portée. Si l’attaque touche, la deuxième créature subit les dégâts de l’arme, mais sans ajouter votre modificateur de caractéristique à ces dégâts, sauf si ce modificateur est négatif. Vous ne pouvez effectuer cette attaque supplémentaire qu’une seule fois par tour.\"},{\"id\":\"ouverture\",\"name\":\"Ouverture\",\"description\":\"Si vous touchez une créature avec cette arme et lui infligez des dégâts, vous avez un Avantage à votre prochain jet d’attaque contre cette créature avant la fin de votre tour suivant.\"},{\"id\":\"poussee\",\"name\":\"Poussée\",\"description\":\"Si vous touchez une créature avec cette arme, vous pouvez la repousser d’un maximum de 3 m en ligne droite pour peu qu’elle soit de taille G ou inférieure.\"},{\"id\":\"ralentissement\",\"name\":\"Ralentissement\",\"description\":\"Si vous touchez une créature avec cette arme et lui infligez des dégâts, vous pouvez réduire sa Vitesse de 3 m jusqu’au début de votre tour suivant. Si la créature est touchée plus d’une fois par des armes dotées de cette propriété, la réduction de sa Vitesse n’excède pas 3 m.\"},{\"id\":\"renversement\",\"name\":\"Renversement\",\"description\":\"Si vous touchez une créature avec cette arme, vous pouvez la contraindre à effectuer un jet de sauvegarde de Constitution (DD égal à 8 + le modificateur de caractéristique utilisé pour le jet d’attaque + votre bonus de maîtrise). En cas d’échec, la créature subit l’état À terre.\"},{\"id\":\"sape\",\"name\":\"Sape\",\"description\":\"Si vous touchez une créature avec cette arme, cette créature subit un Désavantage à son prochain jet d’attaque avant le début de votre tour suivant.\"}]"
      }
    ]
  }
];
