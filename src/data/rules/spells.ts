import { WikiPage } from '../../types';

export const SPELLS_RULES: WikiPage[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // AGRANDISSEMENT / RAPETISSEMENT  (Niv. 2, pas de scaling utile au-delà — sort fixe)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-agrandissement",
    "title": "Agrandissement / Rapetissement",
    "category": "sort",
    "aliases": ["agrandissement", "rapetissement", "agrandissement/rapetissement", "enlarge reduce"],
    "tags": ["Sorts", "Transmutation", "Niveau 2"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-agr-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous modifiez la taille d'une créature ou d'un objet visible à portée. Choisissez l'effet :</p><p><strong>Agrandir :</strong> la cible double de taille dans toutes ses dimensions, son poids est multiplié par 8. Elle a l'avantage aux jets de sauvegarde de Force et aux tests de Force. Ses armes infligent 1d4 dégâts supplémentaires.</p><p><strong>Rapetisser :</strong> la cible diminue de moitié dans toutes ses dimensions, son poids est divisé par 8. Elle a le désavantage aux jets de sauvegarde de Force et aux tests de Force. Ses armes infligent 1d4 dégâts de moins.</p><p>Une créature non consentante effectue un jet de sauvegarde de Constitution. En cas de réussite, le sort n'a aucun effet.</p>"
      },
      {
        "id": "b-sp-agr-1",
        "type": "spell",
        "title": "Transmutation · Emplacement Niv. 2",
        "content": "{\"level\":2,\"school\":\"Transmutation\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"un morceau de fer\"},\"duration\":\"Concentration, jusqu'à 1 minute\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"\",\"description\":\"\",\"materialComponents\":[\"component-fer\"],\"states\":[\"cond-agrandi\",\"cond-rapetisse\"],\"damageDice\":[],\"saveRequired\":\"con\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // AIDE  (Niv. 2 → scale jusqu'au 9)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-aide",
    "title": "Aide",
    "category": "sort",
    "aliases": ["aide", "aid"],
    "tags": ["Sorts", "Abjuration", "Niveau 2"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-aid-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Votre sort renforce et soutient vos alliés en leur accordant une endurance magique temporaire.</p><p>Choisissez jusqu'à trois créatures à portée. Les points de vie maximum et actuels de chaque créature augmentent de 5 pour la durée du sort.</p><p>En utilisant un emplacement de sort de niveau supérieur, les points de vie augmentent de 5 supplémentaires par niveau au-delà du 2e.</p>"
      },
      {
        "id": "b-sp-aid-2",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 2",
        "content": "{\"level\":2,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"+5 PV max et actuels à 3 créatures\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      },
      {
        "id": "b-sp-aid-3",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 3",
        "content": "{\"level\":3,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"+10 PV max et actuels à 3 créatures\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      },
      {
        "id": "b-sp-aid-4",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 4",
        "content": "{\"level\":4,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"+15 PV max et actuels à 3 créatures\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      },
      {
        "id": "b-sp-aid-5",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 5",
        "content": "{\"level\":5,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"+20 PV max et actuels à 3 créatures\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      },
      {
        "id": "b-sp-aid-6",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 6",
        "content": "{\"level\":6,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"+25 PV max et actuels à 3 créatures\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      },
      {
        "id": "b-sp-aid-7",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 7",
        "content": "{\"level\":7,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"+30 PV max et actuels à 3 créatures\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      },
      {
        "id": "b-sp-aid-8",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 8",
        "content": "{\"level\":8,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"+35 PV max et actuels à 3 créatures\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      },
      {
        "id": "b-sp-aid-9",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 9",
        "content": "{\"level\":9,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"+40 PV max et actuels à 3 créatures\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ALARME  (Niv. 1 — rituel, pas de scaling)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-alarme",
    "title": "Alarme",
    "category": "sort",
    "aliases": ["alarme", "alarm"],
    "tags": ["Sorts", "Abjuration", "Niveau 1", "Rituel"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-ala-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous établissez une alarme contre les intrusions non désirées. Choisissez une porte, une fenêtre ou une zone au sol ne dépassant pas un cube de 6 mètres de côté.</p><p>L'alarme se déclenche dès qu'une créature de taille Très Petite ou plus pénètre dans la zone protégée sans prononcer le mot de passe que vous avez défini. Au déclenchement, vous pouvez choisir une alarme <strong>mentale</strong> (signal dans votre esprit vous réveillant) ou une alarme <strong>sonore</strong> (cloche audible à 18 mètres).</p>"
      },
      {
        "id": "b-sp-ala-1",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 1 · Rituel",
        "content": "{\"level\":1,\"school\":\"Abjuration\",\"castingTime\":\"1 minute (ou Rituel)\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une clochette et un fil d'argent\"},\"duration\":\"8 heures\",\"classes\":[\"Magicien\",\"Rôdeur\"],\"damageOrEffect\":\"Alerte sonore ou mentale en cas d'intrusion\",\"description\":\"\",\"materialComponents\":[\"component-clochette\",\"component-fil-argent\"],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"cube\",\"aoeRadius\":6}"
      }
    ]
  },

  {
    "id": "spell-alienation",
    "title": "Aliénation",
    "category": "sort",
    "aliases": ["aliénation", "alienation", "befuddlement"],
    "tags": ["Sorts", "Enchantement", "Niveau 8"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-ali-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous assaillez l'esprit d'une créature que vous pouvez voir à portée. La cible doit effectuer un jet de sauvegarde d'Intelligence.</p><p><strong>En cas d'échec :</strong> la cible subit <strong>10d12 dégâts psychiques</strong> et devient incapable de lancer des sorts ou de faire appel à l'action <strong>Magie</strong>.</p><p><strong>En cas de réussite :</strong> elle subit la moitié des dégâts seulement, et ne subit aucun effet secondaire.</p><p>À la fin de chaque période de 30 jours, la créature peut retenter son jet de sauvegarde pour mettre fin à l'effet. Les sortilèges <em>Restauration supérieure</em>, <em>Guérison</em> ou <em>Souhait</em> y mettent également fin.</p>"
      },
      {
        "id": "b-sp-ali-1",
        "type": "spell",
        "title": "Enchantement · Emplacement Niv. 8",
        "content": "{\"level\":8,\"school\":\"Enchantement\",\"castingTime\":\"1 action\",\"range\":\"45 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"un trousseau de clés sans clés\"},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Druide\",\"Ensorceleur\",\"Magicien\",\"Occultiste\"],\"damageOrEffect\":\"10d12 dégâts psychiques\",\"description\":\"\",\"materialComponents\":[\"component-trousseau-de-cles\"],\"states\":[],\"damageDice\":[{\"count\":10,\"die\":12,\"damageType\":\"psychique\"}],\"saveRequired\":\"int\",\"saveEffect\":\"half\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ALLIÉ PLANAIRE  (Niv. 6 — pas de scaling)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-allie-planaire",
    "title": "Allié planaire",
    "category": "sort",
    "aliases": ["allié planaire", "allie planaire", "planar ally"],
    "tags": ["Sorts", "Conjuration", "Niveau 6"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-pla-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous implorez l'assistance d'une entité d'un autre plan dont vous connaissez le nom. L'entité envoie un céleste, un élémentaire ou un fiélon accomplir votre requête.</p><p>Vous devez proposer un tribut (un service, un objet ou des PO) en échange de son aide. Plus la tâche est dangereuse ou longue, plus le tribut doit être conséquent. L'entité peut refuser si la tâche lui semble contraire à sa nature.</p>"
      },
      {
        "id": "b-sp-pla-1",
        "type": "spell",
        "title": "Conjuration · Emplacement Niv. 6",
        "content": "{\"level\":6,\"school\":\"Conjuration\",\"castingTime\":\"10 minutes\",\"range\":\"18 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Clerc\"],\"damageOrEffect\":\"Invoque un serviteur extra-planaire contre tribut\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ANTIDÉTECTION  (Niv. 3 — pas de scaling)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-antidetection",
    "title": "Antidétection",
    "category": "sort",
    "aliases": ["antidétection", "antidetection", "nondetection"],
    "tags": ["Sorts", "Abjuration", "Niveau 3"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-ant-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous cachez une créature ou un objet que vous touchez contre les sorts de divination magique pour la durée du sort.</p><p>La cible ne peut être perçue par des capteurs de divination magiques (boule de cristal, œil de guet) ni par les sorts de scrutation comme <em>Localisation de créature</em> ou <em>Scrutation</em>.</p>"
      },
      {
        "id": "b-sp-ant-1",
        "type": "spell",
        "title": "Abjuration · Emplacement Niv. 3",
        "content": "{\"level\":3,\"school\":\"Abjuration\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"poudre de diamant d'une valeur de 25 po\"},\"duration\":\"8 heures\",\"classes\":[\"Barde\",\"Magicien\",\"Rôdeur\"],\"damageOrEffect\":\"Immunité contre les capteurs et sorts de divination\",\"description\":\"\",\"materialComponents\":[\"component-poussiere-diamant\"],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // THAUMATURGIE  (Tour de magie — pas de scaling)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-thaumaturgie",
    "title": "Thaumaturgie",
    "category": "sort",
    "aliases": ["thaumaturgie", "thaumaturgy"],
    "tags": ["Sorts", "Transmutation", "Tour de magie"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-thau-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous manifestez un signe mineur de puissance surnaturelle.</p><p>Vous créez l'un des effets magiques suivants dans un rayon de 9 mètres : faire trembler le sol, faire tonner votre voix, faire vaciller ou changer de couleur les flammes, faire claquer une porte non verrouillée, faire gronder le tonnerre ou modifier vos yeux de manière frappante. L'effet dure jusqu'à 1 minute.</p>"
      },
      {
        "id": "b-sp-thau-1",
        "type": "spell",
        "title": "Transmutation · Tour de magie",
        "content": "{\"level\":0,\"school\":\"Transmutation\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true},\"duration\":\"Jusqu'à 1 minute\",\"classes\":[\"Clerc\"],\"damageOrEffect\":\"Effets mineurs surnaturels (son, lumière, mouvement)\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MAINS BRÛLANTES  (Niv. 1 → scale jusqu'au 9 : +1d6 par niveau)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-mains-brulantes",
    "title": "Mains brûlantes",
    "category": "sort",
    "aliases": ["mains brûlantes", "mains brulantes", "burning hands"],
    "tags": ["Sorts", "Évocation", "Niveau 1"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-mains-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vos pouces se touchent et vos doigts sont écartés, formant un éventail. Un mince rideau de flammes surgit de vos doigts tendus.</p><p>Chaque créature dans un cône de 4,5 mètres doit effectuer un jet de sauvegarde de Dextérité. Une créature subit 3d6 dégâts de feu en cas d'échec, ou la moitié en cas de réussite. Les objets inflammables de la zone qui ne sont pas portés ou transportés prennent feu.</p><p><strong>Niveaux supérieurs :</strong> +1d6 dégâts de feu par niveau d'emplacement au-delà du 1er.</p>"
      },
      {
        "id": "b-sp-mains-1",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 1",
        "content": "{\"level\":1,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"3d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":3,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      },
      {
        "id": "b-sp-mains-2",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 2",
        "content": "{\"level\":2,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"4d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":4,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      },
      {
        "id": "b-sp-mains-3",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 3",
        "content": "{\"level\":3,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"5d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":5,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      },
      {
        "id": "b-sp-mains-4",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 4",
        "content": "{\"level\":4,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"6d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":6,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      },
      {
        "id": "b-sp-mains-5",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 5",
        "content": "{\"level\":5,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"7d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":7,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      },
      {
        "id": "b-sp-mains-6",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 6",
        "content": "{\"level\":6,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"8d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":8,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      },
      {
        "id": "b-sp-mains-7",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 7",
        "content": "{\"level\":7,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"9d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":9,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      },
      {
        "id": "b-sp-mains-8",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 8",
        "content": "{\"level\":8,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"10d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":10,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      },
      {
        "id": "b-sp-mains-9",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 9",
        "content": "{\"level\":9,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Personnelle\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"11d6 dégâts de feu\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[{\"count\":11,\"die\":6,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"cone\",\"aoeRadius\":4.5}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TÉNÈBRES  (Niv. 2 — pas de scaling officiel)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-tenebres",
    "title": "Ténèbres",
    "category": "sort",
    "aliases": ["ténèbres", "tenebres", "darkness"],
    "tags": ["Sorts", "Évocation", "Niveau 2"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-ten-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Des ténèbres magiques se répandent depuis un point de votre choix à portée, remplissant une sphère de 4,5 mètres de rayon jusqu'à la fin du sort.</p><p>La zone est plongée dans les ténèbres si profondes que la vision dans le noir ne permet pas de voir à travers. Aucune lumière non magique ne peut illuminer la zone, et si la zone de ténèbres chevauche une lumière magique, le sort qui créait cette lumière est annulé dans la zone de recouvrement.</p>"
      },
      {
        "id": "b-sp-ten-1",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 2",
        "content": "{\"level\":2,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"18 mètres\",\"components\":{\"v\":true,\"m\":\"fourrure de chauve-souris et poudre de jais\"},\"duration\":\"Concentration, jusqu'à 10 minutes\",\"classes\":[\"Magicien\",\"Occultiste\"],\"damageOrEffect\":\"Sphère de ténèbres magiques\",\"description\":\"\",\"materialComponents\":[\"component-fourrure-bat\",\"component-poudre-jais\"],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"sphere\",\"aoeRadius\":4.5}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN DE MAGE  (Tour de magie — pas de scaling)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-main-de-mage",
    "title": "Main de mage",
    "category": "sort",
    "aliases": ["main de mage", "mage hand"],
    "tags": ["Sorts", "Invocation", "Tour de magie"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-main-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Une main spectrale flottante apparaît au point que vous désignez à portée. La main dure jusqu'à la fin du sort.</p><p>Lorsque vous lancez ce sort, puis en utilisant une action à chacun de vos tours, vous pouvez déplacer la main et lui faire effectuer une des tâches suivantes : <strong>manipuler un objet</strong>, <strong>ouvrir une porte ou un récipient non verrouillé</strong>, <strong>ranger ou récupérer un objet</strong>, ou <strong>verser le contenu d'un flacon</strong>. La main ne peut soulever plus de 5 kg, ni attaquer, ni activer des objets magiques.</p>"
      },
      {
        "id": "b-sp-main-1",
        "type": "spell",
        "title": "Invocation · Tour de magie",
        "content": "{\"level\":0,\"school\":\"Invocation\",\"castingTime\":\"1 action\",\"range\":\"9 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"1 minute\",\"classes\":[\"Barde\",\"Magicien\",\"Occultiste\"],\"damageOrEffect\":\"Manipulation d'objets à distance (max 5 kg)\",\"description\":\"\",\"materialComponents\":[],\"states\":[],\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TRAIT DE FEU  (Tour de magie — scale aux niveaux 5, 11, 17)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-trait-de-feu",
    "title": "Trait de feu",
    "category": "sort",
    "aliases": ["trait de feu", "fire bolt"],
    "tags": ["Sorts", "Évocation", "Tour de magie"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-trait-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous projetez un trait de feu vers une créature ou un objet à portée. Effectuez un jet d'attaque de sort à distance. En cas de réussite, la cible subit des dégâts de feu.</p><p>Un objet inflammable touché par ce sort s'enflamme s'il n'est pas porté ou transporté. Les dégâts augmentent lorsque vous atteignez certains niveaux de personnage : <strong>2d10 au niveau 5</strong>, <strong>3d10 au niveau 11</strong>, et <strong>4d10 au niveau 17</strong>.</p>"
      },
      {
        "id": "b-sp-trait-1",
        "type": "spell",
        "title": "Évocation · Tour de magie · Niveaux 1–4",
        "content": "{\"level\":0,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"1d10 feu\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":10,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-trait-2",
        "type": "spell",
        "title": "Évocation · Tour de magie · Niveaux 5–10",
        "content": "{\"level\":0,\"scalingThreshold\":5,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"2d10 feu\",\"description\":\"\",\"damageDice\":[{\"count\":2,\"die\":10,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-trait-3",
        "type": "spell",
        "title": "Évocation · Tour de magie · Niveaux 11–16",
        "content": "{\"level\":0,\"scalingThreshold\":11,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"3d10 feu\",\"description\":\"\",\"damageDice\":[{\"count\":3,\"die\":10,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-trait-4",
        "type": "spell",
        "title": "Évocation · Tour de magie · Niveaux 17–20",
        "content": "{\"level\":0,\"scalingThreshold\":17,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"4d10 feu\",\"description\":\"\",\"damageDice\":[{\"count\":4,\"die\":10,\"damageType\":\"feu\",\"modifier\":\"\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SOINS  (Niv. 1 → scale jusqu'au 9 : +2d8 par niveau)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-soins",
    "title": "Soins",
    "category": "sort",
    "aliases": ["soins", "soin des blessures", "cure wounds"],
    "tags": ["Sorts", "Évocation", "Niveau 1"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-soin-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Une créature que vous touchez récupère un nombre de points de vie égal à <strong>2d8 + votre modificateur de caractéristique d'incantation</strong>.</p><p><strong>Niveaux supérieurs :</strong> +2d8 de soins par niveau d'emplacement au-delà du 1er.</p>"
      },
      {
        "id": "b-sp-soin-1",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 1",
        "content": "{\"level\":1,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"2d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":2,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-soin-2",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 2",
        "content": "{\"level\":2,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"4d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":4,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-soin-3",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 3",
        "content": "{\"level\":3,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"6d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":6,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-soin-4",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 4",
        "content": "{\"level\":4,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"8d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":8,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-soin-5",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 5",
        "content": "{\"level\":5,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"10d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":10,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-soin-6",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 6",
        "content": "{\"level\":6,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"12d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":12,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-soin-7",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 7",
        "content": "{\"level\":7,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"14d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":14,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-soin-8",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 8",
        "content": "{\"level\":8,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"16d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":16,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-soin-9",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 9",
        "content": "{\"level\":9,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Barde\",\"Clerc\",\"Druide\",\"Paladin\",\"Rôdeur\"],\"damageOrEffect\":\"18d8 + mod de sort\",\"description\":\"\",\"damageDice\":[{\"count\":18,\"die\":8,\"damageType\":\"soin\",\"modifier\":\"+mod\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PROJECTILE MAGIQUE  (Niv. 1 → scale : +1 projectile par niveau)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-projectile-magique",
    "title": "Projectile magique",
    "category": "sort",
    "aliases": ["projectile magique", "projectiles magiques", "magic missile"],
    "tags": ["Sorts", "Évocation", "Niveau 1"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-proj-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous créez trois dards de force magique. Chaque dard frappe une créature de votre choix visible à portée. Un dard inflige <strong>1d4 + 1 dégâts de force</strong>. Les dards frappent tous simultanément ; vous pouvez les diriger sur une seule ou plusieurs créatures.</p><p>Ce sort ne nécessite pas de jet d'attaque : les dards frappent automatiquement.</p><p><strong>Niveaux supérieurs :</strong> +1 dard par niveau d'emplacement au-delà du 1er.</p>"
      },
      {
        "id": "b-sp-proj-1",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 1",
        "content": "{\"level\":1,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"3 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×3 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-proj-2",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 2",
        "content": "{\"level\":2,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"4 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×4 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-proj-3",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 3",
        "content": "{\"level\":3,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"5 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×5 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-proj-4",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 4",
        "content": "{\"level\":4,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"6 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×6 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-proj-5",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 5",
        "content": "{\"level\":5,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"7 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×7 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-proj-6",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 6",
        "content": "{\"level\":6,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"8 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×8 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-proj-7",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 7",
        "content": "{\"level\":7,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"9 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×9 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-proj-8",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 8",
        "content": "{\"level\":8,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"10 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×10 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      },
      {
        "id": "b-sp-proj-9",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 9",
        "content": "{\"level\":9,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"36 mètres\",\"components\":{\"v\":true,\"s\":true},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"11 × (1d4 + 1) dégâts de force\",\"description\":\"\",\"damageDice\":[{\"count\":1,\"die\":4,\"damageType\":\"force\",\"modifier\":\"+1 (×11 projectiles)\"}],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[],\"states\":[]}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BOULE DE FEU  (Niv. 3 → scale : +1d6 par niveau)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-boule-de-feu",
    "title": "Boule de feu",
    "category": "sort",
    "aliases": ["boule de feu", "fireball"],
    "tags": ["Sorts", "Évocation", "Niveau 3"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-boule-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Un trait incandescent jaillit de votre doigt pointé vers un point que vous désignez à portée, puis il explose dans un grondement sourd en une déflagration de flammes.</p><p>Chaque créature dans une sphère de 6 mètres de rayon centrée sur ce point doit effectuer un jet de sauvegarde de Dextérité. Elle subit <strong>8d6 dégâts de feu</strong> en cas d'échec, ou la moitié en cas de réussite. Le feu contourne les angles. Il embrase les objets inflammables de la zone qui ne sont pas portés ou transportés.</p><p><strong>Niveaux supérieurs :</strong> +1d6 dégâts de feu par niveau d'emplacement au-delà du 3e.</p>"
      },
      {
        "id": "b-sp-boule-3",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 3",
        "content": "{\"level\":3,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"45 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une boulette de fiente de chauve-souris et du soufre\"},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"8d6 dégâts de feu\",\"description\":\"\",\"damageDice\":[{\"count\":8,\"die\":6,\"damageType\":\"feu\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"sphere\",\"aoeRadius\":6,\"materialComponents\":[\"component-fiente-chauve-souris\",\"component-soufre\"],\"states\":[]}"
      },
      {
        "id": "b-sp-boule-4",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 4",
        "content": "{\"level\":4,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"45 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une boulette de fiente de chauve-souris et du soufre\"},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"9d6 dégâts de feu\",\"description\":\"\",\"damageDice\":[{\"count\":9,\"die\":6,\"damageType\":\"feu\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"sphere\",\"aoeRadius\":6,\"materialComponents\":[\"component-fiente-chauve-souris\",\"component-soufre\"],\"states\":[]}"
      },
      {
        "id": "b-sp-boule-5",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 5",
        "content": "{\"level\":5,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"45 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une boulette de fiente de chauve-souris et du soufre\"},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"10d6 dégâts de feu\",\"description\":\"\",\"damageDice\":[{\"count\":10,\"die\":6,\"damageType\":\"feu\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"sphere\",\"aoeRadius\":6,\"materialComponents\":[\"component-fiente-chauve-souris\",\"component-soufre\"],\"states\":[]}"
      },
      {
        "id": "b-sp-boule-6",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 6",
        "content": "{\"level\":6,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"45 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une boulette de fiente de chauve-souris et du soufre\"},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"11d6 dégâts de feu\",\"description\":\"\",\"damageDice\":[{\"count\":11,\"die\":6,\"damageType\":\"feu\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"sphere\",\"aoeRadius\":6,\"materialComponents\":[\"component-fiente-chauve-souris\",\"component-soufre\"],\"states\":[]}"
      },
      {
        "id": "b-sp-boule-7",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 7",
        "content": "{\"level\":7,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"45 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une boulette de fiente de chauve-souris et du soufre\"},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"12d6 dégâts de feu\",\"description\":\"\",\"damageDice\":[{\"count\":12,\"die\":6,\"damageType\":\"feu\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"sphere\",\"aoeRadius\":6,\"materialComponents\":[\"component-fiente-chauve-souris\",\"component-soufre\"],\"states\":[]}"
      },
      {
        "id": "b-sp-boule-8",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 8",
        "content": "{\"level\":8,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"45 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une boulette de fiente de chauve-souris et du soufre\"},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"13d6 dégâts de feu\",\"description\":\"\",\"damageDice\":[{\"count\":13,\"die\":6,\"damageType\":\"feu\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"sphere\",\"aoeRadius\":6,\"materialComponents\":[\"component-fiente-chauve-souris\",\"component-soufre\"],\"states\":[]}"
      },
      {
        "id": "b-sp-boule-9",
        "type": "spell",
        "title": "Évocation · Emplacement Niv. 9",
        "content": "{\"level\":9,\"school\":\"Évocation\",\"castingTime\":\"1 action\",\"range\":\"45 mètres\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une boulette de fiente de chauve-souris et du soufre\"},\"duration\":\"Instantanée\",\"classes\":[\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"14d6 dégâts de feu\",\"description\":\"\",\"damageDice\":[{\"count\":14,\"die\":6,\"damageType\":\"feu\"}],\"saveRequired\":\"dex\",\"saveEffect\":\"half\",\"aoeType\":\"sphere\",\"aoeRadius\":6,\"materialComponents\":[\"component-fiente-chauve-souris\",\"component-soufre\"],\"states\":[]}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // INVISIBILITÉ  (Niv. 2 → scale : +1 cible par niveau supérieur)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-invisibilite",
    "title": "Invisibilité",
    "category": "sort",
    "aliases": ["invisibilité", "invisibilite", "invisibility"],
    "tags": ["Sorts", "Illusion", "Niveau 2"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-inv-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Une créature que vous touchez devient invisible jusqu'à la fin du sort. Tout ce qu'elle porte ou transporte est invisible tant qu'elle le garde sur elle.</p><p>Le sort prend fin prématurément pour une cible si elle effectue une <strong>attaque</strong> ou lance un <strong>sort</strong>.</p><p><strong>Niveaux supérieurs :</strong> vous pouvez cibler une créature supplémentaire par niveau d'emplacement au-delà du 2e.</p>"
      },
      {
        "id": "b-sp-inv-2",
        "type": "spell",
        "title": "Illusion · Emplacement Niv. 2",
        "content": "{\"level\":2,\"school\":\"Illusion\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une pincée de poudre de cils recouverte de gomme arabique\"},\"duration\":\"Concentration, jusqu'à 1 heure\",\"classes\":[\"Barde\",\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"1 créature invisible (annulé si attaque/sort)\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-cils-gomme\"],\"states\":[\"cond-invisible\"]}"
      },
      {
        "id": "b-sp-inv-3",
        "type": "spell",
        "title": "Illusion · Emplacement Niv. 3",
        "content": "{\"level\":3,\"school\":\"Illusion\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une pincée de poudre de cils recouverte de gomme arabique\"},\"duration\":\"Concentration, jusqu'à 1 heure\",\"classes\":[\"Barde\",\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"2 créatures invisibles\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-cils-gomme\"],\"states\":[\"cond-invisible\"]}"
      },
      {
        "id": "b-sp-inv-4",
        "type": "spell",
        "title": "Illusion · Emplacement Niv. 4",
        "content": "{\"level\":4,\"school\":\"Illusion\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une pincée de poudre de cils recouverte de gomme arabique\"},\"duration\":\"Concentration, jusqu'à 1 heure\",\"classes\":[\"Barde\",\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"3 créatures invisibles\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-cils-gomme\"],\"states\":[\"cond-invisible\"]}"
      },
      {
        "id": "b-sp-inv-5",
        "type": "spell",
        "title": "Illusion · Emplacement Niv. 5",
        "content": "{\"level\":5,\"school\":\"Illusion\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une pincée de poudre de cils recouverte de gomme arabique\"},\"duration\":\"Concentration, jusqu'à 1 heure\",\"classes\":[\"Barde\",\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"4 créatures invisibles\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-cils-gomme\"],\"states\":[\"cond-invisible\"]}"
      },
      {
        "id": "b-sp-inv-6",
        "type": "spell",
        "title": "Illusion · Emplacement Niv. 6",
        "content": "{\"level\":6,\"school\":\"Illusion\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une pincée de poudre de cils recouverte de gomme arabique\"},\"duration\":\"Concentration, jusqu'à 1 heure\",\"classes\":[\"Barde\",\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"5 créatures invisibles\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-cils-gomme\"],\"states\":[\"cond-invisible\"]}"
      },
      {
        "id": "b-sp-inv-7",
        "type": "spell",
        "title": "Illusion · Emplacement Niv. 7",
        "content": "{\"level\":7,\"school\":\"Illusion\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une pincée de poudre de cils recouverte de gomme arabique\"},\"duration\":\"Concentration, jusqu'à 1 heure\",\"classes\":[\"Barde\",\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"6 créatures invisibles\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-cils-gomme\"],\"states\":[\"cond-invisible\"]}"
      },
      {
        "id": "b-sp-inv-8",
        "type": "spell",
        "title": "Illusion · Emplacement Niv. 8",
        "content": "{\"level\":8,\"school\":\"Illusion\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une pincée de poudre de cils recouverte de gomme arabique\"},\"duration\":\"Concentration, jusqu'à 1 heure\",\"classes\":[\"Barde\",\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"7 créatures invisibles\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-cils-gomme\"],\"states\":[\"cond-invisible\"]}"
      },
      {
        "id": "b-sp-inv-9",
        "type": "spell",
        "title": "Illusion · Emplacement Niv. 9",
        "content": "{\"level\":9,\"school\":\"Illusion\",\"castingTime\":\"1 action\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"une pincée de poudre de cils recouverte de gomme arabique\"},\"duration\":\"Concentration, jusqu'à 1 heure\",\"classes\":[\"Barde\",\"Ensorceleur\",\"Magicien\"],\"damageOrEffect\":\"8 créatures invisibles\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-cils-gomme\"],\"states\":[\"cond-invisible\"]}"
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RAPPEL À LA VIE  (Niv. 5 — Raise Dead, pas de scaling significatif)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    "id": "spell-rappel-a-la-vie",
    "title": "Rappel à la vie",
    "category": "sort",
    "aliases": ["rappel à la vie", "rappel a la vie", "raise dead"],
    "tags": ["Sorts", "Nécromancie", "Niveau 5"],
    "relations": [],
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "blocks": [
      {
        "id": "b-sp-rap-desc",
        "type": "text",
        "title": "Description",
        "content": "<p>Vous ramenez à la vie une créature décédée depuis moins de 10 jours. Si l'âme de la créature est libre et consentante, elle revient à la vie avec <strong>1 point de vie</strong>.</p><p>Ce sort neutralise les poisons et maladies qui l'auraient frappée au moment de sa mort, mais ne reconstitue pas les membres ou parties du corps manquants.</p><p>Revenir des morts est une épreuve traumatisante. La cible subit un malus de -4 à ses jets d'attaque, jets de sauvegarde et tests de caractéristique. Chaque fois qu'elle termine un repos long, le malus diminue de 1 jusqu'à disparaître.</p>"
      },
      {
        "id": "b-sp-rap-1",
        "type": "spell",
        "title": "Nécromancie · Emplacement Niv. 5",
        "content": "{\"level\":5,\"school\":\"Nécromancie\",\"castingTime\":\"1 heure\",\"range\":\"Contact\",\"components\":{\"v\":true,\"s\":true,\"m\":\"un diamant d'une valeur minimale de 500 po, consommé par le sort\"},\"duration\":\"Instantanée\",\"classes\":[\"Clerc\",\"Paladin\"],\"damageOrEffect\":\"Ressuscite une créature morte depuis ≤ 10 jours à 1 PV\",\"description\":\"\",\"damageDice\":[],\"saveRequired\":\"none\",\"saveEffect\":\"none\",\"aoeType\":\"none\",\"aoeRadius\":0,\"materialComponents\":[\"component-diamant\"],\"states\":[]}"
      }
    ]
  }
];
