import { WikiPage } from '../../types';

export const SPECIES_RULES: WikiPage[] = [
  {
    "id": "species-humain",
    "title": "Humain",
    "category": "regle",
    "aliases": [
      "humain",
      "humaine"
    ],
    "tags": [
      "Espèces",
      "Races",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-sp-hum-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Adaptabilité et ambition sans limites</h3>\n<p>Les humains sont les plus jeunes des races communes, mais aussi les plus adaptables et ambitieux. Leurs cultures varient énormément d'une région à l'autre, et leurs royaumes s'étendent sur toute la surface du monde.</p>\n<p>Là où les elfes ou les nains peaufinent un savoir sur des siècles, les humains innovent rapidement, bâtissant des empires et accumulant des connaissances en l'espace d'une seule génération. Leur soif d'aventure et de gloire est légendaire.</p>\n<h4>Noms Humains</h4>\n<ul>\n<li><strong>Noms masculins :</strong> Anton, Brand, Connor, Daran, Edric, Garret, Jason, Kendal, Lothar.</li>\n<li><strong>Noms féminins :</strong> Althea, Clara, Elyse, Gwendolyn, Kaelen, Maeve, Rowan, Sanna, Vesper.</li>\n</ul>"
      },
      {
        "id": "b-sp-hum-1",
        "type": "species",
        "title": "Données techniques d'espèce",
        "content": "{\"size\":\"Moyenne\",\"speed\":9,\"traits\":[{\"name\":\"Inspiration Héroïque\",\"description\":\"Vous commencez chaque journée d'aventure (après un repos long) avec l'Inspiration Héroïque en poche, vous permettant de relancer n'importe quel jet de D20.\"},{\"name\":\"Don d'Origine gratuit\",\"description\":\"Vous gagnez un don d'origine supplémentaire de votre choix au niveau 1 (ex : Alerte, Initié à la magie).\"},{\"name\":\"Compétence polyvalente\",\"description\":\"Vous gagnez la maîtrise d'une compétence de votre choix.\"}]}"
      }
    ]
  },
  {
    "id": "species-elfe",
    "title": "Elfe",
    "category": "regle",
    "aliases": [
      "elfe",
      "elfique",
      "haut-elfe"
    ],
    "tags": [
      "Espèces",
      "Races",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-sp-elf-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Grâce et magie sylvestre</h3>\n<p>Les elfes sont un peuple magique d'une grâce surnaturelle, vivant dans des cités sylvestres ou des tours d'ivoire au cœur de forêts anciennes. Ils aiment l'art, la poésie, la musique, et les belles choses de la nature.</p>\n<p>Dotés d'une espérance de vie pouvant dépasser 700 ans, ils contemplent le monde avec un certain recul historique. Leur héritage magique remonte au Feywild (Féerie), ce qui leur accorde des sens aiguisés et une immunité aux sommeils profonds.</p>\n<h4>Noms Elfes</h4>\n<ul>\n<li><strong>Noms masculins :</strong> Adran, Aramil, Carric, Eradan, Ivellios, Laucian, Mindartis, Soveliss.</li>\n<li><strong>Noms féminins :</strong> Adrie, Althaea, Bethrynna, Diancastra, Keyleth, Leshanna, Mialee, Shava.</li>\n<li><strong>Noms de famille :</strong> Amastacia (Fleur-étoile), Galanodel (Clair de lune), Meliamne (Feuille-d'or).</li>\n</ul>"
      },
      {
        "id": "b-sp-elf-1",
        "type": "species",
        "title": "Données techniques d'espèce",
        "content": "{\"size\":\"Moyenne\",\"speed\":9,\"traits\":[{\"name\":\"Vision dans le noir\",\"description\":\"Vous pouvez voir dans la pénombre à 18 mètres comme s'il s'agissait de lumière vive, et dans le noir complet comme dans la pénombre.\"},{\"name\":\"Ascendances féeriques (Haut-Elfe, Elfe des Bois, Drow)\",\"description\":\"Sélectionnez un héritage au niveau 1 : Haut-Elfe (1 tour de magie bonus), Elfe des Bois (vitesse 10,5m et sort Grand pas), Drow (vision supérieure 36m et sort Lumières dansantes).\"},{\"name\":\"Transe\",\"description\":\"Vous n'avez pas besoin de dormir. Un repos long ne vous prend que 4 heures de méditation active.\"}]}"
      }
    ]
  },
  {
    "id": "species-nain",
    "title": "Nain",
    "category": "regle",
    "aliases": [
      "nain",
      "naine",
      "dwarf"
    ],
    "tags": [
      "Espèces",
      "Races",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-sp-nai-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Créatures de la terre et de la pierre</h3>\n<p>Fiers, robustes et courageux, les nains sont connus comme d'habiles guerriers, mineurs et travailleurs de la pierre et du métal. Bien qu'ils mesurent moins d'un mètre cinquante, ils sont si larges et denses qu'ils pèsent autant que des humains.</p>\n<p>Leur courage et leur endurance leur permettent de rivaliser avec n'importe quelle créature plus grande qu'eux. Ils vouent un respect absolu à leurs ancêtres et à leur clan, et chérissent les métaux précieux et les bijoux artisanaux.</p>\n<h4>Noms Nains</h4>\n<ul>\n<li><strong>Noms masculins :</strong> Balendin, Brottor, Eberk, Einkil, Oskar, Rurik, Taklinn, Veit.</li>\n<li><strong>Noms féminins :</strong> Amber, Artin, Audhild, Dagnal, Gunnloda, Hlin, Kristryd, Torbera.</li>\n<li><strong>Noms de clans :</strong> Balderk, Battlehammer, Brawnanvil, Dankil, Fireforge, Frostbeard.</li>\n</ul>"
      },
      {
        "id": "b-sp-nai-1",
        "type": "species",
        "title": "Données techniques d'espèce",
        "content": "{\"size\":\"Moyenne\",\"speed\":9,\"traits\":[{\"name\":\"Robustesse Naine\",\"description\":\"Votre maximum de points de vie augmente de 1, et augmente de 1 à chaque fois que vous gagnez un niveau.\"},{\"name\":\"Résilience Naine\",\"description\":\"Vous avez l'avantage sur les jets de sauvegarde contre le poison, et la résistance aux dégâts de poison.\"},{\"name\":\"Sens de la Pierre\",\"description\":\"Par une action bonus, vous gagnez la vision des vibrations à 18 mètres lorsque vous touchez une surface en pierre.\"}]}"
      }
    ]
  },
  {
    "id": "trait-resistance-poisons",
    "title": "Résistance aux poisons",
    "category": "regle",
    "aliases": [
      "résistance aux poisons",
      "dwarven resilience",
      "resilience naine"
    ],
    "tags": [
      "Traits",
      "Dons",
      "Races",
      "Nain",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-tr-res-poi-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Résistance aux poisons (Poison Resilience)</h3>\n<p>Grâce à votre constitution naine robuste, vous possédez une résistance innée aux substances toxiques.</p>\n<ul>\n<li>Vous avez l'<strong>avantage</strong> sur les jets de sauvegarde pour éviter ou mettre fin à l'état <strong>Empoisonné</strong>.</li>\n<li>Vous avez la <strong>résistance</strong> aux dégâts de poison.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "trait-maitrise-armes-naines",
    "title": "Maîtrise des armes naines",
    "category": "regle",
    "aliases": [
      "maîtrise des armes naines",
      "dwarven combat training"
    ],
    "tags": [
      "Traits",
      "Dons",
      "Races",
      "Nain",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-tr-mai-arm-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Maîtrise des armes naines (Dwarven Combat Training)</h3>\n<p>Vous maîtrisez le maniement de la hachette, de la hache de bataille, du marteau léger et du marteau de guerre. Cet entraînement militaire traditionnel fait partie de l'éducation de chaque nain.</p>"
      }
    ]
  },
  {
    "id": "trait-robustesse-naine",
    "title": "Robustesse naine",
    "category": "regle",
    "aliases": [
      "robustesse naine",
      "dwarven toughness"
    ],
    "tags": [
      "Traits",
      "Dons",
      "Races",
      "Nain",
      "2024"
    ],
    "relations": [],
    "createdAt": "2026-07-13T17:46:06.615Z",
    "updatedAt": "2026-07-13T17:46:06.615Z",
    "blocks": [
      {
        "id": "b-tr-rob-nai-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Robustesse naine (Dwarven Toughness)</h3>\n<p>Votre maximum de points de vie augmente de 1, et il augmente de 1 supplémentaire chaque fois que vous gagnez un niveau.</p>"
      }
    ]
  },
  {
    "id": "species-tieffelin",
    "title": "Tieffelin",
    "category": "regle",
    "aliases": ["tieffelin", "tieffeline", "tiefling"],
    "tags": ["Espèces", "Races", "2024"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-tief-desc",
        "type": "text",
        "title": "Description & Lore",
        "content": "<h3>Héritage des plans inférieurs</h3>\n<p>Les tieffelins partagent un héritage commun lié aux fiélons des plans inférieurs. Leurs cornes, leurs queues pointues et leurs yeux solides révèlent leur nature ésotérique.</p>\n<p>Souvent victimes de préjugés injustes, ils possèdent néanmoins une volonté de fer et une résilience magique innée liée aux forges infernales.</p>"
      },
      {
        "id": "b-sp-tief-1",
        "type": "species",
        "title": "Données techniques d'espèce",
        "content": "{\"size\":\"Moyenne\",\"speed\":9,\"traits\":[{\"name\":\"Vision dans le noir\",\"description\":\"Vous pouvez voir dans la pénombre à 18 mètres comme s'il s'agissait de lumière vive, et dans le noir complet comme dans la pénombre.\"},{\"name\":\"Résistance infernale\",\"description\":\"Vous possédez la résistance aux dégâts de feu.\"},{\"name\":\"Ascendance infernale\",\"description\":\"Vous connaissez le tour de magie Thaumaturgie. Au niveau 3, vous pouvez lancer Mains brûlantes une fois par repos long. Au niveau 5, vous pouvez lancer Ténèbres une fois par repos long (Intelligence ou Charisme comme caractéristique d'incantation).\"}]}"
      }
    ]
  },
  {
    "id": "trait-resistance-infernale",
    "title": "Résistance infernale",
    "category": "regle",
    "aliases": ["résistance infernale", "fiendish resistance"],
    "tags": ["Traits", "Dons", "Races", "Tieffelin", "2024"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-tr-res-inf-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Résistance infernale</h3>\n<p>Grâce à votre sang fiélon, vous possédez une résistance naturelle aux flammes.</p>\n<ul>\n<li>Vous avez la <strong>résistance</strong> aux dégâts de feu.</li>\n</ul>"
      }
    ]
  },
  {
    "id": "trait-ascendance-infernale",
    "title": "Ascendance infernale",
    "category": "regle",
    "aliases": ["ascendance infernale", "infernal legacy"],
    "tags": ["Traits", "Dons", "Races", "Tieffelin", "2024"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-tr-asc-inf-desc",
        "type": "text",
        "title": "Description",
        "content": "<h3>Ascendance infernale (Infernal Legacy)</h3>\n<p>Votre lignée fiélonne vous octroie une étincelle de magie noire :</p>\n<ul>\n<li>Vous connaissez le tour de magie <strong>Thaumaturgie</strong>.</li>\n<li>À partir du niveau 3, vous pouvez lancer le sort <strong>Mains brûlantes</strong> (Burning Hands) au niveau 1. Vous devez terminer un repos long pour pouvoir le lancer de cette façon à nouveau.</li>\n<li>À partir du niveau 5, vous pouvez lancer le sort <strong>Ténèbres</strong> (Darkness). Vous devez terminer un repos long pour pouvoir le lancer de cette façon à nouveau.</li>\n<li>Votre caractéristique d'incantation pour ces sorts est l'Intelligence, la Sagesse ou le Charisme (au choix lors de la création).</li>\n</ul>"
      }
    ]
  }
];
