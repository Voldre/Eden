import { createElement } from "./elements"

const createSnowflake = (): void => {
  // Position initiale horizontale aléatoire
  const startX = Math.random() * 100 // en pourcentage

  // Taille aléatoire
  const size = Math.random() * 12 + 2 // entre 2px et 14px

  const fallDuration = Math.random() * 5 + 5 // entre 5s et 10s

  const snowflake = createElement("div", undefined, {
    className: "snowflake",
    style: {
      left: `${startX}vw`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${fallDuration}s`,
    },
  })

  // Ajout au body
  document.body.appendChild(snowflake)

  // Supprimer le flocon une fois qu'il est hors de la vue
  setTimeout(() => {
    snowflake.remove()
  }, fallDuration * 1000)
}

// Générer des flocons de neige périodiquement
export const startSnowfall = (): void => {
  setInterval(createSnowflake, 275) // Un flocon toutes les 275ms
}

const month = new Date().getMonth() // Add Snowfall in December and January
if ([0, 11].includes(month)) document.addEventListener("DOMContentLoaded", startSnowfall)
