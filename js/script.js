import { activeCodePromo } from "./arrays.js";

function cloneCard() {
  const cardContainer = document.querySelector(".cards");
  const clone = cardContainer.cloneNode(true);
  document.querySelector(".cards-container")?.appendChild(clone);
  return clone;
}

function fillCardWithData(currentCard, data) {
  const codePromo = currentCard.querySelector(".code-promo");
  codePromo.textContent = data.code;

  const expirationDate = currentCard.querySelector(".expiration-date span");
  const dateString = data.date_to;

  // Convertir en objet Date
  const dateObject = new Date(dateString);

  // Vérifier si la date est valide (année bissextile pour 2024)
  if (!isNaN(dateObject.getTime())) {
    const formattedDate = dateObject.toLocaleDateString("fr-FR"); // Formater la date en français
    expirationDate.textContent = formattedDate; // Affiche la date au format jj/mm/aaaa
  } else {
    console.log("Date invalide");
  }

  const description = currentCard.querySelector(".description");
  description.textContent = data.description;

  const condition = currentCard.querySelector(".condition");
  condition.textContent = data.condition;
}

function createCard(data) {
  const card = cloneCard();
  fillCardWithData(card, data);
}

activeCodePromo.map((codePromoData) => createCard(codePromoData));
