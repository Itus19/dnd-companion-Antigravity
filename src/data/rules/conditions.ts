import { WikiPage } from '../../types';

export const CONDITIONS_RULES: WikiPage[] = [
  {
    "id": "rule-invisible",
    "title": "Condition : Invisible (2024)",
    "category": "regle",
    "aliases": [
      "invisible",
      "invisibilité"
    ],
    "tags": [
      "Règles",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rule-inv-1",
        "type": "text",
        "content": "<h3>Condition : Invisible (D&D 2024)</h3>\n<p>Une créature affectée par la condition <strong>Invisible</strong> bénéficie des règles révisées suivantes :</p>\n<ul>\n<li><strong>Invisibilité totale :</strong> Vous êtes impossible à voir sans l'aide de la magie ou d'une capacité spéciale (comme <em>Voir l'invisibilité</em>). Vous êtes considéré comme lourdement dissimulé.</li>\n<li><strong>Détection :</strong> Votre emplacement peut être détecté par le bruit que vous faites ou les traces que vous laissez. Pour vous cacher, vous devez effectuer l'action <strong>Chercher</strong> ou <strong>Se cacher</strong>.</li>\n<li><strong>Avantage / Désavantage :</strong> Les jets d'attaque contre vous ont un <em>désavantage</em>, et vos jets d'attaque ont un <em>avantage</em>. Si une créature parvient à vous voir (via un sort ou un objet), ce bénéfice est annulé contre cette créature.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "rule-exhausted",
    "title": "Condition : Épuisé (2024)",
    "category": "regle",
    "aliases": [
      "épuisé",
      "épuisement",
      "fatigué"
    ],
    "tags": [
      "Règles",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rule-exh-1",
        "type": "text",
        "content": "<h3>Condition : Épuisé (D&D 2024)</h3>\n<p>Le système d'épuisement a été simplifié dans les règles D&D 2024 pour être plus facile à suivre en jeu :</p>\n<ul>\n<li><strong>Niveaux d'épuisement :</strong> Cette condition est cumulative et comporte 10 niveaux.</li>\n<li><strong>Pénalité D20 (-1 par niveau) :</strong> Lorsque vous effectuez un jet de D20 (jet d'attaque, test de caractéristique, jet de sauvegarde), vous appliquez un malus égal à votre niveau d'épuisement actuel.</li>\n<li><strong>Pénalité DD de sort :</strong> Le DD de sauvegarde de vos sorts est également réduit de votre niveau d'épuisement actuel.</li>\n<li><strong>Vitesse réduite :</strong> Votre vitesse de déplacement est réduite de 1,5 mètre (5 pieds) par niveau d'épuisement.</li>\n<li><strong>Mort :</strong> Si votre niveau d'épuisement atteint 10, vous mourez instantanément.</li>\n<li><strong>Récupération :</strong> Un repos long dissipe 1 niveau d'épuisement.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "rule-masteries",
    "title": "Maîtrises d'Armes (2024)",
    "category": "regle",
    "aliases": [
      "maîtrise d'arme",
      "maîtrises d'armes",
      "propriété de maîtrise"
    ],
    "tags": [
      "Règles",
      "Combat",
      "Armes",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rule-mast-1",
        "type": "text",
        "content": "<h3>Propriétés de Maîtrise d'Armes (D&D 2024)</h3>\n<p>Les combattants qualifiés peuvent débloquer les propriétés spéciales de leurs armes pour ajouter des effets tactiques à leurs attaques :</p>\n<ul>\n<li><strong>Trancher (Cleave) :</strong> Si vous touchez, vous pouvez porter une seconde attaque gratuite contre une autre créature adjacente (dégâts de l'arme uniquement). <em>(Exemple : Hallebarde, Grande épée)</em>.</li>\n<li><strong>Entaille (Nick) :</strong> Permet d'effectuer l'attaque de combat à deux armes dans le cadre de votre action Attaquer principale, libérant votre action bonus. <em>(Exemple : Dague, Cimeterre)</em>.</li>\n<li><strong>Pousser (Push) :</strong> Repousse la cible de 3 mètres (10 pieds) en ligne droite si l'attaque touche. <em>(Exemple : Grand marteau, Pique)</em>.</li>\n<li><strong>Ralentir (Slow) :</strong> Réduit la vitesse de déplacement de la cible de 3 mètres (10 pieds) jusqu'à votre prochain tour. <em>(Exemple : Arc long, Fléau)</em>.</li>\n<li><strong>Renverser (Topple) :</strong> Force la cible à effectuer un jet de sauvegarde de Constitution (DD basé sur la Force ou la Dextérité) sous peine d'être mise <em>À terre</em> (Prone). <em>(Exemple : Trident, Hache de bataille)</em>.</li>\n<li><strong>Harceler (Vex) :</strong> Si vous touchez, vous gagnez un <em>avantage</em> sur votre prochain jet d'attaque contre cette cible avant la fin de votre prochain tour. <em>(Exemple : Rapière, Arc court)</em>.</li>\n<li><strong>Affaiblir (Sap) :</strong> Si vous touchez, la cible a un <em>désavantage</em> sur son prochain jet d'attaque avant le début de votre prochain tour. <em>(Exemple : Masse, Fléau)</em>.</li>\n<li><strong>Égratigner (Graze) :</strong> Si votre attaque rate, vous infligez tout de même des dégâts égaux à votre modificateur de caractéristique offensive. <em>(Exemple : Glaive, Grande hache)</em>.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "rule-study",
    "title": "Action : Étudier (2024)",
    "category": "regle",
    "aliases": [
      "étudier",
      "étude"
    ],
    "tags": [
      "Règles",
      "Actions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rule-std-1",
        "type": "text",
        "content": "<h3>L'Action Étudier (D&D 2024)</h3>\n<p>L'action <strong>Étudier</strong> est une nouvelle action formelle permettant à un personnage de faire appel à son érudition en plein combat ou exploration :</p>\n<ul>\n<li><strong>Objectif :</strong> Se rappeler des informations historiques, déchiffrer des runes, identifier un sort en cours ou analyser les faiblesses d'un monstre.</li>\n<li><strong>Test associé :</strong> Effectuez un test d'Intelligence (Arcanes, Histoire, Investigation, Nature ou Religion) selon le sujet d'étude.</li>\n<li><strong>Difficulté (DD) :</strong> Le DD is fixé par le Maître de Jeu (généralement 15 pour des connaissances courantes, ou basé sur le FP de la créature étudiée). En cas de succès, le MJ vous révèle des détails précieux (résistances, vulnérabilités, faiblesses tactiques).</li>\n</ul>"
      }
    ]
  },
  {
    "id": "rule-search",
    "title": "Action : Chercher (2024)",
    "category": "regle",
    "aliases": [
      "chercher",
      "recherche"
    ],
    "tags": [
      "Règles",
      "Actions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rule-sch-1",
        "type": "text",
        "content": "<h3>L'Action Chercher (D&D 2024)</h3>\n<p>L'action <strong>Chercher</strong> permet d'inspecter l'environnement immédiat pour y déceler des éléments cachés ou dissimulés :</p>\n<ul>\n<li><strong>Objectif :</strong> Trouver une créature cachée, un piège dissimulé, une porte secrète, ou un indice physique discret.</li>\n<li><strong>Test associé :</strong> Effectuez un test de Sagesse (Perception) ou d'Intelligence (Investigation).</li>\n<li><strong>Interaction :</strong> Cette action formalise la détection active. Le résultat du jet est opposé au DD du piège ou au jet de discrétion (Discrétion passive ou active) de la cible cachée.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "rule-magic",
    "title": "Action : Magie (2024)",
    "category": "regle",
    "aliases": [
      "magie",
      "action de magie",
      "lancer un sort"
    ],
    "tags": [
      "Règles",
      "Actions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rule-mag-1",
        "type": "text",
        "content": "<h3>L'Action Magie (D&D 2024)</h3>\n<p>L'action <strong>Magie</strong> regroupe toutes les activités liées à la manipulation active des énergies magiques au cours d'un tour :</p>\n<ul>\n<li><strong>Lancer un sort :</strong> Lancer un sort qui nécessite une action de combat s'effectue désormais dans le cadre de l'action Magie.</li>\n<li><strong>Activer un objet magique :</strong> Utiliser un objet magique (comme une baguette ou une potion) qui requiert une action s'effectue également via cette action Magie (et non plus l'action standard \"Utiliser un objet\").</li>\n<li><strong>Concentration :</strong> Si un sort nécessite de la concentration, débuter ou maintenir ce sort est régenté par les règles de l'action Magie.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "rule-grappled",
    "title": "Condition : Agrippé",
    "category": "regle",
    "aliases": [
      "agrippé",
      "agripper",
      "grappled"
    ],
    "tags": [
      "Règles",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rl-grp-1",
        "type": "text",
        "content": "<h3>Condition : Agrippé (D&D 2024)</h3>\n<p>Une créature subissant l'état <strong>Agrippé</strong> subit les effets suivants :</p>\n<ul>\n<li><strong>Vitesse nulle :</strong> La vitesse de la créature agrippée devient 0, et elle ne peut bénéficier d'aucun bonus de vitesse.</li>\n<li><strong>Attaque désavantageuse :</strong> La créature agrippée subit un <em>désavantage</em> sur tous ses jets d'attaque contre d'autres cibles que l'agrippeur.</li>\n<li><strong>Déplacement forcé :</strong> Si l'agrippeur se déplace, il peut traîner la créature agrippée avec lui (son déplacement est réduit de moitié, sauf si la créature est deux catégories de taille inférieure à lui).</li>\n<li><strong>S'échapper :</strong> La créature peut tenter de s'échapper à la fin de chacun de ses tours en effectuant un jet de sauvegarde de Force ou de Dextérité contre le DD de l'agrippeur.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "rule-prone",
    "title": "Condition : À terre",
    "category": "regle",
    "aliases": [
      "à terre",
      "renversé",
      "prone"
    ],
    "tags": [
      "Règles",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rl-prn-1",
        "type": "text",
        "content": "<h3>Condition : À terre (D&D 2024)</h3>\n<p>Une créature <strong>À terre</strong> subit les effets tactiques suivants :</p>\n<ul>\n<li><strong>Déplacement limité :</strong> La seule option de déplacement de la créature est de ramper (chaque mètre parcouru en rampant en coûte un supplémentaire), à moins qu'elle ne consacre la moitié de sa vitesse totale pour se relever.</li>\n<li><strong>Avantage au contact :</strong> Les jets d'attaque au corps à corps contre la créature bénéficient d'un <em>avantage</em> si l'attaquant est à moins de 1,5 mètre d'elle.</li>\n<li><strong>Désavantage à distance :</strong> Les jets d'attaque à distance contre la créature subissent un <em>désavantage</em> (la créature présente une cible plus étroite).</li>\n<li><strong>Attaque désavantageuse :</strong> La créature à terre subit un <em>désavantage</em> sur ses propres jets d'attaque.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "rule-intuition-passive",
    "title": "Intuition passive",
    "category": "regle",
    "aliases": [
      "intuition passive",
      "passive insight"
    ],
    "tags": [
      "Règles",
      "Caractéristiques",
      "Aptitudes",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-rule-int-pass-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Intuition passive (Passive Insight)</h3>\n<p>L'<strong>Intuition passive</strong> représente la capacité d'un personnage à déceler inconsciemment ou automatiquement les mensonges, les intentions cachées ou les états émotionnels des interlocuteurs sans avoir à faire un test actif.</p>\n<p><strong>Formule de calcul :</strong> 10 + modificateur de Sagesse + bonus de maîtrise (si la compétence <em>Intuition</em> est maîtrisée).</p>"
      }
    ]
  },
  {
    "id": "cond-aveugle",
    "title": "Aveuglé",
    "category": "regle",
    "aliases": [
      "aveuglé",
      "aveugle",
      "blinded"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-aveugle",
        "type": "text",
        "title": "État : Aveuglé",
        "content": "<p>• Tout test de caractéristique qui nécessite la vue échoue automatiquement.</p>\n<p>• Vous subissez un <strong>désavantage</strong> sur vos jets d'attaque.</p>\n<p>• Les jets d'attaque contre vous ont l'<strong>avantage</strong>.</p>"
      }
    ]
  },
  {
    "id": "cond-charme",
    "title": "Charmé",
    "category": "regle",
    "aliases": [
      "charmé",
      "charme",
      "charmed"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-charme",
        "type": "text",
        "title": "État : Charmé",
        "content": "<p>• Vous ne pouvez pas attaquer le charmeur ni le cibler avec des capacités nocives.</p>\n<p>• Le charmeur a l'<strong>avantage</strong> sur tout test de caractéristique sociale (Charisme) pour interagir avec vous.</p>"
      }
    ]
  },
  {
    "id": "cond-assourdi",
    "title": "Assourdi",
    "category": "regle",
    "aliases": [
      "assourdi",
      "deafened"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-assourdi",
        "type": "text",
        "title": "État : Assourdi",
        "content": "<p>• Tout test de caractéristique qui nécessite l'ouïe échoue automatiquement.</p>"
      }
    ]
  },
  {
    "id": "cond-invisible",
    "title": "Invisible",
    "category": "regle",
    "aliases": [
      "invisible"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-invisible",
        "type": "text",
        "title": "État : Invisible",
        "content": "<p>• Vous êtes impossible à voir sans l'aide de magie ou d'un sens particulier.</p>\n<p>• Vous bénéficiez d'un <strong>avantage</strong> sur vos tests de Dextérité (Discrétion).</p>\n<p>• Vous avez l'<strong>avantage</strong> sur vos jets d'attaque.</p>\n<p>• Les jets d'attaque contre vous ont un <strong>désavantage</strong>.</p>"
      }
    ]
  },
  {
    "id": "cond-agrippe",
    "title": "Agrippé",
    "category": "regle",
    "aliases": [
      "agrippé",
      "agrippe",
      "grappled"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-agrippe",
        "type": "text",
        "title": "État : Agrippé",
        "content": "<p>• Votre vitesse devient <strong>0</strong> et vous ne pouvez bénéficier d'aucun bonus de vitesse.</p>\n<p>• Cet état prend fin si l'agrippeur est incapable, ou si un effet vous éloigne de la portée de l'agrippeur.</p>"
      }
    ]
  },
  {
    "id": "cond-a-terre",
    "title": "À terre",
    "category": "regle",
    "aliases": [
      "à terre",
      "a terre",
      "prone"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-a-terre",
        "type": "text",
        "title": "État : À terre",
        "content": "<p>• Votre seule option de mouvement est de ramper (vitesse divisée par deux) sauf si vous vous relevez.</p>\n<p>• Vous subissez un <strong>désavantage</strong> sur vos jets d'attaque.</p>\n<p>• Les jets d'attaque contre vous ont l'<strong>avantage</strong> si l'attaquant est à moins de 1.5 mètre (5 pieds) de vous, sinon ils ont le <strong>désavantage</strong>.</p>"
      }
    ]
  },
  {
    "id": "cond-paralyse",
    "title": "Paralysé",
    "category": "regle",
    "aliases": [
      "paralysé",
      "paralyse",
      "paralyzed"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-paralyse",
        "type": "text",
        "title": "État : Paralysé",
        "content": "<p>• Vous êtes <strong>incapable</strong> (vous ne pouvez effectuer aucune action ni réaction) et ne pouvez ni bouger ni parler.</p>\n<p>• Votre vitesse devient <strong>0</strong>.</p>\n<p>• Vous <strong>échouez automatiquement</strong> à vos jets de sauvegarde de <strong>Force</strong> et de <strong>Dextérité</strong>.</p>\n<p>• Les jets d'attaque contre vous ont l'<strong>avantage</strong>.</p>\n<p>• Tout jet d'attaque qui vous touche est un coup critique automatique si l'attaquant se trouve à moins de 1.5 mètre de vous.</p>"
      }
    ]
  },
  {
    "id": "cond-petrifie",
    "title": "Pétrifié",
    "category": "regle",
    "aliases": [
      "pétrifié",
      "petrifie",
      "petrified"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-petrifie",
        "type": "text",
        "title": "État : Pétrifié",
        "content": "<p>• Vous êtes transformé en une substance solide inanimée (généralement en pierre).</p>\n<p>• Vous êtes <strong>incapable</strong>, ne pouvez ni bouger ni parler, et n'avez pas conscience de votre environnement.</p>\n<p>• Votre vitesse devient <strong>0</strong>.</p>\n<p>• Les jets d'attaque contre vous ont l'<strong>avantage</strong>.</p>\n<p>• Vous <strong>échouez automatiquement</strong> à vos jets de sauvegarde de <strong>Force</strong> et de <strong>Dextérité</strong>.</p>\n<p>• Vous avez la résistance à tous les types de dégâts et êtes immunisé au poison.</p>"
      }
    ]
  },
  {
    "id": "cond-empoisonne",
    "title": "Empoisonné",
    "category": "regle",
    "aliases": [
      "empoisonné",
      "empoisonne",
      "poisoned"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-empoisonne",
        "type": "text",
        "title": "État : Empoisonné",
        "content": "<p>• Vous subissez un <strong>désavantage</strong> sur vos tests de caractéristique et sur vos jets d'attaque.</p>"
      }
    ]
  },
  {
    "id": "cond-entrave",
    "title": "Entravé",
    "category": "regle",
    "aliases": [
      "entravé",
      "entrave",
      "restrained"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-entrave",
        "type": "text",
        "title": "État : Entravé",
        "content": "<p>• Votre vitesse devient <strong>0</strong>.</p>\n<p>• Vous subissez un <strong>désavantage</strong> sur vos jets d'attaque et sur vos jets de sauvegarde de <strong>Dextérité</strong>.</p>\n<p>• Les jets d'attaque contre vous ont l'<strong>avantage</strong>.</p>"
      }
    ]
  },
  {
    "id": "cond-etourdi",
    "title": "Étourdi",
    "category": "regle",
    "aliases": [
      "étourdi",
      "etourdi",
      "stunned"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-etourdi",
        "type": "text",
        "title": "État : Étourdi",
        "content": "<p>• Vous êtes <strong>incapable</strong> et ne pouvez ni bouger ni parler.</p>\n<p>• Votre vitesse devient <strong>0</strong>.</p>\n<p>• Vous <strong>échouez automatiquement</strong> à vos jets de sauvegarde de <strong>Force</strong> et de <strong>Dextérité</strong>.</p>\n<p>• Les jets d'attaque contre vous ont l'<strong>avantage</strong>.</p>"
      }
    ]
  },
  {
    "id": "cond-inconscient",
    "title": "Inconscient",
    "category": "regle",
    "aliases": [
      "inconscient",
      "unconscious"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cond-inconscient",
        "type": "text",
        "title": "État : Inconscient",
        "content": "<p>• Vous êtes <strong>incapable</strong>, ne pouvez ni bouger ni parler, et n'avez pas conscience de votre environnement.</p>\n<p>• Vous tombez à terre et lâchez tout objet que vous tenez.</p>\n<p>• Votre vitesse devient <strong>0</strong>.</p>\n<p>• Vous <strong>échouez automatiquement</strong> à vos jets de sauvegarde de <strong>Force</strong> et de <strong>Dextérité</strong>.</p>\n<p>• Les jets d'attaque contre vous ont l'<strong>avantage</strong>.</p>\n<p>• Tout jet d'attaque qui vous touche est un coup critique automatique si l'attaquant est à moins de 1.5 mètre de vous.</p>"
      }
    ]
  },
  {
    "id": "cond-agrandi",
    "title": "Agrandi",
    "category": "regle",
    "aliases": [
      "agrandi",
      "agrandissement"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-cond-agrandi",
        "type": "text",
        "title": "État : Agrandi",
        "content": "<p>• La taille de la cible est <strong>doublée</strong> dans toutes ses dimensions et son poids est multiplié par 8 (sa taille augmente d'une catégorie, par exemple de Moyenne à Grande).</p>\n<p>• Vous bénéficiez d'un <strong>avantage</strong> sur vos jets de sauvegarde de Force et tests de Force.</p>\n<p>• Vos attaques avec des armes infligent <strong>+1d4</strong> dégâts supplémentaires.</p>"
      }
    ]
  },
  {
    "id": "cond-rapetisse",
    "title": "Rapetissé",
    "category": "regle",
    "aliases": [
      "rapetissé",
      "rapetisse",
      "rapetissement"
    ],
    "tags": [
      "États",
      "Conditions",
      "2024"
    ],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-cond-rapetisse",
        "type": "text",
        "title": "État : Rapetissé",
        "content": "<p>• La taille de la cible est <strong>divisée par deux</strong> dans toutes ses dimensions et son poids est divisé par 8 (sa taille diminue d'une catégorie, par exemple de Moyenne à Petite).</p>\n<p>• Vous subissez un <strong>désavantage</strong> sur vos jets de sauvegarde de Force et tests de Force.</p>\n<p>• Vos attaques avec des armes infligent <strong>-1d4</strong> de dégâts (avec un minimum de 1 point de dégât).</p>"
      }
    ]
  }
];
