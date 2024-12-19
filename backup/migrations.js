import { elements, enemyJSON, persoJSON } from "../JDRstore";
import { isTextInText } from "../utils";

// Convert infos "Faible au X et Y" to wekanesses ["X","Y"]
for (const key in enemyJSON) {
  const enemy = enemyJSON[key];
  if (enemy) {
    const weaknesses = elements.filter((e) => isTextInText(enemy.infos, e));
    enemy.weaknesses = weaknesses;
    delete enemy.infos;
  }
}

// Convert JSON stringify skills and eqpts to array
for (const key in persoJSON) {
  const perso = persoJSON[key];
  if (perso) {
    perso.skills = JSON.parse(perso.skills);
    perso.eqpts = JSON.parse(perso.eqpts);
  }
}

// Convert string PV to number
for (const key in enemyJSON) {
  const enemy = enemyJSON[key];
  if (enemy) {
    enemy.pvmax = parseInt(enemy.pvmax);
  }
}

// -------------------------------------------------------
// Convert Discord Summaries to HTML files

// 1) JS Conversion from summaries (string[]) to JSON resume

let summaries = "All my resume[] from discord-messages-raw.json";

// groupe: 1 | 2 | 3
// seance: number
// date: string
// titre: string
// contexte: string
// personnages: string[]
// key_events: string[]
// objectifs: string[]
let htmlFiles = [];
summaries.forEach((summary) => {
  let currentGroup;
  let currentSeance;

  const regex = /séance\s(\d+)(?:\s+groupe\s+(\d+))?\s*:\s*(.+?)\s*-\s*(\d{1,2}(?:-\d{1,2})?\s*\/\s*\d{2,4})/i;

  const match = summary.match(regex);

  // Replace "--" and remove Joueurs break-line
  summary = summary.replaceAll(/--+/g, "\n").replaceAll("\nJoueurs", "");

  // Replace rich text underlines and bold
  summary.replaceAll(/__(.*?)__/g, "<span style='text-decoration:underline;'>$1</span>");
  summary.replaceAll(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  if (match) {
    currentSeance = parseInt(match[1]);
    currentGroup = match[2] ? parseInt(match[2]) : 1; // Firsts summaries doesn't have "groupe" specified
    titre = match[3].replaceAll("*", "");
    date = match[4].replaceAll(" ", "");
    console.log(match);

    const index = summary.indexOf("\n\n");
    const header = index !== -1 ? summary.slice(0, index) : "";
    const content = summary.slice(index + 1);

    console.log(header, content);

    // prettier-ignore
    // All characters in 2024
    const personnages = ["Test","Draigos","Erida","Malvis","Eivor","Marek","Fiore dei San Didero","Cosmos","Aradia","War","Nyx","Xiuhxin","Kryèri","Borak","Rad Ed","Kibo","Estia Ryujin","Leyla","Epsilon","Céleste","Azora","Sekhmet","Lutta","Roco Bonnaro","Ernis","Le Poisseux","Beren nolatary","Cyritsu","Ainz von gaown","Kratos","Ol","Shkrouk","Coracx / Belamis","Zhaïtan","Yuki Hart","Ash","Mania","Willy & Samba","Alec","Falco chëre","Nono","Bellum","Rozo"]
    .filter((perso) => header
      .replace('Poisseux','Le Poisseux')
      .replace('Estia','Estia Ryujin')
      .replace('Yuki','Yuki Hart')
      .includes(perso));

    htmlFiles.push({
      groupe: currentGroup,
      seance: currentSeance,
      date: date,
      titre: titre,
      personnages: personnages,
      content: content,
    });
  } else {
    // Add following content
    if (!htmlFiles.length) {
      console.error("No HTML file exist");
      return;
    }
    htmlFiles[htmlFiles.length - 1].content += "\n\n" + summary;
  }
});

console.log(
  [...htmlFiles].map((t) => ({
    groupe: t.groupe,
    seance: t.seance,
    date: t.date,
    titre: t.titre,
    personnages: t.personnages,
    contexte: "",
    key_events: [],
    objectifs: [],
  })),
  [...htmlFiles].map((htmlFile) => ({
    ...htmlFile,
    content: `<pre>\n<div class="section">${htmlFile.content}\n</div>\n</pre>`
      // Make a section after 3 jump lines
      .replaceAll(/\n\n\n+/g, `\n</div>\n\n<div class="section">\n`),
  }))
);

// 2) Execute python3 .\server\stories\summaries\jsonToSummaries.py

// 3) Open zip archive and get HTML files, enjoy !

// -------------------------------------------------------
