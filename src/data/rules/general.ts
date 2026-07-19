import { WikiPage } from '../../types';

export const GENERAL_RULES: WikiPage[] = [
  {
    id: "rule-spells",
    title: "Règles : Sorts",
    category: "regle",
    aliases: ["règles de magie", "règles : sorts", "magie", "spellcasting rules"],
    tags: ["Règles", "Magie", "Incantation"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-rule-spells-params",
        type: "general_rule",
        title: "Configuration de la Magie (D&D 2024)",
        content: JSON.stringify({
          ruleType: "spells",
          magicSystem: "slots",
          concentrationRule: true,
          spellRecovery: "long_rest",
          hpRecovery: "long_rest",
          maxLevel: 20,
          multiclassing: "allowed",
          encumbranceRule: "classic",
          weaponMasteriesEnabled: true,
          startingLanguages: "Commun",
          asiRule: "free",
          description: "Règles régissant l'incantation des sortilèges et les emplacements de sorts."
        })
      },
      {
        id: "b-rule-spells-desc",
        type: "text",
        title: "Règles d'Incantation",
        content: `<h3>Acquisition et Préparation</h3>
<p>Avant de pouvoir lancer un sort, celui-ci doit être préparé dans votre esprit ou accessible par le biais d'un objet magique (parchemin, baguette). Chaque classe d'incantateur possède ses propres règles pour préparer ses sorts (après un repos long pour le Clerc et le Magicien, ou en gagnant un niveau pour le Barde et l'Ensorceleur).</p>
<h3>Temps d'incantation</h3>
<p>La plupart des sorts nécessitent <strong>1 action</strong> pour être lancés, mais certains utilisent <strong>1 action bonus</strong>, une <strong>réaction</strong>, ou un temps plus long (rituels de 10 minutes).</p>
<h3>Composantes</h3>
<ul>
<li><strong>Verbales (V) :</strong> Des paroles incantatoires prononcées d'une voix ferme.</li>
<li><strong>Somatiques (S) :</strong> Des gestes précis de la main. Requiert au moins une main libre.</li>
<li><strong>Matérielles (M) :</strong> Un composant physique requis, qui peut être remplacé par un focaliseur d'incantation (sauf si un coût en pièces d'or est indiqué).</li>
</ul>
<h3>Concentration</h3>
<p>Certains sorts nécessitent de maintenir votre concentration pour rester actifs. Subir des dégâts requiert un jet de sauvegarde de Constitution (DD 10 ou la moitié des dégâts subis) pour ne pas perdre le sort. Lancer un autre sort nécessitant de la concentration y met également fin.</p>`
      }
    ]
  },
  {
    id: "rule-classes",
    title: "Règles : Classes",
    category: "regle",
    aliases: ["classes", "règles : classes", "multiclassage"],
    tags: ["Règles", "Classes", "Progression"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-rule-classes-params",
        type: "general_rule",
        title: "Configuration de la Progression & Classes",
        content: JSON.stringify({
          ruleType: "classes",
          magicSystem: "slots",
          concentrationRule: true,
          spellRecovery: "long_rest",
          hpRecovery: "long_rest",
          maxLevel: 20,
          multiclassing: "allowed",
          encumbranceRule: "classic",
          weaponMasteriesEnabled: true,
          startingLanguages: "Commun",
          asiRule: "free",
          description: "Règles pour la progression des classes, le niveau maximum et le multiclassage."
        })
      },
      {
        id: "b-rule-classes-desc",
        type: "text",
        title: "Règles des Classes",
        content: `<h3>Points de Vie et Dés de Vie</h3>
<p>Chaque classe détermine le <strong>Dé de vie</strong> du personnage (ex: 1d6 pour le Magicien, 1d10 pour le Guerrier, 1d12 pour le Barbare). Ce dé sert à calculer les points de vie max à la création et à chaque passage de niveau, ainsi qu'à récupérer des PV lors d'un repos court.</p>
<h3>Bonus de Maîtrise</h3>
<p>Le bonus de maîtrise commence à <strong>+2</strong> au niveau 1 et progresse uniformément pour toutes les classes jusqu'à <strong>+6</strong> au niveau 17.</p>
<h3>Sous-classes</h3>
<p>Chaque classe permet de choisir une spécialisation (sous-classe) à un niveau précis (le niveau 3 par défaut pour toutes les classes dans les règles de 2024).</p>
<h3>Multiclassage</h3>
<p>Permet de combiner des niveaux dans plusieurs classes si vous remplissez les conditions de caractéristiques minimales requis (généralement 13 dans les caractéristiques principales des classes concernées).</p>`
      }
    ]
  },
  {
    id: "rule-races",
    title: "Règles : Races",
    category: "regle",
    aliases: ["races", "espèces", "règles : races", "traits raciaux"],
    tags: ["Règles", "Races", "Personnages"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-rule-races-params",
        type: "general_rule",
        title: "Configuration des Races / Espèces",
        content: JSON.stringify({
          ruleType: "races",
          magicSystem: "slots",
          concentrationRule: true,
          spellRecovery: "long_rest",
          hpRecovery: "long_rest",
          maxLevel: 20,
          multiclassing: "allowed",
          encumbranceRule: "classic",
          weaponMasteriesEnabled: true,
          startingLanguages: "Commun + 1 langue au choix",
          asiRule: "free",
          description: "Règles régissant la sélection de la race, la taille, la vitesse et l'attribution des caractéristiques."
        })
      },
      {
        id: "b-rule-races-desc",
        type: "text",
        title: "Règles des Races (Espèces)",
        content: `<h3>Races et Traits</h3>
<p>Le choix de la race définit les capacités physiques innées de votre personnage. Chaque race propose :</p>
<ul>
<li><strong>Une taille :</strong> Moyenne (humain, elfe) ou Petite (halfelin, gnome).</li>
<li><strong>Une vitesse au sol :</strong> Exprimée en mètres (généralement 9 mètres par tour, soit 30 feet).</li>
<li><strong>Des traits uniques :</strong> Vision dans le noir, résistances à des types de dégâts (ex: le poison pour le Nain), ou des dons innés (comme la chance pour le Halfelin).</li>
</ul>
<h3>Changement Majeur 2024</h3>
<p>Dans les règles D&D 2024, les augmentations de caractéristiques (ASI) ne sont plus dictées par votre race mais sont entièrement transférées à votre <strong>Origine (Historique)</strong>. Les langues de départ recommandées sont également simplifiées.</p>`
      }
    ]
  },
  {
    id: "rule-origins",
    title: "Règles : Origines",
    category: "regle",
    aliases: ["origines", "historique", "background", "règles : origines"],
    tags: ["Règles", "Origines", "Création"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-rule-origins-params",
        type: "general_rule",
        title: "Configuration des Origines (Historiques)",
        content: JSON.stringify({
          ruleType: "origins",
          magicSystem: "slots",
          concentrationRule: true,
          spellRecovery: "long_rest",
          hpRecovery: "long_rest",
          maxLevel: 20,
          multiclassing: "allowed",
          encumbranceRule: "classic",
          weaponMasteriesEnabled: true,
          startingLanguages: "Commun",
          asiRule: "free",
          description: "Règles pour la création des origines, l'attribution des dons d'origine gratuits et des caractéristiques."
        })
      },
      {
        id: "b-rule-origins-desc",
        type: "text",
        title: "Règles d'Origine",
        content: `<h3>Structure d'une Origine</h3>
<p>L'Origine (ou Historique) définit le passé de votre personnage avant qu'il ne devienne aventurier. Dans D&D 2024, l'Origine est essentielle et détermine :</p>
<ul>
<li><strong>Ajustements de Caractéristiques :</strong> Un bonus de +2 et +1 (ou trois bonus de +1) à répartir parmi trois caractéristiques recommandées.</li>
<li><strong>Maîtrise de Compétences :</strong> Deux compétences maîtrisées de départ.</li>
<li><strong>Don d'Origine :</strong> Un don gratuit de niveau 1 (ex: <em>Alerte</em>, <em>Béni</em>, <em>Coriace</em>, etc.).</li>
<li><strong>Équipement & Or :</strong> Un paquetage d'équipement thématique et un pécule de pièces d'or de départ.</li>
</ul>`
      }
    ]
  },
  {
    id: "rule-equipment",
    title: "Règles : Équipements",
    category: "regle",
    aliases: ["équipement", "armes", "armures", "règles : équipement", "encombrement"],
    tags: ["Règles", "Équipement", "Objets"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-rule-equipment-params",
        type: "general_rule",
        title: "Configuration de l'Équipement & Encombrement",
        content: JSON.stringify({
          ruleType: "equipment",
          magicSystem: "slots",
          concentrationRule: true,
          spellRecovery: "long_rest",
          hpRecovery: "long_rest",
          maxLevel: 20,
          multiclassing: "allowed",
          encumbranceRule: "classic",
          weaponMasteriesEnabled: true,
          startingLanguages: "Commun",
          asiRule: "free",
          description: "Règles sur l'encombrement physique (kg/livres), les devises monétaires et les maîtrises d'armes."
        })
      },
      {
        id: "b-rule-equipment-desc",
        type: "text",
        title: "Règles d'Équipement",
        content: `<h3>Armes et Propriétés</h3>
<p>Les armes se divisent en <strong>Armes courantes</strong> et <strong>Armes de guerre</strong>. Elles possèdent des propriétés influençant leur maniement : <em>Finesse</em> (permet d'utiliser la Dextérité), <em>Lourde</em>, <em>À deux mains</em>, ou <em>Portée</em>.</p>
<h3>Maîtrise des Armes (Weapon Mastery)</h3>
<p>Nouveauté D&D 2024 : Certaines classes (Guerrier, Barbare, etc.) débloquent des maîtrises d'armes spécifiques permettant de déclencher des effets tactiques uniques lors d'une attaque réussie (ex: <em>Cleave</em>, <em>Push</em>, <em>Topple</em>).</p>
<h3>Armures</h3>
<p>Les armures sont classées en Légères, Intermédiaires et Lourdes. Les armures lourdes suppriment le bonus de Dextérité à la CA et peuvent imposer un désavantage aux tests de Discrétion.</p>
<h3>Encombrement</h3>
<p>La règle standard d'encombrement limite le poids total que vous pouvez porter à <strong>15 fois votre valeur de Force</strong> (en livres/kg). Porter au-delà de cette limite réduit votre vitesse.</p>`
      }
    ]
  },
  {
    id: "rule-combat",
    title: "Règles : Combat & États",
    category: "regle",
    aliases: ["combat", "états", "conditions", "règles : combat", "tour", "action"],
    tags: ["Règles", "Combat", "Conditions"],
    relations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "b-rule-combat-params",
        type: "general_rule",
        title: "Configuration du Combat & Conditions",
        content: JSON.stringify({
          ruleType: "combat",
          magicSystem: "slots",
          concentrationRule: true,
          spellRecovery: "long_rest",
          hpRecovery: "long_rest",
          maxLevel: 20,
          multiclassing: "allowed",
          encumbranceRule: "classic",
          weaponMasteriesEnabled: true,
          startingLanguages: "Commun",
          asiRule: "free",
          description: "Règles régissant l'ordre de combat, les actions principales et l'application des états."
        })
      },
      {
        id: "b-rule-combat-desc",
        type: "text",
        title: "Déroulement du Combat & Conditions",
        content: `<h3>Structure d'un Tour</h3>
<p>Le combat se déroule en rounds successifs de 6 secondes. À chaque tour, une créature peut effectuer :</p>
<ul>
<li><strong>1 Déplacement :</strong> Se déplacer d'une distance maximale égale à sa vitesse.</li>
<li><strong>1 Action :</strong> Attaquer, lancer un sort, foncer (Dash), se désengager (Disengage), esquiver (Dodge), ou utiliser un objet.</li>
<li><strong>1 Action bonus :</strong> Si une capacité ou un sort le permet spécifiquement.</li>
<li><strong>1 Réaction :</strong> Déclenchée par un événement extérieur (ex: attaque d'opportunité).</li>
</ul>
<h3>Jet de Sauvegarde contre la Mort</h3>
<p>À 0 PV, une créature commence à faire des jets de sauvegarde contre la mort (DD 10). 3 succès stabilisent la cible, 3 échecs provoquent sa mort.</p>
<h3>États (Conditions)</h3>
<p>Les états altèrent les capacités de combat d'une cible (ex: <em>Invisible</em>, <em>À terre</em>, <em>Inconscient</em>, <em>Empoisonné</em>). Ils s'appliquent jusqu'à ce qu'un effet ou un jet de sauvegarde réussi y mette fin.</p>`
      }
    ]
  }
];
