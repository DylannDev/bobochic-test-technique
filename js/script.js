import { codePromo } from "./array.js";

// Convertir les dates string en objet Date
const codePromoWithConvertedDates = codePromo.map((data) => {
  const dateString = data.date_to;
  const dateObject = new Date(dateString); // Convertir la string en objet Date

  return {
    ...data,
    date_to: new Date(dateObject), // Convertit en objet Date et élimine l'heure
  };
});

// Trier les data en mettant les dates expirées à la fin et par proximité de la date d'expiration
const codePromoSorted = codePromoWithConvertedDates.sort((a, b) => {
  const now = new Date();
  const dateToA = a.date_to;
  const dateToB = b.date_to;

  const expiredA = dateToA < now;
  const expiredB = dateToB < now;

  if (expiredA !== expiredB) {
    return expiredA ? 1 : -1;
  }

  return Math.abs(dateToA - now) - Math.abs(dateToB - now);
});

// Cloner la structure HTML de la card
function cloneCard(data) {
  const cardContainer = document.querySelector(".card");
  const clone = cardContainer.cloneNode(true);

  if (data.date_to > new Date()) {
    document.querySelector(".cards")?.appendChild(clone);
  } else {
    document.querySelector(".cards-inactive")?.appendChild(clone);
  }
  return clone;
}

// Remplissage des cards avec les données dynamiques
function fillCardWithData(currentCard, data) {
  const codePromo = currentCard.querySelector(".code-promo");
  codePromo.textContent = data.code;

  const expirationDate = currentCard.querySelector(".expiration-date span");
  const dateObject = data.date_to;
  const formattedDate = dateObject.toLocaleDateString("fr-FR"); // Formater la date en français
  expirationDate.textContent = formattedDate; // Affiche la date au format jj/mm/aaaa

  const description = currentCard.querySelector(".description");

  // Remplacer les "*" dans data.description par les balises 'span' pour modifier le css
  let convertedDescription = data.description.replace(
    /\*([^*]+)\*/g,
    "<span>$1</span>"
  );

  // Remplacer les URLs par des balises <a>
  convertedDescription = convertedDescription.replace(
    /(https?:\/\/[^\s,]+)(,?)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>$2'
  );
  description.innerHTML = convertedDescription;

  const condition = currentCard.querySelector(".condition");
  condition.textContent = data.condition;
}

// Création de la card et ajout dans le dom
function createCard(data) {
  const card = cloneCard(data);
  fillCardWithData(card, data);
}

codePromoSorted.map((codePromoData) => createCard(codePromoData));

// Ajout de la classe "inactive" pour modifier le css dans la section code promo inactif
function addClass() {
  const codePromoInactive = document.querySelectorAll(
    ".cards-inactive .code-promo-btn, .cards-inactive .expiration-date, .cards-inactive .description"
  );

  codePromoInactive.forEach((element) => {
    element.classList.add("inactive");
  });
}

addClass();

// Copie du code promo
function copyCodePromo() {
  const buttons = document.querySelectorAll(".code-promo-btn");

  buttons.forEach((button, index) => {
    if (codePromoSorted[index]) {
      // Attribuer un identifiant unique basé sur id_cart_rule
      button.id = `promo-${codePromoSorted[index].id_cart_rule}`;
    }

    button.addEventListener("click", () => {
      if (!button.classList.contains("inactive")) {
        // Copier le texte de l'élément li dans le presse-papiers
        const textToCopy =
          button.children[1].textContent || button.children[1].innerText; // textContent pour les navigateurs modernes, innerText comme fallback
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            console.log(`Texte copié : ${textToCopy}`);
          })
          .catch((err) => {
            console.error("Erreur lors de la copie : ", err);
          });
      }
    });
  });
}

copyCodePromo();
