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
