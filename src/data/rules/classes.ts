import { WikiPage } from '../../types';

export const CLASSES_RULES: WikiPage[] = [
  {
    "id": "class-barbare",
    "title": "Barbare",
    "category": "regle",
    "aliases": [
      "barbare",
      "berserker"
    ],
    "tags": [
      "Classes",
      "Combat",
      "Force"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cl-bar-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>La rage des contrées sauvages</h3>\n<p>Pour certains combattants, la colère n'est pas un défaut, mais un don divin ou une force brute héritée de la nature sauvage. C'est le cas du Barbare, qui canalise sa rage intérieure pour accomplir des prouesses de force et ignorer la douleur physique.</p>\n<p>Riant face au danger, les barbares comptent sur leur robustesse inébranlable et leurs réflexes félins pour charger en première ligne sans se soucier du poids d'une armure lourde.</p>"
      },
      {
        "id": "b-cl-bar-1",
        "type": "class",
        "title": "Données techniques de classe",
        "content": "{\"hitDie\":\"1d12\",\"primaryAbilities\":[\"Force\",\"Constitution\"],\"saves\":[\"Force\",\"Constitution\"],\"armorProficiencies\":[\"Armures légères\",\"Armures intermédiaires\",\"Boucliers\"],\"weaponMastery\":true,\"subclasses\":[{\"name\":\"Voie du Berserker\",\"description\":\"Ajoute des dégâts de Frénésie dévastateurs lors de la rage.\"},{\"name\":\"Voie de l'Arbre-Monde\",\"description\":\"Canalise les racines planaires pour téléporter des alliés et gagner des PV temporaires.\"}],\"description\":\"Guerriers de la fureur sauvage, les barbares excellent dans le combat brut et la survie en milieu hostile. Ils exploitent la Rage pour décupler leur force et résister aux attaques physiques.\"}"
      }
    ]
  },
  {
    "id": "class-barde",
    "title": "Barde",
    "category": "regle",
    "aliases": [
      "barde",
      "musicien"
    ],
    "tags": [
      "Classes",
      "Magie",
      "Charisme"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cl-brd-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>La musique de la création</h3>\n<p>Les bardes savent que le monde a été créé par le son et la parole magique. En harmonisant leurs instruments ou leurs voix avec ces vibrations primordiales, ils lancent des sorts, inspirent leurs compagnons et troublent l'esprit de leurs rivaux.</p>\n<p>Véritables touche-à-tout, ils recueillent les légendes oubliées et les rumeurs pour en tirer des pouvoirs subtils, combinant le combat physique léger et la magie profane.</p>"
      },
      {
        "id": "b-cl-brd-1",
        "type": "class",
        "title": "Données techniques de classe",
        "content": "{\"hitDie\":\"1d8\",\"primaryAbilities\":[\"Charisme\"],\"saves\":[\"Dextérité\",\"Charisme\"],\"armorProficiencies\":[\"Armures légères\"],\"weaponMastery\":false,\"subclasses\":[{\"name\":\"Collège du Savoir\",\"description\":\"Gagne des compétences additionnelles et des secrets magiques précoces.\"},{\"name\":\"Collège de la Danse\",\"description\":\"Combat sans armure avec agilité et inspire les alliés par le rythme.\"}],\"description\":\"Maîtres des mots et de la magie, les bardes utilisent le son, la musique et l'inspiration pour manipuler l'esprit de leurs alliés et ennemis. Ce sont des lanceurs de sorts polyvalents.\"}"
      }
    ]
  },
  {
    "id": "class-magicien",
    "title": "Magicien",
    "category": "regle",
    "aliases": [
      "magicien",
      "mage",
      "sorcier",
      "évocateur"
    ],
    "tags": [
      "Classes",
      "Magie",
      "Intelligence"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cl-mag-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Érudits de la trame magique</h3>\n<p>La magie n'est pas innée pour le Magicien ; elle s'obtient par une étude minutieuse et acharnée des lois du multivers. Armés de leurs grimoires sacrés, ils apprennent à plier la trame profane pour matérialiser du feu, se téléporter, ou percer les secrets de l'avenir.</p>\n<p>Ils façonnent la réalité à coup de formules algébriques astrales et d'expériences alchimiques.</p>"
      },
      {
        "id": "b-cl-mag-1",
        "type": "class",
        "title": "Données techniques de classe",
        "content": "{\"hitDie\":\"1d6\",\"primaryAbilities\":[\"Intelligence\"],\"saves\":[\"Intelligence\",\"Sagesse\"],\"armorProficiencies\":[\"Aucune\"],\"weaponMastery\":false,\"subclasses\":[{\"name\":\"Évocateur\",\"description\":\"Façonne ses sorts de zone destructeurs pour épargner ses alliés.\"},{\"name\":\"Abjurateur\",\"description\":\"Crée des barrières magiques protectrices pour absorber les dégâts subis.\"}],\"description\":\"Érudits de la magie profane, les magiciens étudient et consignent des sorts dans leurs grimoires. Ils possèdent la liste de sorts préparés la plus vaste et polyvalente du jeu.\"}"
      }
    ]
  },
  {
    "id": "class-guerrier",
    "title": "Guerrier",
    "category": "regle",
    "aliases": [
      "guerrier",
      "fighter"
    ],
    "tags": [
      "Classes",
      "Combat",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cl-gue-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Guerrier (Fighter) - D&D 2024</h3>\n<p>Le guerrier est le maître ultime des armes et des tactiques de combat sur le champ de bataille. Capable de porter les armures les plus lourdes et de manier les armes les plus complexes, il excelle en première ligne.</p>"
      },
      {
        "id": "b-cl-gue-1",
        "type": "class",
        "title": "Données de classe",
        "content": "{\"hitDie\":10,\"savingThrows\":[\"Force\",\"Constitution\"],\"armorProficiencies\":[\"Toutes armures (légères, moyennes, lourdes)\",\"Boucliers\"],\"weaponProficiencies\":[\"Armes courantes\",\"Armes de guerre\"],\"toolProficiencies\":[\"Aucun\"],\"skills\":[\"Athlétisme\",\"Intimidation\",\"Perception\",\"Survie\"],\"subclasses\":[\"Champion\",\"Maître de guerre (Battle Master)\",\"Chevalier psychique (Eldritch Knight)\"],\"description\":\"Membres d'élite des armées ou aventuriers endurcis, les guerriers possèdent une endurance et une maîtrise des armes hors pair.\"}"
      },
      {
        "id": "b-cl-gue-prog",
        "type": "text",
        "title": "Progression de niveau (1 à 5)",
        "content": "<h3>Capacités du Guerrier (Niveaux 1 à 5)</h3>\n<ul>\n<li><strong>Niveau 1 : Second Souffle (Second Wind).</strong> Vous pouvez utiliser une action bonus pour récupérer 1d10 + niveau de guerrier PV. Vous possédez 2 utilisations (récupérables par repos court).</li>\n<li><strong>Niveau 1 : Style de Combat.</strong> Vous choisissez un don de Style de combat (ex: <em>Armes à deux mains</em>, <em>Défense</em>).</li>\n<li><strong>Niveau 1 : Maîtrise d'armes (Weapon Masteries).</strong> Vous pouvez utiliser les propriétés de maîtrise de 3 armes de votre choix.</li>\n<li><strong>Niveau 2 : Sursaut d'activité (Action Surge).</strong> Une fois par repos long, vous pouvez effectuer une action supplémentaire durant votre tour.</li>\n<li><strong>Niveau 3 : Sous-classe de Guerrier.</strong> Vous choisissez votre archétype martial (ex: <em>Champion</em>).</li>\n<li><strong>Niveau 4 : Don (Feat).</strong> Vous augmentez une caractéristique de +2 (ou deux de +1) ou choisissez un don spécial.</li>\n<li><strong>Niveau 5 : Attaque supplémentaire.</strong> Vous pouvez attaquer deux fois (au lieu d'une) chaque fois que vous effectuez l'action Attaquer durant votre tour.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "subclass-champion",
    "title": "Champion",
    "category": "regle",
    "aliases": [
      "champion",
      "guerrier champion"
    ],
    "tags": [
      "Sous-classes",
      "Guerrier",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-sub-cha-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Archétype Martial : Champion</h3>\n<p>Le Champion se concentre sur le développement de la puissance physique pure et de l'efficacité brute des attaques. Il s'entraîne sans relâche pour perfectionner ses gestes et terrasser ses adversaires en trouvant leurs faiblesses vitales.</p>"
      },
      {
        "id": "b-sub-cha-feats",
        "type": "text",
        "title": "Capacités du Champion",
        "content": "<h3>Capacités d'archétype martial</h3>\n<ul>\n<li><strong>Niveau 3 : Critique amélioré (Improved Critical).</strong> Vos jets d'attaque avec une arme obtiennent un coup critique sur un résultat de 19 ou 20 sur le d20.</li>\n<li><strong>Niveau 3 : Athlète remarquable.</strong> Vous gagnez l'avantage sur les tests de Force (Athlétisme) et Dextérité (Acrobaties). De plus, votre distance de saut en longueur augmente d'un nombre de mètres égal à votre modificateur de Force.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "class-second-souffle",
    "title": "Second Souffle",
    "category": "regle",
    "aliases": [
      "second souffle",
      "second wind"
    ],
    "tags": [
      "Capacités",
      "Guerrier",
      "Combat",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cl-sec-sou-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Second Souffle (Second Wind)</h3>\n<p>Vous puisez dans une réserve d'endurance limitée pour vous protéger des blessures.</p>\n<p>Au niveau 1, vous pouvez utiliser une <strong>action bonus</strong> pour regagner un nombre de points de vie égal à <strong>1d10 + votre niveau de guerrier</strong>.</p>\n<p>Vous disposez de 2 utilisations de cette capacité par repos long (ou repos court selon les configurations).</p>"
      }
    ]
  },
  {
    "id": "class-sursaut-activite",
    "title": "Sursaut d'activité",
    "category": "regle",
    "aliases": [
      "sursaut d'activité",
      "sursaut d'activite",
      "action surge"
    ],
    "tags": [
      "Capacités",
      "Guerrier",
      "Combat",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-cl-sur-act-desc",
        "type": "text",
        "title": "Sursaut d'activité (Action Surge)",
        "content": "<h3>Sursaut d'activité (Action Surge)</h3>\n<p>Vous pouvez vous pousser temporairement au-delà de vos limites normales.</p>\n<p>Durant votre tour, vous pouvez effectuer **une action supplémentaire** en plus de votre action normale et de votre action bonus.</p>\n<p>Une fois que vous avez utilisé cette capacité, vous devez terminer un **repos long** ou un **repos court** pour pouvoir l'utiliser à nouveau.</p>"
      }
    ]
  },
  {
    "id": "class-roublard",
    "title": "Roublard",
    "category": "regle",
    "aliases": ["roublard", "voleur", "rogue"],
    "tags": ["Classes", "Combat", "Dextérité"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-cl-rou-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Compétence, furtivité et coups bas</h3>\n<p>Les roublards comptent sur leur ruse, leur agilité et leur connaissance des faiblesses de leurs adversaires pour l'emporter. Ils excellent dans le crochetage de serrures, la désactivation de pièges, la discrétion et le vol à la tire.</p>\n<p>En combat, ils évitent les affrontements directs, préférant frapper par surprise avec leur redoutable Attaque sournoise.</p>"
      },
      {
        "id": "b-cl-rou-1",
        "type": "class",
        "title": "Données techniques de classe",
        "content": "{\"hitDie\":\"1d8\",\"primaryAbilities\":[\"Dextérité\"],\"saves\":[\"Dextérité\",\"Intelligence\"],\"armorProficiencies\":[\"Armures légères\"],\"weaponMastery\":true,\"subclasses\":[{\"name\":\"Voleur\",\"description\":\"Grimpe plus vite, utilise des objets par action bonus.\"},{\"name\":\"Voleur arcanique (Arcane Trickster)\",\"description\":\"Combine la ruse du roublard et les illusions magiques d'un magicien.\"}],\"description\":\"Maîtres de la discrétion et des compétences techniques. Le roublard inflige des dégâts massifs grâce à son Attaque sournoise et se déplace avec agilité grâce à son Action rusée.\"}"
      },
      {
        "id": "b-cl-rou-prog",
        "type": "text",
        "title": "Progression de niveau (1 à 5)",
        "content": "<h3>Capacités du Roublard (Niveaux 1 à 5)</h3>\n<ul>\n<li><strong>Niveau 1 : Attaque sournoise.</strong> Vous infligez des dégâts supplémentaires (1d6 au niveau 1, 2d6 au niveau 3, 3d6 au niveau 5) une fois par tour si vous attaquez avec l'avantage ou si un allié est proche de la cible.</li>\n<li><strong>Niveau 1 : Expertise.</strong> Vous doublez votre bonus de maîtrise sur deux compétences ou outils maîtrisés.</li>\n<li><strong>Niveau 2 : Action rusée (Cunning Action).</strong> Vous pouvez utiliser une action bonus à chacun de vos tours pour effectuer l'action Se cacher, Se désengager ou Courir.</li>\n<li><strong>Niveau 3 : Sous-classe de Roublard.</strong> Vous choisissez votre archétype (ex: <em>Voleur arcanique</em>).</li>\n<li><strong>Niveau 4 : Don.</strong> Vous augmentez une caractéristique ou choisissez un don spécial.</li>\n<li><strong>Niveau 5 : Esquive instinctive (Uncanny Dodge).</strong> Lorsque vous êtes touché par une attaque, vous pouvez utiliser votre réaction pour diviser les dégâts par deux.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "subclass-voleur-arcanique",
    "title": "Voleur arcanique",
    "category": "regle",
    "aliases": ["voleur arcanique", "arcane trickster"],
    "tags": ["Sous-classes", "Roublard", "Magie", "2024"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sub-arc-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Archétype de Roublard : Voleur arcanique</h3>\n<p>Le Voleur arcanique agrémente ses talents de roublard de sortilèges d'illusions et d'enchantement. Il utilise la magie pour tromper l'ennemi, se dissimuler ou manipuler des objets à distance à l'aide d'une version invisible du sort <em>Main de mage</em>.</p>"
      },
      {
        "id": "b-sub-arc-feats",
        "type": "text",
        "title": "Capacités de Voleur arcanique",
        "content": "<h3>Capacités d'archétype</h3>\n<ul>\n<li><strong>Niveau 3 : Incantation.</strong> Vous apprenez des tours de magie (dont <em>Main de mage</em>) et des sorts de niveau 1 de la liste de magicien. Votre caractéristique d'incantation est l'Intelligence.</li>\n<li><strong>Niveau 3 : Escamotage de Main de mage (Mage Hand Legerdemain).</strong> Lorsque vous lancez <em>Main de mage</em>, vous pouvez rendre la main spectrale invisible. Vous pouvez l'utiliser pour ranger/récupérer des objets, crocheter des serrures ou désamorcer des pièges à distance de 9 mètres, en utilisant l'action bonus de votre Action rusée.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "class-attaque-sournoise",
    "title": "Attaque sournoise",
    "category": "regle",
    "aliases": ["attaque sournoise", "sneak attack"],
    "tags": ["Capacités", "Roublard", "Combat", "2024"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-cl-att-sou-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Attaque sournoise (Sneak Attack)</h3>\n<p>Vous savez comment exploiter les distractions d'un adversaire pour frapper précisément là où ça fait mal.</p>\n<p>Une fois par tour, vous pouvez infliger <strong>1d6 dégâts supplémentaires</strong> (augmente à <strong>2d6</strong> au niveau 3, et <strong>3d6</strong> au niveau 5) à une créature que vous touchez avec une attaque si vous remplissez l'une des conditions suivantes :</p>\n<ul>\n<li>Vous avez l'<strong>avantage</strong> sur le jet d'attaque.</li>\n<li>Un autre ennemi de la cible (comme un de vos alliés) se trouve à moins de 1,5 mètre d'elle, n'est pas incapable, et vous n'avez pas de désavantage sur le jet d'attaque.</li>\n</ul>\n<p>L'attaque doit utiliser une arme de finesse ou une arme à distance.</p>"
      }
    ]
  },
  {
    "id": "class-action-rusee",
    "title": "Action rusée",
    "category": "regle",
    "aliases": ["action rusée", "action rusee", "cunning action"],
    "tags": ["Capacités", "Roublard", "Combat", "2024"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-cl-act-rus-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Action rusée (Cunning Action)</h3>\n<p>Votre esprit vif et votre agilité vous permettent de vous déplacer et d'agir rapidement.</p>\n<p>Vous pouvez utiliser une **action bonus** à chacun de vos tours en combat pour effectuer l'une des actions suivantes :</p>\n<ul>\n<li><strong>Courir (Dash) :</strong> Vous doublez votre vitesse pour le tour.</li>\n<li><strong>Se désengager (Disengage) :</strong> Vos mouvements ne provoquent pas d'attaques d'opportunité pour le reste du tour.</li>\n<li><strong>Se cacher (Hide) :</strong> Vous effectuez un test de Dextérité (Discrétion) pour vous dissimuler.</li>\n</ul>"
      }
    ]
  }
];
