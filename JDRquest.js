// JSON Initialisation
var xhReq = new XMLHttpRequest();
// var eqptJSON = {};
var enemyJSON = {};
var persosJSON = {};
var pnjJSON = {};
var mapsJSON = {};

// CHATGPT_API Request :

// $.ajax({
//   url: "JDRlogin_chatgpt.php",
//   type: "get",
//   success: function (data) {

//   $('body').html(data);

// const apiKey = data;

const apiKey = "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";
const apiUrl = "https://api.openai.com/v1/chat/completions";

console.log(window.location.href);
if (window.location.href.includes("http")) {
  xhReq.open("GET", "./JDRskills.json" + "?" + new Date().getTime(), false);
  xhReq.send(null);

  enemyJSON = getData("enemy");

  //   eqptJSON = getData("eqpt");

  persosJSON = getData("persos");
  xhReq.open("GET", "./maps.json" + "?" + new Date().getTime(), false);
  xhReq.send(null);
  mapsJSON = JSON.parse(xhReq.responseText);

  pnjJSON = getData("pnj");
} else {
  pnjJSON = {
    1: {
      id: "M007",
      nom: "Jeune Enfant",
      race: "Humain",
      desc: "Un jeune garçon qui cherche à jouer et s'amuser.",
      lang: "Parle de façon familière voire vulgaire.",
    },
    2: {
      id: "M011",
      nom: "Torturran Herboriste",
      race: "Torturran",
      desc: "Un Torturran en recherche d'herbe médicinale.",
      lang: "Parle de façon courtoise et noble.",
    },
    3: {
      id: "M015",
      nom: "Drakai Démoniste",
      race: "Drakai",
      desc: "Un Drakai pratiquant la magie noire. Réalisant des rituels sombres.",
      lang: "Parle un peu mal, utilise des mots simples.",
    },
    4: {
      id: "M037",
      nom: "Anuran Clerc",
      race: "Anuran",
      desc: "Un Anuran prêt à aider les autres avec ses pouvoirs guerisseurs.",
      lang: "Parle avec beaucoup d'éloquence et est blagueur.",
    },
    5: {
      id: "M051",
      nom: "Zumi Guerrier",
      race: "Zumi",
      desc: "Un Zumi dévoué à défendre le peuple, amical et inventif.",
      lang: "Parle de façon amicale et simple.",
    },
    6: {
      id: "M125",
      nom: "Garde de la Ville",
      race: "Humain",
      desc: "Un garde dévoué à défendre le peuple.",
      lang: "Parle de façon professionnelle et sérieuse.",
    },
    7: {
      id: "M126",
      nom: "Garde de la Curie Métérole",
      race: "Humain",
      desc: "Un garde puissant et doué en magie de lumière, qui travaille pour l'église (la Curie Métérole), il travaille soit pour une unité défensive, soit d'expédition soit offensive. Son chef lui donne des instructions et son but est d'aider le peuple.",
      lang: "Parle de façon professionnelle et sérieuse.",
    },
    8: {
      id: "M127",
      nom: "Garde Heldentod",
      race: "Humain",
      desc: "Un garde qui travaille pour un empire nommé Heldentod, c'est un empire belliqueux qui recherche le pouvoir et la suprêmatie. Ils sont généralement peu commode et feront tout ce qu'ils peuvent pour atteindre leur objectif.",
      lang: "Parle de façon hautaine, directif et franc.",
    },
    9: {
      id: "M014",
      nom: "Ogre Solitaire",
      race: "Ogre",
      desc: "Un ogre pas commode et pas très gentil. Il parle mal, il s'exprime mal, et est parfois vulgaire",
      lang: "Parle mal, utilise des mots vulgaires et simples, fait des phrases courtes.",
    },
    10: {
      id: "M048",
      nom: "Zumi Ingénieur",
      race: "Zumi",
      desc: "Un Zumi ingénieur et très créatif. Il réalise de nombreuses inventions High Tech et adore la technologie.",
      lang: "Parle avec des mots savants, utilise des mots compliqués.",
    },
    11: {
      id: "M048b",
      nom: "Moymoy",
      race: "Zumi Androïd",
      desc: "Un Zumi Androïd créé de toute pièce. Il voyage avec Malvis, une jeune femme, et il la suit partout. Il est très intelligent et découvre le monde pour aider les gens. Moymoy parle comme un robot.",
      lang: "Parle comme un robot avec des mots techniques, utilise des mots compliqués.",
    },
  };

  mapsJSON = {
    1: {
      name: "Aven",
      wmap_x: 26.5,
      wmap_y: 64.9,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 2,
    },
    2: {
      name: "Monts Calcaires",
      wmap_x: 10.6,
      wmap_y: 69.2,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 7,
    },
    3: {
      name: "Colline tranquille",
      desc: "La Colline Tranquille se situe le long de la magnifique Côte Etoilée. Son emplacement en fait un important port d'attache pour de nombreux navires. Le port de Clochemer crée ainsi une économie florissante où l'on trouve toutes les dernières nouveautés ainsi que des objets rares. La vie quotidienne de la plupart des habitants est liée à la mer. Les spéciliatés culinaires de la ville attirent de nombreux touristes faisant prospérer l'économie de la région.",
      wmap_x: 17.6,
      wmap_y: 73.3,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 10,
    },
    4: {
      name: "Forêt Arc-en-Ciel",
      desc: "Les voyageurs se rendent à la Forêt Arc-en-Ciel pour ses magnifiques cascades et son hospitalité. L'eau y coule toute l'année, donnant l'impression que la montagne est enveloppée de soie. la brume qu'elle crée projette des arcs-en-ciel sur les rochers.\n De nombreuses cascades alimentent les eaux clair du lac Prismata autour duquel sont éparpillées les reliques d'une civilisation perdue, ce qui donne une aura mystérieuse à la forêt.",
      wmap_x: 16,
      wmap_y: 66.1,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 8,
    },
    5: {
      name: "Monts Arides",
      desc: "Le climat des Monts Arides est rude toute l'année. Seules les plantes les plus résistantes peuvent prendre racine dans ce sol sec. De féroces tempêtes de sable tournoient dans le paysage rocheux et des animaux féroces rendent la survie encore plus compliquée. \n La légende raconte qu'un dragon antique dort dans le désert et le chef de la ville Cenana pense qu'une grande civilisation vivait autrefois sous terre. Personne ne sait si ces légendes sont vraies.",
      wmap_x: 11.5,
      wmap_y: 60.7,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 11,
    },
    6: {
      name: "Baie Bélouga",
      desc: "Le Port Bélouga est tout aussi célèbre que le port de Clochemer à la Colline Tranquille. Comme il est entouré de falaises et sujet aux tempêtes, y accoster n'est pas toujours chose facile. Afin d'aider les bateaux à manoeuvrer en sécurité, la ville a fait construire un grand phare. \n De hauts murs encerclent la ville, la protégeant contre d'éventuelles attaques. Ils ont ainsi permis au port de continuer de prospérer même avec la présence de pirates et de bandits.",
      wmap_x: 16.9,
      wmap_y: 54,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 13,
    },
    7: {
      name: "Bourbes",
      desc: "Au fil du temps, les nombreuses sources de cette région l'ont transformée en une zone marécageuse. La mousse et le lichen envahissent tout, même les anciennes ruines qui s'y dressent.\n Un puissant magicien nommé Rumbledore y vit. Ses expériences ont créés une faune et une flore bien étrange.",
      wmap_x: 20.8,
      wmap_y: 48.8,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 9,
    },
    8: {
      name: "Vallée des Rois",
      desc: "Dans la luxuriante et prospère Vallée des Rois, cinq cascades alimentent un magnifique lac. Ce magnifique paysage attire de nombreux touristes. De nombreuses générations de grands rois d'Ezur y reposent, d'où le nom de la Vallée. Jardin est le nom de la ville de la Vallée des Rois. On y trouve de nombreuses statues et reliques de ces dirigeants du passé dans toute la région. Il n'est donc pas rare d'en trouver. Elle a beaucoup de valeur aux yeux de la Curie Métérole, c'est pourquoi elle a confiée sa protection aux Torturrans. Les Torturrans ce sont les plus aptes à garder et maîtriser les anciens secrets. Malgré cela, une faune et une flore très pestilentielle a aussi pris place dans la Vallée.",
      wmap_x: 12.9,
      wmap_y: 42.6,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 11,
    },
    9: {
      name: "Volcan Avila",
      desc: "Entourée de volcans, c'est une terre de feu et de flammes. Des cendres brûlantes virevoltent dans les airs et le sol y est rouge. Des marres de lave riches en soufre bouillonnent à la surface et rendent le sol si brûlant que personne n'ose y marcher pieds nus.\n Cela dit, les Tuskars (des hommes sangliers) ont réussi à y développer une civilisation florissante. Puissants et courageux, ils ont construit leur forteresse nommée Baltaroï, leur capitale près du cratère du volcan.",
      wmap_x: 28.3,
      wmap_y: 42.2,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 12,
    },
    10: {
      name: "Plaines Dorées",
      desc: "Surnom : Le carrefour verdoyant.\n\n\"Qu'il est bon de s'allonger dans l'herbe et de regarder le soleil passer au dessus des Plaines Dorées ! Cette immense plaine bénéficie de terres fertiles grâce au Volcan située à proximité, et baigne toute l'année dans une chaleur agréable.\n\nSituée en plus au carrefour de grandes routes, il paraît donc normal que les commerçants aient décidé d'y fonder une cité, où les appels des marchands se mélangent aux chants des ménestrels.\n\nDe grandes forteresses, au loin, rappellent les vestiges d'un temps inconnu des habitants actuels d'Ezur.\" (présentation provenant du jeu). \n\nZones et Donjons de la région\n\nIl y a quatre zones et deux donjons aux Plaines Dorées.\n\n\nZones\n\n    Orville\n    Le Mirage de Sam\n    Forêt Saken\n    Montée de Sana\n\nDonjons\n\n    Rêve du Maire (zone d'Orville)\n    Crocvenin (zone Montée de Sana)\n\nListes des Monstres\n\nMonstres simples :\n\n    Epineur vil (41)\n    Epineur acéré (41)\n    Scarabée-scorpion (41)\n    Scarabée-scorpion toxique (42)\n    Yak Tueur (42)\n    Taureau Enragé (42)\n    Taureau à Cornes de Roc (43)\n    Busard Epineux (43)\n    Rapaces à Crêtes (43)\n    Busard à Griffe Acéré (43)\n    Rapace Hachecrête (44)\n    Bandit Œil de Loup (44)\n    Soldat Œil de Loup (44)\n    Tueur Œil de Loup (44)\n    Docteur Œil de Loup (45)\n    Berseker Œil de Loup (45)\n\n\n    \"Reine Maudite des insectes\" Gilz (Boss monde)",
      wmap_x: 33.1,
      wmap_y: 52.1,
      wmap: 0,
      map_x: null,
      map_y: null,
      map_z: null,
      map_r: null,
      bgm: 7,
    },
  };

  enemyJSON = {
    1: {
      visuel3D: "m075",
      nom: "Sanglier Dentranchante",
      pvmax: "70",
      skills: [
        "Charge : fonce : 2D6+4 : force",
        "Morsure : mord : 1D10+4 : force",
        "",
        "",
      ],
      stats: "15,11,9,9,12",
      desc: "Sanglier brun vivant \u00e0 la Colline Tranquille",
      infos: "Faible au feu",
      drop: "80% Fourrure de sanglier X2, 40% D\u00e9fense de sanglier X1",
    },
    2: {
      visuel3D: "m015",
      nom: "Drakai d\u00e9moniste",
      pvmax: "60",
      skills: [
        "Rayon noir : 1D10 + 1D6 +5 devant,  intelligence",
        "Frappe t\u00e9n\u00e9breuse : 2D10+5 et peut parasiter (1D4 sur 3 tours) : force intelligence",
        "Possession d\u00e9moniaque : contr\u00f4le une personne : esprit",
        "",
      ],
      stats: "8,12,16,8,14",
      desc: "Drakai \u00e0 la peau violette en tenue de mage d\u00e9moniste",
      infos: "Faible au contondant, per\u00e7ant et lumi\u00e8res",
      drop: "30po, Robe \u00e9toil\u00e9e, rare : pendentif occulte",
    },
    3: {
      visuel3D: "m016",
      nom: "Guerrier Tuskar",
      pvmax: "85",
      skills: [
        "Charge : 1D10 +8 : force",
        "Coup de hache : 1D10 + 1D6 +7 : force",
        "Cri de guerre : d\u00e9g\u00e2t +3 a tlm pendant 4 tours",
        "",
      ],
      stats: "15,11,7,9,12",
      desc: "Guerrier Tuskar \u00e9quip\u00e9 de 2 haches",
      infos: "Faible au tranchant et au feu",
      drop: "20po, hache en acier, rare : Ceinture Tuskar",
    },
    4: {
      visuel3D: "m034",
      nom: "Ancien Garde",
      pvmax: "80",
      skills: [
        "Bras \u00e9tendu : 1D10 1D6 +5 : force",
        "Bras rayon : 2D10+5 : intelligence",
        "Autodestruction : 3D10+10 : esprit",
        "",
      ],
      stats: "14,10,14,9,12",
      desc: "Robot gardant la caverne de schiste",
      infos: "Faible \u00e0 la foudre et au per\u00e7ant",
      drop: "Noyau de Schiste",
    },
    5: {
      visuel3D: "m025",
      nom: "Champigno\u00efde Baga",
      pvmax: "55",
      skills: [
        "Coup de boule : 1D10+4 : force",
        "Spore : 1D6+4 AoE nature : intelligence",
        "",
        "",
      ],
      stats: "14,9,14,10,13",
      desc: "Petit champigno\u00efde rouge du Mont Calcaire",
      infos: "Faible au feu et \u00e0 la glace",
      drop: "Germe de champignon",
    },
    6: {
      visuel3D: "m086",
      nom: "Lutin des For\u00eats",
      pvmax: "55",
      skills: [
        "Poison : crache du poison : 1D6 et d\u00e9g\u00e2t pendant 3 tours : intelligence",
        "Coup de boule : 1D10+5 : force",
        "Racine claquante : 1D10+5 de zone : intelligence",
        "",
      ],
      stats: "12,12,15,11,12",
      desc: "Petit lutin tout rond et vert avec une feuille",
      infos: "Faible au feu et au per\u00e7ant",
      drop: "R\u00e9sidu de lutin",
    },
    7: {
      visuel3D: "m083",
      nom: "Crabe carapace de fer",
      pvmax: "65",
      skills: [
        "Coup de pince : 1D10 + 1D6 +5 : force",
        "Coup de carapace : 1D10+5 zone : force",
        "",
        "",
      ],
      stats: "17,9,9,12,14",
      desc: "Gros crabe vivant \u00e0 la Baie Belouga",
      infos: "Faible au contondant et glace",
      drop: "Carapace de crabe",
    },
    8: {
      visuel3D: "m037",
      nom: "Magicien Clerc Anuran",
      pvmax: "65",
      skills: [
        "Soin : 2D10+12 (+6 si besoin) : intelligence",
        "Bombe incendiaire : 1D10+8 : intelligence",
        "Affaib Mental : +4 d\u00e9g\u00e2ts magique subis \u00e0 la cible pendant 3 tours",
        "",
      ],
      stats: "9,9,17,12,14",
      desc: "Magicien Clerc du Culte D\u00e9moniaque",
      infos: "Tranchant et Per\u00e7ant",
      drop: "Anneau du rem\u00e8de",
    },
    9: {
      visuel3D: "m042",
      nom: "Sorcier Torturran",
      pvmax: "75",
      skills: [
        "Zone noire : 1D10+6 zone : malus dext\u00e9rit\u00e9 -2 pendant 3 tours : intelligence",
        "Stalactites de Glace : 1D10 +2D6 +6 : intelligence",
        "Coup de b\u00e2ton : 1D10+8 : force",
        "",
      ],
      stats: "11,7,16,9,13",
      desc: "Sorcier du Culte D\u00e9moniaque",
      infos: "Faible au Contondant et Lumi\u00e8res",
      drop: "Anneau de r\u00e9sistance",
    },
    10: {
      visuel3D: "m046",
      nom: "Guerrier Torturran",
      pvmax: "95",
      skills: [
        "Charge : 2D10+6 : force",
        "Frappe terrestre (avec marteau) : 1D10+8 AoE : force",
        "Mur de Titan : D\u00e9g\u00e2t re\u00e7us -4 (3 tours) : Esprit",
        "",
      ],
      stats: "16,9,8,8,14",
      desc: "Guerrier du Culte D\u00e9moniaque",
      infos: "Faible au feu et aux t\u00e9n\u00e8bres",
      drop: "Marteau de guerre",
    },
    11: {
      visuel3D: "m051",
      nom: "Assassin Zumi",
      pvmax: "70",
      skills: [
        "Griffe Ac\u00e9r\u00e9 : 1D10 +10 : force",
        "Griffe embras\u00e9 (charg\u00e9) : 2D10+8 : force esprit",
        "Furtivit\u00e9 : invisible",
        "",
      ],
      stats: "16,14,9,8,9",
      desc: "Petit Zumi sp\u00e9cialis\u00e9 dans l'assassinat",
      infos: "Faible \u00e0 la nature et au t\u00e9n\u00e8bres",
      drop: "Griffe du D\u00e9sert",
    },
    12: {
      visuel3D: "m024",
      nom: "Angel\u00e9e",
      pvmax: "60",
      skills: [
        "Stalactite : 1D10 + 1D6 + 1D4 +5 : intelligence",
        "Soin : 1D10 +7 : intelligence",
        "Coup de tentacule : 1D10 +7 : dext\u00e9rit\u00e9",
        "",
      ],
      stats: "9,12,16,9,12",
      desc: "Angel\u00e9e ros\u00e2tre vivant pr\u00e8s des baies",
      infos: "Faible au tranchant et foudre",
      drop: "R\u00e9sidu d'angel\u00e9e",
    },
    13: {
      visuel3D: "m087",
      nom: "Champigno\u00efde magique",
      pvmax: "65",
      skills: [
        "Stalactite : 1D10 + 1D6 + 1D4 +5 : intelligence",
        "Boule de feu : 1D10 +7 : intelligence",
        "Seisme : 1D10 +6 Aoe : Intelligence",
        "",
      ],
      stats: "9,12,16,9,12",
      desc: "Champigno\u00efde des bourbes, rempli de magie",
      infos: "Faible au contondant et \u00e0 la lumi\u00e8re",
      drop: "Germe de champignon, rare : Chapeau de champigno\u00efde",
    },
    14: {
      visuel3D: "m090",
      nom: "Esprit de l'Abysse",
      pvmax: "75",
      skills: [
        "Foudre noire : 1D10 +6 : intelligence",
        "Charge : 1D10 +8 : force",
        "Peur : peut stun 2 tours : esprit",
        "",
      ],
      stats: "13,8,15,8,14",
      desc: "Esprit tentaculaire cr\u00e9\u00e9 de magie noire",
      infos: "Faible au per\u00e7ant et \u00e0 la lumi\u00e8re",
      drop: "R\u00e9sidu d'esprit, rare : Noyau abyssal",
    },
    15: {
      visuel3D: "m104",
      nom: "Mante terrestre",
      pvmax: "75",
      skills: [
        "Coup de crochet : 1D10 +8 : dext\u00e9rit\u00e9",
        "Vague terrestre : 1D10 +6 AoE : force",
        "D\u00e9fense : d\u00e9g\u00e2t re\u00e7u -5 pendant 2 tours : esprit",
        "",
      ],
      stats: "15,14,8,9,12",
      desc: "Mantes s'engoufrant dans le sol ",
      infos: "Faible au feu et \u00e0 la glace",
      drop: "Rare : Crochet porte bonheur",
    },
    16: {
      visuel3D: "m103",
      nom: "Ver des sables",
      pvmax: "90",
      skills: [
        "Morsure : 2D10+6 : force",
        "S\u00e9isme : 1D10+6 AoE : force",
        "Souffle ralentissant : dext\u00e9-3 (3 tours): esprit",
        "",
      ],
      stats: "15,7,10,8,13",
      desc: "Ver vivant dans les sables et terres poussi\u00e9reuses",
      infos: "Faible au per\u00e7ant et aux t\u00e9n\u00e8bres",
      drop: "Peau de ver, rare : Ep\u00e9e odorante",
    },
    17: {
      visuel3D: "m124",
      nom: "Pirate aggressif",
      pvmax: "80",
      skills: [
        "Coup de flingue : 1D12 +10 : dext\u00e9rit\u00e9",
        "Esquive facile : (3 fois max) : dext\u00e9rit\u00e9",
        "Torche de feu : 1D10+8 AoE : intelligence",
        "",
      ],
      stats: "10,15,15,10,11",
      desc: "Pirate corsaire, grand marin",
      infos: "Faible \u00e0 la foudre et au contondant",
      drop: "Cache oeil de Pirate",
    },
    18: {
      visuel3D: "m123",
      nom: "Voleur avide",
      pvmax: "75",
      skills: [
        "Tranch\u00e9es aggressives : 2D8 +6 : force",
        "Embuscade : 1D10 +8 (X2 si discret) : dext\u00e9rit\u00e9",
        "Int\u00e9gration : Buff Aoe : Esquive +3 pendant 1D4+2 tours : esprit",
        "",
      ],
      stats: "11,14,10,10,13",
      desc: "Voleur ne pr\u00eatant sa confiance qu'\u00e0 lui-m\u00eame, avide et cupide",
      infos: "Faible \u00e0 la glace et au tranchant",
      drop: "Rare : Dague dent\u00e9e OU Ep\u00e9e de Pirate",
    },
    19: {
      visuel3D: "m158",
      nom: "Ma\u00eetre D\u00e9moniste",
      pvmax: "115",
      skills: [
        "Parasite Obscur : 7 d\u00e9g\u00e2ts *(3 tours) : intelligence",
        "Pacte : Invoque un Panopticor : esprit",
        "Fl\u00e8ches des Ombres : 1D10+9 et si parasite : soin 1D10+6 : intelligence",
        "Attaque Cauchemardesque : 3D10+8 (mais tue panopticor) : intelligence",
      ],
      stats: "9,13,16,8,14",
      desc: "Un grand ma\u00eetre d\u00e9moniste, plong\u00e9 dans des cultes sombres",
      infos: "Faible au tranchant et \u00e0 la lumi\u00e8re",
      drop: "B\u00e2ton mal\u00e9fique, Pendentif occulte, tr\u00e8s rare : Cape de sorcier",
    },
    20: {
      visuel3D: "m013",
      nom: "Guerrier Ursun",
      pvmax: "80",
      skills: [
        "Perce-Armure : 1D8+5 + d\u00e9g\u00e2t physique re\u00e7u +3 (3 tours) : force",
        "Charge : 2D8+5 : force",
        "Cri de guerre : d\u00e9g\u00e2t +4 a tlm pendant 3 tours",
        "",
      ],
      stats: "16,9,8,13,14",
      desc: "Ursun guerrier servant g\u00e9n\u00e9ralement une bonne cause",
      infos: "Faible \u00e0 la foudre et au per\u00e7ant",
      drop: "Plastron de garde, rare : Pendentif du Croc Brumeux",
    },
    21: {
      visuel3D: "m076",
      nom: "Tortue vaseuse",
      pvmax: "85",
      skills: [
        "Seisme : 1D8 +5 AoE : force",
        "Vase limitante : 1D6 +5 AoE (dext\u00e9-3 3tours) : intelligence",
        "Morsure : 1D10+7 : force",
        "",
      ],
      stats: "15,5,14,8,10",
      desc: "Grande tortue couleur turquoise",
      infos: "Faible au feu et tranchant",
      drop: "Carapace de torture. Rare : Pierre algue",
    },
    22: {
      visuel3D: "m077",
      nom: "Tortue terrestre",
      pvmax: "90",
      skills: [
        "Seisme : 1D8 +6 AoE : force",
        "Racine claquante : 1D10+6 de zone : intelligence",
        "Morsure : 1D10+8 : force",
        "R\u00e9g\u00e9n\u00e9ration terrestre : 1D10+6 AoE : intelligence",
      ],
      stats: "16,3,15,8,8",
      desc: "Grande tortue avec un arbre sur sa carapace",
      infos: "Faible au feu et \u00e0 la glace",
      drop: "Carapace de tortue. Rare : Anneau du rem\u00e8de",
    },
    23: {
      visuel3D: "m086",
      nom: "Lutin Runique",
      pvmax: "80",
      skills: [
        "Coup de boule : 1D10+4 : force",
        "Magie extr\u00eame : +1D4+4 magique \u00e0 tlm pour 3 tours : esprit",
        "Stalactites de Glace : 3D6 +6 : intelligence",
        "Bombe incendiaire : 1D10 +9 : intelligence",
      ],
      stats: "10,8,16,11,15",
      desc: "Petit dryade (farfadet) tout rond et bleu avec une feuille surplomb\u00e9 de magie",
      infos: "Faible au per\u00e7ant et \u00e0 la lumi\u00e8re",
      drop: "R\u00e9sidu de lutin*2, rare : noyau abyssal",
    },
    24: {
      visuel3D: "m087",
      nom: "Champigno\u00efde Mutant",
      pvmax: "110",
      skills: [
        "Attaque foudroyante : AoE 2D6 + 5 : intelligence",
        "Spore explosif (mono) : 2D8 +6 : intelligence",
        "Spore explosif (multi) : //",
        "Spore mutant : Invoque un mini champigno\u00efde (20 PV, charge 1D10 (D\u00e9 <13), explose \u00e0 la mort 1D10 AoE) : Esprit",
      ],
      stats: "9,7,16,6,14",
      desc: "Un grand champigno\u00efde vert/jaune translucide, cr\u00e9\u00e9 par des exp\u00e9riences",
      infos: "Faible \u00e0 la glace et \u00e0 la nature",
      drop: "Germe de champignon X3, Chapeau de champigno\u00efde, Rare : Fragment de Crystal d'Eden (soit 1/3) ",
    },
    25: {
      visuel3D: "m014",
      nom: "Ogre Solitaire",
      pvmax: "90",
      skills: [
        "Euphorie : +1D4 par coup. Buff pendant 4 tours (max 5) : esprit",
        "Attaque Cyclone : 1D10+7 : force",
        "Faiblesse Critique : 1D10 +8 (X2) : force",
        "",
      ],
      stats: "17,11,8,8,14",
      desc: "Ogre \u00e0 la peau rouge, tr\u00e8s aggressif",
      infos: "Faible \u00e0 la nature et aux t\u00e9n\u00e8bres",
      drop: "Plastron de garde, Rare : Hache D\u00e9fensive",
    },
    26: {
      visuel3D: "m010",
      nom: "Chasseur Anuran",
      pvmax: "65",
      skills: [
        "Triple Tir : 1D8 + 1D6 + 1D4 +6 : dext\u00e9rit\u00e9",
        "Tir de pr\u00e9cision : R\u00e9ussite +1, 1D8+7 (X2)",
        "Blessure Douloureuse : 1D8 +8 : l'emp\u00eache le soin pendant 3 tours : dext\u00e9rit\u00e9",
        "",
      ],
      stats: "11,16,11,13,10",
      desc: "Un Anuran \u00e0 la peau violette et au regard vif",
      infos: "Faible au contondant et \u00e0 la foudre",
      drop: "Rare : Veste d'aventurier OU/ET : Arc du Dresseur",
    },
    27: {
      visuel3D: "m071",
      nom: "Shaman Tuskar",
      pvmax: "75",
      skills: [
        "Totem Gracieux : 1D6 +5 pendant 6 tours (tous les 2 tours) : Intelligence",
        "Affaib Mental : +5 d\u00e9g\u00e2ts magique subis \u00e0 la cible pendant 3 tours : Esprit",
        "\u00c9clair en Furie : 1D8+1 : Intelligence",
        "",
      ],
      stats: "11,7,16,9,13",
      desc: "Un Tuskar avec une coiffe et une robe brune",
      infos: "Faible au tranchant et aux t\u00e9n\u00e8bres",
      drop: "Robe \u00e9toil\u00e9e OU Ceinture Tuskar, Rare : Anneau du rem\u00e8de",
    },
    28: {
      visuel3D: "m065",
      nom: "Chevalier Drakai",
      pvmax: "80",
      skills: [
        "Charge : 1D10 +8 : Force",
        "Vivacit\u00e9 Accrue : Esquive+3, Dext\u00e9rit\u00e9+3 \u00e0 la cible pendant 4 tours : Esprit",
        "Perc\u00e9e du Chevalier : 1D8 + 1D6 + 1D4 +6 : Dext\u00e9rit\u00e9",
        "",
      ],
      stats: "13,14,7,11,14",
      desc: "Un drakai \u00e0 la peau verte avec une armure mi l\u00e9g\u00e8re mi lourde",
      infos: "Faible au contondant et aux t\u00e9n\u00e8bres",
      drop: "Ep\u00e9e de chevalier, (tr\u00e8s) rare : Gilet des Dunes",
    },
    29: {
      visuel3D: "m072",
      nom: "Baram la Chim\u00e8re Volcanique",
      pvmax: "230",
      skills: [
        "Feu propageur : 1D12 +11 AoE : Intelligence",
        "Griffe de d\u00e9mon : 2D10 + 12 : Force",
        "Cri de Chim\u00e8re : d\u00e9g\u00e2t re\u00e7u +5 pendant 3 tours : Esprit",
        "Rayon de feu : 1D12 + 1D10 +13 (+5 si besoin) : Intel",
      ],
      stats: "16,13,15,14,14",
      desc: "BOSS : Une chim\u00e8re antique cr\u00e9\u00e9 \u00e0 l'\u00e9poque de la Grande Guerre",
      infos: "Faible \u00e0 la lumi\u00e8re et \u00e0 la glace",
      drop: "Griffe embras\u00e9e, Noyau abyssal, rare : Crystal de Baltaro\u00ef",
    },
    30: {
      visuel3D: "m096",
      nom: "Floraison f\u00e9tide",
      pvmax: "70",
      skills: [
        "Poison : AoE 1D8 +5 : intelligence",
        "Claque : 1D0+6 : force",
        "",
        "",
      ],
      stats: "14,11,15,8,8",
      desc: "Petite floraison verd\u00e2tre avec un chapeau",
      infos: "Faible au feu et per\u00e7ant",
      drop: "",
    },
    31: {
      visuel3D: "m070",
      nom: "Chasseur Tuskar",
      pvmax: "60",
      skills: [
        "Triple Tir : 1D8 + 1D6 + 1D4 +5 : Dext\u00e9rit\u00e9",
        "Blessure Douloureuse : 1D8 +7, et 0 soin sur 3 tours : Dext\u00e9rit\u00e9",
        "S\u00e9r\u00e9nit\u00e9 : Dext\u00e9+2, D\u00e9g\u00e2t subi -1D6 pendant 3 tours : Esprit",
        "",
      ],
      stats: "11,15,9,8,13",
      desc: "Tuskar \u00e0 la peau verte et au regard vif",
      infos: "Faible \u00e0 la foudre et aux t\u00e9n\u00e8bres",
      drop: "Arc B\u00e9louga ou (rare) Arc du Dresseur",
    },
    32: {
      visuel3D: "m080",
      nom: "Tyrannosaure Ecailles Roc",
      pvmax: "75",
      skills: [
        "Eclat de roche : 1D10+6 : force",
        "Fracassement terresstre : 1D8+5 AoE : force",
        "Cri de guerre : d\u00e9g\u00e2t +4 a tlm pendant 4 tours : esprit",
        "",
      ],
      stats: "17,11,10,8,13",
      desc: "Grand tyrannosaure avec des \u00e9cailles en rocher",
      infos: "Faible au contondant et \u00e0 la nature",
      drop: "Rocher \u00e9caille, Rare : Pierre de s\u00e9curit\u00e9",
    },
    33: {
      visuel3D: "m048",
      nom: "Ing\u00e9nieur Zumi",
      pvmax: "70",
      skills: [
        "Robotisation :  d\u00e9g\u00e2ts re\u00e7u -5, Toutes Stats-1, dure 5 tours",
        "Bombe \u00e0 huile : 1D10 +7 : Dext\u00e9rit\u00e9",
        "Explosifs Visqueux : 1D6 +6, d\u00e9placement/esquive tr\u00e8s r\u00e9duit : Dext\u00e9rit\u00e9",
        "Blessure Douloureuse : 1D8+7 (0 soin pendant 3 tours) : Dext\u00e9rit\u00e9",
      ],
      stats: "11,16,11,11,12",
      desc: "Ing\u00e9nieur Zumi \u00e0 lunettes, cultiv\u00e9 et malin",
      infos: "Faible \u00e0 la nature et \u00e0 la foudre",
      drop: "Fusil de guerre, rare : Crystal d'Asbi, tr\u00e8s rare : Puce \u00e9lectronique Silus",
    },
    34: {
      visuel3D: "m130",
      nom: "Femme Illusionniste",
      pvmax: "70",
      skills: [
        "Voile du blizzard : Rend invisible, pendant l'invisibilit\u00e9, bonus d'intelligence de 2 : Esprit",
        "Oeil Hypnotique : Les ennemis dans la zone cibl\u00e9e s'endorment : Intelligence",
        "Stalactites : 1D8 + 1D6 + 1D4 +6 : Intelligence ",
        "Affaib Mental : +5 d\u00e9g\u00e2ts magique subis \u00e0 la cible pendant 3 tours : Esprit",
      ],
      stats: "7,11,16,9,15",
      desc: "Femme \u00e0 lunettes, s\u00e9rieuse et strat\u00e8ge",
      infos: "Faible au tranchant et \u00e0 la lumi\u00e8re",
      drop: "10po Rare : B\u00e2ton d'Asbi",
    },
    35: {
      visuel3D: "m125",
      nom: "Garde de ville",
      pvmax: "75",
      skills: [
        "Charge : 1D10 +5 : force",
        "D\u00e9fense : d\u00e9g\u00e2t re\u00e7u -5 pendant 2 tours : esprit",
        "Coup de Lance/Epee : 1D10 +5 : dext\u00e9rit\u00e9",
        "",
      ],
      stats: "15,13,9,12,9",
      desc: "Garde de ville et village en armure",
      infos: "Faible au per\u00e7ant et \u00e0 la glace",
      drop: "10po Rare : Rapi\u00e8re de chevalier",
    },
    36: {
      visuel3D: "m135",
      nom: "Capitaine de ville",
      pvmax: "85",
      skills: [
        "Charge : 1D12 +7 : force",
        "D\u00e9fense : d\u00e9g\u00e2t re\u00e7u -7 pendant 3 tours : esprit",
        "Coup de Lance/Epee : 1D12 +7 : dext\u00e9rit\u00e9",
        "",
      ],
      stats: "16,13,9,12,9",
      desc: "Capitaine de ville et village en armure",
      infos: "Faible au tranchant et \u00e0 la glace",
      drop: "20po Rare : Ep\u00e9e des Plaines Dor\u00e9es",
    },
    37: {
      visuel3D: "m118",
      nom: "Rumbledore de Wish",
      pvmax: "150",
      skills: [
        "Temp\u00eate de Glace : 1D12 +7 : Intelligence",
        "Magie Extr\u00eame : Prochain d\u00e9g\u00e2t magique +1D10 +8 : Esprit",
        "M\u00e9ga Bombe Incendiaire : 2D10+8 : Intelligence",
        "Saut Dimensionnel : Intelligence",
      ],
      stats: "7,13,17,13,15",
      desc: "Grand magicien des bourbes",
      infos: "Faible au per\u00e7ant et \u00e0 la nature",
      drop: "On verra si \u00e7a arrive",
    },
    38: {
      visuel3D: "m017",
      nom: "Smilodon",
      pvmax: "90",
      skills: [
        "Morsure : 1D10 +6 : force",
        "Coup de griffe : 1D10 +6 : force",
        "Attaque tournoyante : 1D8+5 : dext\u00e9rit\u00e9",
        "",
      ],
      stats: "15,14,10,9,9",
      desc: "Tigre \u00e0 dent de sabre avec la peau rougeoyante et deux crocs ac\u00e9r\u00e9s",
      infos: "Faible \u00e0 la glace et au contondant",
      drop: "rare : Croc de Smilodon",
    },
    39: {
      visuel3D: "m053",
      nom: "Luminary Clerc Ursun",
      pvmax: "80",
      skills: [
        "Coupure noire : 3D6 +6 : Force",
        "Gu\u00e9rison : 2D6 +14 (+6 si besoin) : Intelligence",
        "Ch\u00e2timent Sacr\u00e9 : 1D10+7 : Intelligence",
        "",
      ],
      stats: "14,7,16,10,13",
      desc: "Ours bleu avec une armure assez lourde violette, combattant soigneur",
      infos: "Faible \u00e0 la foudre et au contondant",
      drop: "rare : Pendentif du Croc Brumeux, tr\u00e8s rare : Ep\u00e9e odorante",
    },
    40: {
      visuel3D: "m055",
      nom: "Assassin Ursun",
      pvmax: "85",
      skills: [
        "Griffe Ac\u00e9r\u00e9 : 1D10 +9 : force",
        "Cicatrice de l'esprit : 1D8+6 (retire buff) : force ",
        "Faiblesse Critique : 1D10 +9 (X2) : force",
        "",
      ],
      stats: "16,13,8,10,11",
      desc: "Ours vert gris avec de grands poings d'acier et une cuirasse",
      infos: "Faible \u00e0 la nature et \u00e0 la glace",
      drop: "rare : Pendentif du Croc Brumeux, tr\u00e8s rare : Crochet porte bonheur",
    },
    41: {
      visuel3D: "m092",
      nom: "Rapace \u00e0 Bec d'acier",
      pvmax: "75",
      skills: [
        "Pic pic : 2D8+5 : dext\u00e9rit\u00e9",
        "Coup de vent : 1D8+5 AoE : intelligence",
        "Coup de serre : 2D10+5 : force",
        "",
      ],
      stats: "13,15,14,9,9",
      desc: "Un aigle g\u00e9ant et brun avec un immense bec",
      infos: "Faible au feu et au per\u00e7ant",
      drop: "Bec imposant, rare : Plume brillante",
    },
    42: {
      visuel3D: "m311",
      nom: "Chevalier de la Curie (Lassar)",
      pvmax: "90",
      skills: [
        "Perc\u00e9e du Chevalier : 1D8 + 1D6 + 1D4 +6 : Dext\u00e9rit\u00e9",
        "Vivacit\u00e9 Accrue : Esquive+3, Dext\u00e9rit\u00e9+3 \u00e0 la cible pendant 4 tours : Esprit",
        "Perce-Armure : 1D8+5 + d\u00e9g\u00e2t physique re\u00e7u +4 (3 tours) : force",
        "D\u00e9fense : d\u00e9g\u00e2t re\u00e7u -5 pendant 3 tours : esprit",
      ],
      stats: "14,16,9,13,14",
      desc: "Chevalier tr\u00e8s noble de la Curie M\u00e9t\u00e9role",
      infos: "Faible aux t\u00e9n\u00e8bres et au per\u00e7ant",
      drop: "rare : Calice de la Curie M\u00e9t\u00e9role",
    },
    43: {
      visuel3D: "m097",
      nom: "Epineur ac\u00e9r\u00e9",
      pvmax: "80",
      skills: [
        "Racine claquante : 1D10+6 AoE : intelligence",
        "Coup d'\u00e9pine : 2D10+6 : force",
        "Bouclier d'\u00e9pines : D\u00e9g\u00e2t r\u00e9duit 4, d\u00e9g\u00e2t des piques 4 pendant 5 tours : intelligence",
        "",
      ],
      stats: "14,9,16,10,11",
      desc: "Fleur en forme de rosier, rose sur le somm\u00e9 et racines torsad\u00e9es piquantes",
      infos: "Faible au feu et \u00e0 la glace",
      drop: "Racine \u00e9pineuse, rare : huile de rose",
    },
    44: {
      visuel3D: "m105",
      nom: "Fourmilion du D\u00e9sert",
      pvmax: "85",
      skills: [
        "Vague terrestre : 1D10 +6 AoE : force",
        "Morsure : 2D10 +6 : force",
        "Crachat corrosif : 1D6+2 pendant 3 tours : intelligence",
        "",
      ],
      stats: "15,13,14,9,11",
      desc: "Fourmilion jaune et violet avec une morsure d'araign\u00e9e, et un dos pulpeux vert ",
      infos: "Faible \u00e0 la nature et au tranchant",
      drop: "Mucus de fourmillion, rare : Crochet porte bonheur",
    },
    45: {
      visuel3D: "m156",
      nom: "Templier de la Curie - Marma",
      pvmax: "150",
      skills: [
        "Euphorie : +1D4 (min 2) par coup. Buff pendant 4-5 tours (max 5) : esprit",
        "Lumi\u00e8re de Gu\u00e9rison : 2D10 +5, 1/4 de rejouer : intelligence",
        "Lumi\u00e8re Sacr\u00e9e : 2D10 +6 : intelligence",
        "Attaque tournoyante : 2D8 +3 : force",
      ],
      stats: "15,11,16,12,12",
      desc: "Templier de la Curie dans une armure noble, chef d'arm\u00e9e",
      infos: "Faible aux t\u00e9n\u00e8bres et \u00e0 la foudre",
      drop: "Calice de la Curie M\u00e9t\u00e9role, tr\u00e8s rare : Plastron de Templier",
    },
    46: {
      visuel3D: "voldre",
      nom: "Voldre",
      pvmax: "230",
      skills: [
        "Coupe Asura : 1D10 + (1D10)+12 : force",
        "Eclair Unique : 1D10 + (1D10) +16 : force",
        "Contr\u00f4le de l'esprit : Soin 4D8 +8, pendant 3 tours : dext\u00e9-4, r\u00e9sistance au stun (res esprit +4)",
        "Foi du temple : Esprit+3, D\u00e9g\u00e2t subi -1D6-6 pendant 4 tours : esprit",
      ],
      stats: "17,13,9,12,15",
      desc: "Zumi \u00e0 la peau bleue et aux yeux orang\u00e9 per\u00e7ant, fier et tr\u00e8s social",
      infos: "Faible \u00e0 la glace et au contondant",
      drop: "A voir !",
    },
    47: {
      visuel3D: "m201",
      nom: "Uvularia sauvage",
      pvmax: "70",
      skills: [
        "Poison : 1D6+6 AoE + 4 d\u00e9g\u00e2t pendant 3 tours : intelligence",
        "Charge : 1D10 +9 : force",
        "Poudre paralysante : AoE dext\u00e9-5 (3 tours) : esprit",
        "",
      ],
      stats: "13,8,15,8,14",
      desc: "Une fleur folle avec des fleurs au bout, aime se terrer dans le sol",
      infos: "Faible au feu et \u00e0 la lumi\u00e8re",
      drop: "P\u00e9tales de fleur folle",
    },
    48: {
      visuel3D: "m203",
      nom: "Mante Fatalame",
      pvmax: "80",
      skills: [
        "Coup de crochet : 1D10 +10 : dext\u00e9rit\u00e9",
        "Coup de corne : 2D10+10 : force",
        "Vivacit\u00e9 : Dext\u00e9+2 Esq+2 : Esprit",
        "",
      ],
      stats: "15,15,9,9,13",
      desc: "Mante verte avec plusieurs faucilles dans son dos",
      infos: "Faible au tranchant et \u00e0 la foudre",
      drop: "Crochet porte bonheur, rare : Ep\u00e9e odorante",
    },
    49: {
      visuel3D: "m215",
      nom: "Mante Cyclope",
      pvmax: "85",
      skills: [
        "Coup de crochet : 1D10 +10 : dext\u00e9rit\u00e9",
        "Fluide conducteur : 1D8 AoE+8 (malus dext\u00e9 3) : intelligence",
        "Croc de foudre : 1D10+12 : force",
        "",
      ],
      stats: "12,16,14,8,9",
      desc: "Mante turquoise pleine de magie, avec un abdomen translucide (bleu/vert)",
      infos: "Faible \u00e0 la nature et au contondant",
      drop: "Mucus magique, rare : Crochet enchant\u00e9",
    },
    50: {
      visuel3D: "m317",
      nom: "Nemelio",
      pvmax: "200",
      skills: [
        "Euphorie : +1D4 (min 2) par coup. Buff pendant 4 tours (max 5) : esprit",
        "Lumi\u00e8re de Gu\u00e9rison : 2D10 +5, 1/4 de rejouer : intelligence",
        "Lumi\u00e8re Sacr\u00e9e : 2D10 +8 : intelligence",
        "Attaque tournoyante : 2D8 +6 : force",
      ],
      stats: "16,11,15,12,12",
      desc: "Un Ezelin Templier d\u00e9chu de la Curie M\u00e9t\u00e9role, reconvertit en bandit",
      infos: "Faible \u00e0 la nature et au per\u00e7ant",
      drop: "rare: Plastron des plaines",
    },
    51: {
      visuel3D: "m073",
      nom: "Griffon Cendr\u00e9",
      pvmax: "80",
      skills: [
        "Projection de cendre : 1D10+6 AoE : Dext\u00e9-1 : Intelligence",
        "Coup de bec : 1D10+8 : Force",
        "Coup d'aile : 1D6+6 AoE : Dext\u00e9",
        "",
      ],
      stats: "13,15,15,9,9",
      desc: "Un griffon couleur grise, corps de lion, t\u00eate et serres d'aigles",
      infos: "Faible \u00e0 la glace et au per\u00e7ant",
      drop: "Bec d'aigle, rare : Peau de griffon",
    },
    52: {
      visuel3D: "m023",
      nom: "Crabe Volcanique",
      pvmax: "80",
      skills: [
        "D\u00e9fense d'acier : Blocage+3 sur 4 tours : Esprit",
        "Coup de pince : 1D10+9 : Force",
        "Attaque tournoyante : 1D10+6 AoE : Force",
        "",
      ],
      stats: "16,10,11,9,13",
      desc: "Crabe rouge robuste avec une carapace piquante (shellmon)",
      infos: "Faible \u00e0 la foudre et la lumi\u00e8re",
      drop: "Carapace de crabe, rare : Acier Volcanique",
    },
    53: {
      visuel3D: "m168",
      nom: "Cactus sauteur",
      pvmax: "80",
      skills: [
        "Bouclier d'\u00e9pines : D\u00e9g\u00e2t r\u00e9duit 4, d\u00e9g\u00e2t des piques 4 pendant 4 tours : intelligence",
        "Lanc\u00e9 d'\u00e9pines : 1D10+6 AoE : force",
        "Coup d'\u00e9pine : 1D10+8 : force",
        "",
      ],
      stats: "15,13,15,8,8",
      desc: "Cactus orang\u00e9 de taille moyenne",
      infos: "Faible au contondant et aux t\u00e9n\u00e8bres",
      drop: "Fruit de cactus, rare : \u00e9pines de cactus",
    },
    54: {
      visuel3D: "m048",
      nom: "Zumi M\u00e9canique - Douvone",
      pvmax: "180",
      skills: [
        "Robotisation : D\u00e9g\u00e2ts re\u00e7u  -2D4-2 (5 tours) : Esprit / R\u00e9paration Armure : 3D6+15 : Esprit",
        "Lavage de Cerveau : Blocage et r\u00e9ussite des sorts : -2 sur 4 tours : Esprit",
        "Artillerie Lourde : 3D6+14 : Dext\u00e9rit\u00e9",
        "Bombe \u00e0 Huile : 2D6+12 : Dext\u00e9rit\u00e9",
      ],
      stats: "11,16,9,10,17",
      desc: "Zumi m\u00e9canique en acier renforc\u00e9 gris/noir, tr\u00e8s ancien et rouill\u00e9",
      infos: "Faible au feu et \u00e0 la foudre",
      drop: "Crystal d'Asbi, rare : Noyau de Schiste, tr\u00e8s rare : R\u00e9acteur Zumi",
    },
    55: {
      visuel3D: "m170",
      nom: "Chauve-souris Gourmande",
      pvmax: "90",
      skills: [
        "Coup de croc : 1D10+9 : force",
        "Tornade : 1D8+6 AoE : dext\u00e9",
        "Blocage critique : ventre rebondissant # Renvoi",
        "",
      ],
      stats: "16,14,11,9,9",
      desc: "Chauve souris grise tr\u00e8s poilue et grosse, ronde",
      infos: "Faible au tranchant et \u00e0 la lumi\u00e8re",
      drop: "Fruits sucr\u00e9s/amers, Aile de chauve-souris",
    },
    56: {
      visuel3D: "m081",
      nom: "Oberon le Massacreur Sadique",
      pvmax: "280",
      skills: [
        "Coup de Queue : 2D6 +10 AoE : Force",
        "Griffe & Croc : 3D6+14 : Force",
        "Frisson de Guerre : Soin 2D8+14, d\u00e9g\u00e2t +10 pendant 4-5 tours : Esprit",
        "Blessure Fatale : \u00e9pines d\u00e9g\u00e2t 1D6+6 pour 4 tours : Esprit",
      ],
      stats: "16,11,9,10,17",
      desc: "BOSS : Un tyrannosaure ancestral dot\u00e9 d'un corps de guerre extr\u00eamement puissants",
      infos: "Faible au contondant et \u00e0 la lumi\u00e8re",
      drop: "Griffe d'Ob\u00e9ron, rare : Anneau de r\u00e9sistance OU Glyphe des Ursuns, Ep\u00e9e Colossale de Parade",
    },
    57: {
      visuel3D: "m056",
      nom: "Ursina",
      pvmax: "260",
      skills: [
        "Coupe Asura : 1D10 + (1D10)+9 : force",
        "Purgatoire : 1D8+10 (+5 asura) + (+1D8) : esprit",
        "Foi du temple : Esprit+3, D\u00e9g\u00e2t subi -1D6-6 pendant 4 tours : esprit",
        "Euphorie : +1D4 (min 2) par coup. Buff pendant 4 tours (max 5) : esprit",
      ],
      stats: "17,13,8,14,15",
      desc: "Ursun \u00e0 la peau brun, grande Samoura\u00ef robuste et tr\u00e8s courageuse et droite",
      infos: "Faible \u00e0 la nature et aux t\u00e9n\u00e8bres",
      drop: "A voir ! Katana --",
    },
    58: {
      visuel3D: "m408",
      nom: "Scarab\u00e9e des Glaces",
      pvmax: "100",
      skills: [
        "Coup de croc : 1D10 +10 : force",
        "Temp\u00eate de Glace : 1D8 AoE+8 (malus dext\u00e9 3) : intelligence",
        "D\u00e9fense d'Acier : Blocage +4 pendant 1D4+1 tours : esprit",
        "",
      ],
      stats: "15,7,16,8,15",
      desc: "Gros scarab\u00e9e de glace bleu recouvert de crystaux",
      infos: "Faible au contondant et au feu",
      drop: "Pierre de s\u00e9curit\u00e9, Boucle d'oreilles du Ma\u00eblstrom",
    },
    59: {
      visuel3D: "etincellia",
      nom: "Etincellia",
      pvmax: "240",
      skills: [
        "Coupure Noire/Blanche : 3D6  +16 : force",
        "Pri\u00e8re Divine/Sacrifice Ombres : Soin 2D6 +24 (DGT/2, all tours). Next Lumi\u00e8re 1D6+4 / All T\u00e9n\u00e8bres 1D6+6 (Force,Int+1) : esprit",
        "Saut Dimensionnel : 5 tentatives : remplace l'esquive par la t\u00e9l\u00e9portation : intel",
        "Destruct de l'aurore/noire : 2D6 +12 : intel",
      ],
      stats: "15,6,17,8,16",
      desc: "Une Ezelin de g\u00e9nie, d\u00e9termin\u00e9e et ambitieuse, puissante",
      infos: "Faible au tranchant et \u00e0 la nature",
      drop: "A voir !",
    },
    60: {
      visuel3D: "m199",
      nom: "Garde Tyrolien",
      pvmax: "100",
      skills: [
        "Poigne de fer : 1D6+12 : force",
        "Jet T\u00e9n\u00e9breux : 2D6+8 : intelligence",
        "Armure : D\u00e9g\u00e2t -8 sur 3 tours : Esprit",
        "Fracas : D\u00e9g\u00e2t 1D6+8 AoE : force",
      ],
      stats: "16,7,15,10,13",
      desc: "Armure vivante en forme de d\u00e9mon en acier gris et brun en l\u00e9vitation",
      infos: "Faible \u00e0 la glace et la lumi\u00e8re",
      drop: "Fragment d'armure, rare : Griffe de l'Esprit",
    },
    61: {
      visuel3D: "m308",
      nom: "Kasar - Braconnier",
      pvmax: "210",
      skills: [
        "Triple Tir : 1D8+1D6+1D4+15 : Dext\u00e9rit\u00e9",
        "Blessure Douloureuse : 1D10 +12, et 0 soin sur 4 tours : Dext\u00e9rit\u00e9",
        "S\u00e9r\u00e9nit\u00e9 : Dext\u00e9+2 Esquive+2, D\u00e9g\u00e2t subi -1D6-6 pendant 4 tours : Esprit",
        "Fl\u00e8che M\u00e9ga Eblouissante : 1D10 +10, r\u00e9ussite des sorts -2 (3 tours) AoE : Dext\u00e9rit\u00e9",
      ],
      stats: "11,16,11,10,16",
      desc: "Braconnier quarantenaire barbu avec des cicatrices, \u00e0 la recherche de b\u00eates rares et on\u00e9reuses",
      infos: "Faible au tranchant et \u00e0 la foudre",
      drop: "Arc du Dresseur, rare : Veste des Hautes-terres",
    },
    62: {
      visuel3D: "m312",
      nom: "Rubis - Chevali\u00e8re Dragonne",
      pvmax: "280",
      skills: [
        "Mode Draconique : Embras\u00e9 : Force+2, D\u00e9moniaque : Charisme+2, Cach\u00e9 : Esprit+2 : Esprit",
        "Terreur du Dragon AoE : R\u00e9ussite des sorts : -2 sur 3 tours AoE (+ mode Cf. DK) : Charisme",
        "Pouvoir du Dragon  / Atk Cyclone : 3D6+16 (2D6+13) (feu, t\u00e9n\u00e8bres,physique) : Force",
        "Revers d'\u00e9caille : 5 tentatives par combat (<10 : 66%, >=10 : 33%) (+ mode Cf. DK) : Esprit",
      ],
      stats: "15,11,7,15,15",
      desc: "H\u00e9riti\u00e8re de l'empire Heldentod, connue pour sa d\u00e9termination et sa prestance",
      infos: "Faible \u00e0 la nature et aux t\u00e9n\u00e8bres",
      drop: "Ep\u00e9e de parade OU Gantelet de Lieutenant, tr\u00e8s rare : Brassard du Pouvoir",
    },
    63: {
      visuel3D: "m197",
      nom: "Taureau Pr\u00e9cieux",
      pvmax: "100",
      skills: [
        "Charge : 1D10 +12 : force",
        "Vague terrestre : 1D10 +8 AoE : force",
        "D\u00e9fense : D\u00e9g\u00e2t -7 sur 3 tours : Esprit",
        "Cri de guerre : d\u00e9g\u00e2t +4 AoE sur 4 tours : Esprit",
      ],
      stats: "17,9,11,9,15",
      desc: "Un taureau \u00e0 carapace de roc orang\u00e9. Des crystaux bleus pars\u00e8ment son corps.",
      infos: "Faible \u00e0 la lumi\u00e8re et aux t\u00e9n\u00e8bres",
      drop: "Crystal de Lazurite, rare : carapace pr\u00e9cieuse",
    },
    64: {
      visuel3D: "m093",
      nom: "Corbeau Noir",
      pvmax: "80",
      skills: [
        "Pic pic : 2D8+8 : dext\u00e9rit\u00e9",
        "Coup de vent : 1D8+8 AoE : intelligence",
        "Cri strident : r\u00e9ussite des sorts -2 AoE sur 3 tours : Esprit",
        "",
      ],
      stats: "9,15,14,9,14",
      desc: "Gros corbeau tour noir avec un bec imposant, aime les objets brillant",
      infos: "Faible au feu et \u00e0 la lumi\u00e8re",
      drop: "Plumes de corbeau, rare : Fragment de Crystal d'Eden   ultra rare : Plaque R\u00e9fl\u00e9chissante",
    },
    65: {
      visuel3D: "m125",
      nom: "Garde de Valence",
      pvmax: "95",
      skills: [
        "Charge : 1D10 +12 : force",
        "Coup de Lance/Epee : 1D10 +10 : force",
        "D\u00e9fense : d\u00e9g\u00e2t re\u00e7u -8 pendant 3 tours : esprit",
        "Silence : Aucun sort magique pendant 3 tours : Esprit",
      ],
      stats: "16,11,9,10,15",
      desc: "Garde de l'arm\u00e9e de Valence, robuste et courageux",
      infos: "Faible au per\u00e7ant et \u00e0 la nature",
      drop: "10-15po, rare : Bouclier de Valence, tr\u00e8s rare : Dague de Valence",
    },
    66: {
      visuel3D: "m442",
      nom: "Grand Garde Tyrolien",
      pvmax: "220",
      skills: [
        "Poigne de fer : 2D6+18 : force",
        "Jet T\u00e9n\u00e9breux : 3D6+12 AoE : intelligence",
        "Armure : D\u00e9g\u00e2t -12 sur 3 tours : Esprit",
        "Fracas : D\u00e9g\u00e2t 2D6+14 AoE : force",
      ],
      stats: "17,8,16,11,14",
      desc: "Grande Armure vivante en forme de d\u00e9mon en acier rouge\u00e2tre noir en l\u00e9vitation",
      infos: "Faible au contondant et \u00e0 la nature",
      drop: "Masse de l'Esprit OU Bouclier de l'Esprit, rare : Noyau abyssal",
    },
    67: {
      visuel3D: "m315",
      nom: "Adonis - Tueur Juge",
      pvmax: "240",
      skills: [
        "\u00c2me Enchain\u00e9e : 2D6+11 et dext\u00e9-3 sur 3 tours : Dext\u00e9rit\u00e9",
        "Scellement Douloureux : Aucun sort physique, 0 SOIN pendant 3 tours : Esprit",
        "Atk Solo / Verdict Final : (2D6+12) 3D6 +14 (X1.5) : Force",
        "Furtivit\u00e9 / Aura du Pourfendeur : DGT T\u00e9n\u00e8b +1D6+6 pendant 4 tours : Esprit - - - 2 fois : Oeil Hypnotique (res esprit -3)",
      ],
      stats: "16,16,9,12,16",
      desc: "Anuran vert tr\u00e8s social et tr\u00e8s tueur",
      infos: "Faible au tranchant et \u00e0 la foudre",
      drop: "50 po, Cape Hypnotique, rare : Faucille d\u00e9moniaque ",
    },
    68: {
      visuel3D: "m200",
      nom: "Ankylosaure",
      pvmax: "90",
      skills: [
        "Morsure : 1D10 +11 : force",
        "Attaque tournoyante : 1D8+8 : dext\u00e9rit\u00e9",
        "Vivacit\u00e9 : Dext\u00e9+2 Esq+2 (3 tours): Esprit",
        "Croc de glace : 1D10+12 : force",
      ],
      stats: "16,14,9,9,13",
      desc: 'Dynosaure "tigre" \u00e0 la peau bleu, la fourrure bien garni et des armes ac\u00e9r\u00e9s',
      infos: "Faible au per\u00e7ant et aux t\u00e9n\u00e8bres",
      drop: "Ecaille d'Ankylosaure",
    },
    69: {
      visuel3D: "m042",
      nom: "D\u00e9moniste Torturran",
      pvmax: "100",
      skills: [
        "Zone noire : 1D10+9 AoE dext\u00e9rit\u00e9 -2 pendant 3 tours : Intelligence",
        "Fl\u00e8che des Ombres : 1D10+15 et si parasite : soin 1D6+9 : Intelligence",
        "Parasite : 5 d\u00e9g\u00e2ts chaque tour (4 tours) : Intelligence",
        "R\u00e9sistance : -9 d\u00e9g\u00e2t re\u00e7us (3 tours) : Esprit",
      ],
      stats: "11,7,17,11,15",
      desc: "Grand D\u00e9moniste Sorcier du Culte de la Chelona",
      infos: "Faible \u00e0 la lumi\u00e8re et au contondant",
      drop: "Anneau de r\u00e9sistance, Pierre Algue, rare : Croix corrompue",
    },
    70: {
      visuel3D: "m156",
      nom: "Templier Marma - V2 (Nv7)",
      pvmax: "220",
      skills: [
        "Euphorie : +1D4+1 (min 3) par coup. Buff pendant 4-5 tours (max 5) : esprit",
        "Lumi\u00e8re de Gu\u00e9rison : 2D10 +12, 1/4 de rejouer : intelligence",
        "Lumi\u00e8re Sacr\u00e9e : 2D10 +12 : intelligence",
        "Attaque tournoyante : 2D8 +8 : force",
      ],
      stats: "14,9,16,12,15",
      desc: "Templier de la Curie dans une armure noble, chef d'arm\u00e9e (v2 = capitaine?)",
      infos: "Faible aux t\u00e9n\u00e8bres et \u00e0 la foudre",
      drop: "Calice de la Curie M\u00e9t\u00e9role, tr\u00e8s rare : Plastron de Templier",
    },
    71: {
      visuel3D: "m077",
      nom: "Ecorce Terrestre - Pionnier de Gaia",
      pvmax: "330",
      skills: [
        "Fracas Terrestre / Atk Foudroyante : 1D10+15 / 2D10+12 AoE : force/intel",
        "Machoir Enorme : 3D6+18 : force",
        "M\u00e8re fondatrice : Soin 2D10+25 Invoque 2 lutins runique (PV/2) : esprit",
        "Passif quand 40% PV : D\u00e9g\u00e2t d'\u00e9pine 1D6+4",
      ],
      stats: "17,9,15,11,16",
      desc: "BOSS : Une tortue verte antique mont\u00e9e d'un arbre gigantesque. Elle est redoutable et tr\u00e8s r\u00e9sistante",
      infos: "Faible au feu et au per\u00e7ant",
      drop: "Pierre Algue, rare : Ep\u00e9e Verdoyante, tr\u00e8s rare : Plastron Ecailleux",
    },
    72: {
      visuel3D: "m059",
      nom: "Ogre des glaces",
      pvmax: "100",
      skills: [
        "Fracas de Glace : 1D8 AoE+8 (malus dext\u00e9 2) : force",
        "Perce-Armure : 1D8+5 + d\u00e9g\u00e2t physique re\u00e7u +3 (3 tours) : force",
        "Hache de Glace : 2D10 +6 : force",
        "Spirale Glaciale : Blocage+3 pdt 2 tours, puis d\u00e9g\u00e2t glace +1D6+4 : esprit",
      ],
      stats: "17,13,7,9,15",
      desc: "Ogre \u00e0 la peau bleu \u00e0 l'air calme mais avec un fond violent",
      infos: "Faible au feu et au tranchant",
      drop: "Pierre de s\u00e9curit\u00e9, rare : Hache de glace",
    },
    73: {
      visuel3D: "m216",
      nom: "Fant\u00f4me L\u00e9thargique",
      pvmax: "75",
      skills: [
        "Attaque foudroyante : 1D8+10 AoE : intelligence",
        "Stalactite : 1D8+1D6+1D4 +8 : intelligence",
        "Voile du blizzard : Dur\u00e9e 3 tours invisi sauf annulation, Intel+1, D\u00e9g\u00e2t+2 : intelligence",
        "Parasite : 4 DGT chaque tour (4 tours) : intelligence",
      ],
      stats: "7,13,17,9,13",
      desc: "Fant\u00f4me bleu violac\u00e9 tr\u00e8s hostile",
      infos: "Faible \u00e0 la lumi\u00e8re et \u00e0 la nature",
      drop: "Extrait fantomatique, rare : Noyau abyssal",
    },
    74: {
      visuel3D: "m118",
      nom: "Rumbledore (le vrai)",
      pvmax: "250",
      skills: [
        "Temp\u00eate de Glace : 2D10 +12 : Intelligence",
        "Saut Dimensio DIVIN : 4 tentatives par combat : remplace l'esq et remplace sa place par un autre joueur : intel",
        "M\u00e9ga Magie Extr\u00eame : Prochain d\u00e9g\u00e2t magique +2D6 +10 : Esprit",
        "M\u00e9ga Bombe Incendiaire : 3D10 +15 : Intelligence",
      ],
      stats: "7,13,17,13,16",
      desc: "Tr\u00e8s grand magicien des bourbes, aussi dou\u00e9 que les plus Grands Sages d'Aven (de la curie)",
      infos: "Faible au per\u00e7ant et \u00e0 la nature",
      drop: "On verra si \u00e7a arrive",
    },
    75: {
      visuel3D: "m311",
      nom: "Chevalier de la Curie (Lassar) v2 (Nv 6)",
      pvmax: "170",
      skills: [
        "Perc\u00e9e du Chevalier : 1D8 + 1D6 + 1D4 +12 : Dext\u00e9rit\u00e9",
        "Vivacit\u00e9 Accrue : Esquive+3, Dext\u00e9rit\u00e9+3 \u00e0 la cible pendant 4 tours : Esprit",
        "Perce-Armure : 1D10+10 + d\u00e9g\u00e2t physique re\u00e7u +5 (3 tours) : force",
        "Silence : Aucun sort magique pendant 3 tours : Esprit",
      ],
      stats: "13,16,9,13,16",
      desc: "Chevalier tr\u00e8s noble de la Curie M\u00e9t\u00e9role, promu en tant que Chef (1 unit\u00e9)",
      infos: "Faible aux t\u00e9n\u00e8bres et au per\u00e7ant",
      drop: "Ep\u00e9e de parade, rare : Calice de la Curie M\u00e9t\u00e9role",
    },
    76: {
      visuel3D: "m205",
      nom: "Fr\u00e9d\u00e9ric - Officier Heldentod",
      pvmax: "250",
      skills: [
        "Euphorie : +1D4+1 (min 3) par coup. Buff pendant 4-5 tours (max 5) : esprit",
        "Perc\u00e9e du Guerrier : 1D6 + 1D6 + 1D4 +12 : force",
        "Perce-Armure : 1D10+10 + d\u00e9g\u00e2t physique re\u00e7u +5 (3 tours) : force",
        "Attaque tournoyante : 2D8 +8 : force",
      ],
      stats: "17,11,13,13,15",
      desc: "Guerrier grand et robuste se battant pour l'empire Heldentod, d\u00e9cor\u00e9 par le grand mar\u00e9chal de l'Empire, vicieux.",
      infos: "Faible au tranchant et \u00e0 la glace",
      drop: "Charme d'Exp\u00e9rience, rare : Katana Incisif",
    },
    77: {
      visuel3D: "m060",
      nom: "McDougal - H\u00e9raut Heldentod",
      pvmax: "220",
      skills: [
        "Marteau Insolent : 1D10 +10 AoE, et -1 de blocage et d'esquive pour 3 tours : force",
        "Marteau de Scellement : 1D10+15 de glace, retire un buff : force",
        "Aura Bouclier : Blocage +3 AoE sur 3 tours : Esprit",
        "Aura Ami Marteau : Soin 2D10 +16. Prochain d\u00e9g\u00e2t +1D6+8 : esprit",
      ],
      stats: "17,8,13,12,17",
      desc: "Ogre costaud et  officier de l'Empire Heldentod dont les fonctions \u00e9taient la transmission des messages, les proclamations solennelles. Il est connu pour sa force et son soutien ravageur",
      infos: "Faible \u00e0 la foudre et aux t\u00e9n\u00e8bres",
      drop: "30po, Marteau Canon V2, rare : Tenue Militaire",
    },
    78: {
      visuel3D: "m127",
      nom: "Garde Heldentod",
      pvmax: "95",
      skills: [
        "Charge : 1D10 +14 : force",
        "Coup de Lance/Epee : 1D10 +11 : force",
        "D\u00e9fense : d\u00e9g\u00e2t re\u00e7u -6 pendant 3 tours : esprit",
        "Cri de guerre : d\u00e9g\u00e2t +5 a tlm pendant 4 tours : esprit",
      ],
      stats: "16,11,9,10,15",
      desc: "Garde de l'infanterie Heldentod, agressif et courage, ils ne reculent jamais.",
      infos: "Faible au contondant et \u00e0 la foudre",
      drop: "10-15po, rare : Bouclier d'\u00e9pines, tr\u00e8s rare : Dague Heldentod",
    },
    79: {
      visuel3D: "m076",
      nom: "Tortue pr\u00e9historique",
      pvmax: "125",
      skills: [
        "Seisme : 2D8 +10 AoE : force",
        "Vase limitante : 2D6 +8 AoE (dext\u00e9-4 4 tours) : intelligence",
        "Morsure : 2D10+12 : force",
        "R\u00e9g\u00e9n\u00e9ration terrestre : 2D6+16 AoE : intelligence",
      ],
      stats: "16,6,15,9,11",
      desc: "Grande tortue pr\u00e9historique couleur turquoise",
      infos: "Faible au feu et tranchant",
      drop: "Carapace de torture. Rare : Pierre algue",
    },
    80: {
      visuel3D: "m032",
      nom: "Mandragore - Graine de l'Yggdrasil",
      pvmax: "250",
      skills: [
        "Rage de Gaia : 1D10+15 AoE : Force",
        "Lumi\u00e8re Gardienne : 2D10+15 et -10 DGT MAG re\u00e7u sur 3 tours : Esprit",
        "Pollen de Pavot : Endort les ennemis et retire leur buffs : Esprit",
        "Coup de racine : 3D6+16 : Force",
      ],
      stats: "16,9,13,11,17",
      desc: "Cr\u00e9ature racine g\u00e9ante au bulbe marron et aux fleurs violettes. Une cr\u00e9ature ancestrale du pass\u00e9.",
      infos: "Faible au tranchant et au feu",
      drop: "Ep\u00e9e Verdoyante. Rare : Tentacule de Mandragore",
    },
    81: {
      visuel3D: "m086",
      nom: "Lutin pr\u00e9historique",
      pvmax: "85",
      skills: [
        "Poison : 1D4+5 d\u00e9g\u00e2t pendant 3 tours : intelligence",
        "Coup de boule : 2D6+14 : force",
        "Racine claquante : 2D10+8 AoE : intelligence",
        "Magie extr\u00eame : +2D4+3 (\u00e0 la cible) pour 4 tours : esprit",
      ],
      stats: "14,10,16,11,15",
      desc: "Petit dryade (farfadet) du pass\u00e9 tout rond et vert avec une feuille",
      infos: "Faible au per\u00e7ant et \u00e0 la foudre",
      drop: "R\u00e9sidu de lutin*2, rare : Noyau abyssal",
    },
    82: {
      visuel3D: "m219",
      nom: "Aigle Mutant",
      pvmax: "253",
      skills: [
        "Croc F\u00e9roce : 2D10 + 8+8 : force",
        "Vent Enflamm\u00e9 :  1D10 + 8+8 AoE : intelligence",
        "Croc Br\u00fblant :  2D10 +13+7 : force",
        "Cri d\u00e9figur\u00e9 : r\u00e9ussite -2 AoE (3 tours) : esprit",
      ],
      stats: "16,12,14,9,14",
      desc: "Un aigle brun qui a aval\u00e9 un embryon d'esprit sacr\u00e9 (chelona) et qui a mut\u00e9 avec ce dernier.",
      infos: "Faible au contondant et \u00e0 la glace",
      drop: "Griffe embras\u00e9e, rare : Plume brillante",
    },
    83: {
      visuel3D: "m035",
      nom: "Ver Carapace Acide",
      pvmax: "100",
      skills: [
        "Morsure : 2D10+8 : force",
        "S\u00e9isme acide : 1D10+8 AoE : force",
        "Souffle ralentissant : dext\u00e9-3 (3 tours): esprit",
        "Poison : 1D4+4 sur 3 tours : intel",
      ],
      stats: "15,7,13,8,14",
      desc: "Ver jaun\u00e2tre avec une carapace acide grise bleut\u00e9 et des cornes, f\u00e9roce",
      infos: "Faible \u00e0 la glace et \u00e0 la foudre",
      drop: "Peau de ver, rare : Ep\u00e9e odorante",
    },
    84: {
      visuel3D: "m102",
      nom: "Ver Cuirass\u00e9 - Jimmy",
      pvmax: "150",
      skills: [
        "Morsure : 2D10+12 : force",
        "S\u00e9isme acide : 1D10+12 AoE : force",
        "Poison AoE : 1D4+6 sur 3 tours : intel",
        "Passif : Bouclier d'\u00e9pines (DGT re\u00e7u -4, \u00e9pines +4)",
      ],
      stats: "16,8,15,9,14",
      desc: "Un Ver Alpha vivant dans une grotte, leader des insectes et territorial, \u00e0 une carapace empoisonn\u00e9e verd\u00e2tre",
      infos: "Faible \u00e0 la glace et aux t\u00e9n\u00e8bres",
      drop: "Peau de ver cuirass\u00e9, Bouclier d'\u00e9pines, rare : Corne de ver",
    },
    85: {
      visuel3D: "m015",
      nom: "Draigos - Drakai aux bouquins",
      pvmax: "160",
      skills: [
        "Parasite Obscur : 6 DGT 4 tours : intel",
        "Fl\u00e8che des ombres : 2D6+8+6, et si parasite : soin 3D6+6 : intel",
        "Bombe Incendiaire : 2D10+4+11, Temp\u00eate Glace : 2D6+6+6 AoE : intel",
        "Pacte : Panopticor. 50 PV, Force : 10, Dext\u00e9 : 15, Intel : 16, Charisme : 11, Esprit : 13. Sort : Jet de T\u00e9n\u00e8bres 2D6+2 (Intel), Coup tentacule 2D10 (Dext\u00e9) : Esprit",
      ],
      stats: "9,11,18,13,15",
      desc: "Draigos, l\u00e2che tacticien hors pair et \u00e9rudit qui ne se laisse pas marcher dessus",
      infos: "Faible au contondant et \u00e0 la lumi\u00e8re",
      drop: "Grimoire infernal & mal\u00e9fique, rare : Crystal de Baltaro\u00ef",
    },
    86: {
      visuel3D: "m091",
      nom: "Esprit de Crystal",
      pvmax: "150",
      skills: [
        "Foudre noire : 1D10 +6 (X1.5) AoE : intelligence",
        "Charge : 2D10 +12 : force",
        "Peur : peut stun 2 tours : esprit",
        "",
      ],
      stats: "14,9,16,9,15",
      desc: "Un esprit de glace form\u00e9 de crystaux, c'est un esprit des marais",
      infos: "Faible \u00e0 la lumi\u00e8re et \u00e0 la glace",
      drop: "Pierre de s\u00e9curit\u00e9, Amulette d'Exp\u00e9rience, rare : Noyau Abyssal",
    },
    87: {
      visuel3D: "m050",
      nom: "Zumi Sage",
      pvmax: "90",
      skills: [
        "Aura Bouclier Protec : Blocage +3 pendant 4 tours : esprit",
        "Aura Ami du Marteau : Soin 2D10 +12. Prochain d\u00e9g\u00e2t +2D6+4 : intel",
        "Marteau du Scellement : 2D6+8 de glace, retire un buff : intel",
        "Symphonie de guerre : D\u00e9g\u00e2t +1D6+2 AoE (3 tours) : esprit",
      ],
      stats: "5,11,16,12,17",
      desc: "Vieux zumi brun et tr\u00e8s cultiv\u00e9",
      infos: "Faible au tranchant et \u00e0 la nature",
      drop: "20po, Marteau de Delphes, rare : Collier Asbi",
    },
    88: {
      visuel3D: "m314",
      nom: "Zumi Juge",
      pvmax: "160",
      skills: [
        "\u00c2me Enchain\u00e9e : 2D6+6 et dext\u00e9-3 sur 3 tours : Dext\u00e9rit\u00e9",
        "Scellement : Aucun sort physique pendant 3 tours : Esprit",
        "Atk Solo (-6) / Verdict Final : 2D6 +12 (Crit X1.5), r\u00e9ussite-1 : Force",
        "Furtivit\u00e9 / Aura du Pourfendeur : DGT T\u00e9n\u00e8b +1D6+2 pendant 4 tours : Esprit",
      ],
      stats: "15,16,9,10,17",
      desc: "Un zumi tr\u00e8s vicieux qui aime diriger et contr\u00f4ler, ambitieux.",
      infos: "Faible au contondant et \u00e0 la nature",
      drop: "40po, Katana renforc\u00e9 ou (rare : Katana Incisif)",
    },
    89: {
      visuel3D: "m052",
      nom: "Tank Ursun",
      pvmax: "200",
      skills: [
        "Mur de Titan : D\u00e9g\u00e2t -4 -1D4 pendant 4 tours : force",
        "Provocation :D\u00e9g\u00e2t 1D6, et 1D4 fois plus de chance d'\u00eatre vis\u00e9 pendant 4 tours : Charisme",
        "Euphorie : +1D4 (min 2) par coup (max 5). Buff pendant 4 tours : esprit, (Passif : D\u00e9g\u00e2t re\u00e7u -5)",
        "Charge (Atk Cyclone) : 1D10+10 (5) : force.",
      ],
      stats: "17,9,5,14,16",
      desc: "Grand ursun noir capable d'encaisser de nombreux coups",
      infos: "Faible \u00e0 la foudre et aux t\u00e9n\u00e8bres",
      drop: "20po, Bouclier de l'Esprit, rare : Pendentif du Croc Brumeux, Pierre de s\u00e9curit\u00e9",
    },
    90: {
      visuel3D: "m347",
      nom: "Lucius - Roi D\u00e9chu",
      pvmax: "255",
      skills: [
        "Soin Inverseur : Transforme les soins ennemis en d\u00e9g\u00e2t (AoE) 4 tours : Esprit",
        "Atk Solo (-6) / Faiblesse Critique : 3D6 +17 (Crit X1.5), r\u00e9ussite-1 : Force",
        "Griffure Noire : 2D6 +10, et -2 blocage/esquive pour 3 tours AoE : Esprit",
        "Pelote d'entrave : 4 tentatives (Instantan\u00e9e) : Mono/AoE force \u00e0 re-esquiver ou re-bloquer (r\u00e9ussite -2 si lui) : Esprit",
      ],
      stats: "16,7,13,12,17",
      desc: "Ezelin au cheveux argent\u00e9 et aux yeux bleux. Roi ayant v\u00e9cu il y a 300 ans, expert en magie noire.",
      infos: "Faible au per\u00e7ant et \u00e0 la lumi\u00e8re",
      drop: "Bijou Iris, Bottes de Guerre, rare : Brassard du Combattant (ou du Pouvoir)",
    },
    91: {
      visuel3D: "m223",
      nom: "Alt\u00e9ration de Crystal",
      pvmax: "150",
      skills: [
        "D\u00e9gagement d'\u00e9nergie : (1 tour incant) 2D6 AoE+13 (malus esprit -2, 3 tours) : intelligence",
        "Flamme tranchante : 2D10 +10 : force",
        "Perc\u00e9 Stella (ignore 50% armure) : 2D10+6 : force",
        "Crystal vivifiant : 2D10 +15 PV (Soin aux alt\u00e9rations) : intelligence",
      ],
      stats: "16,9,16,12,12",
      desc: "Petite cr\u00e9ature mollusque en forme de racine parsem\u00e9 de crystal de Stella.",
      infos: "Faible au per\u00e7ant et \u00e0 la glace",
      drop: "Minerais de Stella, rare : Noyau charg\u00e9 de Stella",
    },
    92: {
      visuel3D: "m141",
      nom: "DD Alpaga zombifi\u00e9",
      pvmax: "70",
      skills: [
        "Coup de boule : 2D10+6 : force",
        "S\u00e9isme : 1D10+6 AoE : force",
        "Cri d'agonie : Stress+5 AoE : esprit",
        "",
      ],
      stats: "16,12,8,8,14",
      desc: "Alpaga blanc-gris avec la machoire d\u00e9bo\u00eet\u00e9 qui g\u00e9mie de douleur",
      infos: "Faible au feu et au tranchant",
      drop: "Fourrure d'alpaga",
    },
    93: {
      visuel3D: "m174",
      nom: "Insecte D\u00e9form\u00e9",
      pvmax: "90",
      skills: [
        "Poison : 1D4+4 sur 3 tours : intel",
        "Mandibule tranche : 2D10+6 : force",
        "Fils d'entrave : 1D6 et Dext\u00e9rit\u00e9-3 AoE : intel",
        "",
      ],
      stats: "13,8,15,8,12",
      desc: "Insecte avec des proportions difformes et recouvert de crystal",
      infos: "Faible aux t\u00e9n\u00e8bres et \u00e0 la lumi\u00e8re",
      drop: "Crystal verd\u00e2tre, Noyau charg\u00e9 de Stella",
    },
    94: {
      visuel3D: "m179",
      nom: "Poisson Abyssal",
      pvmax: "90",
      skills: [
        "Croc pourri : 1D10+6, soin re\u00e7u /2 (3 tours) : force",
        "Projection d'eau : 1D10+4 AoE : intelligence",
        "Coup de queue : 2D10+6 : force",
        "",
      ],
      stats: "15,8,13,8,12",
      desc: "Poisson g\u00e9ant aux yeux noir qui ressort de l'abysse oc\u00e9anique",
      infos: "Faible \u00e0 la lumi\u00e8re et \u00e0 la foudre",
      drop: "Dent g\u00e9ante, \u00e9cailles de poissons",
    },
    95: {
      visuel3D: "m220",
      nom: "Fleur Envahissante",
      pvmax: "50",
      skills: [
        "Coup de ronce : 1D10+6 : dext\u00e9rit\u00e9",
        "Pollen d\u00e9mangeant : Intelligence/Esprit -2 (3 tours) : esprit",
        "Gros coup de ronce : 2D10+10 : dext\u00e9rit\u00e9",
        "",
      ],
      stats: "8,15,13,8,12",
      desc: "Une fleur avec de grandes lianes piquantes capable de se mouvoir en for\u00eat",
      infos: "Faible au tranchant et au feu",
      drop: "Racine \u00e9pineuse x2, rare : huile de rose",
    },
    96: {
      visuel3D: "m230",
      nom: "DD Ogre mutant",
      pvmax: "110",
      skills: [
        "Euphorie : +1D4+2 par coup. Buff pendant 4 tours (max 5) : esprit",
        "Attaque Cyclone : 1D10+7 : force",
        "Faiblesse Critique : 1D10 +8 (X1.5) : force",
        "Cri d'agonie : Stress+10 AoE : esprit",
      ],
      stats: "17,11,8,8,14",
      desc: "Une fleur avec de grandes lianes piquantes capable de se mouvoir en for\u00eat",
      infos: "Faible au per\u00e7ant et \u00e0 la nature",
      drop: "Ep\u00e9e / Hache / Griffe / Plastron",
    },
    97: {
      visuel3D: "m027",
      nom: "DD Gargouille",
      pvmax: "70",
      skills: [
        "Coup de griffe : 2D10+6 : force",
        "Coup de vent : 1D10+8 AoE : intelligence",
        "Mur de titan : D\u00e9g\u00e2t re\u00e7u -4 : force",
        "",
      ],
      stats: "16,11,14,8,12",
      desc: "Gargouille grise noire qui hante les ruines et les manoirs",
      infos: "Faible au contondant et \u00e0 la glace",
      drop: "Griffe de l'esprit, Pierre de s\u00e9curit\u00e9",
    },
    98: {
      visuel3D: "m253",
      nom: "DD Soldat Squelette",
      pvmax: "70",
      skills: [
        "Charge : 1D10 +10 : force",
        "Coup de Lance/Epee : 1D10 +7 : dext\u00e9rit\u00e9",
        "Silence : Aucun sort magique pendant 3 tours : Esprit",
        "Bombe incendiaire : 1D10+10 : intelligence",
      ],
      stats: "14,15,14,8,12",
      desc: "Squelette de soldat inconnu qui erre dans les lieux d\u00e9labr\u00e9s",
      infos: "Faible au contondant et \u00e0 la lumi\u00e8re",
      drop: "Veste/Armure - Ep\u00e9e/B\u00e2ton - Any access (croc smilodon)",
    },
    99: {
      visuel3D: "m247",
      nom: "DD G\u00e9ant Mutil\u00e9",
      pvmax: "140",
      skills: [
        "Poing f\u00e9roce : 2D10 +10 : force",
        "S\u00e9isme pied : 1D10+10 : force",
        "Liqu\u00e9faction : PV - 2D10-20, si mang\u00e9 : soigne les alli\u00e9s autant : Esprit",
        "Passif : tous les 5 tours (Stress+5)",
      ],
      stats: "17,7,10,8,14",
      desc: "Humano\u00efde de race inconnu mutil\u00e9, yeux perc\u00e9s et \u00e0 la peau br\u00fbl\u00e9",
      infos: "Faible au tranchant et \u00e0 la foudre",
      drop: "Brassard, Faucille Rouill\u00e9e, Masse clout\u00e9e, Glyphe ursun",
    },
    100: {
      visuel3D: "m196",
      nom: "DD Shaman Gnome",
      pvmax: "80",
      skills: [
        "Totem Gracieux (40pv) : 1D6 +6 pendant 6 tours (tous les 2 tours) : Intelligence",
        "Buff d\u00e9g\u00e2t : +4 d\u00e9g\u00e2ts AoE pendant 3 tours : Esprit",
        "\u00c9clair en Furie : 1D6+8 : Intelligence",
        "Aura Bouclier : Blocage +2 pendant 3 tours : Esprit",
      ],
      stats: "7,11,16,8,16",
      desc: "Humano\u00efde de race inconnu, hostile et sauvage, cannibal",
      infos: "Faible au tranchant et \u00e0 la nature",
      drop: "Anneau du rem\u00e8de (bague de vigueur), rare : Sceptre du Shaman",
    },
    101: {
      visuel3D: "m375",
      nom: "DD Noble Corrompu",
      pvmax: "160",
      skills: [
        "Perc\u00e9e du Chevalier : 1D8 + 1D6 + 1D4 +12 : Dext\u00e9rit\u00e9",
        "Vivacit\u00e9 Accrue : Esquive+3, Dext\u00e9rit\u00e9+2 \u00e0 la cible pendant 4 tours : Esprit",
        "Silence / Scellement : Aucun sort magique/physique pendant 3 tours : Esprit",
        "Griffures Noires : 2D6 +6, et -2 de blocage et d'esquive pour 3 tours : esprit",
      ],
      stats: "11,15,11,8,17",
      desc: "Un humain noble tomb\u00e9 dans le chaos et la magie d\u00e9moniaque",
      infos: "Faible au contondant et \u00e0 la nature",
      drop: "Ep\u00e9e / Objets maudits (Noir)",
    },
    102: {
      visuel3D: "m409",
      nom: "Escargot Vorace",
      pvmax: "70",
      skills: [
        "Bave visqueuse : 1D6+6 Dext\u00e9 -3 AoE : Intelligence",
        "Morsure : 2D10 +6 : force",
        "Succion : 2D6+10 (soigne \u00e7a +12) : force",
        "Passif : viscosit\u00e9 : d\u00e9g\u00e2t physique -5",
      ],
      stats: "15,8,14,8,14",
      desc: "Escargot g\u00e9ant recouvert de piques avec une bouche dent\u00e9e vorace",
      infos: "Faible \u00e0 la glace et aux t\u00e9n\u00e8bres",
      drop: "Carapace d'escargot, peau d'escargot, rare : Pierre Algue",
    },
    103: {
      visuel3D: "m301",
      nom: "Loup garou",
      pvmax: "90",
      skills: [
        "Coup de griffe/patte : 2D6+10 : dext\u00e9rit\u00e9",
        "Hurlement : stress+5, r\u00e9ussite -1 (3 tours) : esprit",
        "Attaque tournoyante : 1D6+8 AoE : dext\u00e9rit\u00e9",
        "Cicatrice de l'esprit : 1D6 +10, retire un buff : dext\u00e9rit\u00e9",
      ],
      stats: "11,16,11,10,14",
      desc: "Homme loup hostile envers ses proies pour les manger",
      infos: "Faible au per\u00e7ant et aux t\u00e9n\u00e8bres",
      drop: "30po, Griffes de l'esprit/enchant\u00e9, faucille, ...",
    },
    104: {
      visuel3D: "m198",
      nom: "DD Gardien cauchemardesque",
      pvmax: "150",
      skills: [
        "Changement de forme (+ d\u00e9g\u00e2t +5) : esprit",
        "Cri de piti\u00e9 : Stress+10 (15) AoE : esprit",
        "Sort de l'ennemi copi\u00e9 1",
        "Sort de l'ennemi copi\u00e9 2",
      ],
      stats: "14,14,14,8,16",
      desc: "Cr\u00e9ature qui change sa forme, prenant l'apparence (et la voix) de personnes connues de ses ennemis",
      infos: "Faible \u00e0 la lumi\u00e8re et au tranchant (ou au choix)",
      drop: "Sang/Coeur fossilit\u00e9, Toxine noire",
    },
    105: {
      visuel3D: "m290",
      nom: "Cam\u00e9l\u00e9on Mar\u00e9cageux",
      pvmax: "80",
      skills: [
        "Furtivit\u00e9 : Rend invisible, dext & esq+2 (3 tours) : esprit",
        "Coup de langue : 1D10+10 (dext\u00e9-2, 3 tours) : dext\u00e9rit\u00e9",
        "Crachat infect\u00e9 : 1D10+6 AoE : intelligence",
        "Hurlement : stress+5, r\u00e9ussite -1 (3 tours) : esprit",
      ],
      stats: "9,15,15,9,15",
      desc: "Grand cam\u00e9l\u00e9on vert vaseux qui se montre agressif et stress\u00e9. Il effraye ses ennemis pour se d\u00e9fendre",
      infos: "Faible au per\u00e7ant et au feu",
      drop: "Ecaille de reptile, rare : Anneau du rem\u00e8de; Oeil de cam\u00e9l\u00e9on",
    },
    106: {
      visuel3D: "m301",
      nom: "DD Abomination",
      pvmax: "180",
      skills: [
        "Coup de griffe/patte : 3D6+15 : dext\u00e9rit\u00e9",
        "Hurlement : stress+10, r\u00e9ussite -2 (3 tours) : esprit",
        "Attaque tournoyante : 2D6+14 AoE : dext\u00e9rit\u00e9",
        "Cicatrice de l'esprit : 2D6 +15, retire un buff : dext\u00e9rit\u00e9",
      ],
      stats: "11,17,11,10,15",
      desc: "Abomination proche de l'Homme loup hostile envers ses proies pour les manger. Humano\u00efde en sauvage",
      infos: "Faible au per\u00e7ant et au feu",
      drop: "40po, Griffes de l'esprit/enchant\u00e9, faucille, ...",
    },
    107: {
      visuel3D: "m298",
      nom: "Crabe de Jade",
      pvmax: "95",
      skills: [
        "Coup de pince : 2D10+9 : Force",
        "Attaque tournoyante : 1D10+10 AoE : Force",
        "Grincement de pinces : Force & Intelligence -2 AoE (3 tours) : esprit",
        "Passif : Blocage+2",
      ],
      stats: "17,9,13,11,14",
      desc: "Crabe vert de jade recouvert d'une \u00e9paisse carapace, a des petits yeux",
      infos: "Faible au contondant et aux t\u00e9n\u00e8bres",
      drop: "Pierre algue, rare : Carapace \u00e9cailleuse",
    },
    108: {
      visuel3D: "m294",
      nom: "Pangolin de Crystal",
      pvmax: "95",
      skills: [
        "Charge : 2D10 +10 : Force",
        "Frappe de Crystal : 1D10+8 AoE : Intelligence",
        "Mur de Titan : D\u00e9g\u00e2t re\u00e7u -4-1D4 (3 tours) : Esprit",
        "Revers d'\u00e9caille : 3 tentatives par combat (<10 : 66%, >=10 : 33%) : Esprit",
      ],
      stats: "16,9,14,11,15",
      desc: "Un pangolin recouvert d'\u00e9cailles et de crystaux orang\u00e9s magnifiques. De nature assez craintive",
      infos: "Faible au per\u00e7ant et aux t\u00e9n\u00e8bres",
      drop: "Ecailles de Pangolin (rare x2), rare : Pierre de S\u00e9curit\u00e9 OU griffe de pangolin",
    },
    109: {
      visuel3D: "taharqa",
      nom: "Taharqa",
      pvmax: "280",
      skills: [
        "Perc\u00e9e du Guerrier : 1D6 + 1D6 + 1D4 +16 : Dext\u00e9rit\u00e9",
        "Aura Ami Marteau : Soin 2D10 +16. Prochain d\u00e9g\u00e2t +1D6+8 : Esprit",
        "Sceau du Pharaon : 1D10+12 AoE, r\u00e9ussite-2, 3 tours : Esprit",
        "Nihilit\u00e9 : 1D10+12 AoE, retire un buff : Esprit",
      ],
      stats: "12,16,11,13,17",
      desc: "Ancien pharaon noir adepte \u00e0 la magie noire, il a \u00e9t\u00e9 enferm\u00e9 \u00e0 Fl\u00e9au pour ses p\u00each\u00e9s",
      infos: "Faible \u00e0 la nature et \u00e0 la foudre",
      drop: "Tablette Antique, tr\u00e8s rare : Tenue Pharaonique",
    },
    110: {
      visuel3D: "m100",
      nom: "Gardien d'Amur",
      pvmax: "90",
      skills: [
        "Poigne de fer : 1D6+14 : force",
        "Tourbillon T\u00e9n\u00e9breux : 2D6+8 AoE : intelligence",
        "Sceau du Pharaon : 1D6+6, r\u00e9ussite-3, 3 tours : Esprit",
        "",
      ],
      stats: "16,9,16,10,15",
      desc: "Gardien du Royaume d'Amur embaum\u00e9 dans des tissus # momie",
      infos: "Faible au tranchant et \u00e0 la nature",
      drop: "Tissus de momie, rare : Pendentif Occulte, Griffe du D\u00e9sert",
    },
    111: {
      visuel3D: "m197",
      nom: "Volesang - H\u00e9raut de Guerre",
      pvmax: "300",
      skills: [
        "Coup de Corne : 3D6+16 : force",
        "Fracas Terrestre : 1D10+15 AoE : force",
        "Mort Pressante : 1D4+6 AoE sur 3 tours : intel",
        "Horreur de la Guerre : Soin 2D10+15 et renvoi les d\u00e9g\u00e2ts du prochain tour (50% 0 armure) : Esprit",
      ],
      stats: "17,9,15,11,16",
      desc: "BOSS : Grand taureau ancestral \u00e0 carapace de roc rouge\u00e2tre. Des crystaux violets pars\u00e8ment son corps. Ces crystaux am\u00e8ne la douleur",
      infos: "Faible au feu et \u00e0 la glace",
      drop: "Pierre de s\u00e9curit\u00e9, rare : Crystal de Volesang, carapace pr\u00e9cieuse",
    },
    112: {
      visuel3D: "m057",
      nom: "Ogre Corsaire",
      pvmax: "80",
      skills: [
        "Blessure Douloureuse : 2D6+12 et 0 soin (3 tours) : dext\u00e9rit\u00e9",
        "Perce-Armure  : 2D6+10 + d\u00e9g\u00e2t physique re\u00e7u +5  (3 tours) : dext\u00e9rit\u00e9",
        "Saut d'esquive : (3 fois) remplace l'esquive : tir 1D6+8 : dext\u00e9rit\u00e9",
        "Tir terrorisant : 2D6+8 : Esquive/r\u00e9ussite -2 (3 tours) : dext\u00e9rit\u00e9",
      ],
      stats: "11,17,7,10,12",
      desc: "Ogre \u00e0 la peau verte et extr\u00eamement agile",
      infos: "Faible au contondant et \u00e0 la foudre",
      drop: "Veste naturelle, rare : Fusil d'Ogre",
    },
    113: {
      visuel3D: "m228",
      nom: "Ogre Chef Shaman",
      pvmax: "240",
      skills: [
        "Totem Gracieux : 1D6 +12 pendant 6 tours (tous les 2 tours) : Intelligence",
        "Affaib All AoE : +5 d\u00e9g\u00e2t subis AoE pendant 3 tours : Esprit",
        "\u00c9clair en Furie : 3D6+14 : Intelligence",
        "Puma Noir : (Force/Dext\u00e9+5) 4 tours : saignement : 1D6+10 puis 5 pendant 3 tours (Force). Triple Griffe : 3D6+15 (Dext\u00e9rit\u00e9) : esprit",
      ],
      stats: "11,10,17,10,16",
      desc: "Ogre \u00e0 la peau noire bleut\u00e9, recouvert d'une grande cape",
      infos: "Faible au contondant et au feu",
      drop: "rare : Sceptre du Shaman, tr\u00e8s rare : Cape de sorcier",
    },
    114: {
      visuel3D: "m249",
      nom: "Z\u00e9phyr",
      pvmax: "200",
      skills: [
        "Aura Bouclier Protec : Blocage +3 pendant 4 tours : esprit",
        "Aura Ami du Marteau : Soin 2D10 +15. Prochain d\u00e9g\u00e2t +2D6+6 : intel",
        "Marteau du Scellement (Mono/AoE) : 2D6+10 / 5) AoE glace, retire un buff : intel",
        "Symphonie de guerre : D\u00e9g\u00e2t +1D6+3 AoE (3 tours) : esprit",
      ],
      stats: "5,11,16,12,17",
      desc: "Grand sage de la Curie M\u00e9t\u00e9role : Commandant (U Def) et Cardinal. Carr\u00e9 et sympa",
      infos: "Faible au per\u00e7ant et nature",
      drop: "40po, Marteau Canon Glacial, rare : Collier Asbi",
    },
    115: {
      visuel3D: "m021",
      nom: "Dragon Terrestre",
      pvmax: "300",
      skills: [
        "Tremblement Intense : 2D10 +10 AoE : force",
        "Croc/Griffe Imposante : 3D6+15 : force",
        "Hurlement Strident : (force,dext\u00e9,intel) -2 AoE sur 3 tours : esprit",
        "Passif : Euphorie (+2/coup (max 10*2)), reset quand touche",
      ],
      stats: "17,9,9,11,16",
      desc: "Grand dragon terrestre gris brun \u00e0 la peau \u00e9cailleuse et rocheuse, petites ailes",
      infos: "Faible \u00e0 la glace et \u00e0 la lumi\u00e8re",
      drop: "Ecailles de dragon, rare : Dague \u00e9cailles noires, Croc sombre",
    },
    116: {
      visuel3D: "m369",
      nom: "Dragon Fourrure Mythique",
      pvmax: "300",
      skills: [
        "Tremblement Intense : 2D10 +10 AoE : force",
        "Croc/Griffe Imposante : 3D6+15 : force",
        'Hurlement Glac\u00e9 : "Effet froid amplifi\u00e9" (-1 stat) + 1 Scarab\u00e9e : esprit',
        "Manteau Polaire : Blocage+4 pendant 2 tours, puis \u00e0 la fin d\u00e9g\u00e2t glace +2D6+6 : esprit",
      ],
      stats: "17,9,9,11,16",
      desc: "Un dragon fourrure qui sommeillait pr\u00e8s de l'Empire Dulong \u00e0 Ma\u00eblstrom, c'est une version mythique de ses semblables d'Elos",
      infos: "Faible au feu et aux t\u00e9n\u00e8bres",
      drop: "Ecailles de dragon, Fourrure Polaire, rare : Manteau Polaire, Croc Sombre",
    },
  };
  persosJSON = {
    1: {
      nom: "Draigos",
      race: "Drakai",
      classeP: "Magicien",
      classeS: "D\u00e9moniste",
      xp: "285",
      niv: "3",
      pv: "80",
      pvmax: "80",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/showcase_drakai.jpg",
      force: "8",
      "dext\u00e9": "10",
      intel: "17",
      charisme: "12",
      esprit: "14",
      forceB: "",
      "dext\u00e9B": "-1",
      intelB: "+1",
      charismeB: "",
      espritB: "-1",
      skills:
        '["Parasite Obscur","Fl\u00e8che des Ombres","Temp\u00eate de Glace","Pacte","Bombe Incendiaire","Affaiblissement Mental","Voile du Blizzard",""]',
      eqpts:
        '["Grimoire infernal","","Grimoire mal\u00e9fique","Robe \u00e9toil\u00e9e","Chapeau de champigno\u00efde","Crystal de Baltaro\u00ef","","",""]',
      inventaire:
        "3 germe de champignons\nBadge de pirate de belouga\nB\u00e2ton aux propri\u00e9t\u00e9s inconnues \n5 m\u00e9daille d'ar\u00e8ne ",
      argent: "106",
      personnalite:
        "L\u00e2che, tacticiens hors pair, le plus \u00e9rudit de sa race, ne se laisse pas marcher dessus. Il est tr\u00e8s sociable avec les gens, mais se m\u00e9fit quand m\u00eame. ",
      background:
        "Originaire du Royaume des Drakai, G\u00e9n\u00e9ral de l'arme Drakai, qui a fui les siens, car sa race se fait manipuler, il se r\u00e9volta, mais rien \u00e0 faire personne l'\u00e9coute et il a pr\u00e9f\u00e9rer fui les siens pour vivre librement.Et sur le chemin vers le Royaume D\u00e9vast\u00e9, il trouve un ch\u00e2teau en ruine et part dans la biblioth\u00e8que du moins se qu'il reste, et trouve un b\u00e2ton et un grimoire mal\u00e9fique, il \u00e9tudie le grimoire et il a apprit \u00e0 invoquer des cr\u00e9atures pour le servir au doigt et \u00e0 l'oeil, il en profitera.  ",
      notes:
        "Allez au volcan avila pour apprendre \u00e0 mon familler un sort de feu ami de Darius pirate de la baie\nB\u00e2ton voir for\u00eat de Delphes \nPanoticor bombe incendiere 1d 10",
    },
    2: {
      nom: "Erida",
      race: "Ezelin",
      classeP: "Danselame",
      classeS: "Barde",
      xp: "675",
      niv: "6",
      pv: "95",
      pvmax: "95",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Erida.png",
      force: "7",
      "dext\u00e9": "13",
      intel: "12",
      charisme: "17",
      esprit: "13",
      forceB: "",
      "dext\u00e9B": "+2",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Charme tape-\u00e0-l-oeil","Lame Dansante du Po\u00e8te","Gu\u00e9rison","Po\u00e8me du Vent","Danse de l\'oiseau de feu","Danse de la guerri\u00e8re","Encouragement Musical",""]',
      eqpts:
        '["Ep\u00e9e d\'Obsidienne","Ep\u00e9e d\'\u00e9pines","Rapi\u00e8re de givre","Gilet des Dunes","Ceinture de Volesang","Tentacule de mandragore","Parchemin de l\'\u00e9pine","Cache oeil de Pirate","Cache oeil de Pirate"]',
      inventaire:
        "2 potions de soin (2D10 +6) badge pirate + cristal de Lazurite + 5 m\u00e9daille ar\u00e8ne ceinture de tuskar \ncrochet porte bonheur + ceintures de samoura\u00ef + brassard de resistance\n3 livres dont chelona",
      argent: "121",
      personnalite:
        "Ind\u00e9pendante et espi\u00e8gle, elle d\u00e9teste la noblesse. Cependant ces origines peuvent \u00eatre aper\u00e7u \u00e0 travers son charisme.\nUne teinture 1 semaine + stick",
      background:
        "Erida von Ryner vient d'une famille noble d'une contr\u00e9 lointaine (Connais pas trop les zones ^^), reconnaissable par leurs cheveux blancs (Teint en blonde pour voyager incognito)\n\nTr\u00e8s active et intelligente lors de son enfance, elle a finit par s\u2019enfuir lorsqu'on l'a oblig\u00e9 \u00e0 se marier \u00e0 une ordure arrogante pour des raisons politiques. \nC'est alors qu'elle a rencontr\u00e9 son mentor, une humaine du nom de Sophia qui lui appris la danse et le chant.\n\nCela fait un an depuis le mariage de cette derni\u00e8re qui a arr\u00eat\u00e9 de voyager depuis, Erida continue alors seule son voyage.",
      notes:
        "Darius pirate\nChevalier de la rose\nCassidi ar\u00e8ne entra\u00eenement ' empire Valence si on veut poursuivre\nNemelio. Hiros\n\nContrefa\u00e7on et vol. \nDouvone basile\nRuby h\u00e9riti\u00e8re Heldentod\nFaible au contondant et \u00e0 la glace",
    },
    3: {
      nom: "Malvis",
      race: "Humain",
      classeP: "Luminary",
      classeS: "Chasseur",
      xp: "764",
      niv: "7",
      pv: "70",
      pvmax: "120",
      stress: "6",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Malvis1.png",
      force: "11",
      "dext\u00e9": "13",
      intel: "12",
      charisme: "11",
      esprit: "15",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "-1",
      skills:
        '["Invocation d\'Alpaga","Triple Tir","Coupure Noire","Destruction de l\'aurore","Pri\u00e8re Divine","Sacrifice d\'Ombre Noire","Assaut du Chaos","Fl\u00e8che Eblouissante"]',
      eqpts:
        '["Ep\u00e9e des Plaines Dor\u00e9es","Ep\u00e9e d\'Asbi","Arc du Dompteur","Robe l\u00e9g\u00e8re","Brassard de Nihilit\u00e9","Viseur High Tech","Sac d\'Alpaga Dor\u00e9","Brassard du h\u00e9ros","Brassard du h\u00e9ros"]',
      inventaire:
        "Monture Avocat Alpaga -> Brocoli\n1 semaine de repas Alpaga\n10 m\u00e9daille d'ar\u00e8ne\nCristal asbi \u00d72\nChapeau de capitaine\nCrystal de Volesang\nPendentif occulte\nCroc de Smilodon\n2 fragment des cristaux eden\nCarapace tortue\nPierre algue\nMoi :\nBadge pirate\nLivre sur les drakais\nSac friandises poudre un reste\nPotion de confusion \u00d71\nParchemin langue chelou \n",
      argent: "48",
      personnalite:
        "Malvis: joviale, drôle, mignonne,fonce dans le tas, attire les problèmes, ne sait pas chanter.",
      background:
        "Malvis est originaire de la haute terre et vit avec sa famille dans une ferme d'alpaga. Son p\u00e8re, puis son fr\u00e8re jumeau Milo qui a pris le relais, a poursuivi son exploration pour trouver les alpagas les plus rares au monde << alpagas dor\u00e9s >>. Cependant lors d'une exp\u00e9ditions son fr\u00e8re Milo meurt tragiquement. \nElle doit donc prendre sa place pour trouver des alpagas uniques, n\u00e9anmoins elle ne sera jamais vraiment seule lors de ses exp\u00e9ditions car l'\u00e2me de son fr\u00e8re a trouv\u00e9 refuge dans sa folie.\n",
      notes:
        "Rumbledor magicien qui vit au bourbes chelona-> anti dieu faire r\u00e9appara\u00eetre (x\u00e9nophobie) -> marais decrepi et sud ouest\nRomy ing\u00e9nieur mines (ami)\nTorturans for\u00eat arc en ciel\nMamie dans la coline tranquille\nLassar -> chef exp\u00e9dition au sein de la curimeterol (mec)\nBilly -> commer\u00e7ant Alpaga.\nSteve le corsaire (ami)\nMaesly fille ing\u00e9nieur Alpaga d\u00e9sert \nTemplier 3vs3 -> Sora\nVoleur 3vs3 -> Dalas\nMarma Templier chef d'une unit\u00e9 d\u00e9fense curie meterole (Milo)(ami)\nUrsina\nMoyemoye-> Zumi robot\nAdonis -> tueur enfui\nKasar - braconnier qui connait Milo\n\nFaible au contondant et \u00e0 la foudre",
    },
    4: {
      nom: "Eivor",
      race: "Zumi",
      classeP: "Voleur",
      classeS: "Juge",
      xp: "320",
      niv: "4",
      pv: "61",
      pvmax: "110",
      stress: "50",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Eivor.jpg",
      force: "12",
      "dext\u00e9": "16",
      intel: "7",
      charisme: "12",
      esprit: "14",
      forceB: "",
      "dext\u00e9B": "(-4)",
      intelB: "",
      charismeB: "",
      espritB: "+1",
      skills:
        '["Furtivit\u00e9","Aura du Pourfendeur","Embuscade","Scellement","Attaque Rapide","\u00c2me encha\u00een\u00e9e","\u00c2me encha\u00een\u00e9e","Int\u00e9gration"]',
      eqpts:
        '["Faucille tranche-r\u00eave","Faucille Rouill\u00e9e","Bouclier du D\u00e9mon","Veste rafistol\u00e9","Ceinture Tuskar","Bougie de l\'Espoir","Miroir de la V\u00e9rit\u00e9","","Bague de vigueur"]',
      inventaire:
        "6 potions de vie (1 des 10 +6)\n2 cristaux\nFaucille de l'esprit\nGriffe de l'esprit\nFaucille rouill\u00e9\n1 bougie de l'espoir",
      argent: "46",
      personnalite:
        "Grand voleur qui a fait plusieurs aller retour en prison. Tr\u00e8s cool mais surtout avec les riches qu'on peut voler. Fait le boulot que si cela est pay\u00e9.\nPhrase pr\u00e9f\u00e9r\u00e9 : l'argent tombe pas du ciel / vous m'avez pris pour dieu  je suis pas aussi g\u00e9n\u00e9reux \nCause : Punir ce qui font du mal au enfant et tout ce qui trahis (traite)\n\nPeurs : il a peur d'\u00eatre trahi car il l'a v\u00e9cu (par des gens qu'il appr\u00e9ciait vraiment). Il a peur de la mort. Peur de la pauvret\u00e9 # parent. + Peur du vide.",
      background:
        "Zumi originaire du d\u00e9sert, venant du famille pas super riche. Il a d\u00e9cid\u00e9 de voler plut\u00f4t que travailler car il a vu ses parents trimer pour peu d'argent. \nA 17 ans premi\u00e8re fois en prison ou il apprend avec un juge certaines comp\u00e9tences.\nDeuxi\u00e8me fois \u00e0 18 ans, am\u00e9lioration de certaines comp\u00e9tences de juge et Voleur\nTroisi\u00e8me fois 24 ans \nAujourd'hui il a 26 ans et vient de voler un bouclier rare (Pourpre) et un artefact (Perle Noire) de la curie m\u00e9t\u00e9role dans leur r\u00e9serve avec d'autres gens et il s'est barr\u00e9 avec le butin\n",
      notes: "",
    },
    5: {
      nom: "Marek",
      race: "Ursun",
      classeP: "Assassin",
      classeS: "Samoura\u00ef",
      xp: "375",
      niv: "4",
      pv: "83",
      pvmax: "140",
      stress: "47",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/20120315111750829fc.png",
      force: "17",
      "dext\u00e9": "12",
      intel: "6",
      charisme: "10",
      esprit: "16",
      forceB: "",
      "dext\u00e9B": "-2",
      intelB: "",
      charismeB: "",
      espritB: "0",
      skills:
        '["Perce-Armure","Faiblesse Critique","Foi du Temple","Contr\u00f4le de l\'Energie","Cicatrice de l\'esprit","Purgatoire","",""]',
      eqpts:
        '["Griffe enchant\u00e9e","Griffe en Acier renforc\u00e9","Katana Entaille-cerisier","Veste des Hautes-terres","Crochet porte bonheur","Chapeau d\'Ursun","","Gantelet de Lieutenant","Bouclier d\'Asbi"]',
      inventaire:
        "Potion de soin x1 (1D10 + 6)\nPotion de resistance x1 (deg -4 4 tours)\nPotion de concentration x2 (esp +2 4 tours)\nPince de crabe\nPierre algue\nDent geante\n\n",
      argent: "52",
      personnalite: "Yves",
      background:
        "Avant que sa formation de moine ne se termine, Marek quitte les Crocs Brumeux pour chercher le sens de la vie. Il s'engage en tant que mercenaire dans l'Empire Heldentod et participe \u00e0 la 3e Guerre de Valence. Apr\u00e8s la guerre, il quitte l'Empire, toujours en qu\u00eate du sens de la vie. Ses nombreux voyages l'am\u00e8nent aux 4 coins de la Kentros.",
      notes: "undefined",
    },
    6: {
      nom: "Fiore dei San Didero",
      race: "Humain",
      classeP: "Chevalier",
      classeS: "Danselame",
      xp: "160",
      niv: "2",
      pv: "95",
      pvmax: "95",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/348359304_190107367330388_8040385080561189443_n.png",
      force: "12",
      "dext\u00e9": "15",
      intel: "7",
      charisme: "15",
      esprit: "12",
      forceB: "+1",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Vivacit\u00e9 Accrue","Charme tape-\u00e0-l-oeil","Perce-Armure","Lames Dansantes","Perc\u00e9e du Chevalier","","",""]',
      eqpts:
        '["Ep\u00e9e de c\u00f4t\u00e9 jumelle","Ep\u00e9e de c\u00f4t\u00e9 jumelle","","Plastron de garde","","","","",""]',
      inventaire:
        "2 potions de vie\nPi\u00e8ce d'or de la Marina d'Edouard\nPendentif de la maison dei San Didero\nBrevet de lieutenant de l'arm\u00e9e de Braider (d\u00e9chir\u00e9)",
      argent: "40",
      personnalite:
        "Hautaine et arrogante. Narcissique pure.\nNe fait que ce qui l'int\u00e9resse mais loyale envers ceux qui ont gagn\u00e9 sa sympathie.",
      background: "\u5350",
      notes:
        "8 ans : apprend l'escrime\n15 ans : lieutenant dans la compagnie lieutenante-colonelle du R\u00e9giment des Gardes de Braider et d\u00e9but de la Troisi\u00e8me Guerre de Valence\n21 ans : exclue de l'arm\u00e9e\n23 ans : exil\n28 ans : mtn",
    },
    7: {
      nom: "Cosmos",
      race: "Torturran",
      classeP: "Templier",
      classeS: "Shaman",
      xp: "485",
      niv: "5",
      pv: "91",
      pvmax: "135",
      stress: "-6",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Race_Torturran2.jpg",
      force: "11",
      "dext\u00e9": "8",
      intel: "16",
      charisme: "12",
      esprit: "15",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "+1",
      skills:
        '["Lumi\u00e8re Sacr\u00e9e","Lumi\u00e8re de Gu\u00e9rison","Coup Infernal","Bouclier d\'\u00e9pines","Totem Gracieux","Pr\u00e9vention","\u00c9clair en Furie","R\u00e9surrection"]',
      eqpts:
        '["Masse de lumi\u00e8re","Ep\u00e9e Verdoyante","Bouclier de l\'esprit","Plastron des plaines","Noyau de Schiste","Anneau curatif","Calice de la Curie M\u00e9t\u00e9role","Gourde Miraculeuse","Gourde Miraculeuse "]',
      inventaire:
        "2 potions de soin (1D10 +6)\nEp\u00e9e en Acier centure\nPlastron de garde\nCenture Tuskar \nAmulette d'exp\u00e9rience\nBouclier d'acier\nCrochet enchant\u00e9\nDague dent\u00e9e\n\n",
      argent: "82",
      personnalite:
        "Courageux, gentil et sociable , toujours pr\u00eat \u00e0 aider les autres, par contre pour un combat, je suis toujours l\u00e0 \u00e0 foncer dans le tas !!!\n\n",
      background:
        "Mercenaire de la Curie M\u00e9t\u00e9role, Cosmos est \u00e0 la recherche d'argent pour s'am\u00e9liorer et pour aider les autres.\nJe suis devenu Templier en me formant gr\u00e2ce \u00e0 des membres de la Curie. Puis je suis devenu Shaman en allant \u00e0 l'Acad\u00e9mie Osrage aux Marais D\u00e9cr\u00e9pis, je me suis fait un meilleur ami nomm\u00e9 Kyle.\nJ'ai eu une mission que je devais faire dans un camp de Tuskars, mais ils ne m'ont pas accept\u00e9 car j'\u00e9tais un Torturran, du coup, j'ai cherch\u00e9 un alchimiste un peu fou qui m'a fabriqu\u00e9 une potion pour devenir un Tuskar temporairement, la potion a fonctionn\u00e9 mais l\u00e0, \u00e7a fait d\u00e9j\u00e0 1 mois que j'ai bu la potion qui sais peut \u00eatre que la potion va se dissiper un moment? xD\nAujourd'hui j'ai entendu parler de la Chelona et je cherche un groupe pour les aider \u00e0 les vaincre et progresser.",
      notes: "Faible \u00e0 la glace et aux t\u00e9n\u00e8bres ",
    },
    8: {
      nom: "Aradia",
      race: "Ezelin",
      classeP: "Illusionniste",
      classeS: "D\u00e9moniste",
      xp: "396",
      niv: "4",
      pv: "90",
      pvmax: "90",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Aradia3.jpg",
      force: "5",
      "dext\u00e9": "11",
      intel: "15",
      charisme: "13",
      esprit: "17",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Pacte","Voile du Blizzard","Contr\u00f4le de l\'Esprit","Oeil Hypnotique","Hommage","Parasite Obscur","Infection Pullulante","Menaces Mortelles"]',
      eqpts:
        '["Grimoire corrosif","","B\u00e2ton mal\u00e9fique","Robe de Lucius","Charme d\'Exp\u00e9rience","Plume brillante","Pelote d\'entrave","","Pendentif occulte"]',
      inventaire: "Robe duveteuse",
      argent: "26",
      personnalite:
        "Personne atteinte de chuunibyou : Elle se croit \u00eatre Aradia, g\u00e9n\u00e9ral de l'arm\u00e9e de d\u00e9mon du nord, soeur de Lucifer lui-m\u00eame.\nCe personnage incarn\u00e9 permet d\u2019\u00e9chapper \u00e0 sa timidit\u00e9 et lui donne le courage de se rapprocher des autres.\n\nMalgr\u00e9 cette particularit\u00e9 et son insouciance, elle n'a pas mauvais fond et n'h\u00e9sitera pas \u00e0 prendre sous son \"commandement\" les personnes qui en ont besoin.\n",
      background:
        "Son vrai nom est Adelaide von Ryner, cousine \u00e9loign\u00e9 de Erida von Ryner.\n\nTrop loin de la succession et ne pr\u00e9sentant aucun r\u00e9sultat probant lors de son \u00e9ducation, elle n'a pas \u00e9t\u00e9 touch\u00e9 par les jeux de l'aristocratie.\nDe ce fait, elle s'isolait dans la biblioth\u00e8que pour lire un peu de tout, elle a pu ainsi apprendre sa premi\u00e8re profession illusionniste.\nElle \u00e9tait passionn\u00e9 par les histoires de h\u00e9ros et de d\u00e9mon mais principalement par le c\u00f4t\u00e9 des d\u00e9mons et c'est ainsi que Aradia, g\u00e9n\u00e9ral de l'arm\u00e9e de d\u00e9mon du nord, naquit. Elle se concentra alors pour essayer d'invoquer son premier familier.\n\nUn jour, Erida s'enfuit du fief et la famille \u00e9tait en panique afin de trouver une rempla\u00e7ante au mariage. Par chance, l'\u00e9tranget\u00e9 de la librairie ne fut m\u00eame pas consid\u00e9r\u00e9 :)\n\nApr\u00e8s de nombreuse tentative, elle pu invoqu\u00e9 et pactis\u00e9 avec son premier d\u00e9mon : (Anthith\u00e9e : d\u00e9mone mineure illusionniste) --> A voir si et comment on peut int\u00e9grer cela au Panopticor/Alternative (Trait noire on conserve, fouet \u00e0 la place de tentacule et \u00e0 voir si \u00e9volution futur?).\n\nElle laissa alors un mot dans la biblioth\u00e8que avant de partir : \nMoi, Aradia, g\u00e9n\u00e9ral de l'arm\u00e9e de d\u00e9mon du nord et soeur de Lucifer, d\u00e9clare ici pr\u00e9sent le d\u00e9but de la conqu\u00eate du monde.\n\n",
      notes:
        "Anurant bourbe scell\u00e9 livre.\nScl\u00e9rose pic de maelsrom\nLumi\u00e8re et tranchant",
    },
    9: {
      nom: "War",
      race: "Humain",
      classeP: "Samoura\u00ef",
      classeS: "Chevalier",
      xp: "425",
      niv: "5",
      pv: "61",
      pvmax: "130",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/War.jpg",
      force: "17",
      "dext\u00e9": "13",
      intel: "5",
      charisme: "12",
      esprit: "15",
      forceB: "+2blo",
      "dext\u00e9B": "",
      intelB: "-1+2 blo",
      charismeB: "",
      espritB: "",
      skills:
        '["Coupe Asura","Eclair unique","Silence","Fr\u00e9n\u00e9sie des Ogres","Perce-Armure","Purgatoire","Purgatoire","Vivacit\u00e9 Accrue"]',
      eqpts:
        '["Katana Lame Noire","","","Plastron d\'Ogre","Pierre de s\u00e9curit\u00e9","Crochet porte bonheur","Noyau charg\u00e9 de Stella","Gantelet Noireflammes","Gantelet Noireflammes"]',
      inventaire:
        "1 potions de soin (2D10 +6)\nEcaille d'Ankylosaure\nFiole de jus de larve de reine insecte \n\n",
      argent: "17",
      personnalite:
        "pas tr\u00e8s aimable et pas tr\u00e8s malin, il  respecte le code honneur des samourai et il est toujours pret pour combat et \u00e0 acharn\u00e9 et peu vite perdre un peu les p\u00e9dales mais s'arrete toujours avant que l'adversaire ne clames. Ce m\u00e9fit des races vu son histoire.",
      background:
        "Il a \u00e9tait Adopter par des ogres quand il \u00e9tait qu'un nourrisson, il a apprit \u00e0 ce battre comme les ogres et devient un grand combattant, tout le monde le craignent, car en combat intense il perd son controle de son esprit, mais il peut \u00eatre facilement revenir \u00e0 lui soit quand l'adversaire est un terre ou inconscient ou quand une ou plusieurs personnes dire de s\u2019arr\u00eater. Puis un jour, pendant qu'il est parti chercher du gibier, il retrouve son camps en feu, toute sa tribut d\u00e9cimer, par des humains, il les a combattue mais ils \u00e9tait trop nombreux, ils l'ont laisser pour mort et il entendu un soldat dire qu'ils sont des soldats de l'empire heldentod, puis \u00e0 son r\u00e9veille, dans un village d'humain, tr\u00e8s gentil, une fois soigner il remercie les habitants et part \u00e0 la recherche d'un groupe de personne qu'ils soient assez fort pour qu'il l'aide \u00e0 se venger des siens.",
      notes: "Faible au per\u00e7ant et \u00e0 la glace ",
    },
    10: {
      nom: "Nyx",
      race: "Humain",
      classeP: "Magicien",
      classeS: "Barde",
      xp: "314",
      niv: "4",
      pv: "85",
      pvmax: "85",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Nyx.jpg",
      force: "6",
      "dext\u00e9": "9",
      intel: "16",
      charisme: "14",
      esprit: "16",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "+1",
      espritB: "",
      skills:
        '["Encouragement Musical","R\u00e9surrection","Explosion Glaciale","Voile du Blizzard","Brisure Vibrante","Eclair charg\u00e9","Eclair charg\u00e9","Symphonie D\u00e9moniaque"]',
      eqpts:
        '["Guitare Electronique","","","Tenue d\'Idole","Pantoufles Discr\u00e8tes","Pierre de Chance","Charme d\'Exp\u00e9rience","Oreillette-micro","Oreillette-micro"]',
      inventaire:
        "2 Potion de vie (2 d\u00e9 10 +6)\nPotion de paillettes Hans ribo\nRobe de l'hiver",
      argent: "45",
      personnalite:
        "Jovial joyeux prend peu de chose au s\u00e9rieux un peu folle folle. Tr\u00e8s curieuse.\nVeut faire plaisir et sourire les gens. Toujours souriante et enjou\u00e9e.\nDes fois a vouloir \u00eatre un peu trop parfaite. Et prend un peu mal de ne pas \u00eatre connu \nCheveux rose et yeux bleu.\n\nChanteuse connue ",
      background:
        "Nyx est une jeune fille de 23 ans qui a commenc\u00e9 la musique \u00e0 l'\u00e2ge de 5 ans pour remonter le moral des troupes qui partez en guerre \u00e0 l'\u00e9poque. Fan de musique et de chant elle a pris des cours dans son empire Heldentod et puis \u00e0 l'\u00e2ge de 15 ans d\u00e9cide de visiter le monde pour s'am\u00e9liorer.\nA 18 commence les concerts dans les bar un peu partout pour voire les gens sourire et se d\u00e9tendre.\nConnu comme chanteuse professionnelle \u00e0 20 ans un peu partout, s'amuse \u00e0 faire des apparitions non pr\u00e9vus dans certains festivals.\nTop 10 chanteuse s\u00fbr.",
      notes:
        "Sofia acad\u00e9mie marais Osrage\nHector acad\u00e9mie marais \nBalder chef de ville vall\u00e9e des rois\nLaura installation pour spectacle \nTitouan fan pour le festival \nFaible au contondant et au feu",
    },
    11: {
      nom: "Xiuhxin",
      race: "Humain",
      classeP: "Chev Dragon",
      classeS: "Guerrier",
      xp: "3000",
      niv: "22",
      pv: "115",
      pvmax: "115",
      stress: "1",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Guerriers.jpg",
      force: "15",
      "dext\u00e9": "9",
      intel: "7",
      charisme: "15",
      esprit: "15",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Mode Draconique","Revers d\'\u00e9caille","Euphorie","Armure Draconique","Provocation de Groupe","Attaque Cyclone","Terreur du Dragon","Pouvoir du dragon"]',
      eqpts: '["","","","","","","","",""]',
      inventaire: "",
      argent: "50",
      personnalite: "",
      background: "",
      notes: "",
    },
    12: {
      nom: "Kry\u00e8ri",
      race: "Ogre",
      classeP: "Clerc",
      classeS: "Luminary",
      xp: "301",
      niv: "4",
      pv: "90",
      pvmax: "90",
      stress: "271",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Kryeri.jpg",
      force: "12",
      "dext\u00e9": "8",
      intel: "16",
      charisme: "12",
      esprit: "13",
      forceB: "+3",
      "dext\u00e9B": "",
      intelB: "+3",
      charismeB: "",
      espritB: "15",
      skills:
        '["Gu\u00e9rison","Coupure Noire","Sacrifice d\'Ombre Noire","Pri\u00e8re Divine","Ch\u00e2timent Sacr\u00e9","Saut Dimensionnel","",""]',
      eqpts:
        '["Grimoire de l\'apprenti","","","Tunique de Delphes","Noyau abyssal","Anneau du rem\u00e8de","","",""]',
      inventaire: "Carapace de tortue\nFusil de guerre",
      argent: "28",
      personnalite:
        "Femme avare et cupide, peut d\u00e9sob\u00e9ir aux principes de la Curie pour sa propre cause (corruption, gain d'argent, ...).\nEst aussi assez rancuni\u00e8re.\n\nCependant, est capable d'aider et de prendre des bonnes d\u00e9cisions, mais pas au prix de sa personne.\nA dans ses principes le fait de ne pas vouloir devenir redevable, et de refuser trop de charit\u00e9.",
      background:
        "Ogresse Clerc travaillant pour la Curie M\u00e9t\u00e9role.\nA \u00e9t\u00e9 form\u00e9 par son tuteur et sa famille qui a envie de faire de lui un grand clerc de la Curie.\nCependant, les autres de la Curie ne l'accepte pas enti\u00e8rement, de part sa personnalit\u00e9 et son comportement anormal. Kry\u00e8ri est donc un peu \u00e0 part de la Curie.",
      notes: "Faible au tranchant \u00e0 la nature",
    },
    15: {
      nom: "Kibo",
      race: "Zumi",
      classeP: "Guerrier",
      classeS: "Ing\u00e9nieur",
      xp: "378",
      niv: "4",
      pv: "38",
      pvmax: "120",
      stress: "-12",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/zumi4.png",
      force: "12",
      "dext\u00e9": "14",
      intel: "8",
      charisme: "12",
      esprit: "15",
      forceB: "+3",
      "dext\u00e9B": "-2 S (-1)",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Provocation de Groupe","Charge du Guerrier","Robotisation","R\u00e9paration Armure","Mur de Titan","Protection Absolue","Attaque Cyclone","Euphorie"]',
      eqpts:
        '["Masse en Acier","Bouclier d\'\u00e9pines","","Plastron de garde","Pierre de s\u00e9curit\u00e9","Bottes de Guerre","Pendentif du Croc Brumeux","",""]',
      inventaire:
        "2 Potion de vie (2 d\u00e9 10 +6)\n\n1 m\u00e9daille en chocolat du tournoi versatile ",
      argent: "5 pi\u00e8ces, plus que toutes les s\u00e9ances d'avant",
      personnalite:
        "Kibo est une petite souris qui r\u00eave de devenir grande. L'espoir et l'optimisme le guide tout au long de son chemin. Il a un sens obtus de la justice et tentera de venir en aide \u00e0 ceux qui s'\u00e9cartent du droit chemin, il s'est jur\u00e9 de prot\u00e9ger aussi bien ses amis que ses principes.\n\nLa cr\u00e9dulit\u00e9 fait partie de son quotidien, si bien qu'il est la cible r\u00e9guli\u00e8re d'arnaques qui l'ont d\u00e9pouill\u00e9 de ses richesses.\n\nIl se refuse cat\u00e9goriquement \u00e0 tuer les humano\u00efdes. ",
      background:
        "N\u00e9 de riches parents ing\u00e9nieurs, Kibo a longtemps voyag\u00e9 dans d'autres contr\u00e9es lointaines avec ses parents, qui lui ont transmis leur go\u00fbt prononc\u00e9 pour la m\u00e9tallurgie. Kibo s'est tr\u00e8s t\u00f4t passionn\u00e9 pour un conte de super-h\u00e9ro pour enfant tr\u00e8s populaire chez les Zumis : Zuminator, devenant son idole de justice et de droiture. \n\nIl voyage maintenant \u00e0 travers du monde en accomplissant son r\u00eave : r\u00e9pandre le bien ",
      notes:
        "N'accepte pas de tuer des humano\u00efdes, et n'utilise aucune arme tranchante\n\nNote \u00e0 Valentin : si il arrive \u00e0 Kibo de tuer, fais de moi ce que tu veux :P\nFaible \u00e0 la foudre et aux t\u00e9n\u00e8bres ",
    },
    14: {
      nom: "Rad Ed",
      race: "Torturran",
      classeP: "Assassin",
      classeS: "Ing\u00e9nieur",
      xp: "382",
      niv: "4",
      pv: "16",
      pvmax: "120",
      stress: "0",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Torturran1.png",
      force: "14",
      "dext\u00e9": "15",
      intel: "9",
      charisme: "10",
      esprit: "13",
      forceB: "9 bloc",
      "dext\u00e9B": "16/ -1rob",
      intelB: "",
      charismeB: "",
      espritB: "6 bloc",
      skills:
        '["Attaque Furieuse","Faiblesse Critique","Robotisation","Bombe \u00e0 Huile","Transe - Mode Tueur","","",""]',
      eqpts:
        '["Fusil d\'Ogre","Griffe en Acier renforc\u00e9","Ep\u00e9e de parade","Veste naturelle","Lunettes Anciennes","Glyphe des Ursuns","","",""]',
      inventaire:
        "1 Potion de vie (2 d\u00e9 10 +6)\n100 g de haricots de Arish le commer\u00e7ant de haricot (rencontr\u00e9 dans un dirigeable). Plaine dor\u00e9e \nVeste rafistol\u00e9e (d\u00e9g\u00e2t -4)\n5 carapaces de tortue\nH\u00e2che d\u00e9fensive (arme)",
      argent: "41",
      personnalite:
        "Rad Ed est une adolescente insouciante, qui agit comme une jeune enfant.\nElle est tr\u00e8s sociable et parle facilement avec n'importe qui; comme une enfant, un simple bonjour suffit pour \u00eatre ami !\nQuand elle passe en mode tueuse, sa concentration est intense et rien ne pourrait la d\u00e9tacher de sa cible.\nElle est incapable de tuer un Ursun, les consid\u00e9rant comme des amis.\n",
      background:
        "Ses parents faisaient partis du culte qui s'est form\u00e9 dans la race des Torturrans (la Chelona), vivant dans un palais recul\u00e9. Rad Ed a failli mourir \u00e0 ses 6 ans, car choisie pour \u00eatre sacrifi\u00e9e. Lors de la c\u00e9r\u00e9monie de sacrifice, un Ursun est apparu et a d\u00e9cim\u00e9 l'enti\u00e8ret\u00e9 du groupe. Rad Ed est \u00e9pargn\u00e9. C\u2019\u00e9tait il y a 10/15 ans. La gamine vit seule parmi les cadavres, lisant et s'amusant avec des outils m\u00e9caniques et technologiques. Elle s'habitue \u00e0 tuer chaque intru venant au palais avec les outils qu'elle cr\u00e9e, imitant l'Ursun qui l'a sauv\u00e9.\nBien assez t\u00f4t, Rad Ed d\u00e9couvre que son sauveur s'appelle Ein, dans un journal sur le cadavre d'une de ses victimes. Elle quitte son palais pour retrouver Ein (qu\u00eate personnelle).\n",
      notes:
        "La pelote d\u2019entrave s\u2019appelle Burma (donn\u00e9e \u00e0 Aradia)\nFaible au per\u00e7ant et au feu\n\nEin retrouv\u00e9 au Crocs Brumeux; nouvelle qu\u00eate : retrouver la griffe du fr\u00e8re d\u2019Ein et lui rapportait (seules Rad Ed et Nyx sont au courant.)\n",
    },
    0: {
      nom: "",
      race: "Humain",
      classeP: "",
      classeS: "",
      xp: "00000",
      niv: "1",
      pv: "85",
      pvmax: "85",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/AssassinF.jpg",
      force: "",
      "dext\u00e9": "",
      intel: "",
      charisme: "",
      esprit: "",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["","","","","A la Charge ! ","Gu\u00e9rison","Blessure Douloureuse","Saut d\'esquive"]',
      eqpts: '["","","","","","","","",""]',
      inventaire: "2 Potion de vie (2 d\u00e9 10 +6)",
      argent: "50",
      personnalite: "",
      background: "",
      notes: "",
    },
    16: {
      nom: "Estia Ryujin",
      race: "Humain",
      classeP: "Samoura\u00ef",
      classeS: "Chev Dragon",
      xp: "284",
      niv: "3",
      pv: "36",
      pvmax: "120",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/Estia.jpg",
      force: "16",
      "dext\u00e9": "12",
      intel: "7",
      charisme: "12",
      esprit: "14",
      forceB: "+1",
      "dext\u00e9B": "+2",
      intelB: "",
      charismeB: "",
      espritB: "courage",
      skills:
        '["Coupe Asura","Dash Foudroyant","Purgatoire","Mode Draconique","Armure Draconique","Pouvoir du dragon","Terreur du Dragon","Revers d\'\u00e9caille"]',
      eqpts:
        '["Katana Plume","","","Plastron de garde","Gourde Miraculeuse","Amulette d\'exp\u00e9rience","","",""]',
      inventaire: "1 potion 2 des 10 +6\nPlastron en mailles",
      argent: "5",
      personnalite:
        "Peureuse, et pas de confiance en soi. Pr\u00e9f\u00e8re \u00e9viter les combats et conflits, mais \u00e0 cause de son h\u00e9ritage de samoura\u00ef essayera toujours de prot\u00e9ger les plus faibles m\u00eame si elle se fait dessus ",
      background:
        "Vient d'une grande famille de samoura\u00ef \" Ryujin\" respecter de Valence. Elle devra prendre le titre de chef de famille prochainement. Cependant \u00e9tant de nature peureuse et n'ayant pas confiance en elle, ses parents lui disent d'aller aider des gens dans le monde pour combattre ses peurs ridicules d'apr\u00e8s eux. \nCependant dans son sang ne coule pas que l'honneur de samoura\u00ef, mais aussi celui d'un chevalier dragon qui ne s'\u00e9tait pas r\u00e9veill\u00e9 dans sa famille depuis des g\u00e9n\u00e9rations. O\u00f9 ce sang se serait d\u00e9j\u00e0 r\u00e9veill\u00e9... ?! mais aurait d\u00fb \u00eatre cach\u00e9 par la famille due aux conflits opposant les deux empires.",
      notes: "",
    },
    13: {
      nom: "Borak",
      race: "Torturran",
      classeP: "Magicien",
      classeS: "Sage",
      xp: "375",
      niv: "4",
      pv: "91",
      pvmax: "95",
      stress: "75",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/TorturranMage.jpg",
      force: "9",
      "dext\u00e9": "6",
      intel: "17",
      charisme: "12",
      esprit: "17",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Saut Dimensionnel","Temp\u00eate de Glace","Aura : Bouclier protecteur","Aura : Ami du Marteau","Voile du Blizzard","Eclair charg\u00e9","",""]',
      eqpts:
        '["B\u00e2ton de Delphes","","","Robe duveteuse","Bouquin Pare-balle","Collier d\'Asbi","Crochet enchant\u00e9","Bijou Aurique","Bijou Aurique"]',
      inventaire:
        "Potion de soin X2 (1D10 + 6)\nDent g\u00e9ante et \u00e9cailles de poisson\nHerbe de provence\nGriffe du mino\nAnneau du rem\u00e8de\n",
      argent: "50",
      personnalite: "",
      background: "",
      notes: "",
    },
    17: {
      nom: "Mania",
      race: "Ezelin",
      classeP: "Chev Dragon",
      classeS: "Assassin",
      xp: "100",
      niv: "2",
      pv: "100",
      pvmax: "100",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/ChevalierDragonE.png",
      force: "15",
      "dext\u00e9": "12",
      intel: "7",
      charisme: "13",
      esprit: "14",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Mode Draconique","Contr\u00f4le de l\'Energie","Pouvoir du dragon","Transe - Mode Tueur","Griffures Noires","Armure Draconique","Perce-Armure","Faiblesse Critique"]',
      eqpts: '["","","","","","","","",""]',
      inventaire:
        "Cahier de note sur tout les plats qu'elle mange. (Ce cahier de note sert aussi pour noter le plaisir qu'elle a eu a tuer, plus la proie est difficile plus c'est dr\u00f4le)",
      argent: "50",
      personnalite:
        "Jeune fille tr\u00e8s folle qui aime tuer et manger. Rien ne l'arr\u00eate quand elle a un contrat, que se soit des vieux ou des enfants elles tueras son contrat et les gens qui l'emp\u00eacherons. ",
      background:
        "Mania est une jeune fille entra\u00een\u00e9 depuis son enfance par l'empire Heldentod. Entra\u00eene a tu\u00e9 sans remords, elle devient assassins et tue sa premi\u00e8re cible \u00e0 10 ans sans laisser de traces. Travaillant pour empire elle a particip\u00e9 au massacre d'un camp d'orgre a 18 ans pour f\u00eater sa majorit\u00e9. Aujourd'hui elle a 20 ans est tue quand elle est envoy\u00e9. La seul choses qui reste apr\u00e8s son passage, est le repas qu'elle a mang\u00e9 tout en torturant la personne qu'elle devait tuer.",
      notes: "",
    },
    18: {
      nom: "Test",
      race: "Torturran",
      classeP: "Chev Dragon",
      classeS: "Shaman",
      xp: "1000",
      niv: "9",
      pv: "115",
      pvmax: "115",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/TorturranGuerrier.jpg",
      force: "13",
      "dext\u00e9": "7",
      intel: "13",
      charisme: "13",
      esprit: "15",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Mode Draconique","Puma Noir","Bouclier d\'\u00e9pines","Totem Gracieux","Revers d\'\u00e9caille","Armure Draconique","Pouvoir du dragon","Terreur du Dragon"]',
      eqpts: '["","","","","","","","",""]',
      inventaire: "",
      argent: "60",
      personnalite: "",
      background: "",
      notes: "",
    },
    19: {
      nom: "C\u00e9leste",
      race: "Humain",
      classeP: "Corsaire",
      classeS: "Sage",
      xp: "0",
      niv: "1",
      pv: "85",
      pvmax: "85",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/LuminaryCool.jpg",
      force: "11",
      "dext\u00e9": "11",
      intel: "12",
      charisme: "13",
      esprit: "14",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Tir de Pr\u00e9cision","S\u00e9r\u00e9nit\u00e9","Aura : Bouclier protecteur","Aura : Ami du Marteau","A la Charge ! ","Gu\u00e9rison","Blessure Douloureuse","Saut d\'esquive"]',
      eqpts: '["","","","","","","","",""]',
      inventaire: "2 Potion de vie (2 d\u00e9 10 +6)",
      argent: "50",
      personnalite:
        "Jeune femme aux cheveux long et blanc comme neige, et qui \u00e0 des yeux rouge. Elle aime voyager en groupe, explorer le monde, aider les gens, mais elle est un peu enfantine et persistante. Elle a toujours une \u00e9p\u00e9e qui s'en sert pas mais pour elle sa reste styl\u00e9 et utilise des pistolets, comme les corsaires.",
      background:
        "elle est n\u00e9e \u00e0 la capital d'Aven, quand elle a eu ces 16ans, elle aimais voyager dans le monde. Comme l'\u00e9quipage du grand corsaire Mihawk. Puis un jour, il a d\u00e9barquer \u00e0 Aven pour des affaires, elle est partir le voir pour lui demander de rejoindre son \u00e9quipage et devenir comme lui un grand corsaire. Mais il refusa. T\u00eatue, comme elle est, elle persiste d'heure en heure, de jour en jour. Puis Mihawk accepta d\u00e9sesp\u00e9rer. Puis fut, un assez long voyage en compagnie du grand corsaire. Il m'a apprit comment \u00eatre un bon corsaire pendant 2 ans, il m'a proposer d'aller \u00e9tudier la classe sage, car j'aime soutenir mes allier (soin, buff), avec l'ordre des chevaliers de la rose, il m'a conduit jusqu'\u00e0 la falaise des grand vents pour \u00eatre recruter et apprendre la classe sage pendant 2 ans, mais en fin d'\u00e9tude apr\u00e8s avoir devenue une sage, j'ai eu des rumeurs comme quoi le grand corsaire Mihawk \u00e0 \u00e9tait tuer lors d'une bataille et que apr\u00e8s toute son \u00e9quipage avait \u00e9t\u00e9 dissous. Elle \u00e9tait choqu\u00e9 par cette nouvelle, et \u00e0 d\u00e9cide de devenir comme lui, qui \u00e9tait pr\u00eat \u00e0 aider les gens. ",
      notes: "",
    },
    20: {
      nom: "Azora",
      race: "Ogre",
      classeP: "Clerc",
      classeS: "Sage",
      xp: "216",
      niv: "3",
      pv: "85",
      pvmax: "85",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/aurakingdom___stellyangel_kiss_by_dennisstelly_d7fx2uo-pre.png",
      force: "11",
      "dext\u00e9": "7",
      intel: "15",
      charisme: "13",
      esprit: "15",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "1",
      charismeB: "",
      espritB: "",
      skills:
        '["Aura : Bouclier protecteur","Aura : Ami du Marteau","B\u00e9n\u00e9diction de la Lumi\u00e8re","R\u00e9surrection","Vent Purificateur","Ch\u00e2timent Sacr\u00e9","Marteau du Scellement","Gr\u00e2ce de la Sagesse"]',
      eqpts:
        '["Sceptre du shaman","","","Robe \u00e9toil\u00e9e","Chapeau de champigno\u00efde","Amulette d\'exp\u00e9rience","","",""]',
      inventaire:
        "Marteau du chevalier\nHach\u00e9 de glace\n2 potions de soin (2D10 +6)",
      argent: "60",
      personnalite:
        "Un peu cr\u00e9dule, elle ne connait pour le moment que les zones proche de son enfance. Elle adore soigner son prochain, m\u00eame si le soin peut \u00eatre un peu brutal parfois (Ogre :) )",
      background:
        "Apprenti gu\u00e9risseuse de ozor de la ville de baalu. Ayant fini sa formation, elle doit partir gagner de l'exp\u00e9rience.\nElle a pour objectif lors de son voyage initiatique d'aller \u00e0 Haven afin de s'y inscrire apr\u00e8s sa formation.\n\n ",
      notes: "",
    },
    21: {
      nom: "Saphir",
      race: "Humain",
      classeP: "Guerrier",
      classeS: "Sage",
      xp: "300",
      niv: "4",
      pv: "100",
      pvmax: "100",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/43269-Berserker-Cosplay-from-Nostale-1-2.jpg",
      force: "14",
      "dext\u00e9": "8",
      intel: "11",
      charisme: "13",
      esprit: "15",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Attaque Cyclone","Euphorie","Gu\u00e9rison","Provocation de Groupe","Aura : Ami du Marteau","Aura : Bouclier protecteur","Mur de Titan","Marteau du Scellement"]',
      eqpts: '["","","","","","","","",""]',
      inventaire: "2 Potion de vie (2 d\u00e9 10 +6)",
      argent: "50",
      personnalite:
        "Jeune femme aux cheveux long et blanc comme neige, et qui \u00e0 des yeux bleu.  lle est hautaine, t\u00e9tue (fait ce qu'elle veut) et c'est une ivrogne quand elle boit, un vrai gar\u00e7on manquer. En combat, on l'a surnomme \" La B\u00eate des Enfer\", \u00e0 cause de son mode de combat sauvage avec son amure en plate noire et \u00e7a grosse hache.   ",
      background: "",
      notes: "",
    },
    22: {
      nom: "SatSousk\u00e9",
      race: "Zumi",
      classeP: "Juge",
      classeS: "D\u00e9moniste",
      xp: "300",
      niv: "4",
      pv: "95",
      pvmax: "95",
      stress: "",
      pp: "http://voldre.free.fr/Eden/images/jdrgalerie/ZumiMineur.jpg",
      force: "9",
      "dext\u00e9": "13",
      intel: "13",
      charisme: "12",
      esprit: "14",
      forceB: "",
      "dext\u00e9B": "",
      intelB: "",
      charismeB: "",
      espritB: "",
      skills:
        '["Aura du Pourfendeur","Parasite Obscur","Scellement","Infection Pullulante","Blessure Douloureuse","Fl\u00e8che des Ombres","Menaces Mortelles","Perforation"]',
      eqpts: '["","","","","","","","",""]',
      inventaire: "2 Potion de vie (2 d\u00e9 10 +6)",
      argent: "50",
      personnalite: "Zumi \u00e9mo\nSatSousk\u00e9 ",
      background: "",
      notes: "",
    },
  };

  // End of JSON
}

function getData(filename) {
  xhReq.open(
    "GET",
    "./JDR" + filename + ".json" + "?" + new Date().getTime(),
    false
  );
  xhReq.send(null);
  return JSON.parse(xhReq.responseText);
}

// Load perso if URL parameter
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has("perso")) {
    document.querySelector("body").innerHTML =
      "Erreur : vous devez saisir dans l'URL un numéro de personnage (jdr_quest?perso=4) par exemple.";
    stop();
  }

  const indexPerso = urlParams.get("perso") - 1;
  const persoData = persosJSON[indexPerso];
  const enemyData = chooseEnemy();
  const randomPNJ = Math.floor(
    Math.random() * Object.entries(pnjJSON).length + 1
  );
  console.log(randomPNJ);
  const pnjData = pnjJSON[randomPNJ];

  // 10 pour le moment en desc
  const mapID = Math.round(Math.random() * 7 + 3);
  const mapData = mapsJSON[mapID.toString()];

  document.querySelector(".game").style.backgroundImage =
    "url('./images/loadingframe/Loading_" + mapID + "B.jpg')";

  document.querySelector("#mapName").innerText = mapData["name"];

  pnjEnemy = Object.values(enemyJSON).find((e) => e.visuel3D == pnjData["id"]);

  if (pnjEnemy) {
    console.log("Combattable !");
    actions = ["Accepter la Quête", "Refuser la Quête", "Refuser et combattre"];
  } else {
    actions = ["Accepter la Quête", "Refuser la Quête"];
  }

  initializeActions(actions);

  document.querySelector("#pnj").src = "./images/PNJ/" + pnjData["id"] + ".png";
  document.querySelector("#persoName").innerText = persoData["nom"];
  document.querySelector("#perso").src = persoData["pp"].replace(
    "http://voldre.free.fr/Eden",
    "."
  );

  document.querySelector("#enemy").src =
    "./images/monsters/" + enemyData.visuel3D + ".png";
  // Math.round(Math.random()*110)

  const instruction =
    "Consignes à respecter : Tu dois parler pour demander de l'aide à " +
    persoData["nom"] +
    ".\n Ta réponse doit faire 5 à 6 phrases avec des paragraphes et saute des lignes à chaque phrase. Enfin : " +
    pnjData["lang"];

  const pnjDesc =
    "Ton personnage est " + pnjData["nom"] + ". Tu es : " + pnjData["desc"];
  const mapDesc =
    "Tu vies au (à la) " +
    mapData["name"] +
    ", description : " +
    mapData["desc"];
  const enemyDesc =
    "Là où tu vies, vous avez des problèmes avec : " +
    enemyData["nom"] +
    ", cette personne est : " +
    enemyData["desc"];
  const persoDesc =
    "La personne a qui tu parles, et à qui tu vas demander de l'aide s'appelle " +
    persoData["nom"] +
    ", voici sa personnalité : " +
    persoData["personnalite"];
  // ". Et voici son histoire : " +persoData["background"];

  const message =
    "Tu incarnes un personnage dans l'univers de Eden Eternal." +
    pnjDesc +
    "\n" +
    persoData +
    "\n" +
    mapDesc +
    "\n" +
    enemyDesc +
    "\n" +
    persoDesc;

  // const message = "Bonjour, que pouvez-vous me dire sur les étoiles ?";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: message },
      ],
      max_tokens: 350,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const response = data.choices[0].message.content;
      document.querySelector("#response").innerHTML = response.replaceAll(
        "\n",
        "<br/>"
      );
      // Affichez la réponse de l'assistant dans votre application web
    })
    .catch((error) => {
      console.error("Erreur lors de la requête à l'API :", error);
    });

  // Assurez-vous de consulter la documentation de l'API ChatGPT d'OpenAI pour obtenir des informations détaillées sur la manière d'envoyer des requêtes et de gérer les interactions conversationnelles avec le modèle.
  //   },
  // });
});

function chooseEnemy(category = null) {
  // prettier-ignore
  const forbidden = ["71","74","80","82","85","90","101","104","109","113"];
  // console.log(forbidden.map(f => enemyJSON[f]))

  // prettier-ignore
  const boss = ["24","29","45","46","50","54","56","57","59","61","62","67","70","71","74","75","76","77","80","82","84","85","86","89","90","101","106","109","111","113","114"];

  var enemyList = [];

  if (!category) {
    enemyList = { ...enemyJSON };
    forbidden.forEach((enemyF) => {
      delete enemyList[enemyF];
    });
  } else if (category == "boss") {
    enemyList = { ...enemyJSON };
    enemyList = Object.keys(enemyList).filter((enemy) => boss.includes(enemy));

    forbidden.forEach((enemyF) => {
      enemyList = enemyList.filter((enemy) => enemy != enemyF);
    });
  }

  var randomEnemy = Math.floor(Math.random() * Object.keys(enemyList).length);
  // console.log(randomEnemy,enemyList)
  if (!category) {
    // console.log(enemyList[randomEnemy])
    // console.log(Object.entries(enemyJSON).find(e => e[1] == enemyList[randomEnemy])[0]);

    // Reset index
    enemyList = format(enemyList);
  }

  console.log(enemyList, randomEnemy);
  return enemyList[randomEnemy];
}

function format(object) {
  var items = {};

  var i = 0;
  for (var index in object) {
    items[i] = object[index];
    i++;
  }
  return items;
}

function initializeActions(actions) {
  const urlParams = new URLSearchParams(window.location.search);
  const indexPerso = urlParams.get("perso") - 1;

  Object.entries(actions).forEach((id, action) => {
    const liElem = document.createElement("li");
    liElem.innerText = action;
    document.querySelector("#actions").append(liElem);

    const dirname =
      window.location.host || "file:///C:/wamp/www/Site%20free.fr";

    var enemy;
    if (id == 0) {
      enemy = enemyData["nom"];
      window.location.href =
        dirname +
        "/Eden/jdr_combat.html?perso=" +
        indexPerso +
        "&enemy=" +
        enemy;
    } else if (id == 1) {
      // Make Home page
      window.location.href = dirname + "/Eden/jdr_.html?perso=" + indexPerso;
    } else if (id == 2) {
      // Change enemy
      enemy = pnjEnemy["nom"];
      window.location.href =
        dirname +
        "/Eden/jdr_combat.html?perso=" +
        indexPerso +
        "&enemy=" +
        enemy;
    }
  });
}
