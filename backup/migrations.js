// Migrate infos "Faible au X et Y" to wekanesses ["X","Y"]

import { elements, enemyJSON } from "../JDRstore";
import { isTextInText } from "../utils";

const copyEnemyJSON = enemyJSON;
for (const key in copyEnemyJSON) {
  const enemy = copyEnemyJSON[key];
  if (enemy) {
    const weaknesses = elements.filter((e) => isTextInText(enemy.infos, e));
    enemy.weaknesses = weaknesses;
    delete enemy.infos;
  }
}
